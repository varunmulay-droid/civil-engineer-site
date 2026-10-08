# Sahyadri Structures — civil engineering website

React + Vite front end, Express server that proxies Pexels (the API key never reaches the browser).

## Run locally
    npm install
    PEXELS_API_KEY=your_key npm run build && PEXELS_API_KEY=your_key npm start

## Deploy on Render
Render dashboard → New → Blueprint → select this repo. Enter `PEXELS_API_KEY` when prompted.

Edit `src/data.js` to re-skin for another builder.
