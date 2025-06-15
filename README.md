# 💰 FinStack Frontend

> A modern, responsive financial management web application built with Angular 19 and TailwindCSS

[![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🎯 Overview

FinStack Frontend is a clean, intuitive web application for personal financial management. Built with the latest Angular framework and styled with TailwindCSS, it provides users with a seamless experience to track income, expenses, and financial goals.

## ✨ Key Features

- **📊 Dashboard Analytics** - Visual insights into spending patterns and income trends
- **💳 Expense Tracking** - Categorize and monitor daily expenses
- **💰 Income Management** - Track multiple income sources
- **🔐 Secure Authentication** - JWT-based user authentication
- **📱 Responsive Design** - Mobile-first approach with TailwindCSS
- **⚡ Modern Architecture** - Angular 19 with standalone components
- **🎨 Beautiful UI/UX** - Clean, professional interface

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Angular 19** | Frontend framework with latest features |
| **TailwindCSS 4** | Utility-first CSS framework |
| **TypeScript** | Type-safe JavaScript development |
| **RxJS** | Reactive programming for HTTP calls |
| **pnpm** | Fast, efficient package manager |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start
# App runs on http://localhost:4200

# Build for production
pnpm run build
```

### Environment Configuration

The app uses a flexible configuration system:

```bash
# Set API endpoint (optional - defaults to localhost:8080)
export FRONTEND_API_URL=https://your-api-domain.com
pnpm start
```

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── dashboard/       # Main dashboard
│   │   ├── auth/           # Authentication
│   │   ├── expenses/       # Expense management
│   │   └── income/         # Income tracking
│   ├── services/           # API and business logic
│   ├── guards/             # Route protection
│   ├── interceptors/       # HTTP interceptors
│   └── config/             # Environment configuration
├── assets/                 # Static assets
└── styles.css             # Global styles
```

## 🎨 Design Highlights

- **Clean Aesthetics** - Minimalist design focusing on usability
- **Responsive Layout** - Seamless experience across all devices
- **Intuitive Navigation** - User-friendly interface design
- **Modern Components** - Reusable, maintainable component architecture

## 🔧 Development Features

- **Hot Reload** - Instant development feedback
- **Type Safety** - Full TypeScript integration
- **Modular Architecture** - Scalable component structure
- **Environment Flexibility** - Easy configuration management

## 📊 Performance

- **Fast Loading** - Optimized build with Angular CLI
- **Small Bundle Size** - Efficient code splitting
- **Modern Standards** - ES2022+ JavaScript features

## 🤝 Integration

This frontend seamlessly integrates with:

- **FinStack API** - Rust-based backend service
- **JWT Authentication** - Secure user sessions
- **RESTful APIs** - Standard HTTP communication

---

### Built with ❤️ using Angular 19 and TailwindCSS
