# Sahyadri Structures — civil engineering website

Stack: React + Vite, GSAP ScrollTrigger, React Three Fiber + drei (shader), Express (Pexels proxy; key stays server-side).

Concept: Industrial Precision — blueprint grid, concrete/steel palette, amber accent.
Signature moments: hero mask/clip reveals, pinned "Blueprint to Built" 3D construction scrub, liquid-shader project slider, material explorer, before/after slider.
Falls back gracefully without WebGL or with reduced motion.

    npm install
    PEXELS_API_KEY=your_key npm run build && PEXELS_API_KEY=your_key npm start

Deploy: Render → New → Blueprint → select this repo (asks for PEXELS_API_KEY).
Content lives in `src/data.js`.
