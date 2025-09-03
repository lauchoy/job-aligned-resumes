#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Template definitions for missing roles
const roleTemplates = {
  PROJ: {
    label: "Project Manager",
    summary: "Project Manager with proven expertise coordinating complex technical projects and stakeholder relationships. Skilled at delivering mission-critical initiatives on time and within budget while maintaining quality standards and team collaboration.",
    position: "Principal Project Consultant",
    description: "Project management consulting practice specializing in technical delivery and stakeholder coordination",
    highlights: [
      "Orchestrated technical project delivery combining SquareSpace integration projects with custom GPT model implementations, coordinating hospitality business digital transformations with 100% on-time delivery",
      "Managed dynamic pricing project implementation using n8n workflows and Airtable, coordinating cross-functional teams to deliver booking pattern analysis that increased revenue by 20%",
      "Led secure payment processing project with PCI compliance requirements, managing stakeholder expectations while coordinating fraud detection implementation that reduced cart abandonment by half"
    ],
    skills: [
      { name: "Project Management", keywords: ["Agile", "Scrum", "Kanban", "JIRA", "Confluence", "Risk Management", "Stakeholder Management"] },
      { name: "Technical Coordination", keywords: ["Technical Documentation", "Cross-functional Leadership", "Resource Planning", "Timeline Management"] }
    ]
  },
  PLAT: {
    label: "Platform Engineer", 
    summary: "Platform Engineer with proven expertise building developer-focused infrastructure and tooling that enables scalable application development. Skilled at designing platform solutions that enhance developer productivity while maintaining enterprise-grade reliability.",
    position: "Principal Platform Consultant",
    description: "Platform engineering consulting practice specializing in developer experience and infrastructure automation",
    highlights: [
      "Built platform solutions combining SquareSpace developer APIs with custom automation tooling, enabling hospitality businesses to deploy and scale applications efficiently",
      "Implemented platform automation using n8n workflows and Airtable backends, creating developer-friendly interfaces that reduced deployment time by 60%", 
      "Developed secure payment platform infrastructure with PCI compliance, building reusable components that reduced integration effort by half"
    ],
    skills: [
      { name: "Platform Engineering", keywords: ["Kubernetes", "Docker", "CI/CD", "Infrastructure as Code", "Service Mesh", "API Gateways"] },
      { name: "Developer Experience", keywords: ["Internal Tools", "Developer Portals", "Automation", "Self-service Platforms"] }
    ]
  },
  SALE: {
    label: "Sales Engineer",
    summary: "Sales Engineer with proven technical expertise building customer relationships and driving revenue through solution-oriented technical sales. Skilled at translating complex technical concepts into business value while maintaining technical credibility.",
    position: "Principal Sales Consultant", 
    description: "Technical sales consulting practice specializing in solution architecture and customer success",
    highlights: [
      "Drove technical sales for SquareSpace integration solutions with custom GPT models, achieving 150% of sales targets by demonstrating technical value to hospitality clients",
      "Led technical demonstrations of dynamic pricing solutions using n8n workflows, converting 80% of prospects through hands-on technical proof-of-concepts",
      "Closed secure payment processing deals with PCI compliance requirements, building technical trust that resulted in $500K+ in annual recurring revenue"
    ],
    skills: [
      { name: "Technical Sales", keywords: ["Solution Architecture", "Technical Demonstrations", "Proof of Concepts", "Competitive Analysis", "Value Selling"] },
      { name: "Customer Engineering", keywords: ["Technical Support", "Integration Planning", "Customer Success", "Relationship Management"] }
    ]
  },
  CS: {
    label: "Customer Success Manager",
    summary: "Customer Success Manager with technical background driving customer retention and growth through solution-oriented relationship management. Skilled at identifying expansion opportunities while ensuring technical customer satisfaction.",
    position: "Principal Customer Success Consultant",
    description: "Customer success consulting practice specializing in technical account management and growth",
    highlights: [
      "Managed technical customer relationships for SquareSpace integration clients, achieving 98% customer retention through proactive technical support and expansion planning",
      "Drove customer adoption of dynamic pricing solutions using technical training and support, resulting in 35% account growth across hospitality client base",
      "Led technical onboarding for payment processing solutions, reducing time-to-value by 50% and achieving 120% net revenue retention"
    ],
    skills: [
      { name: "Customer Success", keywords: ["Account Management", "Customer Retention", "Expansion Planning", "Technical Training", "Relationship Building"] },
      { name: "Technical Support", keywords: ["Problem Solving", "Technical Documentation", "User Training", "Solution Optimization"] }
    ]
  },
  DA: {
    label: "Data Analyst",
    summary: "Data Analyst with proven expertise extracting insights from complex datasets to drive business decisions. Skilled at transforming raw data into actionable intelligence while building scalable reporting and analytics solutions.",
    position: "Principal Data Analytics Consultant", 
    description: "Data analytics consulting practice specializing in business intelligence and insights generation",
    highlights: [
      "Analyzed customer behavior data from SquareSpace integrations and booking systems, generating insights that informed product development and increased customer engagement by 40%",
      "Built comprehensive analytics for dynamic pricing algorithms using booking pattern analysis, creating data models that identified revenue optimization opportunities worth 20% increase",
      "Developed fraud detection analytics for payment processing systems, implementing data-driven monitoring that reduced fraud incidents by 65%"
    ],
    skills: [
      { name: "Data Analysis", keywords: ["SQL", "Python", "Statistical Analysis", "Data Modeling", "A/B Testing", "Hypothesis Testing"] },
      { name: "Business Intelligence", keywords: ["Tableau", "Power BI", "Dashboard Design", "KPI Development", "Reporting Automation"] }
    ]
  }
};

// Function to generate resume from template
function generateResumeFromTemplate(roleCode, template) {
  // Use FSE resume as base
  const baseResume = JSON.parse(readFileSync(join(projectRoot, 'data/resume/jimmy_fse_resume.json'), 'utf8'));
  
  // Update basics
  baseResume.basics.label = template.label;
  baseResume.basics.summary = template.summary;
  
  // Update work experience - modify the first two positions
  if (baseResume.work && baseResume.work.length > 0) {
    baseResume.work[0].position = template.position;
    baseResume.work[0].description = template.description;
    baseResume.work[0].highlights = template.highlights;
  }
  
  // Update skills
  if (template.skills) {
    baseResume.skills = template.skills;
  }
  
  // Update meta
  baseResume.meta.lastModified = "2025-08-26";
  
  return baseResume;
}

// Generate missing resume files
Object.entries(roleTemplates).forEach(([roleCode, template]) => {
  const filePath = join(projectRoot, 'data/resume', `jimmy_${roleCode.toLowerCase()}_resume.json`);
  
  if (!existsSync(filePath)) {
    const resume = generateResumeFromTemplate(roleCode, template);
    writeFileSync(filePath, JSON.stringify(resume, null, 2), 'utf8');
    console.log(`✅ Generated resume for ${roleCode}: ${filePath}`);
  } else {
    console.log(`⚠️  Resume already exists for ${roleCode}: ${filePath}`);
  }
});

console.log('🎉 Missing resume generation complete!');
