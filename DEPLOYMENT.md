# PesaRate Deployment Guide

## Frontend (React + Vite) → Vercel

### Setup

1. Connect your GitHub repo to Vercel
2. In the Vercel project settings, add the following environment variable:

```
VITE_API_URL=https://your-backend-url/api
```

Replace `https://your-backend-url` with your actual backend deployment URL.

### Finding the Backend URL

If the backend is deployed on Render:
1. Go to https://dashboard.render.com
2. Find the PesaRate API service
3. Copy the **Public URL** (should look like `https://pesarate-api-xxxxx.render.com`)
4. The full `VITE_API_URL` should be: `https://pesarate-api-xxxxx.render.com/api`

### Verification

After deployment, visit https://pesarate.vercel.app and:
- Try to sign up or log in
- Check the browser Network tab for API requests
- They should go to your backend URL, not localhost

## Backend (Flask) → Render (or similar platform)

### Setup on Render

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Configure environment variables in Render dashboard:

```
FLASK_ENV=production
SECRET_KEY=your-random-secret-key
JWT_SECRET_KEY=your-random-jwt-secret
DATABASE_URL=your-postgresql-connection-string
CORS_ORIGINS=https://pesarate.vercel.app,https://your-custom-domain.com
```

**Important**: Update `CORS_ORIGINS` to include your frontend URLs. Use comma-separated values without spaces.

### Database

Use Supabase PostgreSQL or any Postgres provider:
1. Create a database
2. Copy the connection string
3. Paste it as `DATABASE_URL` in Render environment variables
4. Run migrations on first deployment (or use build hook)

### Testing Production Connection

After both deployments:

```bash
# Test the backend health endpoint
curl https://your-backend-url/api/health

# Test frontend can reach backend
# Visit https://pesarate.vercel.app and try to sign up
```

## Local Development (no changes needed)

Frontend: `npm run dev` (uses `VITE_API_URL=http://localhost:5000/api` from `.env`)
Backend: `python run.py` (runs on port 5000)

## Troubleshooting

### "Can't reach the PesaRate server" error

1. **Frontend not finding backend**
   - Check Vercel has `VITE_API_URL` env var set
   - Verify the URL matches your actual backend deployment
   - Check the Network tab in browser DevTools to see the actual request URL

2. **Backend returns CORS error**
   - Verify `CORS_ORIGINS` on backend includes your frontend URL
   - Check it's without trailing slashes: `https://pesarate.vercel.app` (not `https://pesarate.vercel.app/`)
   - Restart the backend after changing CORS settings

3. **404 on `/api/health`**
   - Backend might not be running or deployed
   - Check Render dashboard for service status
   - View logs in Render to see any startup errors

### Environment Variables Not Updating

After changing Vercel env vars:
- Trigger a new build (push to git or use Vercel dashboard)
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Backend Database Issues

If migrations fail on first deploy:
- Connect to your Postgres database directly
- Run `flask db upgrade` locally pointing to production DATABASE_URL
- Or add a build hook in Render that runs the migration automatically
