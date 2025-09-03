#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, watchFile } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Configuration
const PORT = 3000;
const WS_PORT = 3001;

// Load configuration files
const rolesConfig = JSON.parse(readFileSync(join(projectRoot, 'config/roles.json'), 'utf8'));

class ResumeDevServer {
  constructor(roleCode) {
    this.roleCode = roleCode;
    this.role = rolesConfig.roles[roleCode];
    this.theme = 'jsonresume-theme-react-tailwind-backup';
    this.currentHtml = '';
    this.clients = new Set();
    this.server = null;
    this.wss = null;
    this.isShuttingDown = false;
    
    if (!this.role) {
      throw new Error(`Invalid role code: ${roleCode}. Available roles: ${Object.keys(rolesConfig.roles).join(', ')}`);
    }
    
    this.sourceFile = join(projectRoot, this.role.sourceFile);
    if (!existsSync(this.sourceFile)) {
      throw new Error(`Resume source file not found: ${this.sourceFile}`);
    }
  }

  async generateHtml() {
    try {
      console.log('🔄 Generating HTML...');
      
      // Read the resume JSON
      const resumeData = JSON.parse(readFileSync(this.sourceFile, 'utf8'));
      
      // Import the theme
      const themeModule = await import(this.theme);
      
      // Prepare theme options
      const themeOptions = {
        role: {
          code: this.roleCode,
          name: this.role.name,
          description: this.role.description
        }
      };
      
      // Generate the HTML
      this.currentHtml = themeModule.render(resumeData, themeOptions);
      
      // Inject live reload script
      this.currentHtml = this.injectLiveReloadScript(this.currentHtml);
      
      console.log('✅ HTML generated successfully');
      return this.currentHtml;
      
    } catch (error) {
      console.error('❌ Error generating HTML:', error.message);
      this.currentHtml = this.generateErrorPage(error.message);
      return this.currentHtml;
    }
  }

  injectLiveReloadScript(html) {
    const liveReloadScript = `
    <script>
      (function() {
        const ws = new WebSocket('ws://localhost:${WS_PORT}');
        
        ws.onopen = function() {
          console.log('🔌 Live reload connected');
        };
        
        ws.onmessage = function(event) {
          if (event.data === 'reload') {
            console.log('🔄 Reloading page...');
            window.location.reload();
          }
        };
        
        ws.onclose = function() {
          console.log('🔌 Live reload disconnected');
          // Try to reconnect after 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        };
        
        ws.onerror = function(error) {
          console.error('❌ WebSocket error:', error);
        };
      })();
    </script>
    `;
    
    // Inject before closing body tag, or at the end if no body tag found
    if (html.includes('</body>')) {
      return html.replace('</body>', liveReloadScript + '</body>');
    } else {
      return html + liveReloadScript;
    }
  }

