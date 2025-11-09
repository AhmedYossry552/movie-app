# 🎬 MovieApp - Production-Quality Angular 20 Application

A modern, Netflix-style movie discovery application built with Angular 20, featuring a complete enterprise architecture, beautiful UI, and production-ready features.

![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎥 Core Features
- **Browse Movies**: Explore now-playing movies with pagination
- **Movie Details**: View comprehensive movie information, trailers, and recommendations
- **Search**: Real-time debounced search with infinite scroll
- **Wishlist**: Save and manage favorite movies (persisted in LocalStorage)
- **User Authentication**: Register/Login system with auth guards
- **Multi-language Support**: English, Arabic, French, Chinese with RTL support
- **Dark/Light Mode**: Toggle between themes with smooth transitions

### 🏗️ Architecture & Best Practices
- **Enterprise Folder Structure**: Core, Features, Shared modules
- **Lazy Loading**: All feature modules are lazy-loaded for optimal performance
- **HTTP Interceptors**: Global loading and error handling
- **Route Guards**: Protected routes with authentication
- **Reactive Programming**: RxJS observables and Angular Signals
- **Type Safety**: Full TypeScript coverage with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### 🎨 UI/UX Excellence
- **Netflix-Inspired Design**: Modern glassmorphism cards and gradients
- **Smooth Animations**: Route transitions and hover effects
- **Skeleton Loaders**: Better perceived performance
- **Snackbar Notifications**: User feedback for all actions
- **Back-to-Top Button**: Enhanced navigation
- **Accessibility**: ARIA labels and semantic HTML

## 📦 Tech Stack

- **Frontend Framework**: Angular 20
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1 + DaisyUI 4.12
- **UI Components**: Angular Material 19
- **Icons**: Inline SVG icons
- **API**: The Movie Database (TMDB) API
- **State Management**: Angular Signals + RxJS
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading
- **Build Tool**: Angular CLI with esbuild

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- TMDB API Key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-app.git
   cd movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Open `src/environments/environment.ts` and `src/environments/environment.prod.ts`:
   
   ```typescript
   export const environment = {
     production: false,
     tmdb: {
       apiKey: 'YOUR_TMDB_API_KEY_HERE', // ← Add your API key
       baseUrl: 'https://api.themoviedb.org/3',
       // ...
     }
   };
   ```

4. **Run development server**
   ```bash
   npm start
   ```
   
   Navigate to `http://localhost:4200/`

## 📁 Project Structure

```
movie-app/
├── src/
│   ├── app/
│   │   ├── core/                    # Core module (singletons)
│   │   │   ├── guards/             # Route guards
│   │   │   ├── interceptors/       # HTTP interceptors
│   │   │   ├── models/             # TypeScript interfaces
│   │   │   └── services/           # Core services
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   │   ├── movies/             # Movies list
│   │   │   ├── movie-detail/       # Movie details page
│   │   │   ├── search/             # Search functionality
│   │   │   ├── wishlist/           # Wishlist management
│   │   │   ├── auth/               # Authentication pages
│   │   │   └── account/            # User account page
│   │   ├── shared/                  # Shared module
│   │   │   └── components/         # Reusable components
│   │   ├── app.ts                  # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Route definitions
│   ├── environments/               # Environment configs
│   └── styles.css                  # Global styles
├── public/                         # Static assets
├── tailwind.config.js              # Tailwind configuration
└── angular.json                    # Angular workspace config
```

## 🎯 Key Services

### TmdbApiService
Handles all TMDB API interactions:
- `getNowPlaying()` - Fetch current movies
- `getMovieDetails()` - Get detailed info
- `searchMovies()` - Search functionality
- `getRecommendations()` - Similar movies
- `getMovieVideos()` - Trailers and videos

### AuthService
LocalStorage-based authentication:
- `register()` - User registration
- `login()` - User login
- `logout()` - Clear session
- `currentUser()` - Reactive user state

### WishlistService
Manage saved movies:
- `addToWishlist()` - Save movie
- `removeFromWishlist()` - Remove movie
- `toggleWishlist()` - Toggle state
- `wishlistCount()` - Reactive counter

### ThemeService
Dark/Light mode management:
- `toggleTheme()` - Switch themes
- `setTheme()` - Set specific theme
- `currentTheme()` - Reactive theme state

### LanguageService
Multi-language support:
- `setLanguage()` - Change app language
- `currentLanguage()` - Active language
- `isRTL()` - Check for RTL layout

## 🔒 Authentication Flow

1. User registers or logs in
2. Credentials stored in LocalStorage (use real backend in production!)
3. AuthGuard protects private routes
4. Navbar displays user avatar and menu
5. Logout clears session and redirects

## 🌐 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Done! Your app is live

### Netlify

1. Build the app: `npm run build`
2. Drag and drop `dist/movie/browser` to Netlify
3. Configure redirects (already included in `netlify.toml`)

### GitHub Pages

```bash
npm run build --base-href=/movie-app/
npx angular-cli-ghpages --dir=dist/movie/browser
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests (if configured)
npm run e2e
```

## 🛠️ Build

```bash
# Development build
npm run build

# Production build
npm run build --configuration=production

# Analyze bundle size
npm run build --stats-json
npx webpack-bundle-analyzer dist/movie/stats.json
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `tmdb.apiKey` | TMDB API key | Yes |
| `tmdb.baseUrl` | TMDB API base URL | Yes |
| `defaultLanguage` | Default app language | No |
| `supportedLanguages` | Available languages | No |

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
daisyui: {
  themes: [
    {
      dark: {
        primary: "#YOUR_COLOR",      // Main accent color
        "base-100": "#141414",       // Background
        // ...
      }
    }
  ]
}
```

### Add New Language

1. Add language code to `environment.ts`:
   ```typescript
   supportedLanguages: ['en', 'ar', 'fr', 'zh', 'de']
   ```

2. Add translation in `LanguageService`:
   ```typescript
   getLanguageName(code: string): string {
     const names = {
       'de': 'Deutsch',
       // ...
     };
   }
   ```

## 🐛 Troubleshooting

### CORS Errors
- TMDB API supports CORS by default
- If issues persist, check your API key

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
rm -rf .angular
```

### Styling Not Applied
```bash
# Rebuild Tailwind
npm run build
```

## 📚 API Documentation

This app uses [The Movie Database (TMDB) API](https://developers.themoviedb.org/3).

Key endpoints:
- `/movie/now_playing` - Current movies
- `/movie/{id}` - Movie details
- `/movie/{id}/recommendations` - Similar movies
- `/movie/{id}/videos` - Trailers
- `/search/movie` - Search
- `/genre/movie/list` - All genres

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the API
- [Angular Team](https://angular.dev/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Angular Material](https://material.angular.io/) for UI components

## 📧 Contact



Project Link: [https://github.com/ahmedyossry552/movie-app](https://github.com/ahmedyossry552/movie-app)

---

⭐ Star this repository if you find it helpful!

Made with ❤️ using Angular 20
