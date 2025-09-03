#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Import the modified theme
async function generateVersionedResume(resumeJsonPath, themeName = 'jsonresume-theme-react-tailwind', outputDir = 'outputs') {
  try {
    // Read the resume JSON
    const resumeData = JSON.parse(readFileSync(resumeJsonPath, 'utf8'));
    
    // Import the theme
    const theme = await import(themeName);
    
    // Generate the HTML
    const html = theme.render(resumeData);
    
    // Generate versioned filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const baseName = resumeData.basics?.name?.replace(/\s+/g, '_').toLowerCase() || 'resume';
    const shortHash = Math.random().toString(36).substring(2, 8);
    const filename = `${baseName}_v${timestamp}_${shortHash}.html`;
    
    // Ensure output directory exists
    mkdirSync(join(projectRoot, outputDir), { recursive: true });
    
    // Write the file
    const outputPath = join(projectRoot, outputDir, filename);
    writeFileSync(outputPath, html, 'utf8');
    
    console.log(`✅ Resume generated successfully: ${outputPath}`);
    console.log(`📝 Version: ${timestamp}`);
    console.log(`🆔 Hash: ${shortHash}`);
    
    return { outputPath, filename, timestamp, shortHash };
  } catch (error) {
    console.error('❌ Error generating resume:', error.message);
    process.exit(1);
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('Usage: node scripts/generate-versioned-resume.js <resume.json> [theme] [outputDir]');
  console.log('Example: node scripts/generate-versioned-resume.js data/resume/jimmy_swe_resume.json');
  process.exit(1);
}

const resumePath = process.argv[2];
const theme = process.argv[3] || 'jsonresume-theme-react-tailwind';
const outputDir = process.argv[4] || 'outputs';

generateVersionedResume(resumePath, theme, outputDir);