  generateErrorPage(errorMessage) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume Dev Server - Error</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          background: #f5f5f5; 
        }
        .error { 
          background: #fff; 
          border-left: 4px solid #e74c3c; 
          padding: 20px; 
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .error h1 { 
          color: #e74c3c; 
          margin-top: 0; 
        }
        .error pre { 
          background: #f8f8f8; 
          padding: 10px; 
          border-radius: 4px; 
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="error">
        <h1>🚨 Resume Generation Error</h1>
        <p>There was an error generating your resume. Please check your JSON format and try again.</p>
        <pre>${errorMessage}</pre>
        <p><strong>File being watched:</strong> ${this.sourceFile}</p>
        <p><strong>Role:</strong> ${this.role.name} (${this.roleCode})</p>
        <p><strong>Theme:</strong> ${this.theme}</p>
      </div>
    </body>
    </html>
    `;
  }

  setupWebSocketServer() {
    this.wss = new WebSocketServer({ port: WS_PORT });
    
    this.wss.on('connection', (ws) => {
      console.log('🔌 Client connected to live reload');
      this.clients.add(ws);
      
      ws.on('close', () => {
        console.log('🔌 Client disconnected from live reload');
        this.clients.delete(ws);
      });
    });
    
    console.log(`🔌 WebSocket server running on port ${WS_PORT}`);
  }

  broadcastReload() {
    console.log('📡 Broadcasting reload to clients...');
    this.clients.forEach(client => {
      try {
        client.send('reload');
      } catch (error) {
        // Remove dead connections
        this.clients.delete(client);
      }
    });
  }

  setupFileWatcher() {
    console.log(`👀 Watching file: ${this.sourceFile}`);
    
    watchFile(this.sourceFile, { interval: 500 }, async (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log('📝 File changed, regenerating...');
        await this.generateHtml();
        this.broadcastReload();
      }
    });
  }

  createHttpServer() {
    this.server = createServer(async (req, res) => {
      try {
        // CORS headers for development
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'GET' && req.url === '/') {
          // Serve the current HTML
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.end(this.currentHtml);
        } else if (req.method === 'GET' && req.url === '/status') {
          // Status endpoint
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify({
            status: 'running',
            role: this.role.name,
            roleCode: this.roleCode,
            theme: this.theme,
            sourceFile: this.sourceFile,
            timestamp: new Date().toISOString()
          }));
        } else {
          // 404 for other routes
          res.writeHead(404);
          res.end('Not found');
        }
      } catch (error) {
        console.error('❌ Server error:', error.message);
        res.writeHead(500);
        res.end('Internal server error');
      }
    });

    return this.server;
  }

  shutdown() {
    if (this.isShuttingDown) {
      return;
    }
    
    this.isShuttingDown = true;
    console.log('\n📴 Shutting down server...');
    
    // Close all WebSocket connections immediately
    if (this.clients.size > 0) {
      this.clients.forEach(client => {
        try {
          client.terminate();
        } catch (error) {
          // Ignore errors during termination
        }
      });
      this.clients.clear();
    }
    
    // Close WebSocket server immediately
    if (this.wss) {
      this.wss.close(() => {
        // WebSocket server closed
      });
    }
    
    // Close HTTP server with timeout
    if (this.server) {
      this.server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
      });
      
      // Force close after 1 second if graceful shutdown takes too long
      setTimeout(() => {
        console.log('⚡ Force closing server...');
        process.exit(0);
      }, 1000);
    } else {
      console.log('✅ Server stopped');
      process.exit(0);
    }
  }

  async start() {
    try {
      console.log('🚀 Starting Resume Development Server');
      console.log('====================================');
      console.log(`📋 Role: ${this.role.name} (${this.roleCode})`);
      console.log(`📁 Source: ${this.sourceFile}`);
      console.log(`🎨 Theme: ${this.theme}`);
      
      // Generate initial HTML
      await this.generateHtml();
      
      // Setup WebSocket server for live reload
      this.setupWebSocketServer();
      
      // Setup file watcher
      this.setupFileWatcher();
      
      // Create and start HTTP server
      const server = this.createHttpServer();
      server.listen(PORT, () => {
        console.log(`\\n🌐 Development server running at: http://localhost:${PORT}`);
        console.log(`📝 Edit your resume at: ${this.sourceFile}`);
        console.log(`\\n💡 Tips:`);
        console.log(`   • Save your JSON file to see changes instantly`);
        console.log(`   • Press Ctrl+C to stop the server`);
        console.log(`   • Visit http://localhost:${PORT}/status for server info`);
        console.log('\\n🔄 Server is ready! Start editing your resume...');
      });

      // Graceful shutdown - support multiple signals
      process.on('SIGINT', () => this.shutdown());   // Ctrl+C
      process.on('SIGTERM', () => this.shutdown());  // Termination signal
      process.on('SIGQUIT', () => this.shutdown());  // Ctrl+\

    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    }
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('⚠️  Please specify a role code.');
  console.log('📝 Usage: node scripts/dev-server.js <ROLE_CODE>');
  console.log('📝 Example: node scripts/dev-server.js PM');
  process.exit(1);
}

const roleCode = process.argv[2].toUpperCase();

// Start the development server
const devServer = new ResumeDevServer(roleCode);
devServer.start();
