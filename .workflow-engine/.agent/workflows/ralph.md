---
description: Ralph workflow - Agent-controlled task management with stateless handoffs
---

# 🎯 RALPH WORKFLOW

> **STOP. READ THIS FIRST.**
> 
> You are operating under the Ralph Workflow. The workflow controls you, not the other way around.
> Follow these instructions EXACTLY before taking any action.

---

## ⚙️ CONFIGURATION

This workflow is configurable. Before proceeding, check for a `workflow.config.json` file in the project root.

**If config exists**, use the configured values for:
- `./.agent/docs` → Documentation directory (default: `.agent/docs/`)
- `./.agent/handoffs` → Handoff reports directory (default: `.agent/handoffs/`)
- `./.agent/contexts` → Context files directory (default: `.agent/contexts/`)
- `./.agent/docs/codebase-map.md` → Codebase map file path
- `./.agent/docs/task-registry.md` → Task registry file path
- `TASK` → Task ID prefix (default: `TASK`)
- `My Project` → Project name for context

**If no config exists**, use the default paths shown in this workflow.

---

## 📋 PHASE 1: ONBOARDING (MANDATORY)

Before doing ANYTHING, you MUST complete these steps in order:

### Step 1: Read the Codebase Map
```
// turbo
View file: .agent/docs/codebase-map.md
```
This gives you the project structure and how to find relevant files. Do NOT ask for full file contents yet.

### Step 2: Read the Task Registry
```
// turbo
View file: .agent/docs/task-registry.md
```
This shows all tasks, their priorities, and current status.

### Step 3: Check for Active Handoffs
```
// turbo
List directory: .agent/handoffs/
```
If there are handoff files, read the most recent one for any in-progress tasks.

---

## 📊 PHASE 2: TASK SELECTION

### Priority Levels
| Priority | Meaning | Examples |
|----------|---------|----------|
| **P0** | CRITICAL - Blocks everything | Build failures, security issues, production bugs |
| **P1** | HIGH - Important for progress | Core feature implementation, major refactors |
| **P2** | MEDIUM - Should be done soon | Enhancements, non-critical bugs, optimizations |
| **P3** | LOW - Nice to have | Documentation, minor improvements |
| **P4** | BACKLOG - Future consideration | Ideas, long-term improvements |

### Selection Rules

1. **Scan ALL pending tasks** in the task registry
2. **Select the HIGHEST priority task** you can meaningfully progress
3. **Check for dependencies** - don't start a task if its dependencies aren't complete
4. **Check for handoffs** - if a task has a handoff file, READ IT FIRST and continue from there
5. **If priorities are equal**, pick the one with the most context available

> ⚠️ **NEVER** start from task 1 and work linearly. Always evaluate by priority.

---

## 🔍 PHASE 3: CONTEXT GATHERING

Before starting work, you MUST gather context:

### Step 1: Read Task Context (if exists)
Check for: `.agent/contexts/TASK-XXX.md`

### Step 2: Read Previous Handoffs (if exists)
Check for: `.agent/handoffs/TASK-XXX-*.md`

### Step 3: Navigate to Relevant Files
Use the codebase-map.md to identify which directories/files are relevant. Then view those specific files.

### Step 4: Document Your Understanding
Before making changes, briefly state:
- What the task requires
- Which files you'll modify
- Your approach

---

## 🛠️ PHASE 4: EXECUTION

### Rules During Execution

1. **Stay focused** - Only work on the selected task
2. **Track changes** - Note every file you modify
3. **Test as you go** - Verify changes work before moving on
4. **Monitor your memory** - If context is growing large, prepare for handoff

### Memory Management

> ⚠️ **CRITICAL**: You do NOT need to complete a task in one session.

Signs you should prepare a handoff:
- You've made significant progress but more remains
- The task is more complex than initially estimated
- You're starting to lose track of earlier context
- You've been working for an extended period

**When in doubt, hand off early rather than late.**

---

## 📝 PHASE 5: DOCUMENTATION

### After Completing Work (or Pausing)

You MUST create/update documentation:

#### A. Update Task Registry
Mark task status:
- `✅ COMPLETED` - Task is fully done
- `🔄 IN PROGRESS` - Task is being worked on
- `⏸️ PAUSED` - Task paused with handoff
- `🚫 BLOCKED` - Cannot proceed, document why

#### B. Create Handoff Report (if not completing)
Create file: `.agent/handoffs/TASK-XXX-YYYY-MM-DD-HHMM.md`

Use this format:
```markdown
# Handoff Report: [Task Title]

## Task Reference
- **Task ID**: TASK-XXX
- **Priority**: PX
- **Status**: [PAUSED/IN PROGRESS]
- **Date**: YYYY-MM-DD HH:MM

## Summary
[1-2 sentence summary of the task goal]

## What Was Completed
- [Specific item 1]
- [Specific item 2]
- [Include file paths with line numbers if relevant]

## What Remains
- [ ] [Remaining item 1]
- [ ] [Remaining item 2]

## Files Modified
| File | Changes Made |
|------|--------------|
| `path/to/file.ts` | Added X, modified Y |

## Context for Next Agent
[Critical information the next agent needs to know]
- Key decisions made and why
- Patterns to follow
- Gotchas or issues encountered

## Blockers (if any)
- [Blocker 1]
- [Blocker 2]

## Recommended Next Steps
1. [Step 1]
2. [Step 2]
```

#### C. Update Codebase Map (if structure changed)
If you added new files or directories, update `.agent/docs/codebase-map.md`

---

## 🔄 PHASE 6: CONTINUATION (For Picking Up Tasks)

When picking up a task that was handed off:

1. **Read the handoff file completely**
2. **Do NOT start over** - continue from where it stopped
3. **Verify the documented state** - quick check that files match what was described
4. **Continue from "What Remains"** - use this as your checklist
5. **Create your own handoff** if you can't complete it either

---

## 📁 FILE STRUCTURE REFERENCE

```
.agent/
├── workflows/
│   └── ralph.md          # This file - main workflow
├── docs/
│   ├── codebase-map.md   # Project structure navigation
│   ├── task-registry.md  # All tasks with priorities
│   ├── handoff-template.md   # Template for handoffs
│   └── context-template.md   # Template for task context
├── contexts/
│   └── TASK-XXX.md       # Context files for specific tasks
└── handoffs/
    └── TASK-XXX-DATE.md  # Handoff reports
```

---

## ✅ QUICK REFERENCE CHECKLIST

Before ANY action:
- [ ] Read codebase-map.md
- [ ] Read task-registry.md
- [ ] Check for handoffs in .agent/handoffs/

When selecting a task:
- [ ] Evaluate ALL tasks by priority
- [ ] Check dependencies are met
- [ ] Read any existing context/handoffs

During execution:
- [ ] Stay on the selected task
- [ ] Track file changes
- [ ] Monitor memory usage

After work:
- [ ] Update task-registry.md
- [ ] Create handoff if not completing
- [ ] Update codebase-map.md if structure changed

---

## 🚨 VIOLATIONS

The following are WORKFLOW VIOLATIONS:

1. ❌ Starting work without reading codebase-map.md
2. ❌ Picking tasks linearly instead of by priority
3. ❌ Ignoring existing handoff files
4. ❌ Starting a task over when there's a handoff
5. ❌ Not creating a handoff when pausing
6. ❌ Making changes without documenting them
7. ❌ Modifying files not related to the current task

---

> **Remember**: You are a stateless agent. The documentation IS the memory.
> Write handoffs as if explaining to yourself with complete amnesia.
