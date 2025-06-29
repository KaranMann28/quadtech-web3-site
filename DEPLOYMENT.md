# 🚀 Deployment Guide - AI Chatbot Setup

## Environment Variables Required

The AI chatbot requires a Google Gemini API key to function. Follow these steps to set it up:

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

#### For Vercel Deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy your application

#### For Local Development:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Verify Setup

After setting up the environment variable:

1. **Local Testing**: Run `npm run dev` and test the chatbot
2. **Production Testing**: Deploy to Vercel and test the chatbot on your live site

### 4. Troubleshooting

If you see the error: `"Sorry, I encountered an error. Please try again or contact our team directly at +1 (555) 123-4567."`

This means:
- The `GEMINI_API_KEY` environment variable is not set
- The API key is invalid
- There's a network issue with Google's API

**Solutions:**
1. Double-check the environment variable is set correctly in Vercel
2. Verify your API key is valid by testing it locally first
3. Ensure you have billing enabled on your Google Cloud account (if required)
4. Check the Vercel function logs for more detailed error messages

### 5. API Usage and Costs

- Google Gemini 1.5 Flash has generous free tier limits
- Monitor your usage in Google AI Studio
- Consider setting up usage alerts if needed

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- The `.env.local` file is already in `.gitignore`
- Rotate API keys periodically for security

## Support

If you need help with deployment, contact the development team or refer to:
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google AI Studio Documentation](https://ai.google.dev/docs)
