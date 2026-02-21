# Ralph Workflow Engine

A **configurable agentic workflow system** for managing AI coding agents. Use this as a library/submodule in your projects to get structured task management, handoffs, and stateless agent operation.

## 🎯 What This Is

The Ralph Workflow Engine is a **reusable core engine** that can be installed into any project. It provides:

- **Stateless Agent Operation** - Each agent session starts fresh with documented context
- **Priority-Based Task Selection** - Agents work on what matters most
- **Seamless Handoffs** - Complete documentation for session continuation
- **Configurable Structure** - All paths, prompts, and behaviors are customizable
- **Project Agnostic** - Works with any language, framework, or project type

## 🚀 Quick Start

### Option 1: Git Submodule (Recommended)

```bash
# Add as submodule
git submodule add https://github.com/your-org/workflow-template.git .workflow-engine

# Create your config
cp .workflow-engine/workflow.config.default.json ./workflow.config.json

# Initialize
node .workflow-engine/scripts/init-workflow.js --config=./workflow.config.json
```

### Option 2: Clone Directly

```bash
git clone https://github.com/your-org/workflow-template.git .workflow-engine
```

### Option 3: Copy Files

Copy the `.agent/` directory and configuration files directly into your project.

## ⚙️ Configuration

Create a `workflow.config.json` in your project root:

```json
{
  "$schema": "./.workflow-engine/workflow.config.schema.json",
  "version": "1.0.0",
  "project": {
    "name": "My API Server",
    "technology": "Python/FastAPI",
    "role": "Backend Engineer"
  },
  "structure": {
    "source_directories": ["app/", "api/"],
    "test_directories": ["tests/"]
  }
}
```

See [workflow.config.default.json](./workflow.config.default.json) for all options.

## 📁 Structure

```
.workflow-engine/                # This repo (submodule)
├── workflow.config.default.json # Default configuration
├── workflow.config.schema.json  # JSON Schema for validation
├── README_INTEGRATION.md        # Full integration guide
├── scripts/
│   └── init-workflow.js         # Initialization script
└── .agent/
    ├── workflows/ralph.md       # Main workflow definition
    ├── docs/                    # Templates
    ├── contexts/                # Task context (generated)
    └── handoffs/                # Handoff reports (generated)
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Integration Guide](./README_INTEGRATION.md) | How to add this to your project |
| [Configuration Schema](./workflow.config.schema.json) | All config options |
| [Workflow Guide](./.agent/workflows/ralph.md) | How the workflow operates |

## 🎯 Priority Levels

| Priority | Meaning | Examples |
|----------|---------|----------|
| **P0** | 🔴 CRITICAL | Build broken, security issues |
| **P1** | 🟠 HIGH | Core features, major bugs |
| **P2** | 🟡 MEDIUM | Enhancements, minor bugs |
| **P3** | 🟢 LOW | Nice-to-have improvements |
| **P4** | ⚪ BACKLOG | Future ideas |

## 🤖 For AI Agents

1. Check for `workflow.config.json` in project root
2. Read `.agent/workflows/ralph.md`
3. Follow onboarding phases exactly
4. Use `/ralph` to invoke the workflow

## 🧑‍💻 For Humans

1. Add tasks to `.agent/docs/task-registry.md`
2. Update `.agent/docs/codebase-map.md` when structure changes
3. Review handoffs in `.agent/handoffs/`

---

> **Philosophy**: Documentation IS the agent's memory. Write as if explaining to yourself with complete amnesia.
