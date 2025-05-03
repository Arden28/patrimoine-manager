Patrimoine App
A React-based MVP for a personal and family wealth management platform. Users can track assets, debts, net worth, manage documents, receive reminders, and share access with family members.
Folder Structure
patrimoine-app/
├── public/
│   └── index.html           # Entry point
├── src/
│   ├── components/
│   │   ├── Login.jsx        # Modern login form inspired by Auprea Dashboard
│   │   ├── Dashboard.jsx    # Dashboard with sidebar and card layout
│   │   ├── AssetForm.jsx    # Form to add/edit assets
│   │   ├── DebtForm.jsx     # Form to add/edit debts
│   │   ├── DocumentVault.jsx # Document upload and management
│   │   ├── Notifications.jsx # Display reminders
│   │   └── FamilySharing.jsx # Manage family members and permissions
│   ├── App.jsx              # Main app component with login/logout
│   ├── fakeData.js          # Fake data for MVP
│   ├── index.js             # Webpack entry point
│   └── index.css            # Tailwind CSS with custom animations
├── .babelrc                 # Babel configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind configuration
├── webpack.config.js        # Webpack configuration
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation

Features

User Registration/Login: Modern login page with gradient background, icons, and animations, inspired by Auprea Dashboard.
Net Worth Dashboard: Displays net worth with a styled Chart.js line chart, assets, debts, documents, notifications, and family sharing in a card-based layout.
Asset/Debt Entry: Add assets (category, name, value) and debts (category, name, amount) via forms.
Document Vault: Upload and view documents per asset (simulated).
Notifications: Shows reminders for upcoming tasks (e.g., insurance renewals).
Family Sharing: Add family members with Viewer/Editor roles.
Modern Design: Fixed sidebar for navigation, responsive grid layout, subtle animations, and a professional color scheme (navy blue, white, gray).

Setup

Install dependencies:npm install


Start the development server:npm start


Open http://localhost:3000 in your browser.
Build for production:npm run build



Design Highlights

Login Page: Centered card with gradient background, input icons, hover effects, and "Forgot Password?" / "Sign Up" links.
Dashboard: Fixed sidebar with navigation (Dashboard, Assets, Debts, Documents, Notifications, Family Sharing, Logout), header with user info, and a responsive card grid with fade-in animations.
Chart: Enhanced with gradients, tooltips, and a legend for a polished look.
Icons: Heroicons for visual hierarchy in sidebar and card headers.
Responsiveness: Sidebar and cards adapt to mobile screens.

Next Steps

Implement navigation logic for sidebar links (e.g., route to separate pages).
Add user registration form.
Implement role-based permissions (e.g., restrict Viewer actions).
Enhance chart with real historical data via API.
Add edit/delete functionality for assets, debts, and family members.
Replace fake data with API calls.

