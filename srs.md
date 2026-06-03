Saudi Manpower Platform — Descriptive Project Plan
1. Project Overview

The project is a Saudi Arabia manpower hiring marketplace where workers can create verified profiles and contractors can hire them for jobs. The platform will work like a simplified version of Upwork/Freelancer, but focused on manpower, labor, site workers, technicians, drivers, cleaners, construction workers, and other job categories.

The main goal is to make worker hiring easier, faster, and more trusted by using:

Google login
Worker profile verification
Iqama and TUB card document upload
AI-assisted document data extraction
Job posting
Worker search
Hiring workflow
Payment tracking
Reviews and ratings

The platform will have three main users:

Worker
Contractor
Admin
2. Main Business Objective

The platform should solve these problems:

For Workers

Many workers do not have a professional online profile. Contractors cannot easily verify their documents, skills, and experience. This platform gives workers a digital profile with verified identity, work history, skills, reviews, and availability.

For Contractors

Contractors often need manpower quickly. They need to find workers based on skills, location, experience, documents, and previous performance. This platform helps contractors post jobs, search workers, hire them, track payment, and review work.

For Platform Owner

The platform owner can manage users, verify documents, control job activity, monitor payments, and build a scalable manpower marketplace business.

3. Target Users
Worker

A worker is an individual looking for work opportunities. Examples:

Electrician
Plumber
Mason
Carpenter
Cleaner
Driver
Painter
Construction labor
AC technician
Welder
Security guard
Helper
Factory worker
Contractor

A contractor is a company or person who needs workers. Examples:

Construction company
Maintenance company
Cleaning company
Facility management company
Real estate contractor
Industrial contractor
Small business owner
Manpower supplier
Admin

The admin is the platform management team. Admins control verification, user management, document checking, disputes, payment status, and overall marketplace quality.

4. Core Platform Concept

The platform should follow this simple flow:

Worker registers
Worker uploads documents
AI extracts Iqama/TUB details
Worker completes profile
Admin verifies profile
Contractor posts job
Worker applies or contractor invites worker
Contractor hires worker
Payment is tracked
Work is completed
Both sides review each other
5. Main Modules
5.1 Authentication Module

Users should be able to register and login using Google.

After login, the user must select a role:

Worker
Contractor

Admin accounts should be created manually by the platform owner.

Authentication should be simple, secure, and role-based.

5.2 Role-Based Onboarding Module

After the first login, the system should ask the user:

What type of account do you want to create?

Options:

Worker Account
Contractor Account

Based on the selected role, the user will be redirected to the correct onboarding process.

Worker onboarding and contractor onboarding should be different.

6. Worker Module
6.1 Worker Profile

The worker profile is the most important part of the platform. It should contain all necessary information that helps contractors trust and hire the worker.

Worker profile should include:

Full name
Profile photo
Phone number
Email
Nationality
Current city
Available work location
Profession/category
Years of experience
Skills
Expected salary/rate
Availability status
Language skills
Work history
Previous company reviews
Iqama details
TUB card details
Verification status
Average rating
Total completed jobs
6.2 Worker Document Upload

Workers should upload:

Iqama photo
TUB card photo

The uploaded documents should be stored securely. These documents should not be publicly visible.

After upload, the system should create a document verification record.

6.3 AI Document Extraction

After a worker uploads an Iqama or TUB card, AI should read the image and extract important information.

For Iqama, AI should try to detect:

Full name
Iqama number
Nationality
Profession
Date of birth if available
Expiry date
Employer name if available

For TUB card, AI should try to detect:

Card number
Worker name
Profession
Expiry date
Organization/company name if available

Important: AI should not directly approve documents. AI should only help fill data automatically.

The correct flow should be:

Upload document
AI extracts details
Worker reviews extracted data
Worker confirms or edits data
Admin verifies final information
6.4 Worker Skills and Experience

The worker should be able to add:

Work category
Skills
Experience years
Previous companies
Project history
Certificates if available
Expected work type
Expected salary/rate
Preferred city
Availability

Example skills:

Electrical wiring
Plumbing
Tile work
Painting
Welding
Driving
AC maintenance
Heavy equipment operation
Cleaning
Construction labor
6.5 Previous Company Review

The platform should allow the worker to add previous company references or reviews.

This can include:

Company name
Reviewer name
Rating
Comment
Work duration
Job role
Contact reference if available

For MVP, this can be manually added by the worker and later verified by admin.

