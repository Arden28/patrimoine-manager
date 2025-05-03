Patrimoine App
A React-based MVP for a personal and family wealth management platform. Users can track assets, debts, net worth, manage documents, receive reminders, and share access with family members.
Folder Structure
patrimoine-app/
├── public/
│   └── index.html           # Entry point
├── src/
│   ├── components/
│   │   ├── Login.jsx        # Modern login form inspired by Auprea Dashboard
│   │   ├── Dashboard.jsx    # Shopify-inspired dashboard with buttons and modernized tools
│   │   ├── AssetsPage.jsx   # Assets page with table/card listing and button
│   │   ├── DebtsPage.jsx    # Debts page with table/card listing and button
│   │   ├── DocumentsPage.jsx # Documents page with table/card listing and button
│   │   ├── NotificationsPage.jsx # Notifications page with table/card listing
│   │   ├── FamilySharingPage.jsx # Family Sharing page with table/card listing and button
│   │   ├── Sidebar.jsx      # Professional sidebar with solid navy background, logo, and slogan
│   │   ├── AssetForm.jsx    # Form to add/edit assets
│   │   ├── DebtForm.jsx     # Form to add/edit debts
│   │   ├── DocumentVault.jsx # Document upload and management
│   │   ├── Notifications.jsx # Display reminders
│   │   └── FamilySharing.jsx # Manage family members and permissions
│   ├── App.jsx              # Main app with routing and login/logout
│   ├── fakeData.js          # Fake data for MVP
│   ├── index.js             # Webpack entry point
│   └── index.css            # Tailwind CSS with custom animations and colors
├── .babelrc                 # Babel configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind configuration
├── webpack.config.js        # Webpack configuration
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation

Features

User Registration/Login: Modern login page with gradient background, icons, and animations, inspired by Auprea Dashboard.
Dashboard: Shopify-inspired, professional design with a net worth chart, summary card, recent assets/debts with “Add” buttons, and modernized Other Tools section in a single-column layout.
Dedicated Pages: Assets, Debts, Documents, Notifications, and Family Sharing pages with elegant table/card listings and simple action buttons (e.g., “Add Asset”).
Asset/Debt Entry: Add assets and debts via buttons linking to dedicated pages.
Document Vault: Upload documents via a button linking to the Documents page.
Notifications: Shows reminders for recent activities.
Family Sharing: Add family members via a button linking to the Family Sharing page.
Responsive Sidebar: Solid navy blue sidebar with logo, “Wealth, Simplified” slogan, and smooth animations; collapsible on mobile with a hamburger menu.
Modern Design: Navy blue (#1E3A8A), white, and teal (#2DD4BF) color scheme, rounded cards with soft shadows, bold typography, and subtle animations. No nested cards.

Setup

Install dependencies:npm install


Start the development server:npm start


Open http://localhost:3000 in your browser.
Build for production:npm run build



Design Highlights

Login Page: Centered card with gradient background, input icons, and hover effects.
Dashboard: Modern card-based layout with a gradient-filled net worth chart, summary stats, recent assets/debts with “Add” buttons, and a single-column Other Tools section with descriptive text and links.
Dedicated Pages: Table/card listings with rounded cards, hover effects (lift and color change), and action buttons (e.g., View, Download, Dismiss, Edit). Simple teal buttons for adding items.
Sidebar: Solid navy blue background (#1E3A8A) with a logo, “Wealth, Simplified” slogan, teal accents, and smooth hover effects; responsive with a slide-in animation on mobile.
Chart: Enhanced with a teal gradient fill, interactive tooltips, and a bold legend.
Icons: Heroicons for sidebar and card headers.
Responsiveness: Sidebar hides on mobile, cards stack, and layouts adjust to screen size.
Animations: Fade-in for pages, slide-in for sidebar, and hover effects (scale, shadow).
No Nested Cards: All sections use a flat card structure for consistency.

Next Steps

Implement edit/delete functionality for assets, debts, and family members.
Add user registration form and backend authentication.
Implement role-based permissions (e.g., restrict Viewer actions).
Enhance chart with real historical data via API.
Replace fake data with API calls.
Add search/filter for assets, debts, and documents.
Implement “Add” routes (e.g., /assets/add) with modal forms or dedicated pages.
Implement “View” and “Download” actions for listings.

