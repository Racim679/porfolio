# Portfolio Website

A modern portfolio website built with Next.js, featuring 3D animations, glassmorphism effects, and a clean design.

## Features

- **Navbar**: Fixed navigation with logo and CV button
- **Hero Section**: Profile image with overlapping "Contacte Moi" button and Antigravity 3D background
- **Projects Section**: Carousel displaying your projects
- **Tech Stack Section**: Grid layout with mastery bars and animated logo loop
- **Footer**: Clean contact buttons (Mail, LinkedIn, WhatsApp+)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your profile image:
   - Place your profile image in `public/profile.jpg`
   - Or update the `profileImage` prop in `app/page.tsx`

3. Customize content:
   - Update projects in `components/Projects.tsx`
   - Update tech stack items in `components/TechStack.tsx`
   - Update contact links in `components/Footer.tsx`
   - Update description in `app/page.tsx`

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Deployment

The site is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy!

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Lucide React Icons
