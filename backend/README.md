# DevConnect KZ backend

This service accepts contact form submissions and stores them in Firebase Firestore.

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

## Firestore document shape

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
