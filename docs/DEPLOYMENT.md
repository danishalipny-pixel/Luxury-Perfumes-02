# Deployment Guide — NOIRÉLLE

Because NOIRÉLLE is architected as an optimized Single Page Application (SPA) with client-side routing, it can be deployed to any modern static hosting provider or CDN.

## Recommended Hosting Platforms

### 1. Vercel
1. Connect the GitHub repository `danishalipny-pixel/Luxury-Perfumes-02`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Ensure a `vercel.json` rewrites configuration is included to support direct client-side routes:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 2. Netlify
1. Connect the GitHub repository.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Ensure public `_redirects` file exists with:
```
/*    /index.html   200
```

### 3. GitHub Pages
1. Build the production application using `npm run build`.
2. Configure GitHub Actions workflow or push the `dist/` branch with an SPA fallback routing script.
