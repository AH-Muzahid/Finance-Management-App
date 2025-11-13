# Finance Management Application

A full-stack financial management application that helps users track, manage, and visualize their transactions and financial reports.

## 🌐 Live Demo

**Access the application here**: [https://walletbymuzahid.netlify.app/](https://walletbymuzahid.netlify.app/)

## 📋 Project Overview

This is a complete finance management system with:
- **Frontend**: React + Vite with Tailwind CSS and DaisyUI
- **Backend**: Node.js + Express with MongoDB
- User authentication using Firebase
- Transaction tracking and management
- Financial reports and analytics
- Responsive design for all devices

## 🏗️ Project Structure

```
B12A10-FinanceManagement/
├── FinanceManagement/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── Components/         # Reusable React components
│   │   ├── Pages/              # Page components
│   │   ├── Firebase/           # Firebase configuration
│   │   ├── api/                # API integration
│   │   ├── Layout/             # Layout components
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── FM-BackEnd/                 # Backend (Node.js + Express)
│   ├── index.js                # Server entry point
│   ├── package.json
│   ├── vercel.json             # Vercel deployment config
│   └── .env                    # Environment variables
│
└── categories.json             # Category configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account
- Firebase project

### Configuration

#### Frontend (.env)
Create a `.env.local` file in the `FinanceManagement` directory:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000
```

#### Backend (.env)
Create a `.env` file in the `FM-BackEnd` directory:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## 📦 Frontend Dependencies

- **React**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind CSS component library
- **Firebase**: Authentication and real-time database
- **React Firebase Hooks**: Custom hooks for Firebase
- **Recharts**: Data visualization library
- **React Hot Toast**: Toast notifications
- **SweetAlert2**: Alert dialogs
- **React Icons**: Icon library
- **React Spinners**: Loading spinners

## 📦 Backend Dependencies

- **Express**: Web framework
- **MongoDB**: Database driver
- **CORS**: Cross-Origin Resource Sharing
- **Dotenv**: Environment variables
- **Vercel**: Deployment platform

## 🎯 Features

### Authentication
- User registration and login with Firebase
- Password reset functionality
- Profile management
- Secure session handling

### Transaction Management
- Add, view, and manage financial transactions
- Categorize transactions
- Filter and search transactions
- View transaction details
- Update and delete transactions

### Reports & Analytics
- Visual financial reports using charts
- Transaction statistics
- Category-wise breakdown
- Monthly and yearly summaries

### User Interface
- Responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle
- Intuitive dashboard
- User-friendly forms

## 🔧 Available Scripts

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend

```bash
# Start server
npm start

# Development mode
npm run dev
```

## 🌐 API Endpoints

All endpoints are based on `http://localhost:3000` (or your backend URL)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🎨 Frontend Pages

- **Home**: Dashboard and overview
- **Login**: User authentication
- **Registration**: New user signup
- **My Transactions**: View and manage all transactions
- **Add Transaction**: Create new transaction
- **Transaction Details**: View details of a specific transaction
- **Reports**: Financial analytics and reports
- **Profile**: User profile management
- **Forget Password**: Password recovery

## 🔐 Security Features

- Firebase authentication
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed on:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
The backend is configured for Vercel deployment. Check `vercel.json` for configuration.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to your branch
5. Create a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Team

Developed as a full-stack project for B12A10 batch.

## 🐛 Bug Reports

If you find any bugs, please create an issue in the repository.

## 📧 Support

For support, please contact the development team or create an issue in the repository.

---

**Last Updated**: November 13, 2025
