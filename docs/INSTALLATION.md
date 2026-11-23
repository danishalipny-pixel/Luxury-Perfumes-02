# Installation & Local Setup — NOIRÉLLE

## Prerequisites
- **Node.js**: Version 18.0.0 or higher (Node 20+ recommended).
- **Package Manager**: `npm` (v9+), `yarn`, or `pnpm`.
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox with ES2022+ support.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/danishalipny-pixel/Luxury-Perfumes-02.git
cd Luxury-Perfumes-02
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Local Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```
*(Optionally adjust `VITE_WHATSAPP_PHONE` to configure target concierge phone number for testing.)*

### 4. Start Development Server
```bash
npm run dev
```
The application will launch on your local network (default: `http://localhost:5173` or `http://localhost:5174`).

### 5. Build for Production
To produce an optimized production bundle:
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory, ready for deployment to any static hosting provider.
