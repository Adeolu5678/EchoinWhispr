#!/usr/bin/env node

/**
 * Ralph Workflow Initialization Script
 * 
 * Creates the workflow directory structure and generates
 * templated files based on the provided configuration.
 * 
 * Usage:
 *   node init-workflow.js --config=./workflow.config.json
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value || true;
    }
  });
  return args;
}

// Load and merge configuration
function loadConfig(configPath) {
  const scriptDir = path.dirname(__filename);
  const defaultConfigPath = path.join(scriptDir, '..', 'workflow.config.default.json');
  
  // Load default config
  let defaultConfig = {};
  if (fs.existsSync(defaultConfigPath)) {
    defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
  }
  
  // Load user config
  let userConfig = {};
  if (configPath && fs.existsSync(configPath)) {
    userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else if (configPath) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }
  
  // Deep merge configs
  return deepMerge(defaultConfig, userConfig);
}

// Deep merge utility
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Template rendering with {{variable}} syntax
function renderTemplate(template, config, context = '') {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = getNestedValue(config, path.trim());
    if (value === undefined) {
      console.warn(`Warning: Template variable not found: ${path}${context ? ` in ${context}` : ''}`);
      return match;
    }
    return value;
  });
}

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  Created directory: ${dirPath}`);
  }
}

// Copy and template a file
function copyTemplateFile(srcPath, destPath, config) {
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    content = renderTemplate(content, config, srcPath);
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  Created file: ${destPath}`);
  }
}

// Generate task registry from config
function generateTaskRegistry(config) {
  const priorities = config.tasks?.priorities || {};
  const statuses = config.tasks?.statuses || {};
  const idPrefix = config.tasks?.id_prefix || 'TASK';
  const nextId = config.tasks?.next_id || 1;
  
  let priorityRows = '';
  for (const [key, val] of Object.entries(priorities)) {
    priorityRows += `| **${key}** | ${val.emoji || ''} ${val.label} | ${val.description || ''} |\n`;
  }
  
  let statusRows = '';
  for (const [key, val] of Object.entries(statuses)) {
    statusRows += `| ${val.symbol} ${val.label} | ${key.replace('_', ' ')} |\n`;
  }
  
  return `# 📋 TASK REGISTRY

> **Purpose**: Central tracking for all tasks with priorities and status.
> **Project**: ${config.project?.name || 'Unnamed Project'}
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## 📊 Status Legend

| Status | Meaning |
|--------|---------|
${statusRows}

## 🎯 Priority Legend

| Priority | Urgency | Examples |
|----------|---------|----------|
${priorityRows}

---

## 📝 Active Tasks

### P0 - Critical
| ID | Task | Status | Assignee | Handoff |
|----|------|--------|----------|---------|
| — | *No critical tasks* | — | — | — |

### P1 - High Priority
| ID | Task | Status | Dependencies | Handoff |
|----|------|--------|--------------|---------|
| — | *No high priority tasks* | — | — | — |

### P2 - Medium Priority
| ID | Task | Status | Dependencies | Handoff |
|----|------|--------|--------------|---------|
| — | *No medium tasks* | — | — | — |

### P3 - Low Priority
| ID | Task | Status | Dependencies | Handoff |
|----|------|--------|--------------|---------|
| — | *No low tasks* | — | — | — |

### P4 - Backlog
| ID | Task | Status | Notes |
|----|------|--------|-------|
| — | *No backlog items* | — | — |

---

## ✅ Completed Tasks

| ID | Task | Completed Date | Notes |
|----|------|----------------|-------|
| — | *No completed tasks yet* | — | — |

---

## 📏 Task ID Format

- Format: \`${idPrefix}-XXX\` (e.g., ${idPrefix}-001, ${idPrefix}-042)
- IDs are never reused
- Next available ID: **${idPrefix}-${String(nextId).padStart(3, '0')}**

---

## 📌 Quick Stats

- **Total Tasks**: 0
- **Pending**: 0
- **In Progress**: 0
- **Completed**: 0
- **Blocked**: 0
`;
}

// Generate codebase map from config
function generateCodebaseMap(config) {
  const srcDirs = config.structure?.source_directories || ['src/'];
  const testDirs = config.structure?.test_directories || ['tests/'];
  const configFiles = config.structure?.config_files || [];
  
  let structureTree = `project-root/
├── ${config.paths?.workflow_root || '.agent'}/         # 🤖 Workflow system
│   ├── workflows/
│   ├── docs/
│   ├── contexts/
│   └── handoffs/
│`;
  
  srcDirs.forEach((dir, i) => {
    structureTree += `\n├── ${dir.padEnd(25)} # 📦 Source code`;
  });
  
  testDirs.forEach((dir, i) => {
    structureTree += `\n├── ${dir.padEnd(25)} # 🧪 Tests`;
  });
  
  if (configFiles.length > 0) {
    structureTree += `\n└── [config files]           # ⚙️ Configuration`;
  }
  
  return `# 🗺️ CODEBASE MAP

> **Purpose**: Quick navigation guide for finding relevant files.
> **Project**: ${config.project?.name || 'Unnamed Project'}
> **Technology**: ${config.project?.technology || 'Not specified'}
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## 📁 Project Structure

\`\`\`
${structureTree}
\`\`\`

---

## 🏷️ Directory Purposes

| Directory | Purpose | When to Look Here |
|-----------|---------|-------------------|
| \`${config.paths?.workflow_root || '.agent'}/\` | Workflow system | Always start here |
${srcDirs.map(d => `| \`${d}\` | Source code | Feature work, bugs |`).join('\n')}
${testDirs.map(d => `| \`${d}\` | Test files | Adding/fixing tests |`).join('\n')}

---

## 🔎 Quick Find Guide

| Looking For | Check These Locations |
|-------------|----------------------|
| API endpoints | \`src/api/\`, config files |
| Components | \`src/components/\`, \`src/screens/\` |
| Business logic | \`src/features/\`, \`src/services/\` |
| Configuration | ${configFiles.map(f => `\`${f}\``).join(', ') || 'Root config files'} |
| Tests | ${testDirs.map(d => `\`${d}\``).join(', ')} |

---

## 📌 Key Files

| File | Purpose |
|------|---------|
| *Add key files here* | *Description* |

---

## 🔗 Related Documentation

- Task Registry: \`${config.paths?.task_registry || '.agent/docs/task-registry.md'}\`
- Workflow Guide: \`${config.paths?.workflows || '.agent/workflows'}/ralph.md\`

---

> ⚠️ **MAINTENANCE**: When adding new directories or key files, UPDATE THIS MAP.
`;
}

// Main initialization function
function init() {
  console.log('\n🚀 Ralph Workflow Initialization\n');
  
  const args = parseArgs();
  const configPath = args.config || './workflow.config.json';
  
  console.log(`📄 Loading configuration from: ${configPath}`);
  const config = loadConfig(configPath);
  
  console.log(`📦 Project: ${config.project?.name || 'Unnamed'}`);
  console.log(`🔧 Technology: ${config.project?.technology || 'Not specified'}\n`);
  
  // Determine paths
  const projectRoot = config.paths?.project_root || './';
  const workflowRoot = path.join(projectRoot, config.paths?.workflow_root || '.agent');
  const workflowsDir = path.join(projectRoot, config.paths?.workflows || '.agent/workflows');
  const docsDir = path.join(projectRoot, config.paths?.docs || '.agent/docs');
  const contextsDir = path.join(projectRoot, config.paths?.contexts || '.agent/contexts');
  const handoffsDir = path.join(projectRoot, config.paths?.handoffs || '.agent/handoffs');
  
  // Create directories
  console.log('📁 Creating directories...');
  ensureDir(workflowRoot);
  ensureDir(workflowsDir);
  ensureDir(docsDir);
  ensureDir(contextsDir);
  ensureDir(handoffsDir);
  
  // Copy workflow files from engine
  const scriptDir = path.dirname(__filename);
  const engineRoot = path.join(scriptDir, '..');
  
  console.log('\n📝 Generating files...');
  
  // Copy ralph.md
  const ralphSrc = path.join(engineRoot, '.agent', 'workflows', 'ralph.md');
  const ralphDest = path.join(workflowsDir, 'ralph.md');
  copyTemplateFile(ralphSrc, ralphDest, config);
  
  // Copy templates
  const templateFiles = ['handoff-template.md', 'context-template.md'];
  templateFiles.forEach(file => {
    const src = path.join(engineRoot, '.agent', 'docs', file);
    const dest = path.join(docsDir, file);
    copyTemplateFile(src, dest, config);
  });
  
  // Generate task registry
  const taskRegistryPath = path.join(projectRoot, config.paths?.task_registry || '.agent/docs/task-registry.md');
  fs.writeFileSync(taskRegistryPath, generateTaskRegistry(config), 'utf8');
  console.log(`  Created file: ${taskRegistryPath}`);
  
  // Generate codebase map
  const codebaseMapPath = path.join(projectRoot, config.paths?.codebase_map || '.agent/docs/codebase-map.md');
  fs.writeFileSync(codebaseMapPath, generateCodebaseMap(config), 'utf8');
  console.log(`  Created file: ${codebaseMapPath}`);
  
  // Create README files in contexts and handoffs
  const contextsReadme = `# CONTEXT FILES

This directory contains task-specific context documentation.

**Naming Convention:** \`${config.tasks?.id_prefix || 'TASK'}-XXX.md\`

See \`${docsDir}/context-template.md\` for the template.
`;
  fs.writeFileSync(path.join(contextsDir, 'README.md'), contextsReadme, 'utf8');
  console.log(`  Created file: ${path.join(contextsDir, 'README.md')}`);
  
  const handoffsReadme = `# HANDOFF REPORTS

This directory contains handoff reports from agent sessions.

**Naming Convention:** \`${config.tasks?.id_prefix || 'TASK'}-XXX-YYYY-MM-DD-HHMM.md\`

See \`${docsDir}/handoff-template.md\` for the template.
`;
  fs.writeFileSync(path.join(handoffsDir, 'README.md'), handoffsReadme, 'utf8');
  console.log(`  Created file: ${path.join(handoffsDir, 'README.md')}`);
  
  console.log('\n✅ Initialization complete!\n');
  console.log('Next steps:');
  console.log(`  1. Review and customize ${codebaseMapPath}`);
  console.log(`  2. Add tasks to ${taskRegistryPath}`);
  console.log('  3. Use /ralph to invoke the workflow\n');
}

// Run if executed directly
if (require.main === module) {
  init();
}

module.exports = { init, loadConfig, renderTemplate };
