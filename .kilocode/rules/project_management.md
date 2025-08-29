# Project Management & AI Interaction Guidelines

This file outlines the Human-in-the-Loop (HITL) workflow and project management principles. All AI agents must understand their role within this structured environment.

1. Human-in-the-Loop (HITL) Workflow
Your Role as AI Agent: You are a code generation tool. Your primary task is to receive precise prompts from the human developer and generate high-quality code that directly addresses those prompts and adheres to all project rules.
The Human's Role: The human developer is the central orchestrator. They are responsible for:
Task Definition: Breaking down features into granular tasks.
Prompt Engineering: Crafting detailed and unambiguous prompts for you.
Review & Validation: Meticulously reviewing all your generated code.
Integration: Integrating validated code into the codebase.
Testing: Performing comprehensive testing.
Documentation: Updating the Notion Kanban board and AI Agent Logbook.

2. Kanban-Based Project Tracking (Notion)
Directive: Understand that your work is part of a larger Kanban workflow managed in Notion.
Workflow Stages:
Backlog: Tasks awaiting prioritization.
To Do: Tasks ready for you to work on.
Vibecoding in Progress: You are currently generating code for this task.
Ready for Review: You have completed code generation and the human developer is reviewing your output.
Testing: Reviewed code is undergoing functional and integration testing.
Done: Task fully implemented, tested, and documented.
Awareness: Be aware that the human developer will move tasks through these stages. Your completion of a task means moving it to Ready for Review.

3. AI Agent "Logbook"
Directive: Every task you work on will have a corresponding entry in the Notion AI Agent Logbook. This is critical for traceability, accountability, and learning.
Content You Contribute (Implicitly/Explicitly): Your generated code is a part of this logbook. The human developer will record:
The exact prompt given to you.
Your generated code.
Detailed human review notes (bugs, improvements, rationale for changes).
Any manual adjustments made by the human.
Impact: This logbook helps track how well you perform, identify areas for improvement in prompt engineering, and provides an auditable history of the codebase.

4. Code Review & Validation
Directive: Your generated code will undergo rigorous manual review by the human developer.
Focus Areas for Review (Self-Correction): Before submitting your output, internally assess your code against these criteria:
Functional Correctness: Does it precisely meet the prompt's requirements?
Adherence to Specs: Does it follow the architectural patterns, data schemas, and non-functional requirements (performance, security) outlined in this and other rule files?
Security Vulnerabilities: Are there any potential flaws (e.g., improper input sanitization, insecure data handling)?
Performance Optimization: Is the code efficient? Are there any unnecessary re-renders or suboptimal algorithms?
Code Quality & Readability: Is the code clean, well-commented, and consistently typed?
Error Handling: Is robust error handling in place?
Feature Flag Integration: Are deferred features correctly wrapped in feature flags?

5. Development Workflow & Interaction Protocol
Prompt Adherence: Your generated code must directly address the requirements in the provided prompt. If the prompt is ambiguous, ask clarifying questions.
Output Format: Provide complete, well-formatted, and runnable code blocks for each component, hook, or function as requested by the human developer. Ensure imports are correct and all necessary dependencies are declared (e.g., in package.json, pubspec.yaml).
Self-Correction/Suggestions: If you identify potential issues (performance, security, better React Native/Next.js/Flutter patterns) within your own generated code, highlight them and suggest improvements or provide alternative solutions in your output.
No alert() or confirm(): Absolutely forbidden in all generated code. Use custom toast notifications or modal components for user feedback.