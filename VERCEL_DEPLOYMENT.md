# Vercel Deployment Configuration

## ✅ Environment Variables Configured

Your Vercel project has been configured with the following Sanity environment variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_SANITY_PROJECT_ID` | `vc89ievx` | Production, Preview, Development |
| `VITE_SANITY_DATASET` | `production` | Production, Preview, Development |

## 🚀 Deployment Status

The project is configured and will automatically deploy when you push to GitHub:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests and other branches

## 🔗 Project URLs

- **Production**: [https://michael-evans-port.vercel.app](https://michael-evans-port.vercel.app)
- **Vercel Dashboard**: [https://vercel.com/mevans2120s-projects/michael-evans-port-main](https://vercel.com/mevans2120s-projects/michael-evans-port-main)
- **Sanity Studio**: [https://michael-evans-port.vercel.app/studio](https://michael-evans-port.vercel.app/studio)

## 📦 Build Configuration

The `vercel.json` file configures:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Vite builds the project correctly
- SPA routing works (all routes serve index.html)
- Static assets are served from the `dist` folder

## 🔧 Managing Environment Variables

### Via Vercel CLI
```bash
# List all environment variables
vercel env ls

# Add a new variable
vercel env add VARIABLE_NAME production

# Remove a variable
vercel env rm VARIABLE_NAME production
```

### Via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/mevans2120s-projects/michael-evans-port-main)
2. Navigate to Settings → Environment Variables
3. Add, edit, or remove variables as needed
4. Redeploy to apply changes

## 🚨 Important Notes

1. **Automatic Deployments**: Every push to `main` triggers a production deployment
2. **Preview Deployments**: Every pull request gets its own preview URL
3. **Environment Variables**: Already configured for all environments
4. **CORS**: Already configured in Sanity for the production URL

## 📊 Monitoring

Check your deployment status:
- [Vercel Dashboard](https://vercel.com/mevans2120s-projects/michael-evans-port-main)
- GitHub commit status checks
- Vercel CLI: `vercel ls`

## 🐛 Troubleshooting

### If Sanity content doesn't load:
1. Check environment variables are set: `vercel env ls`
2. Verify CORS is configured for your domain
3. Check browser console for errors
4. Ensure content is published in Sanity Studio

### If routing doesn't work:
- The `vercel.json` rewrites should handle SPA routing
- Clear browser cache and try again

### To redeploy:
```bash
# Trigger a new deployment
vercel --prod

# Or push any change to GitHub
git push origin main
```

## ✅ Status

Your Vercel deployment is fully configured and ready! The latest push has triggered a deployment with all Sanity environment variables properly set.

---

*Last updated: September 2025*