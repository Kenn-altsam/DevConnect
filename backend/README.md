# DevConnect KZ backend

This service accepts contact form submissions, developer applications, and project briefs, then stores them in Firebase Firestore.

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure Firebase

1. Create a Firebase project.
2. Enable Firestore Database.
3. Generate a Firebase Admin SDK service account key.
4. Copy `backend/.env.example` to `backend/.env`.
5. Fill in:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

`FIREBASE_PRIVATE_KEY` must keep the `\n` line breaks exactly as shown in the example.

## 3. Run

```bash
cd backend
npm start
```

The API will be available at `http://localhost:3000/api/contact`.
Developer applications will be available at `http://localhost:3000/api/developer-applications`.
Project briefs will be available at `http://localhost:3000/api/projects`.

## Contact document shape

Each request is stored in the `contactRequests` collection by default:

```json
{
  "fullName": "Aruzhan Tulegenova",
  "email": "user@example.com",
  "topic": "Partnership",
  "message": "Tell us what you need",
  "createdAt": "server timestamp"
}
```

Allowed `topic` values:

- `General Inquiry`
- `Partnership`
- `Support`

## Developer application document shape

Each developer application is stored in the `developerApplications` collection by default:

```json
{
  "fullName": "Aruzhan Tulegenova",
  "email": "dev@example.com",
  "role": "Frontend Developer",
  "location": "Almaty, Kazakhstan",
  "mainStack": "React, TypeScript, Next.js, Tailwind",
  "portfolioLinks": "GitHub, LinkedIn, personal website, project links",
  "experienceSummary": "Describe experience, strongest projects, and preferred work.",
  "status": "new",
  "createdAt": "server timestamp"
}
```

## Project document shape

Each project brief is stored in the `projects` collection by default:

```json
{
  "projectTitle": "CRM dashboard for logistics startup",
  "budget": "$2,000 - $5,000",
  "timeline": "4-6 weeks",
  "techStack": "React, Node.js, PostgreSQL",
  "projectDescription": "What should be built and why.",
  "expectedOutcome": "Prototype, MVP, redesign, API integration, maintenance, etc.",
  "createdAt": "server timestamp"
}
```

You can override the collection names with:

- `FIREBASE_CONTACT_COLLECTION`
- `FIREBASE_DEVELOPER_APPLICATIONS_COLLECTION`
- `FIREBASE_PROJECTS_COLLECTION`
