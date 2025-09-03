#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Environment variable validation
function validateEnvironment() {
  const required = ['FIRST_NAME', 'LAST_NAME', 'USERNAME'];
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('💡 Please set these in your .env file or environment');
    console.error('📄 See .env.example for reference');
    process.exit(1);
  }
}

// Function to substitute environment variables in strings
function substituteEnvVars(str) {
  return str.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
    return process.env[envVar] || match;
  });
}

// Load configuration files
const rolesConfigRaw = readFileSync(join(projectRoot, 'config/roles.json'), 'utf8');
const rolesConfig = JSON.parse(substituteEnvVars(rolesConfigRaw));
const versionsFile = join(projectRoot, 'config/versions.json');
let versionsConfigRaw = readFileSync(versionsFile, 'utf8');
let versionsConfig = JSON.parse(substituteEnvVars(versionsConfigRaw));

// Function to increment version for a role
function incrementVersion(roleCode) {
  if (!versionsConfig.versions[roleCode]) {
    versionsConfig.versions[roleCode] = {
      current: 0,
      lastGenerated: null,
      totalGenerated: 0
    };
  }
  
  versionsConfig.versions[roleCode].current += 1;
  versionsConfig.versions[roleCode].lastGenerated = new Date().toISOString();
  versionsConfig.versions[roleCode].totalGenerated += 1;
  versionsConfig.meta.lastUpdated = new Date().toISOString();
  
  // Save updated versions
  writeFileSync(versionsFile, JSON.stringify(versionsConfig, null, 2), 'utf8');
  
  return versionsConfig.versions[roleCode].current;
}

// Function to generate filename
function generateFilename(roleCode, version, extension = 'html') {
  const paddedVersion = version.toString().padStart(3, '0');
  const firstName = process.env.FIRST_NAME || 'FirstName';
  const lastName = process.env.LAST_NAME || 'LastName';
  return `${firstName}${lastName}_${roleCode}_v${paddedVersion}.${extension}`;
}

// Function to generate versioned resume
async function generateVersionedResume(roleCode, themeName = null, outputDir = null) {
  try {
    // Validate role code
    if (!rolesConfig.roles[roleCode]) {
      throw new Error(`Invalid role code: ${roleCode}. Available roles: ${Object.keys(rolesConfig.roles).join(', ')}`);
    }
    
    const role = rolesConfig.roles[roleCode];
    const theme = themeName || rolesConfig.defaultTheme;
    const outputPath = outputDir || rolesConfig.outputDir;
    
    // Check if source file exists
    const sourceFile = join(projectRoot, role.sourceFile);
    if (!existsSync(sourceFile)) {
      throw new Error(`Resume source file not found: ${sourceFile}`);
    }
    
    // Read the resume JSON
    const resumeData = JSON.parse(readFileSync(sourceFile, 'utf8'));
    
    // Import the theme
    const themeModule = await import(theme);
    
    // Increment version
    const versionNumber = incrementVersion(roleCode);
    
    // Prepare theme options with role and version info
    const themeOptions = {
      role: {
        code: roleCode,
        name: role.name,
        description: role.description
      },
      version: {
        current: versionNumber,
        lastGenerated: versionsConfig.versions[roleCode].lastGenerated,
        totalGenerated: versionsConfig.versions[roleCode].totalGenerated
      }
    };
    
    // Generate the HTML with role and version information
    const html = themeModule.render(resumeData, themeOptions);
    
    // Generate filename
    const filename = generateFilename(roleCode, versionNumber);
    
    // Ensure output directory exists
    const fullOutputDir = join(projectRoot, outputPath);
    mkdirSync(fullOutputDir, { recursive: true });
    
    // Write the file
    const filePath = join(fullOutputDir, filename);
    writeFileSync(filePath, html, 'utf8');
    
    console.log(`✅ Resume generated successfully: ${filename}`);
    console.log(`📋 Role: ${role.name} (${roleCode})`);
    console.log(`🔢 Version: ${versionNumber}`);
    console.log(`📁 Output: ${filePath}`);
    console.log(`🎨 Theme: ${theme}`);
    
    return {
      filename,
      filePath,
      roleCode,
      roleName: role.name,
      version: versionNumber,
      theme
    };
  } catch (error) {
    console.error('❌ Error generating resume:', error.message);
    process.exit(1);
  }
}

// Function to show available roles
function showAvailableRoles() {
  console.log('\n📋 Available Roles:');
  console.log('==================');
  Object.entries(rolesConfig.roles).forEach(([code, role]) => {
    const currentVersion = versionsConfig.versions[code]?.current || 0;
    const totalGenerated = versionsConfig.versions[code]?.totalGenerated || 0;
    console.log(`${code.padEnd(5)} - ${role.name.padEnd(25)} (v${currentVersion.toString().padStart(3, '0')}, ${totalGenerated} total)`);
  });
  console.log('\n📝 Usage: node scripts/generate-role-resume.js <ROLE_CODE> [theme] [outputDir]');
  console.log('📝 Example: node scripts/generate-role-resume.js FSE');
  console.log('📝 Example: node scripts/generate-role-resume.js PM jsonresume-theme-even');
}

// Validate environment before proceeding
validateEnvironment();

// CLI usage
if (process.argv.length < 3) {
  console.log('⚠️  Please specify a role code.');
  showAvailableRoles();
  process.exit(1);
}

const roleCode = process.argv[2].toUpperCase();

// Handle help or list commands
if (['HELP', '--HELP', '-H', 'LIST', '--LIST', '-L'].includes(roleCode)) {
  showAvailableRoles();
  process.exit(0);
}

const theme = process.argv[3];
const outputDir = process.argv[4];

generateVersionedResume(roleCode, theme, outputDir);
