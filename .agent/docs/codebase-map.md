# 🗺️ CODEBASE MAP

> **Purpose**: Quick navigation guide for finding relevant files.
> **Project**: EchoinWhispr
> **Technology**: Flutter, Next.js, Convex, Clerk
> **Last Updated**: 2026-02-07

---

## 📁 Project Structure

```
EchoinWhispr/
├── .agent/                   # 🤖 Workflow system
│   ├── workflows/            # Workflow definitions
│   ├── docs/                 # Documentation & Registry
│   ├── contexts/             # Task specific contexts
│   └── handoffs/             # Task handoff reports
│
├── Flutter/                  # 📱 Mobile App (Target)
│   ├── lib/                  # Source code (to be created)
│   ├── test/                 # Tests (to be created)
│   └── pubspec.yaml          # Dependencies
│
├── Web/                      # 🌐 Web App (Reference)
│   ├── src/
│   │   ├── features/         # Feature modules
│   │   ├── components/       # UI components
│   │   └── hooks/            # Logic hooks
│   └── package.json
│
├── Convex/                   # 🗄️ Backend & Database
│   ├── convex/
│   │   ├── schema.ts         # Database schema
│   │   └── *.ts              # Backend functions
│
└── Documentations/           # 📚 Project Documentation
    ├── Software Specification Documentation (SSD)/
    └── UI-UX Specifications/
```

---

## 🏷️ Directory Purposes

| Directory | Purpose | When to Look Here |
|-----------|---------|-------------------|
| `./.agent/` | Workflow system | Always start here |
| `Flutter/` | Mobile App Source | Implementation Ref |
| `Web/` | Web App Reference | Logic & UI Reference |
| `Convex/` | Backend | Schema & API Reference |
| `Documentations/` | Specs | Requirements & Flows |

---

## 🔎 Quick Find Guide

| Looking For | Check These Locations |
|-------------|----------------------|
| **Data Models** | `Convex/convex/schema.ts`, `Web/src/features/*/types.ts` |
| **Business Logic** | `Convex/convex/*.ts`, `Web/src/hooks/` |
| **UI Design** | `Web/src/components/`, `Documentations/UI-UX Specifications/` |
| **Requirements** | `Documentations/Software Specification Documentation (SSD)/` |

---

## 📌 Key Files

| File | Purpose |
|------|---------|
| `Convex/convex/schema.ts` | **Truth Source** for all data models |
| `Web/src/middleware.ts` | Auth routing logic reference |
| `Flutter/pubspec.yaml` | Flutter dependencies |

---

## 🔗 Related Documentation

- Task Registry: `./.agent/docs/task-registry.md`
- Workflow Guide: `./.agent/workflows/ralph.md`

---

> ⚠️ **MAINTENANCE**: When adding new directories or key files, UPDATE THIS MAP.
