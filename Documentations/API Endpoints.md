# API Endpoints Documentation

## Overview

Launchpad is a professional platform for Entrepreneurs and Investors. The system architecture combines Convex for backend logic and real-time database capabilities with Clerk for authentication.

- **Convex Functions**: Serverless functions for data persistence and business logic.
- **Web API Routes**: Next.js API routes for webhooks (Clerk, Stripe).

## Convex Functions (Backend API)

### Project Management

#### `mutation projects.create(args: { title: string, industry: string, fundingGoal: number, ... })`
- **Description**: Creates a new project and associated workspace.
- **Returns**: Project ID
- **Auth**: Entrepreneur only

#### `query projects.list(args: { industry?: string, stage?: string })`
- **Description**: Lists projects for the "Deal Flow" feed.
- **Returns**: Array of Project objects

### Application System

#### `mutation applications.apply(args: { projectId: Id<"projects">, role: string, message: string })`
- **Description**: Submits an application to join a project team.
- **Auth**: User (Talent)

#### `mutation applications.updateStatus(args: { applicationId: Id<"applications">, status: string })`
- **Description**: Updates application status (e.g., "interviewing", "accepted").
- **Auth**: Project Owner

### Milestones & Updates

#### `mutation milestones.create(args: { projectId: Id<"projects">, title: string, date: number })`
- **Description**: Adds a new milestone to the project timeline.

#### `query milestones.getByProject(args: { projectId: Id<"projects"> })`
- **Description**: Retrieves the timeline for a project.

### User Management

#### `mutation users.register(args: { role: "entrepreneur" | "investor", ... })`
- **Description**: Registers a new user with a specific role.

#### `query users.getProfile(args: { userId: Id<"users"> })`
- **Description**: Retrieves a user's professional profile.

## Web API Routes

### Webhooks

#### `POST /api/webhooks/clerk`
- **Description**: Handles user creation/update events from Clerk.

#### `POST /api/webhooks/stripe`
- **Description**: Handles subscription payment events from Stripe.
