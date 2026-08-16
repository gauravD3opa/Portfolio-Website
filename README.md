# Senior Software Engineer Portfolio Website

React + Vite portfolio website with configuration-driven content and a Firebase Firestore contact form.

Original Figma project:

https://www.figma.com/design/JVBlf2INzXD8cdWKLJxPa3/Senior-Software-Engineer-Portfolio-Website--Community-

---

## 🚀 Quick Start

### 1. Prerequisites

Install:

- Node.js
- Git
- Vercel CLI
- Firebase account

Install Vercel CLI:

```bash
npm install -g vercel
```

---

## 2. Install Dependencies

Clone the repository and enter the project:

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

---

## 3. Configure Firebase

Create a project in:

https://console.firebase.google.com/

Then:

```text
Firebase Project
      │
      ├── Create Firestore Database
      │
      └── Project Settings
              │
              └── Service Accounts
                      │
                      └── Generate Private Key
```

Create the Firestore database.

The application stores contact messages in:

```text
contactMessages/
```

### Firestore Rules

Set the rules to prevent direct browser access:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /contactMessages/{messageId} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. Create Vercel Project

The API uses Vercel Serverless Functions, so **`npm run dev` alone is not sufficient for local development**.

Create/link the project:

```bash
vercel
```

Follow the prompts to create or link the Vercel project.

The architecture is:

```text
                   Vercel
                     │
          ┌──────────┴──────────┐
          │                     │
       React UI            /api/contact
          │                     │
          │                     ▼
          │                Firebase Admin
          │                     │
          │                     ▼
          │                 Firestore
          │
          └──── portfolio-config.json
```

---

## 5. Configure Environment Variables

The backend requires:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
IP_HASH_SALT
```

### Local Development

Vercel `dev` uses the environment variables associated with the linked Vercel project.

Add the variables to the **Development** environment in:

**Vercel → Project → Settings → Environment Variables**

Then run:

```bash
vercel dev
```

Do **not** commit Firebase credentials to Git.

---

## 6. Run the Application

Use:

```bash
vercel dev
```

Vercel starts both the frontend and the serverless API.

Typically:

```text
http://localhost:3000
```

### Why not `npm run dev`?

```text
npm run dev
     │
     ▼
   Vite
     │
     └── React only
           │
           └── /api/contact ❌
```

Use:

```text
vercel dev
     │
     ├── Vite / React       ✅
     │
     └── /api/contact       ✅
             │
             ▼
          Firestore
```

---

# 📝 Portfolio Configuration

All public portfolio content is maintained in:

```text
public/portfolio-config.json
```

This includes:

```text
portfolio-config.json
        │
        ├── Personal information
        ├── About
        ├── Skills
        ├── Experience
        ├── Projects
        ├── Education
        ├── Contact information
        └── Public/social/project links
```

Update this file instead of changing React components for normal portfolio-content changes.

### Important

`portfolio-config.json` is **public**.

Never put secrets, passwords, API keys, or Firebase credentials in it.

---

# 📩 Contact Form

The contact form follows this flow:

```text
Visitor
   │
   ▼
Contact.tsx
   │
   │ POST /api/contact
   ▼
Vercel Serverless Function
   │
   ├── Validate input
   ├── Check honeypot
   ├── Rate limit
   ├── Hash IP
   │
   ▼
Firebase Admin SDK
   │
   ▼
Firestore
   │
   ▼
Success response
   │
   ▼
React → "Message sent"
```

Messages are stored in:

```text
Firestore
└── contactMessages
    └── <message-id>
        ├── name
        ├── email
        ├── subject
        ├── message
        ├── createdAt
        ├── isRead
        ├── emailSent
        └── ipHash
```

**Email notification is currently not enabled.**

---

# 🔐 Security

The contact API includes:

```text
                     Contact Request
                           │
                           ▼
                    Server validation
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 Honeypot     Rate Limit
                    │             │
                    └──────┬──────┘
                           ▼
                      Firestore
```

Protection includes:

- Server-side validation
- Input length limits
- Honeypot bot detection
- IP-based rate limiting
- Hashed IP storage
- Firebase credentials kept server-side
- Firestore client access disabled
- HTML escaping
- POST-only API

---

# 📁 Project Structure

```text
.
├── api/
│   ├── contact.ts
│   └── lib/
│       └── firebase-admin.ts
│
├── public/
│   └── portfolio-config.json
│
├── src/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🛠 Useful Commands

Install dependencies:

```bash
npm install
```

Frontend only:

```bash
npm run dev
```

Frontend + Vercel API:

```bash
vercel dev
```

Production build:

```bash
npm run build
```

---

# 🚀 Production Deployment

```text
GitHub
   │
   ▼
Vercel
   │
   ├── React/Vite
   │
   └── /api/contact
           │
           ▼
       Firestore
```

Steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the four production environment variables.
4. Deploy.
5. Test the contact form.

---

## Original Project

The original community design is available at:

https://www.figma.com/design/JVBlf2INzXD8cdWKLJxPa3/Senior-Software-Engineer-Portfolio-Website--Community-