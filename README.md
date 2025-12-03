# La Maison Du Lavoir Vert

A modern vacation rental website for La Maison Du Lavoir Vert, a beautiful retreat in the heart of the Languedoc wine country.

## About

La Maison Du Lavoir Vert is a vacation rental property located in the charming medieval village of Tourbes, France. This inviting house offers the perfect escape, surrounded by rolling vineyards, historic sites, and a vibrant cultural scene. The property features four cozy bedrooms, a spacious living room, private swimming pool, sauna, and modern amenities.

## Features

- **Multi-language Support**: English, French, and German
- **Room Pages**: Detailed information about each room (Rodin, Moulin Rouge, Caraibes, Delice)
- **Booking System**: Integrated booking calendar and management system
- **Admin Dashboard**: Full admin interface for managing bookings and events
- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Image Gallery**: Beautiful image galleries showcasing the property

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui (Radix UI)
- **Routing**: React Router
- **Animations**: Framer Motion
- **Backend**: Express.js (Node.js)
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone https://github.com/LeonidasOfficial/dulavoirevert.git
cd dulavoirevert
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

### Backend Server

To run the backend server (for booking management):

```sh
npm run server
```

The backend API will be available at `http://localhost:3001`

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── locales/        # Translation files
│   └── utils/          # Utility functions
├── server/             # Express backend server
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start backend server

## Deployment

Build the project for production:

```sh
npm run build
```

The `dist` folder will contain the production-ready files that can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## License

All rights reserved.
