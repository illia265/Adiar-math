# Firebase Setup Guide for Adiar Math

## Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `adiar-math` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

### 2. Add Web App

1. In your Firebase project dashboard, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (</>)
5. Register app with nickname: `Adiar Math Web`
6. Click **"Register app"**

### 3. Copy Configuration

After registering, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-your-actual-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 4. Create Environment File

Create a file called `.env.local` in your project root with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-your-actual-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Replace the values with your actual Firebase configuration!**

### 5. Enable Authentication

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Google"** provider
5. Enable it and add your support email
6. Click **"Save"**

### 6. Create Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users
5. Click **"Done"**

### 7. Set Up Security Rules (Optional)

In Firestore Database → Rules, you can use these basic rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == resource.data.email;
    }
    match /satProblems/{problemId} {
      allow read, write: if request.auth != null && request.auth.token.email == resource.data.userId;
    }
  }
}
```

### 8. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try signing in with Google
3. Submit a test SAT problem
4. Check Firestore Database to see if data is being saved

## Troubleshooting

### "Invalid API Key" Error
- Make sure your `.env.local` file exists in the project root
- Verify all environment variables are correctly copied from Firebase
- Restart your development server after adding environment variables

### Authentication Not Working
- Ensure Google Sign-In is enabled in Firebase Authentication
- Check that your domain is authorized (localhost:3000 should work for development)

### Database Errors
- Make sure Firestore Database is created
- Check that you're in "test mode" or have proper security rules

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- For production, set up proper Firestore security rules
- Consider using Firebase App Check for additional security

## Next Steps

Once Firebase is working:
1. Test user authentication
2. Verify data is being saved to Firestore
3. Set up proper security rules for production
4. Configure custom domains if needed
