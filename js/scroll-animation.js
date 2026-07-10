/**
 * scroll-animation.js
 * Implements smooth scroll-controlled image sequence playback on the home page.
 * Uses GSAP ScrollTrigger for pinning and progress synchronization with a Canvas renderer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on index.html where #story-scroll exists
  const section = document.getElementById('story-scroll');
  if (!section) return;

  const canvas = document.getElementById('story-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const loadingProgress = document.getElementById('loading-progress');
  const loader = document.querySelector('.story-loader');
  const canvasContainer = document.querySelector('.story-canvas-container');
  const overlayContent = document.querySelector('.story-overlay-content');

  const frameCount = 140;
  const images = [];

  // Object tracking current frame index for GSAP to tween
  const frameObj = { frame: 0 };

  // Detect which folder contains the frame sequence (high_quality_frames/, images/, or image/)
  const testImg = new Image();
  testImg.src = `high_quality_frames/ezgif-frame-011.jpg`;
  testImg.onload = () => {
    preloadImages('high_quality_frames');
  };
  testImg.onerror = () => {
    const testImg2 = new Image();
    testImg2.src = `images/ezgif-frame-011.jpg`;
    testImg2.onload = () => {
      preloadImages('images');
    };
    testImg2.onerror = () => {
      // Fall back to the existing image/ folder
      console.warn("Frames not found in high_quality_frames/ or images/, falling back to 'image/'");
      preloadImages('image');
    };
  };

  function preloadImages(folderName) {
    const currentFrame = index => `${folderName}/ezgif-frame-${String(index + 11).padStart(3, '0')}.jpg`;
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        updateProgress();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${img.src}`);
        loadedCount++; // Prevent preloader lock
        updateProgress();
      };
      images.push(img);
    }

    function updateProgress() {
      const percent = Math.round((loadedCount / frameCount) * 100);
      if (loadingProgress) {
        loadingProgress.textContent = percent;
      }

      if (loadedCount === frameCount) {
        // Hide loader and initialize animation
        setTimeout(() => {
          if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
          }
          if (canvasContainer) canvasContainer.classList.add('visible');
          if (overlayContent) overlayContent.classList.add('visible');
          
          initAnimation();
        }, 300);
      }
    }
  }

  function initAnimation() {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial canvas size setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Timeline for pin & scrub scroll animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#story-scroll',
        start: 'top top',
        end: '+=350%', // Pinned scroll depth
        pin: true,
        scrub: 1, // Smooth scrub
        invalidateOnRefresh: true, // Recalculate values on window resize
      }
    });

    // Tween the frame number from 0 to 150
    tl.to(frameObj, {
      frame: frameCount - 1,
      ease: 'none',
      onUpdate: render,
      duration: 4 // Timeline duration is 4 units
    }, 0);

    // Card CTA: End Frame CTA (fades in from the right at the end frame and stays visible)
    tl.fromTo('.text-card-cta',
      { opacity: 0, x: 50, yPercent: -50 },
      { opacity: 1, x: 0, yPercent: -50, duration: 0.8, ease: 'power2.out' },
      3.0
    ).to('.text-card-cta',
      { opacity: 1, x: 0, yPercent: -50, duration: 0.2 },
      3.8
    );

    // Navbar: hides when scroll starts, fades back in on the end frame
    tl.fromTo('.navbar-homepage',
      { opacity: 1, pointerEvents: 'auto' },
      { opacity: 0, pointerEvents: 'none', duration: 0.5, ease: 'power2.inOut' },
      0.1
    ).to('.navbar-homepage',
      { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power2.inOut' },
      3.0
    );

    // Render the initial frame
    render();

    function resizeCanvas() {
      // Get device pixel ratio for sharp rendering on retina screens
      const dpr = window.devicePixelRatio || 1;
      const rect = section.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = window.innerHeight * dpr;
      
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      
      render();
    }

    function render() {
      const index = Math.round(frameObj.frame);
      const img = images[index];
      
      // Calculate canvas bounds in logical CSS pixels
      const cw = canvas.width / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, cw, ch);

      if (img && img.complete && img.naturalWidth > 0) {
        drawImageProp(ctx, img, 0, 0, cw, ch);
      } else {
        // Fallback styling if image fails to render or load
        ctx.fillStyle = '#0f0805';
        ctx.fillRect(0, 0, cw, ch);
      }
    }
  }

  /**
   * Helper function to emulate background-size: cover on a canvas element.
   * Maintains original aspect ratio and centers the image.
   */
  function drawImageProp(ctx, img, x, y, w, h, offsetX = 0.5, offsetY = 0.5) {
    const iw = img.width;
    const ih = img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    let cx = 0;
    let cy = 0;
    let cw = iw;
    let ch = ih;
    let ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }
});
