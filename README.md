# VentureDeck (formerly EchoinWhispr)

> **"Where Ambition Meets Opportunity."**

![VentureDeck Banner](https://via.placeholder.com/1200x400?text=VentureDeck+Banner)

## Vision
We envision a world where every groundbreaking idea has a clear path to reality. VentureDeck is the catalyst that transforms raw ambition into investable enterprises, democratizing access to capital and talent for visionaries everywhere.

## Overview
VentureDeck is the ultimate launchpad for new startups. It bridges the gap between "I have an idea" and "I have funding" by providing a dual-interface platform:
- **The Forge (For Entrepreneurs):** A structured environment to articulate visions, build pitch decks, and showcase traction.
- **Deal Flow (For Investors):** A high-signal discovery engine to find, vet, and connect with the next generation of unicorns.

## Strategic Aims
1.  **Democratize Access:** Level the playing field for entrepreneurs.
2.  **Accelerate Discovery:** Empower investors with data-driven deal flow.
3.  **Build Trust:** Verify skills and reputation to ensure genuine talent.
4.  **Foster Connection:** Ignite collaboration between founders, funders, and builders.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TailwindCSS, Lucide Icons
- **Backend:** Convex (Real-time Database & Functions)
- **Auth:** Clerk
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Adeolu5678/EchoinWhispr.git
    cd EchoinWhispr
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    - Create `.env.local` in `web-new/` and `Convex/`.
    - Add your Clerk and Convex publishable keys.

4.  **Run Development Servers:**
    ```bash
    # Run both Frontend and Backend
    pnpm dev
    
    # Or individually:
    pnpm dev:web    # Web App (localhost:3000)
    pnpm dev:convex # Convex Dashboard
    ```

## Project Structure
- `/web-new`: The Next.js frontend application.
- `/Convex`: The backend logic and database schema.
- `/Documentations`: Comprehensive SSD and project guides.

## License
[MIT](LICENSE)
