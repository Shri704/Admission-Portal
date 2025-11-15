# Engineering Admission Portal

Unified platform for managing engineering college admissions, documents, notifications, and online fee payments. The project delivers a full-stack MERN implementation with a production-ready backend (Express + MongoDB + Razorpay + Cloudinary) and a React + Vite frontend featuring role-based dashboards for students and administrators.

## Features

- **Secure authentication** for students and admins with JWT + role-based authorization.
- **Student portal** for admission submissions, document uploads, profile management, and Razorpay-backed fee payments (with automatic mock mode fallback for local development).
- **Admin console** to review admissions, manage students, configure fee structures, trigger notifications, and export payment reports.
- **Responsive UI** built with React, Tailwind CSS, and context-driven state management.
- **Modular services** for notifications (email/SMS placeholders), document storage (Cloudinary), and payment reporting.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router 7
- **Backend:** Node.js, Express, MongoDB (Mongoose), Razorpay SDK, Cloudinary, Joi validation
- **Tooling:** ESLint, Prettier, Nodemon, Winston logger, dotenv

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas connection or local MongoDB instance
- Razorpay credentials (optional in development; mock mode is enabled when absent)
- Cloudinary account (for document uploads)

## Project Structure

```
Admittion-Project/
├── backend/          # Express API with services, controllers, tests
└── frontend/         # React + Vite single page application
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # create if missing, populate as below
npm run dev
```

### `.env` configuration

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional integrations
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.server.com
SMTP_PORT=587
SMTP_USER=no-reply@server.com
SMTP_PASS=app_password
FROM_EMAIL=no-reply@server.com
```

> **Note:** If Razorpay keys are not set, the backend automatically enables a mock payment mode so you can test end-to-end flows locally without a live gateway.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend expects the backend API at `http://localhost:5000/api`. Override via `VITE_API_URL` in a `.env` file inside `frontend/`.

## Available Scripts

### Backend (`/backend`)

- `npm run dev` – start API in watch mode
- `npm run start` – start API in production mode
- `npm run lint` – run ESLint
- `npm run format` – apply Prettier formatting

### Frontend (`/frontend`)

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – lint React codebase

## Testing Payments

- With valid Razorpay keys, the fee payment pages open the Razorpay checkout widget and verify signatures server-side.
- Without keys, the backend serves a mock mode that auto-confirms payments so the UI and reporting flows remain testable.

## Contributing

1. Fork and clone the repository.
2. Create a feature branch.
3. Commit with descriptive messages.
4. Open a pull request targeting `main`.

## License

This project is released under the MIT License. See `LICENSE` for details.

