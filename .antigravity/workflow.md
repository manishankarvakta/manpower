# Antigravity Workflow - Saudi Manpower Platform

This workflow is derived from `srs.md` and coordinates the specialized agents to build the MVP.

## Phase 1: Requirement Analysis
**Objective:** Formalize MVP scope and logic constraints.
- **Product Manager Agent:** Analyze `srs.md` (Sections 1-4, 11) to finalize the MVP Scope Document and User Journey Map.
- **Business Analyst Agent:** Extract and formalize business rules from `srs.md` (Sections 5-10).
- **Project Manager Agent:** Setup project tracking.

## Phase 2: Architecture Planning
**Objective:** Define technical scaffolding.
- **System Architect Agent:** Map `srs.md` Section 12 (Main Pages) to a Next.js App Router structure. Define server/client boundaries.
- **Database Architect Agent:** Design Firestore schema strictly following `srs.md` Section 13 (Data Structure Plan).
- **Security Engineer Agent:** Outline Firestore and Storage security rules for role separation.
- **Code Review Agent:** Validate architectural documents.

## Phase 3: UI/UX Planning
**Objective:** Design the visual interfaces.
- **UI/UX Designer Agent:** Create layouts for Public Pages, Auth Pages, Worker/Contractor Dashboards, and Admin Panel using shadcn/ui.
- **Frontend Engineer Agent:** Review for technical feasibility.

## Phase 4: Backend Foundation
**Objective:** Setup Firebase architecture.
- **Firebase Backend Agent:** Implement Firebase Client SDK and Admin SDK structures. Setup Storage services for Iqama and TUB card uploads.
- **Authentication and RBAC Agent:** Implement Google Login and role-based route guards for Worker, Contractor, and Admin (`srs.md` Section 5).

## Phase 5: Core Feature Development
**Objective:** Build the platform functional modules.
- **Frontend Engineer Agent:** Build React components, Zod forms, and UI states.
- **AI/OCR Extraction Agent:** Implement the document upload and AI extraction flow for Iqama/TUB cards (`srs.md` Section 6.3).
- **Marketplace Workflow Agent:** Build Job Posting, Worker Search, Applications, and Hiring Flows (`srs.md` Section 7).
- **Payment Workflow Agent:** Implement manual payment tracking and proof uploads (`srs.md` Section 8).

## Phase 6: Admin System
**Objective:** Build moderation and control tools.
- **Admin Panel Agent:** Build dashboards for user management, document verification, job monitoring, and review moderation (`srs.md` Section 10).

## Phase 7: Security and QA
**Objective:** Harden and verify the system.
- **Security Engineer Agent:** Apply final Firestore/Storage rules. Ensure worker documents are not public.
- **QA and Testing Agent:** Test the full Worker, Contractor, and Admin journeys (`srs.md` Section 11).

## Phase 8: Documentation and Deployment
**Objective:** Prepare for production handoff.
- **Documentation Agent:** Write setup guides, README, and user manuals.
- **DevOps and Deployment Agent:** Configure Vercel/Firebase hosting environments.
- **Project Manager Agent:** Issue final completion report.
