# Google Maps Integration Setup

## Step 1: Get Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name: "Parking Management System"
   - Click "Create"

3. **Enable Maps JavaScript API**
   - Go to "APIs & Services" → "Library"
   - Search for "Maps JavaScript API"
   - Click on it → Click "Enable"

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

5. **Restrict API Key (Recommended)**
   - Click on the API key you just created
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add your Vercel domain: `https://parking-management-system-lake.vercel.app/*`
     - Add localhost: `http://localhost:5173/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "Maps JavaScript API"
   - Click "Save"

## Step 2: Add API Key to Project

### Local Development:
Edit `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### Vercel Deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:
   - **Key**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google Maps API key
   - **Environment**: All (Production, Preview, Development)
5. Click "Save"
6. Redeploy your project

## Step 3: Test

1. Run locally: `npm run dev`
2. Go to "Park Vehicle" page
3. You should see a real Google Map
4. Select a parking location
5. Map should show a marker at that location

## Demo Locations

The app includes 3 demo parking locations in Delhi, India:

1. **Central Mall Underground**
   - Coordinates: 28.6139°N, 77.2090°E
   - Location: Central Delhi

2. **City Plaza Parking**
   - Coordinates: 28.5355°N, 77.3910°E
   - Location: Noida

3. **Airport Terminal 1**
   - Coordinates: 28.5562°N, 77.1000°E
   - Location: IGI Airport

## Pricing

Google Maps offers:
- **Free tier**: $200 credit per month
- **Maps JavaScript API**: $7 per 1,000 loads
- For a demo/MVP, you'll stay within free tier

## Troubleshooting

**Map not showing?**
- Check if API key is correct
- Verify Maps JavaScript API is enabled
- Check browser console for errors
- Ensure domain is whitelisted in API restrictions

**"This page can't load Google Maps correctly"**
- API key might be restricted to wrong domains
- Add your current domain to HTTP referrers

**Map shows but no marker?**
- Select a parking location from dropdown
- Marker appears only when location is selected