In future, companies can directly submit verified reviews.

6.6 Worker Dashboard

The worker dashboard should show:

Profile completion percentage
Document verification status
Available jobs
Applications submitted
Active contracts
Payment status
Reviews received
Notifications

The worker should clearly see what is missing from their profile.

Example:

Your profile is 70% complete.
Upload your TUB card to become eligible for verified jobs.
7. Contractor Module
7.1 Contractor Profile

Contractors should create a company or individual hiring profile.

Contractor profile should include:

Company name
Contact person name
Email
Phone number
City
Business category
Company registration number if available
Company address
Verification status
Average rating
Total jobs posted
Total workers hired
7.2 Contractor Dashboard

The contractor dashboard should show:

Total job posts
Open jobs
Applications received
Shortlisted workers
Active contracts
Pending payments
Completed jobs
Reviews
Notifications

The dashboard should help contractors manage hiring easily.

7.3 Job Posting

Contractors should be able to post jobs.

A job post should include:

Job title
Job category
Job description
Required skills
Number of workers needed
City/location
Work duration
Start date
End date if needed
Budget type
Budget amount
Payment type
Experience requirement
Document verification requirement
Job status

Job status can be:

Draft
Open
In progress
Completed
Cancelled
Closed

Example job:

Need 10 electricians for a construction project in Riyadh.
Duration: 3 months.
Experience: Minimum 3 years.
Documents required: Valid Iqama and TUB card.
Salary: SAR 2500 monthly.
7.4 Worker Search

Contractors should be able to search and filter workers.

Search filters should include:

Skill
Category
City
Nationality
Experience years
Availability
Verification status
Rating
Expected salary/rate
Document validity

Worker cards should show:

Name
Profession
City
Experience
Skills
Rating
Verification badge
Availability
Expected rate
7.5 Hiring Flow

The hiring flow should be simple.

There should be two hiring methods:

Method 1: Worker Applies to Job
Contractor posts job
Worker applies
Contractor reviews applications
Contractor shortlists worker
Contractor sends hire offer
Worker accepts
Contract starts
Method 2: Contractor Invites Worker
Contractor searches worker
Contractor views profile
Contractor sends hire offer
Worker accepts
Contract starts
7.6 Contract Management

When a contractor hires a worker, the system should create a contract.

Contract should include:

Worker
Contractor
Related job
Start date
End date
Work duration
Payment rate
Payment type
Contract status
Payment status
Terms and notes

Contract status can be:

Offered
Accepted
Active
Completed
Cancelled
Disputed

Payment status can be:

Pending
Partial
Paid
Failed
Refunded
8. Payment Module

For MVP, payment should be simple and manually tracked.

The platform does not need to process real online payments in the first version.

Recommended MVP payment flow:

Contractor hires worker
Payment record is created
Contractor marks payment as pending/paid
Contractor uploads payment proof if needed
Admin verifies payment
Worker sees payment status

Payment details should include:

Contract ID
Worker
Contractor
Amount
Currency: SAR
Payment method
Payment proof
Payment status
Admin verification status
Transaction reference
Payment date

Supported payment methods for MVP:

Cash
Bank transfer
Manual payment
External payment

Future payment integrations:

PayTabs
HyperPay
Stripe
Bank transfer automation
Escrow wallet
Milestone payment
Platform commission system
9. Review and Rating Module

After a contract is completed, both parties should be able to review each other.

Contractor Reviews Worker

Contractor can rate:

Work quality
Professional behavior
Punctuality
Skill accuracy
Communication
Overall rating
Worker Reviews Contractor

Worker can rate:

Payment behavior
Work environment
Communication
Professional treatment
Overall rating

Reviews should help build trust in the marketplace.

Admin should be able to moderate reviews if needed.

10. Admin Module

The admin panel is very important for trust and control.

10.1 Admin Dashboard

Admin dashboard should show:

Total users
Total workers
Total contractors
Pending document verification
Open jobs
Active contracts
Completed contracts
Pending payments
Reported issues
Platform growth summary
10.2 User Management

Admin should manage:

Workers
Contractors
Admins
Suspended users
Pending users
Verified users

Admin can:

View user details
Change user status
Suspend user
Verify user
Reject user
Add admin notes
10.3 Document Verification

Admin should review uploaded Iqama and TUB card documents.

Admin can see:

Uploaded image
AI extracted data
Worker confirmed data
Raw extracted text
Confidence score
Document status

