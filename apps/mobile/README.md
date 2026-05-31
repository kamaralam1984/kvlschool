# KVL School Mobile App

React Native / Expo mobile app for KVL International School.

## Quick Start

```bash
cd apps/mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (iOS / Android).

## Role-Based Login

| Role    | Portal Features                                      |
|---------|------------------------------------------------------|
| Student | Dashboard, Timetable, Marks, Attendance, Notifications |
| Parent  | Child selector, Fees (Pay), Progress, Notices, Alerts  |
| Teacher | Periods, Attendance marking, Grade entry, Leave mgmt   |
| Admin   | Students, Staff, Fees, Notifications                   |

## API

Points to `http://localhost:4000/api/v1` (the `apps/api` NestJS server).
Edit `src/config/api.ts` to change the base URL for staging/production.

All screens include **offline-safe mock data** — the UI renders even when the API is unreachable.

## Project Structure

```
apps/mobile/
├── App.tsx                        # Root component
├── app.json                       # Expo config
├── package.json
├── tsconfig.json
├── babel.config.js
├── assets/                        # Icons & splash (add PNGs here)
└── src/
    ├── config/api.ts              # Axios client + endpoints
    ├── context/AuthContext.tsx    # Auth state + SecureStore
    ├── navigation/AppNavigator.tsx # Role-based tab routing
    └── screens/
        ├── auth/LoginScreen.tsx
        ├── student/StudentDashboard.tsx
        ├── parent/ParentDashboard.tsx
        ├── teacher/TeacherDashboard.tsx
        └── shared/
            ├── AttendanceScreen.tsx
            └── NotificationsScreen.tsx
```

## Before Building for Production

1. Add icon/splash images to `assets/`
2. Update `app.json` with your actual bundle identifiers
3. Set API base URL in `src/config/api.ts`
4. Run `eas build` (requires Expo account)
