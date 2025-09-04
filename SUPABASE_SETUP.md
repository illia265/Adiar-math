# Supabase Setup Guide for Adiar Math

## Step-by-Step Supabase Configuration

### 1. Create Supabase Project

1. Go to [Supabase Console](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose your organization
4. Enter project name: `adiar-math` (or your preferred name)
5. Enter a secure database password
6. Choose a region close to your users
7. Click **"Create new project"**

### 2. Get Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. These will be used in your environment variables

### 3. Create Environment File

Create a file called `.env.local` in your project root with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Replace the values with your actual Supabase configuration!**

### 4. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'premium')),
  subscription_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weak_areas TEXT[] DEFAULT '{}',
  total_problems_solved INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.email() = email);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.email() = email);
```

#### SAT Problems Table
```sql
CREATE TABLE sat_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  image_url TEXT,
  solution TEXT,
  desmos_steps TEXT[],
  category TEXT NOT NULL CHECK (category IN ('algebra', 'functions', 'geometry', 'statistics')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_correct BOOLEAN
);

-- Enable Row Level Security
ALTER TABLE sat_problems ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own problems" ON sat_problems
  FOR SELECT USING (auth.email() = user_id);

CREATE POLICY "Users can insert own problems" ON sat_problems
  FOR INSERT WITH CHECK (auth.email() = user_id);

CREATE POLICY "Users can update own problems" ON sat_problems
  FOR UPDATE USING (auth.email() = user_id);
```

### 5. Enable Google Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
5. Click **Save**

### 6. Set Up Google OAuth (if you haven't already)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
7. Copy the Client ID and Client Secret to Supabase

### 7. Create Auth Callback Route

Create the file `app/auth/callback/route.ts`:

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
```

### 8. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try signing in with Google
3. Submit a test SAT problem
4. Check Supabase Database to see if data is being saved

## Troubleshooting

### "Invalid API Key" Error
- Make sure your `.env.local` file exists in the project root
- Verify all environment variables are correctly copied from Supabase
- Restart your development server after adding environment variables

### Authentication Not Working
- Ensure Google OAuth is enabled in Supabase Authentication
- Check that your redirect URLs are correctly configured
- Verify Google OAuth credentials are correct

### Database Errors
- Make sure database tables are created with correct schemas
- Check that Row Level Security policies are properly configured
- Verify table names match what's in your code (`users`, `sat_problems`)

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Row Level Security is enabled by default
- Users can only access their own data

## Next Steps

Once Supabase is working:
1. Test user authentication
2. Verify data is being saved to database
3. Test problem submission and retrieval
4. Set up additional database indexes if needed
5. Configure custom domains if needed

## Database Schema Reference

### Users Table Fields
- `id`: Unique identifier (UUID)
- `email`: User's email address
- `display_name`: User's display name
- `photo_url`: Profile picture URL
- `subscription`: 'free' or 'premium'
- `subscription_expiry`: When premium expires
- `created_at`: Account creation date
- `last_active`: Last activity timestamp
- `weak_areas`: Array of weak subject areas
- `total_problems_solved`: Total problems attempted
- `correct_answers`: Total correct answers

### SAT Problems Table Fields
- `id`: Unique identifier (UUID)
- `user_id`: User's email (foreign key)
- `question`: Math problem text
- `image_url`: Problem image URL
- `solution`: AI-generated solution
- `desmos_steps`: Array of Desmos steps
- `category`: Problem category
- `difficulty`: Problem difficulty level
- `created_at`: Problem creation date
- `completed_at`: When problem was solved
- `is_correct`: Whether answer was correct
