import fs from 'fs';
import path from 'path';

// Read all assets as base64 data URIs
function toDataUri(filePath, mimeType) {
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

console.log('Reading image and audio assets...');
const img1 = toDataUri('01_live_homepage.png', 'image/png');
const img2 = toDataUri('02_live_shop_catalog.png', 'image/png');
const img3 = toDataUri('03_live_single_product.png', 'image/png');
const img4 = toDataUri('test_live_gateway_razorpay.png', 'image/png');
const img5 = toDataUri('05_live_checkout.png', 'image/png');

const audio1 = toDataUri('scripts/scene1.wav', 'audio/wav');
const audio2 = toDataUri('scripts/scene2.wav', 'audio/wav');
const audio3 = toDataUri('scripts/scene3.wav', 'audio/wav');
const audio4 = toDataUri('scripts/scene4.wav', 'audio/wav');
const audio5 = toDataUri('scripts/scene5.wav', 'audio/wav');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reflection Elite — Portfolio Showcase Reel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #050508;
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    #stage {
      width: 1080px;
      height: 1920px;
      position: relative;
      background: radial-gradient(circle at 50% 20%, #1a1622 0%, #08080c 60%, #030305 100%);
      overflow: hidden;
      box-shadow: 0 0 100px rgba(212, 175, 55, 0.15);
    }

    /* Ambient Gold Shimmer & Glows */
    .ambient-glow-1 {
      position: absolute;
      top: -200px;
      right: -200px;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
    }
    .ambient-glow-2 {
      position: absolute;
      bottom: -200px;
      left: -200px;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(163, 92, 255, 0.15) 0%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
    }

    /* Top Branding Bar */
    .top-bar {
      position: absolute;
      top: 60px;
      left: 60px;
      right: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
    }
    .brand-pill {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(212, 175, 55, 0.3);
      backdrop-filter: blur(25px);
      padding: 14px 28px;
      border-radius: 999px;
    }
    .brand-dot {
      width: 14px;
      height: 14px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 15px #10B981;
      animation: pulse 2s infinite;
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #F6E6B4;
    }
    .tag-pill {
      font-size: 20px;
      font-weight: 700;
      color: #D4AF37;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 12px 24px;
      border-radius: 999px;
      letter-spacing: 1px;
    }

    /* Scene Progress Bars */
    .progress-track {
      position: absolute;
      top: 30px;
      left: 60px;
      right: 60px;
      display: flex;
      gap: 12px;
      z-index: 100;
    }
    .progress-segment {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: #D4AF37;
      border-radius: 999px;
      transition: width 0.1s linear;
    }

    /* Device Mockup Frame */
    .mockup-container {
      position: absolute;
      top: 170px;
      left: 80px;
      right: 80px;
      height: 1240px;
      border-radius: 44px;
      padding: 16px;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
      border: 2px solid rgba(212, 175, 55, 0.35);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(212, 175, 55, 0.1);
      backdrop-filter: blur(30px);
      z-index: 20;
      overflow: hidden;
    }
    .mockup-inner {
      width: 100%;
      height: 100%;
      border-radius: 32px;
      overflow: hidden;
      position: relative;
      background: #000;
    }
    .slide-media {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: scale(1.05);
      transition: opacity 0.8s ease, transform 6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .slide-media.active {
      opacity: 1;
      transform: scale(1.0);
    }

    /* Feature Badge floating over Mockup */
    .feature-badge {
      position: absolute;
      top: 210px;
      right: 120px;
      background: rgba(10, 10, 14, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.4);
      padding: 14px 28px;
      border-radius: 20px;
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6);
      z-index: 50;
      font-size: 22px;
      font-weight: 700;
      color: #F6E6B4;
    }

    /* Lower Narrative & Subtitle Card */
    .narrative-card {
      position: absolute;
      bottom: 70px;
      left: 60px;
      right: 60px;
      background: rgba(12, 12, 18, 0.88);
      border: 1px solid rgba(212, 175, 55, 0.35);
      backdrop-filter: blur(40px);
      border-radius: 36px;
      padding: 44px 50px;
      z-index: 100;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
    }

    .scene-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .scene-step {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #D4AF37;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .sound-wave {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .wave-bar {
      width: 5px;
      height: 18px;
      background: #D4AF37;
      border-radius: 4px;
      animation: wave 0.8s ease-in-out infinite alternate;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.15s; height: 32px; }
    .wave-bar:nth-child(3) { animation-delay: 0.3s; height: 24px; }
    .wave-bar:nth-child(4) { animation-delay: 0.45s; height: 38px; }
    .wave-bar:nth-child(5) { animation-delay: 0.2s; height: 16px; }

    .scene-headline {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.25;
      color: #FFFFFF;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .scene-caption {
      font-size: 26px;
      line-height: 1.45;
      color: #C8C8D4;
      font-weight: 500;
    }
    .highlight {
      color: #FFE072;
      background: rgba(212, 175, 55, 0.15);
      padding: 2px 8px;
      border-radius: 6px;
    }

    /* Bottom Floating Action Bar */
    .controls-bar {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 16px;
      z-index: 200;
    }
    .ctrl-btn {
      background: rgba(20, 20, 28, 0.9);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #F6E6B4;
      font-size: 18px;
      font-weight: 700;
      padding: 12px 24px;
      border-radius: 999px;
      cursor: pointer;
      backdrop-filter: blur(20px);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .ctrl-btn:hover {
      background: rgba(212, 175, 55, 0.25);
      border-color: #D4AF37;
      transform: translateY(-2px);
    }
    .ctrl-btn.primary {
      background: linear-gradient(135deg, #D4AF37, #AA8222);
      color: #0B0B0E;
      border: none;
    }
    .ctrl-btn.primary:hover {
      background: linear-gradient(135deg, #FFE072, #C5A059);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.9); }
    }
    @keyframes wave {
      0% { transform: scaleY(0.4); }
      100% { transform: scaleY(1.3); }
    }
  </style>
</head>
<body>
  <div id="stage">
    <div class="ambient-glow-1"></div>
    <div class="ambient-glow-2"></div>

    <!-- Progress Track -->
    <div class="progress-track">
      <div class="progress-segment"><div class="progress-fill" id="pf-0"></div></div>
      <div class="progress-segment"><div class="progress-fill" id="pf-1"></div></div>
      <div class="progress-segment"><div class="progress-fill" id="pf-2"></div></div>
      <div class="progress-segment"><div class="progress-fill" id="pf-3"></div></div>
      <div class="progress-segment"><div class="progress-fill" id="pf-4"></div></div>
    </div>

    <!-- Top Bar -->
    <div class="top-bar">
      <div class="brand-pill">
        <div class="brand-dot"></div>
        <div class="brand-title">REFLECTION ELITE</div>
      </div>
      <div class="tag-pill" id="tech-badge">E-COMMERCE SHOWCASE</div>
    </div>

    <!-- Floating Badge -->
    <div class="feature-badge" id="floating-badge">
      <span>✨</span> <span id="badge-text">Luxury Mirror Studio</span>
    </div>

    <!-- Phone / Device Mockup -->
    <div class="mockup-container">
      <div class="mockup-inner">
        <img src="${img1}" class="slide-media active" id="media-0" alt="Home">
        <img src="${img2}" class="slide-media" id="media-1" alt="Catalog">
        <img src="${img3}" class="slide-media" id="media-2" alt="Product">
        <img src="${img4}" class="slide-media" id="media-3" alt="Payments">
        <img src="${img5}" class="slide-media" id="media-4" alt="Checkout">
      </div>
    </div>

    <!-- Bottom Narrative Card -->
    <div class="narrative-card">
      <div class="scene-meta">
        <div class="scene-step" id="scene-step">SCENE 1 / 5 · LUXURY BRANDING</div>
        <div class="sound-wave">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
      </div>
      <div class="scene-headline" id="scene-headline">Bespoke Luxury E-Commerce</div>
      <div class="scene-caption" id="scene-caption">
        Engineered for Reflection Elite with seamless Indian payments and <span class="highlight">₹0 monthly subscriptions</span>.
      </div>
    </div>

    <!-- Floating Controls -->
    <div class="controls-bar">
      <button class="ctrl-btn" onclick="restartShowcase()">↺ Replay</button>
      <button class="ctrl-btn primary" id="record-btn" onclick="startTabRecording()">⏺ Export Video File (WebM/MP4)</button>
    </div>
  </div>

  <!-- Audio Elements -->
  <audio id="audio-0" src="${audio1}"></audio>
  <audio id="audio-1" src="${audio2}"></audio>
  <audio id="audio-2" src="${audio3}"></audio>
  <audio id="audio-3" src="${audio4}"></audio>
  <audio id="audio-4" src="${audio5}"></audio>

  <script>
    const scenes = [
      {
        duration: 5.64,
        step: "SCENE 1 / 5 · ARCHITECTURE",
        badge: "Zero SaaS Fees",
        tech: "WOOCOMMERCE",
        headline: "Bespoke Luxury E-Commerce",
        caption: "Built for Reflection Elite with custom architecture and <span class='highlight'>₹0 monthly subscriptions</span>."
      },
      {
        duration: 6.97,
        step: "SCENE 2 / 5 · VISUAL AESTHETICS",
        badge: "Luxury UI Design",
        tech: "ASTRA & GOLD THEME",
        headline: "Artisanal Craftsmanship Showcase",
        caption: "Gold-accented typography and <span class='highlight'>high-resolution galleries</span> optimized for luxury mirrors."
      },
      {
        duration: 7.07,
        step: "SCENE 3 / 5 · PRODUCT CUSTOMIZER",
        badge: "Dynamic Variations",
        tech: "LIVE RECALCULATION",
        headline: "Real-Time Pricing & Finishes",
        caption: "Customers switch <span class='highlight'>dimensions and frame colors</span> with live price updates and inventory sync."
      },
      {
        duration: 9.85,
        step: "SCENE 4 / 5 · INDIAN PAYMENTS",
        badge: "Razorpay + UPI + COD",
        tech: "CHECKOUT INTEGRATION",
        headline: "Frictionless Indian Checkout",
        caption: "Mandatory 6-digit PIN validation, Cash on Delivery thresholds, and <span class='highlight'>instant UPI & Cards via Razorpay</span>."
      },
      {
        duration: 7.82,
        step: "SCENE 5 / 5 · ROI & COST SAVINGS",
        badge: "Save ₹25,000+/yr",
        tech: "SHOPIFY TO WOOCOMMERCE",
        headline: "Self-Hosted Freedom & Savings",
        caption: "Migrated away from Shopify to self-hosted WooCommerce, saving <span class='highlight'>₹25,000+ every single year</span>."
      }
    ];

    let currentScene = 0;
    let isPlaying = false;
    let animId = null;

    window.restartShowcase = function() {
      // Reset all progress
      for (let i = 0; i < scenes.length; i++) {
        document.getElementById('pf-' + i).style.width = '0%';
        const a = document.getElementById('audio-' + i);
        a.pause();
        a.currentTime = 0;
      }
      playScene(0);
    };

    window.startShowcase = function() {
      if (isPlaying) return;
      isPlaying = true;
      playScene(0);
    };

    function playScene(idx) {
      if (idx >= scenes.length) {
        console.log("Showcase complete!");
        if (window.onShowcaseEnded) window.onShowcaseEnded();
        return;
      }
      currentScene = idx;
      const s = scenes[idx];

      // Update text
      document.getElementById('scene-step').innerText = s.step;
      document.getElementById('badge-text').innerText = s.badge;
      document.getElementById('tech-badge').innerText = s.tech;
      document.getElementById('scene-headline').innerHTML = s.headline;
      document.getElementById('scene-caption').innerHTML = s.caption;

      // Update Media
      for (let i = 0; i < scenes.length; i++) {
        const m = document.getElementById('media-' + i);
        if (i === idx) {
          m.classList.add('active');
        } else {
          m.classList.remove('active');
        }
      }

      // Play Audio
      const audio = document.getElementById('audio-' + idx);
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio autoplay prevented, continuing timer'));

      // Progress animation
      const pf = document.getElementById('pf-' + idx);
      let startTime = performance.now();
      const durMs = s.duration * 1000;

      function updateProgress(now) {
        let elapsed = now - startTime;
        let pct = Math.min(100, (elapsed / durMs) * 100);
        pf.style.width = pct + '%';
        if (elapsed < durMs) {
          animId = requestAnimationFrame(updateProgress);
        } else {
          pf.style.width = '100%';
          playScene(idx + 1);
        }
      }
      animId = requestAnimationFrame(updateProgress);
    }

    // 1-Click Video Recording & Export
    async function startTabRecording() {
      try {
        const recordBtn = document.getElementById('record-btn');
        recordBtn.innerText = "⏳ Recording tab...";
        recordBtn.style.background = "#E11D48";
        recordBtn.style.color = "#FFF";

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'browser' },
          audio: true,
          preferCurrentTab: true
        });

        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reflection_elite_portfolio_reel.webm';
          a.click();
          recordBtn.innerText = "✓ Exported! Record Again";
          recordBtn.style.background = "linear-gradient(135deg, #D4AF37, #AA8222)";
          recordBtn.style.color = "#0B0B0E";
        };

        recorder.start();
        restartShowcase();

        window.onShowcaseEnded = () => {
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
        };
      } catch (err) {
        alert("Recording cancelled or not supported. You can still watch the reel!");
        const recordBtn = document.getElementById('record-btn');
        recordBtn.innerText = "⏺ Export Video File";
      }
    }

    // Auto-start on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => window.startShowcase(), 600);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('portfolio_showcase.html', htmlContent);
console.log('Successfully created portfolio_showcase.html! Size:', fs.statSync('portfolio_showcase.html').size);
