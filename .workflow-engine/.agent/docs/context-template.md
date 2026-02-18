# 📄 CONTEXT TEMPLATE

> Use this template to create context documentation for complex tasks.
> Save as: `.agent/contexts/TASK-XXX.md`

---

```markdown
# Task Context: [Task Title]

## 📋 Task Reference

| Field | Value |
|-------|-------|
| **Task ID** | TASK-XXX |
| **Priority** | P[0-4] |
| **Created** | YYYY-MM-DD |
| **Status** | [Current status] |

---

## 🎯 Objective

### What
[Clear description of what needs to be accomplished]

### Why
[Business reason or motivation for this task]

### Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

---

## 📁 Relevant Files

### Primary Files (will be modified)
| File | Purpose |
|------|---------|
| `path/to/file1.ts` | [What it does, why it's relevant] |
| `path/to/file2.tsx` | [What it does, why it's relevant] |

### Secondary Files (for reference)
| File | Purpose |
|------|---------|
| `path/to/related.ts` | [Provides context for X] |

### Configuration Files
| File | Relevance |
|------|-----------|
| `config.json` | [May need updates for Y] |

---

## 🔗 Dependencies

### Task Dependencies
| Task ID | Status | Why It's a Dependency |
|---------|--------|----------------------|
| TASK-XXX | [Status] | [What it provides] |

### Technical Dependencies
- [Package/library dependency]
- [API dependency]
- [Service dependency]

---

## ⚙️ Technical Context

### Current State
[Describe the current implementation or situation]

### Desired State
[Describe what it should look like after completion]

### Constraints
- [Technical constraint 1]
- [Business constraint 2]
- [Time/resource constraint 3]

### Technical Considerations
- [Architecture notes]
- [Performance considerations]
- [Security considerations]

---

## 📜 Background Information

### History
[Any previous attempts, related work, or context about why this task exists]

### Related Issues/PRs
- [Link to issue/PR if applicable]

### Domain Knowledge
[Any domain-specific information needed to understand the task]

---

## 🧩 Approach (if known)

### Proposed Solution
[High-level approach if already determined]

### Alternatives Considered
| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| [Option A] | [+] | [-] | [Chosen/Rejected] |
| [Option B] | [+] | [-] | [Chosen/Rejected] |

### Open Questions
- [ ] [Question that needs answering]
- [ ] [Another uncertainty]

---

## 📎 Resources

### Documentation
- [Relevant doc links]

### Examples
- [Reference implementations]
- [Similar patterns in codebase]

### External Resources
- [API docs, tutorials, etc.]
```

---

## 📝 Usage Notes

### When to Create Context

Create context documentation when:
- ✅ Task requires understanding of complex system
- ✅ Multiple files/systems are involved
- ✅ Task will likely span multiple sessions
- ✅ Domain knowledge is required
- ✅ Previous approaches/decisions need documentation

### Keep It Updated

- Update as new information is discovered
- Add "History" entries for significant attempts
- Mark completed success criteria

### Relationship to Handoffs

- **Context** = Stable information about the task (what/why/where)
- **Handoff** = Session-specific progress (what was done/what remains)

Both work together: Context provides background, Handoffs track progress.
