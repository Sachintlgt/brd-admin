# Property Admin Panel

A Next.js admin panel for managing properties with authentication, CRUD operations, file uploads, and booking calendar.

## Features

- User authentication
- Property management (add, edit, delete, search)
- File uploads for photos, videos, and legal documents
- Phase-wise pricing and maintenance charges
- Staff assignment
- Booking calendar view
- Featured and active status toggles

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/` - Next.js app directory
- `app/context/` - React contexts for auth and properties
- `app/types/` - TypeScript type definitions
- `app/login/` - Login page
- `app/dashboard/` - Dashboard with stats
- `app/properties/` - Property management pages

## Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS
- React Hook Form
- React Dropzone
- React Calendar
- Lucide React (icons)