Admin actions:

Approve document
Reject document
Request resubmission
Add verification notes

Document status can be:

Uploaded
Processing
Extracted
Pending verification
Verified
Rejected
Failed
10.4 Job Management

Admin can monitor all job posts.

Admin can:

View all jobs
Approve jobs if needed
Remove inappropriate jobs
Close suspicious jobs
View applications
View contracts
10.5 Payment Management

Admin can monitor payment records.

Admin can:

View pending payments
Verify manual payments
Reject fake payment proof
Add payment notes
Resolve payment disputes
10.6 Review Moderation

Admin can manage reviews.

Admin can:

View reported reviews
Hide inappropriate reviews
Remove fake reviews
Resolve review disputes
11. Marketplace Workflow
Worker Journey
1. Worker visits platform
2. Logs in with Google
3. Selects Worker role
4. Completes basic profile
5. Uploads Iqama photo
6. Uploads TUB card photo
7. AI extracts document details
8. Worker reviews and confirms details
9. Admin verifies documents
10. Worker becomes verified
11. Worker browses jobs
12. Worker applies to jobs
13. Contractor sends hire offer
14. Worker accepts offer
15. Contract starts
16. Worker completes work
17. Payment is marked and verified
18. Worker receives review
Contractor Journey
1. Contractor visits platform
2. Logs in with Google
3. Selects Contractor role
4. Completes company profile
5. Posts manpower job
6. Receives worker applications
7. Searches verified workers
8. Shortlists suitable workers
9. Sends hire offer
10. Worker accepts offer
11. Contract starts
12. Contractor tracks work/payment
13. Contract completed
14. Contractor reviews worker
Admin Journey
1. Admin logs in
2. Views dashboard
3. Checks pending documents
4. Verifies worker identity
5. Monitors contractors and jobs
6. Reviews active contracts
7. Verifies payments
8. Handles disputes
9. Maintains platform quality
12. Main Pages
Public Pages
Landing page
Login page
About page
How it works page
Worker benefits page
Contractor benefits page
Contact page
Auth Pages
Login
Role selection
Onboarding
Worker Pages
Worker dashboard
Worker profile
Worker documents
Worker jobs
Worker applications
Worker contracts
Worker payments
Worker reviews
Worker notifications
Contractor Pages
Contractor dashboard
Contractor profile
Post job
Manage jobs
Browse workers
Applications
Contracts
Payments
Reviews
Notifications
Admin Pages
Admin dashboard
Users
Workers
Contractors
Documents
Jobs
Applications
Contracts
Payments
Reviews
Disputes
Settings
Audit logs
13. Data Structure Plan

The database should be organized around these main data groups:

Users

Stores basic login and role information.

Contains:

User ID
Name
Email
Profile photo
Role
Status
Created date
Updated date
Workers

Stores worker-specific profile information.

Contains:

Worker personal info
Skills
Experience
Documents
Verification status
Availability
Rating
Work history
Contractors

Stores contractor/company information.

Contains:

Company info
Contact person
Business category
Verification status
Posted jobs
Rating
Documents

Stores uploaded document information.

Contains:

Document type
Image location
AI extracted data
Worker confirmed data
Verification status
Admin notes
Confidence score
Jobs

Stores contractor job posts.

Contains:

Job title
Description
Location
Required skills
Workers needed
Budget
Duration
Status
Created by contractor
Applications

Stores worker job applications.

Contains:

Worker ID
Job ID
Contractor ID
Application message
Expected rate
Status
Contracts

Stores hiring relationship between worker and contractor.

Contains:

Worker
Contractor
Job
Contract amount
Start date
End date
Status
Payment status
Payments

Stores payment tracking records.

Contains:

Contract
Amount
Currency
Method
Status
Proof
Admin verification
Reviews

Stores reviews and ratings.

Contains:

Reviewer
Reviewee
Rating
Comment
Contract reference
Created date
Notifications

Stores system notifications.

Examples:

Document verified
Job application received
Hire offer received
Contract accepted
Payment verified
Review received
Audit Logs

Stores important platform activity.

Examples:

User role changed
Document approved
Payment verified
Job removed
User suspended
14. Verification System

The platform should have multiple verification levels.

Worker Verification Levels
Unverified
Profile completed
Documents uploaded
AI extracted
Worker confirmed
Admin verified
Rejected
Contractor Verification Levels
Unverified
Profile completed
Pending review
Verified
Rejected
Suspended
Job Verification Levels
Draft
Open
Under review
Approved
Closed
Cancelled
Reported
15. AI Extraction Rules

