# Patrimoine App
A React-based MVP for a personal and family wealth management platform. Users can track assets, debts, net worth, manage documents, receive reminders, and share access with family members.
Folder Structure
patrimoine-app/
├── public/
│   └── index.html           # Entry point with CDN dependencies
├── src/
│   ├── components/
│   │   ├── Login.jsx        # Login form for user authentication
│   │   ├── Dashboard.jsx    # Main dashboard with net worth, assets, debts
│   │   ├── AssetForm.jsx    # Form to add/edit assets
│   │   ├── DebtForm.jsx     # Form to add/edit debts
│   │   ├── DocumentVault.jsx # Document upload and management
│   │   ├── Notifications.jsx # Display reminders
│   │   └── FamilySharing.jsx # Manage family members and permissions
│   ├── App.jsx              # Main app component
│   └── fakeData.js          # Fake data for MVP
├── README.md                # Project documentation
└── package.json             # Project metadata

## Components

Login.jsx: Handles user authentication with email/password.
Dashboard.jsx: Displays net worth, asset breakdown, debts, and links to other features.
AssetForm.jsx: Form to add/edit assets (category, name, value).
DebtForm.jsx: Form to add/edit debts (category, name, amount).
DocumentVault.jsx: Allows document uploads and management per asset.
Notifications.jsx: Shows reminders and notifications.
FamilySharing.jsx: Manages family members with Viewer/Editor roles.

## Next Steps

Implement state management (e.g., React hooks).
Add Chart.js for net worth visualization.
Flesh out component logic with fake data.
Later connect to APIs for real data.

