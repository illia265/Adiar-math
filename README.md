# Adiar Math - SAT Desmos Math Tutor

Master SAT math with AI-powered Desmos training. Think strategically, solve efficiently, and leverage the exact tool you'll use on test day.

## 🚀 Features

- **AI-Powered Problem Solving**: Step-by-step SAT math solutions with Desmos integration
- **Interactive Desmos Walkthroughs**: Learn by doing with hands-on Desmos practice
- **Personalized Adaptive Practice**: AI identifies weak areas and generates custom problem sets
- **Video Explanations & Strategy**: Complementary lessons for maximum test-day efficiency
- **Dark/Light Theme**: Beautiful, accessible UI with theme switching
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with Row Level Security
- **AI Integration**: OpenAI (coming soon)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd adiar-math3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI API (coming soon)
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe (coming soon)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up Supabase database**
   Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
adiar-math3.0/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (coming soon)
│   ├── auth/              # Authentication routes
│   │   └── callback/      # Supabase OAuth callback
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── ProblemInput.tsx   # Math problem input form
│   ├── SignInModal.tsx    # Authentication modal
│   ├── FeaturesSection.tsx # Features showcase
│   ├── ValueProposition.tsx # Pricing section
│   ├── Footer.tsx         # Site footer
│   ├── Toast.tsx          # Notification system
│   ├── LoadingSpinner.tsx # Loading states
│   └── ErrorBoundary.tsx  # Error handling
├── contexts/               # React contexts
│   ├── AuthContext.tsx    # Supabase authentication state
│   └── ThemeContext.tsx   # Theme management
├── lib/                    # Utility functions
│   ├── supabase.ts        # Supabase configuration and functions
│   ├── validation.ts      # Form validation
│   └── imageUtils.ts      # Image processing
└── public/                 # Static assets
    └── adiar.png          # Logo
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Automatic code formatting
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes

### Component Guidelines

- Each component should be in its own file
- Use TypeScript interfaces for props
- Include proper error handling
- Add loading states where appropriate
- Ensure accessibility (ARIA labels, keyboard navigation)

## 🚧 Current Status

### ✅ Completed
- [x] Modern, responsive UI design
- [x] Dark/light theme switching
- [x] Component architecture
- [x] Form validation
- [x] Image upload handling
- [x] Error boundaries
- [x] Loading states
- [x] Toast notifications
- [x] Responsive design utilities
- [x] Supabase authentication integration
- [x] Supabase database setup
- [x] User profile management
- [x] SAT problem submission and storage

### 🚧 In Progress
- [ ] OpenAI API integration
- [ ] Desmos calculator integration
- [ ] Stripe payment processing

### 📋 Coming Soon
- [ ] User progress tracking
- [ ] Problem history
- [ ] Performance analytics
- [ ] Mobile app
- [ ] Advanced Desmos tutorials

## 🎨 UI Components

### Design System
- **Colors**: Blue primary (#2563eb), gray scale, dark mode support
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle elevation with Tailwind classes
- **Transitions**: Smooth 200ms transitions

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- Users can only access their own data
- Input sanitization for all user inputs
- Image file validation and processing
- Rate limiting (coming soon)
- Secure authentication with Supabase Auth

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: This README and [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Issues**: GitHub Issues
- **Email**: support@adiarmath.com (coming soon)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Supabase for the powerful backend services

---

**Note**: This project has been migrated from Firebase to Supabase for improved performance and developer experience. The backend is fully functional with user authentication, database storage, and real-time updates.
