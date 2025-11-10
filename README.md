# Laravel + Inertia.js + React

A modern full-stack web application built with **Laravel** (backend) and **React** (frontend) using **Inertia.js** as the bridge.

## 🧱 Tech Stack

- **Backend**: Laravel 12.x  
- **Frontend**: React 18.x  
- **Full-stack Bridge**: Inertia.js 2.x  
- **Database**: PostgreSQL  
- **Build Tool**: Vite 7.x  
- **Styling**: Tailwind CSS 4.x  
- **HTTP Client**: Axios  
- **Runtime**: PHP 8.3+

## ⚙️ Prerequisites

Make sure you have the following installed:

- PHP 8.3 or higher  
- Composer  
- Node.js 18 or higher  
- npm or yarn  
- PostgreSQL server

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Set up the environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   Update your `.env` file with PostgreSQL settings:
   ```
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run database migrations (if any)**
   ```bash
   php artisan migrate
   ```

## 🧑‍💻 Development

### Start Development Server

To run the application in development mode:

```bash
# Run Vite development server (asset bundler)
npm run dev

# In another terminal, run Laravel's built-in server
php artisan serve
```

Or run both simultaneously:
```bash
npm run dev & php artisan serve
```

Your app will be available at **http://localhost:8000**

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
├── app/
│   ├── Http/
│   │   └── Controllers/      # Controllers handle backend logic
├── resources/
│   ├── js/
│   │   ├── Pages/            # React components for Inertia pages
│   │   ├── Layouts/          # Shared layouts
│   │   ├── app.jsx           # Inertia.js + React entry point
│   │   └── bootstrap.js      # JS initialization
│   └── views/
│       └── app.blade.php     # Root Blade template for Inertia
├── routes/
│   └── web.php               # Application routes
├── public/                   # Public assets
└── vite.config.js            # Vite configuration
```

## 🔑 Key Features

### Inertia.js Integration

This project uses **Inertia.js** to connect Laravel and React seamlessly — no separate API needed.

- **Server-side**: Controllers use `Inertia::render()` to return data directly to React pages.  
- **Client-side**: React pages receive props from Laravel and can interact with the backend through Inertia.

### Component Organization

- **Pages** → `resources/js/Pages/` — Each file represents a route page.  
- **Layouts** → Shared UI wrappers (navigation, headers, etc.).  
- **Entry Point** → `resources/js/app.jsx` — initializes Inertia + React app.

## 🧭 Development Workflow

1. **Create a New Page**
   - Add a new JSX file in `resources/js/Pages/`
   - Define a route in `routes/web.php`
   - Render it from a controller using `Inertia::render()`

2. **Styling**
   - Use Tailwind CSS utility classes  
   - Assets are automatically compiled by Vite

3. **Hot Reloading**
   - Vite provides fast HMR (Hot Module Replacement) for instant feedback

## 🧰 Useful Commands

### Laravel

```bash
php artisan serve          # Start Laravel server
php artisan migrate        # Run database migrations
php artisan make:controller # Create a new controller
```

### NPM

```bash
npm run dev               # Start Vite dev server
npm run build             # Build production assets
npm install               # Install dependencies
npm update                # Update dependencies
```

## 🧩 Troubleshooting

### Common Issues

1. **Blank Page / No Output**
   - Ensure Vite is running (`npm run dev`)
   - Check browser console for JavaScript errors
   - Verify routes and Inertia setup in your controller

2. **Build Failures**
   - Delete `node_modules` and `public/build`, then reinstall dependencies
   - Clear Laravel cache:
     ```bash
     php artisan config:clear
     php artisan route:clear
     php artisan view:clear
     ```

3. **Permission Errors**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
