# Social Media Management Platform

A comprehensive social media management platform that allows users to create campaigns, generate AI-powered posts, and schedule content across multiple platforms including X (Twitter), LinkedIn, Instagram, and Reddit.

## 🚀 Features

- **Campaign Management**: Create, edit, and manage marketing campaigns
- **AI-Powered Content Generation**: Generate platform-specific posts using OpenAI
- **Multi-Platform Support**: X (Twitter), LinkedIn, Instagram, and Reddit
- **Content Scheduling**: Schedule posts with calendar view
- **User Authentication**: Secure authentication with Firebase Auth and JWT
- **Responsive Design**: Modern UI with Tailwind CSS and shadCN UI components
- **Toast Notifications**: Smart error handling with Sonner toast notifications

## 🏗️ Architecture

This is a full-stack application with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth + JWT
- **AI Integration**: OpenAI GPT (gpt-4o-mini) for content generation

## 📁 Project Structure

```
social-media-management/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Base UI components (Radix UI)
│   │   │   ├── CalendarPreview.tsx
│   │   │   ├── CampaignEditDialog.tsx
│   │   │   ├── CampaignList.tsx
│   │   │   ├── PostEditDialog.tsx
│   │   │   └── ...
│   │   ├── pages/           # Application pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── Calendar.tsx
│   │   │   ├── CampaignDetails.tsx
│   │   │   ├── CampaignForm.tsx
│   │   │   ├── Campaigns.tsx
│   │   │   └── ...
│   │   ├── context/         # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── database/        # Database connection
│   │   └── utils/           # Utility functions
│   ├── dist/               # Compiled TypeScript
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Firebase project
- OpenAI API account

### 1. Clone the Repository

```bash
git clone https://github.com/PiyushKhewalkar/campaign-os
cd social-media-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Database
DB_URI=mongodb://localhost:27017/social-media-management
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/social-media-management

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Firebase Admin (for Google sign-in verification)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account-json
```

Build and start the backend:

```bash
npm run build
npm start
# or for development:
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-google-analytics-id
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and add Google as a sign-in provider
3. Get your Firebase configuration from Project Settings
4. For Google sign-in verification, create a service account and encode it in base64

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_URI` | MongoDB connection string | ✅ |
| `PORT` | Server port (default: 3001) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for content generation | ✅ |
| `FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Base64 encoded Firebase service account | ✅ |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | ✅ |
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID | ❌ |

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Mode

1. Build the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/google` - Google sign-in
- `POST /auth/verify-email` - Email verification
- `GET /auth/validate` - Token validation

### Campaign Endpoints

- `GET /campaign` - Get all user campaigns
- `GET /campaign/:id` - Get specific campaign
- `POST /campaign/create` - Create new campaign
- `PUT /campaign/:id/update` - Update campaign
- `DELETE /campaign/:id/delete` - Delete campaign

### Post Endpoints

- `GET /post/:campaignId` - Get posts for campaign
- `GET /post/id/:postId` - Get specific post
- `PUT /post/:id/update` - Update post
- `PUT /post/:id/schedule` - Schedule post
- `DELETE /post/:id/delete` - Delete post
- `GET /post/:campaignId/generate` - Generate posts for campaign
- `GET /post/scheduled/all` - Get all scheduled posts

## 🔐 Authentication Flow

1. **Registration/Login**: Users can sign up with email/password or Google
2. **JWT Tokens**: Backend issues JWT tokens for authenticated requests
3. **Protected Routes**: Frontend protects routes using authentication context
4. **Token Validation**: Backend validates JWT tokens on protected endpoints

## 🎨 UI Components

The application uses a modern design system with:

- **shadCN UI**: Accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

### Key Components

- `CampaignList`: Displays user campaigns with CRUD operations
- `CampaignForm`: Multi-step campaign creation form
- `Post`: view post content within the campaign
- `Calendar`: Shows scheduled posts in calendar view
- `Toast System`: Smart notifications that filter out expected empty states

## 🤖 AI Integration

The platform uses OpenAI GPT to generate platform-specific content:

- **Platform-Specific Formats**: Different content styles for each platform
- **Campaign Context**: Generates posts based on campaign details
- **Content Variety**: Creates multiple post variations for each platform

## 📱 Supported Platforms

- **X (Twitter)**: Short-form content with hashtags
- **LinkedIn**: Professional content for business networking
- **Instagram**: Visual content with engaging captions
- **Reddit**: Community-focused content with proper formatting

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Heroku
- Render (recommended)
- Railway
- DigitalOcean App Platform
- AWS EC2

### Frontend Deployment

The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## 🔧 Development Scripts

### Backend Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📝 Assumptions and Notes

### Assumptions

1. **MongoDB**: Assumes MongoDB is available and accessible
2. **Firebase**: Assumes Firebase project is properly configured
3. **OpenAI**: Assumes OpenAI API key is valid and has sufficient credits (even $1 is enough for 60-70 generations)

### Known Limitations

1. **Post Scheduling**: Currently supports date-only scheduling (no time)
2. **Post Content Quality**: Currently haluccinates and far from high performing campaigns
3. **Platform APIs**: No actual posting to social media platforms (scheduling only)

### Future Enhancements

1. **Time-based Scheduling**: Add time selection for post scheduling
2. **Media Support**: Generate relevant image to attach in the posts
3. **Platform Integration**: Connect with actual social media APIs
4. **Supporting different post types**: Supporting Carousels, threads, reels, text+captions - eventually all post formats to ensure comprehensiveness
4. **Improved Campaign Quality**: Currently AI model has no enough data to write high performing campaigns. we would be collecting and templatizing 100s of real user posts from facebook, reddit, instagram and Linkedin so that we ensure high performing campaigns


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments for implementation details

---

**Happy Campaigning! 🚀**