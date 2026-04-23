# Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (https://render.com)
- Your project pushed to a GitHub repository

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Group Assignment Shuffler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/group-shuffler.git
git push -u origin main
```

## Step 2: Deploy Backend on Render

1. **Go to Render Dashboard** → Click "New +" → "Web Service"

2. **Connect Repository** → Select your GitHub repo

3. **Configure Backend Service**:
   - **Name**: `group-shuffler-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=0
   PYTHON_VERSION=3.12.0
   ```

5. **Click "Create Web Service"**

7. **Note the backend URL** (e.g., `https://group-shuffler-backend.onrender.com`)

## Step 3: Deploy Frontend on Render

1. **Go to Render Dashboard** → Click "New +" → "Static Site"

2. **Connect Repository** → Select your GitHub repo

3. **Configure Frontend Service**:
   - **Name**: `group-shuffler-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://group-shuffler-backend.onrender.com
   NODE_VERSION=18
   ```
   *(Replace with your actual backend URL)*

5. **Click "Create Static Site"**

## Step 4: Update CORS Settings

After both services are deployed:

1. **Go to Backend Service** → Environment → Add:
   ```
   CORS_ORIGINS=https://group-shuffler-frontend.onrender.com
   ```
   *(Replace with your actual frontend URL)*

2. **Redeploy Backend** to apply CORS changes

## Step 5: Test Deployment

1. Visit your frontend URL: `https://group-shuffler-frontend.onrender.com`
2. Enter a name and test the shuffler
3. Verify the group table updates correctly

## Important Notes

### Data Persistence on Free Tier
- **Free tier does NOT support persistent disks**
- CSV data is stored in the app directory
- **Data will be lost when the service redeploys** (code changes, manual redeploy)
- Data persists between cold starts (15 min inactivity) but NOT across redeployments
- For permanent data storage, consider:
  - Upgrading to paid plan with persistent disk ($7/month)
  - Using a free database service (MongoDB Atlas, Supabase)
  - Exporting CSV data manually before redeploying

### WebSocket Limitations on Render Free Tier
- Render's free tier may have limitations with WebSocket connections
- If WebSocket doesn't work, the app will fall back to HTTP polling
- For production use, consider upgrading to a paid plan

### Cold Starts
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-up may take 30-50 seconds
- This is normal for free tier

### Persistent Data
- CSV data is stored on the persistent disk
- Data survives redeployments
- Back up your CSV regularly

## Troubleshooting

### Backend not starting
- Check logs in Render dashboard
- Verify all dependencies in `requirements.txt`
- Ensure gunicorn command is correct

### Frontend can't connect to backend
- Verify `VITE_API_URL` environment variable is set correctly
- Check CORS settings in backend
- Ensure backend URL is accessible

### WebSocket connection fails
- Check browser console for errors
- Verify Socket.IO is properly configured
- Consider using HTTP-only mode if WebSocket is blocked

### CSV data lost
- This is expected on free tier after redeployment
- Data persists during normal operation (cold starts are OK)
- Only lost when you redeploy or push new code
- To preserve data: Export CSV before redeploying, or upgrade to paid plan

## Local Development

After deployment, for local development:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your production backend URL for CORS
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
# Create .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev
```

## Monitoring

- **Render Dashboard**: Monitor service health and logs
- **Uptime Monitoring**: Use services like UptimeRobot to keep services awake
- **Backup CSV**: Periodically download your CSV data

## Upgrade Path

For production use:
1. Upgrade to Render Starter plan ($7/month per service)
2. Enables always-on services (no cold starts)
3. Better WebSocket support
4. More persistent storage
