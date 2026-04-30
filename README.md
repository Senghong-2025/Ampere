# Ampere

Ampere is a web application built with Nuxt.js for managing and monitoring electrical loads, room management, and user permissions. It includes features for tracking power consumption, managing rooms, and generating load reports.

## Features

- 🔐 Authentication system with protected routes
- 📊 Load management and monitoring
- 🏠 Room management system
- 📱 Responsive design with mobile support
- 🔔 Real-time notifications
- 📋 Load details and reporting
- 🔗 Shareable load reports
- 🤖 Telegram Bot integration

## Tech Stack

- **Framework:** Nuxt.js 3
- **Styling:** TailwindCSS
- **Authentication:** Firebase
- **State Management:** Nuxt Composables
- **Icons & Assets:** Custom icon system

## Project Structure

```
app/
├── assets/          # Static assets and data models
├── components/      # Reusable Vue components
├── composables/     # Shared composition functions
├── enums/          # TypeScript enumerations
├── helpers/        # Utility functions
├── layouts/        # Page layouts
├── middleware/     # Navigation guards
├── models/         # Data models
├── pages/          # Application routes
└── plugins/        # Plugin configurations
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file with necessary Firebase configurations

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deploy to Cloudflare Workers

1. Log in to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Add production environment variables:
   ```bash
   npx wrangler secret put NUXT_DATABASE_URL
   npx wrangler secret put NUXT_PUBLIC_TOKEN_KEY
   npx wrangler secret put NUXT_PUBLIC_TELEGRAM_TELEGRAM_BOT_TOKEN
   npx wrangler secret put NUXT_PUBLIC_TELEGRAM_TELEGRAM_CHAT_ID
   ```

3. Deploy the Worker:
   ```bash
   npm run deploy:prod
   ```

## Features Documentation

### Load Management
- Create, update, and delete load entries
- Generate load reports
- Track power consumption
- Share load details via links

### Room Management
- Room creation and configuration
- Room-specific load tracking
- Multiple room support

### User System
- Authentication
- Role-based permissions
- User preferences

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is private and proprietary. All rights reserved.

---
Built with ❤️ using Nuxt.js
