# OsamVista UI - React + Vite

A modern, fast, and responsive frontend for the OsamVista project using React 19, Vite, Tailwind CSS, and other cutting-edge technologies.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "axios": "^1.7.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^7.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 🎨 Styling

- **Only Tailwind CSS** - No custom CSS files (except index.css with Tailwind directives)
- Fully responsive design with Tailwind's breakpoints
- Custom color scheme with primary color palette
- Predefined component classes (btn-primary, btn-secondary, card, container-max)

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Home page with hero section
│   ├── Places.jsx        # Places listing page
│   ├── Events.jsx        # Events listing page
│   └── Gallery.jsx       # Gallery page
├── components/
│   ├── Navigation.jsx    # Navigation bar
│   ├── Footer.jsx        # Footer component
│   └── ...other components
├── services/
│   └── api.js            # API client with axios
├── index.css             # Tailwind CSS configuration
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── assets/               # Images and static files
```

## 🔌 API Integration

### API Service (`src/services/api.js`)

Pre-configured Axios instance with:
- Base URL from environment variables
- Request/response interceptors
- Bearer token authentication
- Error handling

### Available API Methods

```javascript
// Places
placesAPI.getAll(params)
placesAPI.getById(id)
placesAPI.create(data)
placesAPI.update(id, data)
placesAPI.delete(id)

// Events
eventsAPI.getAll(params)
eventsAPI.getById(id)
eventsAPI.create(data)
eventsAPI.update(id, data)
eventsAPI.delete(id)

// Gallery
galleryAPI.getAll(params)
galleryAPI.getById(id)
galleryAPI.create(data)
galleryAPI.update(id, data)
galleryAPI.delete(id)

// Auth
authAPI.login(email, password)
authAPI.register(data)
authAPI.logout()
```

## 🔧 Configuration

### Environment Variables (`.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
```

Change the API URL based on your environment:
- Development: `http://127.0.0.1:8000`
- Production: `https://api.osamvista.com`

## 🎯 Getting Started

### Install Dependencies

```bash
cd D:\Project3\ui
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Production-ready files will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## ✨ Features

- **Responsive Design** - Works on all devices
- **Fast Performance** - Vite's lightning-fast HMR
- **Smooth Animations** - Framer Motion animations
- **Modern Icons** - Lucide React icons
- **Type-Safe** - JSX + Tailwind CSS
- **API Integration** - Pre-configured Axios client
- **Routing** - React Router for SPA navigation

## 🎨 Tailwind CSS Classes

### Button Components

```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

### Card Component

```jsx
<div className="card">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</div>
```

### Container

```jsx
<div className="container-max">
  <h1>Main content with max width</h1>
</div>
```

## 📱 Responsive Design

Tailwind's breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example:
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🔐 Authentication

Tokens are stored in localStorage:
```javascript
// Login
const response = await authAPI.login(email, password)
localStorage.setItem('access_token', response.data.token)

// Logout
await authAPI.logout()
```

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Clear Cache

```bash
rm -rf node_modules
npm install
```

### Build Issues

```bash
npm run build -- --debug
```

## 📚 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev)

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/feature-name`
2. Make your changes
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/feature-name`
5. Create a Pull Request

## 📄 License

This project is part of the OsamVista ecosystem.

---

**Development Server:** http://localhost:5173/
**API Server:** http://127.0.0.1:8000/
**API Documentation:** http://127.0.0.1:8000/docs
