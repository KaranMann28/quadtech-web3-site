# QuadTech Solutions Website

A modern, responsive website for QuadTech Solutions - a premier Telecom & IT company specializing in network infrastructure solutions.

## 🚀 Features

- **Modern Design**: Glass morphism UI with smooth animations
- **Responsive**: Mobile-first design that works on all devices
- **AI Chatbot**: 24/7 AI Network Consultant powered by Google Gemini
- **Performance**: Optimized for speed and SEO
- **TypeScript**: Full type safety throughout the application

## 🤖 AI Network Consultant

The website includes an intelligent AI chatbot that provides:
- Technical consultation on network infrastructure
- Lead qualification and generation
- 24/7 customer support
- Expert guidance on telecom solutions

**⚠️ Important**: The AI chatbot requires a Google Gemini API key to function. See [DEPLOYMENT.md](./DEPLOYMENT.md) for setup instructions.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Pages Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini 1.5 Flash
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quadtech-web3-site
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Google Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🚀 Deployment

### Vercel (Recommended)

1. Deploy to Vercel using the [Vercel Platform](https://vercel.com/new)
2. Set up the `GEMINI_API_KEY` environment variable in Vercel dashboard
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Make sure to set the `GEMINI_API_KEY` environment variable on your chosen platform.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── sections/        # Page sections
│   └── layout/          # Layout components
├── pages/
│   ├── api/             # API routes
│   └── *.tsx            # Page components
├── styles/              # Global styles
└── lib/                 # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For deployment issues or questions about the AI chatbot setup, refer to:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 📞 Contact

QuadTech Solutions
- Website: [quadtechsolutions.com](https://quadtechsolutions.com)
- Email: info@quadtechsolutions.com
- Phone: +1 (555) 123-4567
