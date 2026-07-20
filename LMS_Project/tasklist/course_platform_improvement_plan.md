# Course Learning Platform Improvement Plan

## Overview

The platform will support three types of users:

1.  Free User
2.  Trial User
3.  Paid User

The goal is to provide free learning access, trial-based premium access,
and controlled paid course access with payment verification.

## Current Coverage Snapshot

Last checked: `2026-07-13`

### Already Implemented In Code

- Trial/default subscription data model via `user_subscriptions`
- Profile-level `FREE / TRIAL / PAID` account state
- Course access metadata for `FREE / TRIAL_PREVIEW / PAID`
- Payment request backend table and admin approval flow
- Payment-proof storage migration, browser upload helper, and admin screenshot preview wiring
- Admin analytics counts for users, payments, revenue, and top courses
- Admin activity log helper/API
- Safe course delete confirmation UX plus dependency-aware soft delete flow
- Manual course access history panel and admin activity timeline filters in dashboard
- Trial-expiry downgrade helper plus scheduled cron endpoint

### Partially Implemented

- Learner course gating now has backend/helper support, but full UX still needs final pass
- Admin payment operations now have dashboard workspace support, but live Supabase storage verification is still pending
- Remove/restore and manual course access backend flows now have dashboard UX, but still need final acceptance testing
- Admin-managed user create form and course edit workspace exist, but still need final acceptance testing
- Admin activity timeline and safe delete UX exist, but still need live verification

### Not Implemented Yet

- Live Supabase verification for learner screenshot upload end-to-end
- Progress tracking
- Certificates
- Notifications
- Full security hardening and final production verification

------------------------------------------------------------------------

# User Subscription System

## 1. Trial User

### Registration Flow

When a new user registers:

    Register
       |
       v
    Trial User Account
       |
       v
    30 Days Trial Period

### Trial User Access

-   Access to free courses
-   Limited access to paid courses
-   Course previews
-   Selected premium lessons

After 30 days:

    Trial Expired
          |
          v
    Free User

The user dashboard will show:

-   Trial expired message
-   Upgrade button

------------------------------------------------------------------------

# 2. Free User

Free users will have:

## Access

-   Free courses
-   Basic learning materials
-   Public resources

## Restrictions

-   Paid courses locked
-   Premium resources unavailable

Dashboard:

    Account Type:
    Free User

    Available:
    Free Courses

    Premium:
    Locked

    [Upgrade Now]

------------------------------------------------------------------------

# 3. Paid User

Paid users get premium access after payment approval.

## Features

-   Complete paid courses
-   Premium videos
-   Downloadable resources
-   Assignments
-   Certificates
-   Progress tracking

------------------------------------------------------------------------

# Payment and Upgrade System

## Upgrade Page

The upgrade page will contain:

-   Available subscription plans
-   Payment instructions
-   Bank information
-   Payment proof upload
-   Transaction ID submission

Example:

    Premium Plan

    Price:
    XXXX BDT

    Payment Method:
    Bank Transfer

    Transaction ID:
    _________

    Upload Screenshot:
    [Upload]

    Submit Request

------------------------------------------------------------------------

# Admin Payment Approval

Admin dashboard will include:

## Payment Requests

Admin can view:

-   User information
-   Selected plan
-   Transaction ID
-   Payment screenshot
-   Payment status

Actions:

-   Approve
-   Reject

After approval:

    Trial User
          |
          v
    Paid User

------------------------------------------------------------------------

# Database Structure Recommendation

## Users Table

    id
    name
    email
    password

## Subscription Table

    id
    user_id
    plan
    start_date
    end_date
    status

Plan values:

    trial
    free
    paid

This structure allows future subscription expansion.

------------------------------------------------------------------------

# Course Management

Each course should have:

    Course Title

    Course Type:

    - Free
    - Paid

Access logic:

    If Course = Free
        Allow all users

    If Course = Paid
        Check subscription status

    If Paid Active
        Allow access

    Else
        Redirect to Upgrade Page

------------------------------------------------------------------------

# Learning Progress System

Users should be able to track:

-   Completed lessons
-   Course percentage
-   Learning history

Example:

    Python Course

    Progress:
    80%

    Completed:
    16/20 Lessons

------------------------------------------------------------------------

# Certificate System

After completing a course:

    Congratulations!

    Course Completed

    Download Certificate PDF

------------------------------------------------------------------------

# Notification System

The system should send notifications:

## Trial Expiry

"Your trial expires in 7 days."

## Payment Approval

"Your premium access has been activated."

## Subscription Expiry

"Your premium access has expired."

------------------------------------------------------------------------

# Admin Dashboard

Admin statistics:

    Total Users

    Free Users

    Trial Users

    Paid Users

    Revenue

    Pending Payments

    Popular Courses

------------------------------------------------------------------------

# Security Features

Recommended:

-   Email verification
-   Password reset
-   Secure payment verification
-   Video access protection
-   User activity logging

------------------------------------------------------------------------

# Final User Journey

    Visitor
       |
    Register
       |
    Trial User (30 Days)
       |
       +----------------+
       |                |
    Upgrade          Expire
       |                |
    Payment          Free User
       |
    Admin Approval
       |
    Paid User
       |
    Premium Learning
       |
    Certificate

------------------------------------------------------------------------

# Future Expansion Ideas

-   Monthly/yearly subscription plans
-   Course bundles
-   Instructor accounts
-   Live classes
-   Quiz system
-   Discussion forum
-   AI learning assistant