AI should help extract data from documents, but it should not make the final decision.

The system should always follow this rule:

AI suggests.
Worker confirms.
Admin verifies.

AI extraction should include:

Raw text extraction
Structured data extraction
Confidence score
Error detection
Manual correction option

The worker should be able to correct wrong extracted data before submitting for admin verification.

Admin should be able to compare:

Uploaded document image
AI extracted data
Worker submitted data
Final verification decision
16. Security Plan

The platform must protect personal and document data.

Important Security Rules
Users can only access their own private profile.
Workers can only edit their own worker profile.
Contractors can only edit their own contractor profile.
Workers can only upload their own documents.
Contractors can only manage their own jobs.
Admin can access verification and management data.
Documents should not be public.
Payment proof should not be public.
Sensitive information should not be exposed on public pages.
Public Worker Profile Data

Contractors should only see safe worker information, such as:

Name
Profession
City
Experience
Skills
Rating
Verification badge
Availability

Contractors should not automatically see sensitive document images unless allowed by the platform policy.

17. UI/UX Direction

The design should be simple, professional, and trustworthy.

Design Style
Clean SaaS marketplace design
Light background
Professional color palette
Strong verification badges
Simple cards
Mobile responsive
Fast onboarding
Easy dashboards
Clear status indicators
Suggested Design Feel

The platform should feel like:

Upwork simplicity
LinkedIn profile trust
Modern SaaS dashboard
Saudi business marketplace
Main UI Components
Dashboard cards
Worker profile card
Job card
Status badge
Verification badge
Document upload box
Step-by-step onboarding
Search filter sidebar
Contract summary card
Payment status card
Review card
Admin data table
18. MVP Scope

The first version should focus only on the core business flow.

MVP Must Have
Google login
Role selection
Worker profile
Contractor profile
Iqama upload
TUB card upload
AI extraction placeholder/initial version
Admin document verification
Job posting
Worker search
Job application
Hire offer
Contract creation
Manual payment tracking
Review system
Admin dashboard
Basic notifications
MVP Should Avoid
Complex escrow
Advanced chat
Real payment gateway
Mobile app
Multi-language at first
Complex commission system
Advanced dispute system
Video verification
Payroll system
Attendance system

These can come later.

19. Future Features

After MVP, add:

Arabic language
English/Arabic switcher
WhatsApp notification
SMS notification
In-app chat
Worker location map
Real-time availability
PayTabs/HyperPay integration
Escrow payment system
Platform commission
Subscription plans for contractors
Verified agency accounts
Bulk hiring
Attendance tracking
Worker timesheets
Contract PDF generation
Invoice generation
Dispute center
Mobile app
AI worker-job matching
Saudi government API integration if available
20. Development Phases
Phase 1: Foundation

Goal: Create the basic app structure.

Deliverables:

Next.js app setup
Firebase project setup
Authentication setup
Database setup
Storage setup
Basic layouts
Public landing page
Login page
Phase 2: Authentication and Role System

Goal: Allow users to login and select role.

Deliverables:

Google login
User record creation
Role selection
Worker dashboard route
Contractor dashboard route
Admin dashboard route
Protected page access
Phase 3: Worker Profile and Documents

Goal: Build worker onboarding.

Deliverables:

Worker profile form
Skills and experience form
Iqama upload
TUB card upload
AI extraction process
Worker document review
Profile completion indicator
Phase 4: Contractor Profile and Jobs

Goal: Build contractor onboarding and job posting.

Deliverables:

Contractor profile form
Job create form
Job management page
Job listing page
Job status management
Phase 5: Marketplace Flow

Goal: Connect workers and contractors.

Deliverables:

Worker search
Job browsing
Job application
Application status
Shortlist flow
Hire offer
Contract creation
Phase 6: Payment and Reviews

Goal: Complete basic transaction lifecycle.

Deliverables:

Manual payment tracking
Payment proof upload
Admin payment verification
Contract completion
Worker review
Contractor review
Rating calculation
Phase 7: Admin Panel

Goal: Give platform owner control.

Deliverables:

Admin dashboard
User management
Document verification
Job management
Contract management
Payment verification
Review moderation
Audit logs
Phase 8: Security and Production Polish

Goal: Make the app production-ready.

Deliverables:

