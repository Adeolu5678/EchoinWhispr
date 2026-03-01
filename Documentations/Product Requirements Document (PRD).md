# EchoinWhispr: Product Requirements Document (PRD)

## 1. Product Vision
EchoinWhispr is a social networking platform designed for psychological depth and radical privacy. It aims to facilitate meaningful connections based on merit, interests, and current psychological state, rather than social status or physical appearance.

## 2. Target Audience
- Professionals seeking anonymous networking.
- Individuals looking for support groups or interest-based communities.
- Users fatigued by the superficial nature of mainstream social media.

## 3. Core Features

### 3.1 Anonymous Personas
- Users do not have "real name" profiles by default.
- Personas are defined by: **Career**, **Interests**, and **Mood**.
- Users can switch between multiple personas or evolve their primary one.

### 3.2 The Whisper System
- **Whispers**: One-way, anonymous messages sent to a specific user (by username) or broadcast to the "Void".
- **Interaction**: Recipients can "Echo" (like), "Resonate" (connect), or "Discard".
- **Evolution**: If two users interact positively multiple times, a "Conversation" is unlocked.

### 3.3 Echo Chambers
- Interest-based group chat rooms.
- Membership is dynamic and based on persona relevance.
- Conversations are ephemeral by default.

### 3.4 Resonance Matching
- An AI-powered matching engine that pairs users based on:
    - Life phase similarity.
    - Career synergy.
    - Complementary moods.

### 3.5 The Unmasking Ceremony
- A high-trust feature allowing users to reveal their identity to a specific connection.
- Requires mutual confirmation.
- Can reveal components (e.g., "Reveal LinkedIn", "Reveal True Name", "Reveal Avatar").

## 4. Technical Constraints
- **Stack**: Next.js, Convex, Clerk.
- **Performance**: Real-time message delivery (< 200ms).
- **Security**: SOC2 compliant data handling via Clerk/Vercel.

## 5. Success Metrics
- **Retention**: Percentage of users returning within 7 days.
- **Resonance Rate**: Ratio of whispers that lead to conversations.
- **Unmasking Depth**: Average number of mutual reveals per active user.
