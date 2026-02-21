# Integration Guide: Ralph Workflow Engine

This guide explains how to integrate the **Ralph Workflow System** into your project as a reusable workflow engine.

---

## Quick Start

### 1. Add the Workflow Engine to Your Project

**Option A: Git Submodule (Recommended)**
```bash
git submodule add https://github.com/your-org/workflow-template.git .workflow-engine
```

**Option B: Clone Directly**
```bash
git clone https://github.com/your-org/workflow-template.git .workflow-engine
```

**Option C: NPM (if published)**
```bash
npm install @your-org/workflow-engine
```

### 2. Create Your Project Configuration

Copy the default configuration and customize it:

```bash
cp .workflow-engine/workflow.config.default.json ./workflow.config.json
```

### 3. Initialize the Workflow

```bash
node .workflow-engine/scripts/init-workflow.js --config=./workflow.config.json
```

This creates the necessary directories and templated files in your project.

### 4. Invoke the Workflow

Use the `/ralph` command (or your configured workflow name) in your AI coding assistant.

---

## Configuration Reference

### Minimal Configuration

```json
{
  "$schema": "./.workflow-engine/workflow.config.schema.json",
  "version": "1.0.0",
  "project": {
    "name": "My API Server",
    "technology": "Python/FastAPI",
    "role": "Backend Engineer"
  }
}
```

### Full Configuration

See [workflow.config.default.json](./workflow.config.default.json) for all available options.

---

## Configuration Sections

### `project` (Required)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Human-readable project name |
| `description` | string | Brief description of the project |
| `technology` | string | Tech stack (used in prompts) |
| `role` | string | Agent's role (e.g., "Frontend Developer") |

### `prompts`

| Field | Type | Description |
|-------|------|-------------|
| `system_role` | string/null | Direct system prompt (overrides file) |
| `system_role_file` | string/null | Path to system prompt file |
| `context_prefix` | string | Prefix for workflow context |
| `agent_persona` | string | How agent describes itself |

### `paths`

| Field | Default | Description |
|-------|---------|-------------|
| `project_root` | `"./"` | Project root directory |
| `workflow_root` | `"./.agent"` | Workflow files directory |
| `workflows` | `"./.agent/workflows"` | Workflow definitions |
| `docs` | `"./.agent/docs"` | Documentation templates |
| `contexts` | `"./.agent/contexts"` | Task context files |
| `handoffs` | `"./.agent/handoffs"` | Handoff reports |

### `structure`

| Field | Default | Description |
|-------|---------|-------------|
| `source_directories` | `["src/"]` | Source code directories |
| `test_directories` | `["tests/"]` | Test file directories |
| `config_files` | `["package.json"]` | Config files to track |
| `ignore_patterns` | `["node_modules/"]` | Patterns to ignore |

### `tasks`

| Field | Default | Description |
|-------|---------|-------------|
| `id_prefix` | `"TASK"` | Prefix for task IDs |
| `id_format` | `"{{prefix}}-{{number:3}}"` | ID format template |
| `next_id` | `1` | Next available ID number |
| `priorities` | P0-P4 | Priority level definitions |
| `statuses` | standard | Status definitions |

### `behavior`

| Field | Default | Description |
|-------|---------|-------------|
| `strict_task_selection` | `true` | Enforce priority-based selection |
| `require_handoff_on_pause` | `true` | Require handoff when pausing |
| `auto_update_codebase_map` | `false` | Auto-update structure map |
| `memory_threshold_warning` | `true` | Warn on heavy context |

### `features`

| Field | Default | Description |
|-------|---------|-------------|
| `enable_contexts` | `true` | Enable context files |
| `enable_handoffs` | `true` | Enable handoff reports |
| `enable_codebase_map` | `true` | Enable codebase navigation |
| `enable_task_dependencies` | `true` | Enable dependency tracking |

---

## Examples

### Web Frontend Project

```json
{
  "version": "1.0.0",
  "project": {
    "name": "E-Commerce Dashboard",
    "technology": "React/TypeScript",
    "role": "Frontend Developer"
  },
  "structure": {
    "source_directories": ["src/components/", "src/features/", "src/hooks/"],
    "test_directories": ["src/__tests__/"],
    "config_files": ["package.json", "vite.config.ts", "tsconfig.json"]
  }
}
```

### Python Backend Project

```json
{
  "version": "1.0.0",
  "project": {
    "name": "API Gateway",
    "technology": "Python/FastAPI",
    "role": "Backend Engineer"
  },
  "structure": {
    "source_directories": ["app/", "api/", "models/"],
    "test_directories": ["tests/"],
    "config_files": ["pyproject.toml", "requirements.txt"]
  },
  "paths": {
    "workflow_root": "./.workflow"
  }
}
```

### Flutter Mobile App

```json
{
  "version": "1.0.0",
  "project": {
    "name": "Fitness Tracker",
    "technology": "Flutter/Dart",
    "role": "Mobile Developer"
  },
  "structure": {
    "source_directories": ["lib/", "lib/screens/", "lib/widgets/"],
    "test_directories": ["test/"],
    "config_files": ["pubspec.yaml", "analysis_options.yaml"]
  }
}
```

---

## Template Variables

The workflow supports these template variables in prompts and documentation:

| Variable | Source | Example |
|----------|--------|---------|
| `{{project.name}}` | `config.project.name` | "My API" |
| `{{project.technology}}` | `config.project.technology` | "TypeScript" |
| `{{project.role}}` | `config.project.role` | "Backend Engineer" |
| `{{paths.docs}}` | `config.paths.docs` | "./.agent/docs" |
| `{{paths.handoffs}}` | `config.paths.handoffs` | "./.agent/handoffs" |
| `{{paths.contexts}}` | `config.paths.contexts` | "./.agent/contexts" |
| `{{tasks.id_prefix}}` | `config.tasks.id_prefix` | "TASK" |

---

## Directory Structure After Initialization

```
your-project/
├── workflow.config.json          # Your project config
├── .agent/                       # Workflow files (or custom path)
│   ├── workflows/
│   │   └── ralph.md             # Main workflow (from engine)
│   ├── docs/
│   │   ├── codebase-map.md      # Generated for your project
│   │   ├── task-registry.md     # Generated with your config
│   │   ├── handoff-template.md
│   │   └── context-template.md
│   ├── contexts/
│   │   └── README.md
│   └── handoffs/
│       └── README.md
└── .workflow-engine/             # The engine (submodule/package)
```

---

## Updating the Engine

**If using Git Submodule:**
```bash
cd .workflow-engine
git pull origin main
cd ..
git add .workflow-engine
git commit -m "chore: update workflow engine"
```

**If using NPM:**
```bash
npm update @your-org/workflow-engine
```

---

## Troubleshooting

### Configuration Not Loading

1. Verify `workflow.config.json` exists in project root
2. Validate JSON syntax
3. Ensure `$schema` path is correct

### Templates Not Rendering

1. Check that template variables use `{{variable}}` format
2. Verify the path exists in your config

### Missing Directories

Run the initialization script again:
```bash
node .workflow-engine/scripts/init-workflow.js --config=./workflow.config.json
```

---

## Support

- [Main README](./README.md)
- [Configuration Schema](./workflow.config.schema.json)
- [Default Configuration](./workflow.config.default.json)