Database security rules
Storage security rules
Role-based access
Form validation
Error handling
Loading states
Empty states
Responsive design
SEO setup
Deployment setup
Documentation
Testing checklist
21. Business Workflow
Complete Platform Workflow
1. User logs in with Google
2. User selects role
3. User completes profile
4. Worker uploads documents
5. AI extracts document data
6. Worker confirms extracted data
7. Admin verifies worker
8. Contractor posts job
9. Worker applies or contractor invites worker
10. Contractor hires worker
11. Contract is created
12. Payment record is created
13. Work is completed
14. Payment is confirmed
15. Reviews are submitted
16. Ratings are updated
22. Admin Control Workflow
New worker registered
   ↓
Worker uploads documents
   ↓
AI extracts data
   ↓
Worker confirms
   ↓
Admin reviews document
   ↓
Admin approves/rejects
   ↓
Worker gets verified badge
23. Contractor Hiring Workflow
Contractor posts job
   ↓
Workers apply
   ↓
Contractor reviews applications
   ↓
Contractor shortlists worker
   ↓
Contractor sends hire offer
   ↓
Worker accepts
   ↓
Contract starts
   ↓
Payment tracked
   ↓
Contract completed
   ↓
Review submitted
24. Worker Profile Completion Logic

The worker dashboard should show profile completion.

Example scoring:

Basic information: 20%
Skills added: 15%
Experience added: 15%
Iqama uploaded: 20%
TUB card uploaded: 20%
Profile photo added: 5%
Previous review/reference added: 5%

Profile status:

0% - 40%: Incomplete
41% - 70%: Basic profile
71% - 90%: Almost ready
91% - 100%: Ready for verification
Verified by admin: Verified worker
25. Key Status Badges

Use clear badges across the platform.

Worker Badges
Unverified
Pending Verification
Verified Worker
Available
Currently Hired
Top Rated
New Worker
Contractor Badges
Unverified Contractor
Verified Contractor
Trusted Contractor
High Hiring Rate
Job Badges
Open
Urgent
In Progress
Completed
Cancelled
Payment Badges
Pending
Partially Paid
Paid
Failed
Refunded
Admin Verified
26. Platform Monetization Ideas

The platform can make money from:

Contractor subscription
Featured job posts
Featured worker profiles
Commission from hiring
Document verification fee
Premium contractor account
Bulk hiring package
Agency account package
Advertisement
Recruitment service fee

Recommended MVP monetization:

Free worker registration
Free contractor registration
Paid featured job posts
Manual commission tracking
Premium contractor plan later
27. Risk and Solution Plan
Risk: Fake Documents

Solution:

AI extraction
Manual admin verification
Document status tracking
Audit logs
Risk: Fake Reviews

Solution:

Only allow reviews after completed contracts
Admin moderation
Report review option
Risk: Payment Disputes

Solution:

Manual payment proof
Admin verification
Contract payment status
Dispute status
Risk: Wrong AI Extraction

Solution:

Worker review step
Admin verification step
Confidence score
Manual correction
Risk: Unauthorized Data Access

Solution:

Role-based access
Database security rules
Storage security rules
Server-side admin operations
28. Acceptance Criteria

The MVP is successful when:

Worker can login with Google.
Worker can create a profile.
Worker can upload Iqama and TUB card.
AI can extract document information or prepare it for admin review.
Worker can confirm document details.
Admin can verify or reject documents.
Contractor can login with Google.
Contractor can create company profile.
Contractor can post a job.
Worker can apply to a job.
Contractor can hire a worker.
A contract can be created.
Payment can be tracked manually.
Both parties can submit reviews after completion.
Admin can manage users, documents, jobs, contracts, payments, and reviews.
Routes are protected by role.
Sensitive data is protected.
App is responsive and production-ready.
29. Final Project Summary

This platform should be built as a trusted manpower marketplace for Saudi Arabia.

The first version should not try to be too complex. It should focus on:

Verified worker profiles
Contractor job posting
Worker hiring
Manual payment tracking
Reviews
Admin verification

The strongest value of the platform will be:

Document verification
Worker trust profile
Easy contractor hiring
Clear job and contract workflow
Reliable review system

Once the MVP works, the platform can grow into a complete manpower ecosystem with:

Mobile app
Real payments
Escrow
Arabic support
Bulk hiring
Agencies
Payroll
Attendance
Timesheets
AI worker matching
Government verification integration