function renderStatusPage(config) {
  const hermesMode = config.hermes.mock ? 'mock' : config.hermes.apiMode;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Star 小宇宙 MVP</title>
  <style>
    :root {
      --ink: #24213a;
      --muted: #6f6a8b;
      --line: #dedbf4;
      --paper: #ffffff;
      --wash: #f7f5ff;
      --brand: #5b5ce2;
      --brand-soft: #ecebff;
      --blue: #3867d6;
      --blue-soft: #eaf0ff;
      --accent: #7c3aed;
      --accent-soft: #f1eaff;
      --cyan: #2aa8c6;
      --amber: #8a5a1f;
      --amber-soft: #f8efe2;
      --shadow: 0 24px 70px rgba(30, 24, 80, 0.24);
      color: var(--ink);
      background: #e9e7f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 28px;
      background:
        radial-gradient(circle at 18% 18%, rgba(124, 58, 237, 0.18), transparent 28%),
        radial-gradient(circle at 82% 16%, rgba(42, 168, 198, 0.16), transparent 30%),
        linear-gradient(135deg, rgba(91, 92, 226, 0.14), transparent 38%),
        #e9e7f9;
    }

    button,
    input,
    textarea {
      font: inherit;
    }

    button {
      border: 0;
      border-radius: 8px;
      cursor: pointer;
    }

    .phone {
      width: min(430px, 100%);
      height: min(860px, calc(100vh - 56px));
      min-height: 680px;
      position: relative;
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr) auto;
      overflow: hidden;
      border: 10px solid #211f3f;
      border-radius: 34px;
      background: var(--wash);
      box-shadow: var(--shadow);
    }

    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 18px 4px;
      color: #24213a;
      background: var(--paper);
      font-size: 12px;
      font-weight: 700;
    }

    .signal {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: #24213a;
    }

    .app-header {
      padding: 8px 18px 10px;
      border-bottom: 1px solid var(--line);
      background: var(--paper);
    }

    .app-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .app-title {
      margin: 0;
      font-size: 19px;
      line-height: 1.2;
      letter-spacing: 0;
    }

    .pill {
      flex: 0 0 auto;
      padding: 4px 7px;
      border-radius: 8px;
      color: var(--brand);
      background: var(--brand-soft);
      font-size: 11px;
      font-weight: 700;
    }

    .screen {
      min-height: 0;
      overflow-y: auto;
      padding: 14px 16px 18px;
    }

    .view {
      display: none;
      animation: fade-in 160ms ease-out;
    }

    .view.active {
      display: block;
    }

    .view.chat-view.active {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .home-hero {
      position: relative;
      overflow: hidden;
      padding: 14px;
      border: 1px solid rgba(118, 112, 231, 0.24);
      border-radius: 8px;
      background:
        linear-gradient(145deg, rgba(245, 244, 255, 0.92), rgba(232, 244, 255, 0.88)),
        #ffffff;
      animation: fade-in 360ms ease both;
    }

    .home-hero h2 {
      margin: 0;
      color: var(--ink);
      font-size: 23px;
      line-height: 1.18;
      letter-spacing: 0;
    }

    .hero-kicker {
      color: var(--brand);
      font-size: 21px;
      font-weight: 900;
      line-height: 1.18;
      letter-spacing: 0;
    }

    .hero-subtitle {
      margin-top: 7px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.5;
    }

    .quest-map {
      width: 100%;
      height: 148px;
      margin-top: 14px;
      display: block;
      object-fit: cover;
      object-position: center 52%;
      border-radius: 8px;
      border: 1px solid rgba(203, 198, 255, 0.78);
      box-shadow: 0 16px 30px rgba(56, 103, 214, 0.16);
      animation: map-float 4.8s ease-in-out infinite;
    }

    @keyframes map-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .mission-dock {
      margin-top: 12px;
      display: grid;
      grid-template-columns: 72px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      color: #ffffff;
      background:
        linear-gradient(135deg, rgba(44, 41, 105, 0.97), rgba(72, 80, 212, 0.9)),
        #29265f;
      box-shadow: 0 14px 26px rgba(36, 33, 58, 0.16);
    }

    .mission-art {
      width: 72px;
      height: 66px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.24);
    }

    .mission-label {
      color: rgba(255, 255, 255, 0.68);
      font-size: 12px;
      font-weight: 800;
    }

    .mission-title {
      margin-top: 5px;
      font-size: 16px;
      font-weight: 850;
      line-height: 1.25;
    }

    .mission-desc {
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.74);
      font-size: 12px;
      line-height: 1.45;
    }

    .mission-dock .button-row {
      margin-top: 9px;
    }

    .quest-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .quest-card {
      position: relative;
      overflow: hidden;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 9px;
      border: 1px solid #dcd8fb;
      border-radius: 8px;
      background: #ffffff;
      text-align: left;
      box-shadow: 0 9px 22px rgba(55, 49, 108, 0.07);
      animation: card-rise 420ms ease both;
    }

    .quest-card:nth-child(2) { animation-delay: 45ms; }
    .quest-card:nth-child(3) { animation-delay: 90ms; }
    .quest-card:nth-child(4) { animation-delay: 135ms; }
    .quest-card:nth-child(5) { animation-delay: 180ms; }
    .quest-card:nth-child(6) { animation-delay: 225ms; }

    @keyframes card-rise {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .quest-card.active,
    .quest-card:focus-visible {
      border-color: var(--brand);
      box-shadow: 0 14px 28px rgba(91, 92, 226, 0.2);
      transform: translateY(-1px);
    }

    .quest-card.feature {
      grid-column: 1 / -1;
      min-height: 158px;
      display: grid;
      grid-template-columns: 140px minmax(0, 1fr);
      align-items: center;
      background: linear-gradient(135deg, #ffffff, #f0f7ff);
    }

    .quest-card.split {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 118px;
      align-items: center;
      background: linear-gradient(135deg, #f8f6ff, #ffffff);
    }

    .quest-card.scroll {
      min-height: 120px;
      background:
        linear-gradient(135deg, rgba(255, 249, 232, 0.98), rgba(245, 236, 255, 0.95)),
        #fffaf0;
      border-color: #ead6a8;
    }

    .quest-card.note {
      min-height: 120px;
      background:
        linear-gradient(180deg, rgba(236, 235, 255, 0.92), rgba(255, 255, 255, 0.98)),
        #ffffff;
    }

    .quest-card.mini {
      min-height: 104px;
    }

    .quest-card.calm {
      background: linear-gradient(135deg, #ffffff, #f3fbff);
      border-color: #cce8f2;
    }

    .quest-card-art {
      width: 100%;
      height: 92px;
      object-fit: cover;
      border-radius: 8px;
      background: #ecebff;
      transition: transform 220ms ease;
    }

    .quest-card.feature .quest-card-art {
      width: 140px;
      height: 126px;
    }

    .quest-card.split .quest-card-art {
      width: 118px;
      height: 96px;
      order: 2;
    }

    .quest-card-mark {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      color: #ffffff;
      background: linear-gradient(135deg, #5b5ce2, #2aa8c6);
      font-size: 15px;
      font-weight: 950;
      box-shadow: 0 8px 18px rgba(91, 92, 226, 0.18);
    }

    .scroll .quest-card-mark {
      color: #6b4c13;
      background: linear-gradient(135deg, #ffe6a3, #d49b35);
    }

    .note .quest-card-mark {
      background: linear-gradient(135deg, #5b5ce2, #8b72ff);
    }

    .calm .quest-card-mark {
      background: linear-gradient(135deg, #2aa8c6, #75d6e8);
    }

    .quest-card.active .quest-card-art,
    .quest-card:hover .quest-card-art {
      transform: scale(1.04);
    }

    .quest-card-body {
      min-width: 0;
      display: grid;
      align-content: center;
      gap: 5px;
    }

    .quest-card-title {
      color: var(--ink);
      font-size: 15px;
      font-weight: 900;
      line-height: 1.2;
    }

    .feature .quest-card-title {
      font-size: 18px;
    }

    .quest-card-desc {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.35;
    }

    .quest-card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .quest-card-tag {
      padding: 4px 7px;
      border-radius: 999px;
      color: #4f4c75;
      background: #f0eefc;
      font-size: 10px;
      font-weight: 900;
      line-height: 1;
    }

    .home-playground {
      display: none;
      margin-top: 12px;
    }

    .home-playground.active {
      display: block;
    }

    .play-card {
      padding: 12px;
      border: 1px solid #dcd8fb;
      border-radius: 8px;
      background: #ffffff;
    }

    .play-kicker {
      color: var(--brand);
      font-size: 11px;
      font-weight: 850;
    }

    .play-title {
      margin-top: 4px;
      font-size: 16px;
      font-weight: 850;
      line-height: 1.3;
    }

    .play-question {
      margin-top: 8px;
      color: #2d294f;
      font-size: 14px;
      line-height: 1.55;
    }

    .level-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 10px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 750;
    }

    .quest-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .quest-chip {
      padding: 5px 8px;
      border-radius: 999px;
      color: #4f4c75;
      background: #f0eefc;
      font-size: 11px;
      font-weight: 850;
    }

    .quest-chip.hot {
      color: #ffffff;
      background: linear-gradient(135deg, #5b5ce2, #2aa8c6);
    }

    .progress-track {
      height: 7px;
      margin-top: 7px;
      overflow: hidden;
      border-radius: 999px;
      background: #ece9fb;
    }

    .progress-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #5b5ce2, #2aa8c6);
    }

    .game-complete {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #dcd8fb;
      border-radius: 8px;
      color: #2d294f;
      background: #faf9ff;
      font-size: 14px;
      line-height: 1.5;
    }

    .profile-hero {
      padding: 14px;
      border-radius: 8px;
      color: #ffffff;
      background:
        linear-gradient(135deg, rgba(91, 92, 226, 0.95), rgba(42, 168, 198, 0.86)),
        #29265f;
    }

    .profile-name {
      font-size: 18px;
      font-weight: 900;
      line-height: 1.2;
    }

    .profile-subtitle {
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 12px;
      line-height: 1.45;
    }

    .achievement-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
      margin-top: 12px;
    }

    .achievement-stat {
      padding: 10px 8px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.14);
    }

    .achievement-stat strong {
      display: block;
      font-size: 20px;
      line-height: 1.1;
    }

    .achievement-stat span {
      display: block;
      margin-top: 4px;
      color: rgba(255, 255, 255, 0.75);
      font-size: 11px;
    }

    .bento-shop {
      overflow: hidden;
      border-color: #e5def4;
      background:
        linear-gradient(180deg, #fffdf8, #f7f3ff 58%, #ffffff),
        #ffffff;
    }

    .bento-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .bento-head h3 {
      margin: 0;
    }

    .bento-wallet {
      min-width: 78px;
      padding: 7px 8px;
      border-radius: 8px;
      color: #4a35a3;
      background: #f0edff;
      text-align: center;
      font-size: 11px;
      font-weight: 850;
    }

    .bento-wallet strong {
      display: block;
      margin-top: 2px;
      color: #24213a;
      font-size: 18px;
      line-height: 1;
    }

    .bento-stage {
      margin-top: 12px;
      padding: 12px;
      border: 1px solid #eaded0;
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(255, 239, 207, 0.75), rgba(235, 244, 255, 0.86)),
        #fffaf1;
    }

    .bento-upgrade-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      margin-bottom: 10px;
      padding: 9px;
      border: 1px solid rgba(213, 185, 142, 0.72);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.72);
    }

    .upgrade-title {
      color: #6e5128;
      font-size: 13px;
      font-weight: 900;
      line-height: 1.2;
    }

    .upgrade-meta {
      margin-top: 3px;
      color: #8a6a41;
      font-size: 11px;
      font-weight: 750;
      line-height: 1.35;
    }

    .lunchbox {
      position: relative;
      min-height: 172px;
      padding: 12px;
      border: 2px solid #d6b98e;
      border-radius: 8px;
      background: #fff7e7;
      box-shadow: inset 0 0 0 7px rgba(255, 255, 255, 0.72), 0 10px 22px rgba(97, 70, 38, 0.1);
    }

    .lunchbox-title {
      color: #6e5128;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0;
    }

    .bento-slots {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }

    .bento-slot {
      min-height: 52px;
      display: grid;
      place-items: center;
      border: 1px dashed #cfb891;
      border-radius: 8px;
      color: #a08662;
      background: rgba(255, 255, 255, 0.62);
      font-size: 11px;
      font-weight: 850;
    }

    .bento-piece {
      min-height: 52px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      color: #2d294f;
      background: #ffffff;
      font-size: 15px;
      font-weight: 950;
      box-shadow: 0 8px 16px rgba(72, 55, 27, 0.12);
    }

    .food-image {
      width: 38px;
      height: 38px;
      display: block;
      object-fit: contain;
    }

    .bento-piece.rice { background: linear-gradient(145deg, #ffffff, #f1edf8); }
    .bento-piece.cabbage { background: linear-gradient(145deg, #e8ffd9, #86d06f); }
    .bento-piece.drumstick { background: linear-gradient(145deg, #ffe1b8, #d98940); }
    .bento-piece.egg { background: linear-gradient(145deg, #fff6c3, #f4c547); }
    .bento-piece.corn { background: linear-gradient(145deg, #fff0a6, #e5a925); }
    .bento-piece.shrimp { background: linear-gradient(145deg, #ffd8d7, #ff8e82); }

    .bento-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 10px;
    }

    .bento-action {
      min-height: 30px;
      padding: 0 10px;
      border-radius: 8px;
      color: #4a35a3;
      background: #efedff;
      font-size: 12px;
      font-weight: 850;
    }

    .ingredient-shop,
    .customer-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .ingredient-card,
    .customer-card {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      padding: 8px;
      border: 1px solid #ece5f4;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
    }

    .ingredient-card.locked {
      filter: grayscale(0.75);
      opacity: 0.72;
    }

    .ingredient-icon,
    .customer-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      color: #2d294f;
      background: #f0edff;
      font-size: 14px;
      font-weight: 950;
    }

    .ingredient-icon .food-image {
      width: 35px;
      height: 35px;
    }

    .ingredient-name,
    .customer-name {
      color: #2d294f;
      font-size: 13px;
      font-weight: 900;
      line-height: 1.25;
    }

    .ingredient-meta,
    .customer-request {
      margin-top: 3px;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.35;
    }

    .bento-buy,
    .bento-serve {
      min-height: 30px;
      padding: 0 9px;
      border-radius: 8px;
      color: #ffffff;
      background: #5b5ce2;
      font-size: 12px;
      font-weight: 850;
      white-space: nowrap;
    }

    .bento-buy[disabled],
    .bento-serve[disabled] {
      color: #8b879f;
      background: #ebe8f5;
    }

    .bento-feedback {
      margin-top: 10px;
      color: #4a35a3;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.45;
    }

    .badge-grid {
      display: grid;
      gap: 10px;
      margin-top: 10px;
    }

    .badge-family {
      position: relative;
      overflow: hidden;
      padding: 12px;
      border: 1px solid rgba(104, 96, 224, 0.18);
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(242, 239, 255, 0.94)),
        radial-gradient(circle at 12% 0%, rgba(98, 143, 255, 0.15), transparent 34%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
    }

    .badge-family::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(90deg, rgba(105, 96, 224, 0.08) 1px, transparent 1px),
        linear-gradient(0deg, rgba(105, 96, 224, 0.06) 1px, transparent 1px);
      background-size: 16px 16px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.65), transparent);
    }

    .record-item {
      padding: 10px;
      border: 1px solid #ece9fb;
      border-radius: 8px;
      background: #faf9ff;
    }

    .badge-family-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .badge-family-head strong {
      color: #2d294f;
      font-size: 13px;
      line-height: 1.35;
    }

    .badge-best {
      color: var(--muted);
      font-size: 11px;
      font-weight: 750;
    }

    .badge-levels {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }

    .badge-level {
      position: relative;
      overflow: hidden;
      min-height: 80px;
      display: grid;
      align-content: center;
      justify-items: center;
      gap: 4px;
      padding: 9px 5px;
      border: 1px solid #d7d4e8;
      border-radius: 8px;
      color: #8a869b;
      background:
        linear-gradient(145deg, #f1eff8, #dedcec),
        repeating-linear-gradient(135deg, rgba(255,255,255,0.2) 0 4px, transparent 4px 8px);
      text-align: center;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .badge-level::before {
      content: "";
      position: absolute;
      inset: -20% auto auto -20%;
      width: 70%;
      height: 70%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.28);
      transform: rotate(-18deg);
    }

    .badge-level.unlocked {
      color: #272344;
      box-shadow: 0 10px 24px rgba(36, 33, 58, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.82);
    }

    .badge-level.starter.unlocked {
      border-color: #7eb6ff;
      background: linear-gradient(145deg, #eaf5ff, #7fb4ff 55%, #4e78ff);
    }

    .badge-level.bronze.unlocked {
      border-color: #d5965f;
      background: linear-gradient(145deg, #fff0d9, #d69355 55%, #9f572f);
    }

    .badge-level.silver.unlocked {
      border-color: #bcc7dc;
      background: linear-gradient(145deg, #ffffff, #c5d0e3 58%, #8494b2);
    }

    .badge-level.gold.unlocked {
      border-color: #f0c24d;
      background: linear-gradient(145deg, #fff8c6, #f4bd39 55%, #c97a17);
    }

    .badge-level.crystal.unlocked {
      border-color: #7dd7ff;
      background: linear-gradient(145deg, #effcff, #91e1ff 48%, #7b7cff);
    }

    .badge-level.galaxy.unlocked {
      border-color: #9b8cff;
      color: #ffffff;
      background:
        radial-gradient(circle at 20% 18%, rgba(255,255,255,0.9) 0 2px, transparent 3px),
        radial-gradient(circle at 78% 28%, rgba(255,255,255,0.8) 0 1px, transparent 2px),
        linear-gradient(145deg, #36216f, #6757ff 52%, #18b6ff);
    }

    .badge-icon {
      position: relative;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      color: inherit;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.42);
      box-shadow: inset 0 -3px 8px rgba(45, 41, 79, 0.1);
      font-size: 13px;
      font-weight: 950;
    }

    .badge-level-name {
      font-size: 12px;
      font-weight: 900;
      line-height: 1.15;
    }

    .badge-target {
      color: rgba(36, 33, 58, 0.64);
      font-size: 10px;
      line-height: 1.2;
    }

    .badge-level.locked .badge-icon {
      color: #8b879a;
      border-color: rgba(255, 255, 255, 0.4);
      background: #d8d6e5;
    }

    .badge-level.locked .badge-target {
      color: #8c889c;
    }

    .record-item strong {
      display: block;
      color: #2d294f;
      font-size: 13px;
      line-height: 1.35;
    }

    .record-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }

    .record-meta {
      margin-top: 5px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .answer-line {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      margin-top: 10px;
    }

    .play-input {
      min-width: 0;
      min-height: 38px;
      padding: 0 11px;
      border: 1px solid #d6d2ef;
      border-radius: 8px;
      color: var(--ink);
      background: #fafaff;
      outline: none;
    }

    .play-input:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(91, 92, 226, 0.12);
    }

    .play-feedback {
      min-height: 21px;
      margin-top: 9px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    .play-feedback.good {
      color: #1c7a5a;
    }

    .play-feedback.try {
      color: #815116;
    }

    .mini-steps {
      display: grid;
      gap: 7px;
      margin: 10px 0 0;
      padding: 0;
      list-style: none;
    }

    .mini-steps li {
      padding: 8px 9px;
      border: 1px solid #ece9fb;
      border-radius: 8px;
      color: #35315f;
      background: #faf9ff;
      font-size: 13px;
      line-height: 1.45;
    }

    .play-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 11px;
    }

    .ghost-link {
      color: var(--brand);
      background: var(--brand-soft);
    }

    .section {
      margin-top: 16px;
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .section-title {
      font-size: 17px;
      font-weight: 800;
    }

    .section-note {
      color: var(--muted);
      font-size: 12px;
    }

    .plan-section-note {
      margin: 14px 0 10px;
      color: #24213a;
      font-size: 15px;
      font-weight: 900;
    }

    .plan-history-title {
      margin-top: 18px;
    }

    .card {
      padding: 15px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--paper);
    }

    .card + .card,
    .plan-card + .plan-card {
      margin-top: 12px;
    }

    .card h3 {
      margin: 0 0 7px;
      font-size: 17px;
      line-height: 1.3;
      letter-spacing: 0;
    }

    .muted {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.55;
    }

    .steps {
      margin: 10px 0 0;
      padding-left: 18px;
      color: #2d294f;
      font-size: 14px;
      line-height: 1.6;
    }

    .plan-dashboard {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    .plan-stat {
      padding: 10px 7px;
      border: 1px solid #dedbf4;
      border-radius: 8px;
      background: #ffffff;
      text-align: center;
    }

    .plan-stat strong {
      display: block;
      color: var(--brand);
      font-size: 18px;
      line-height: 1.05;
    }

    .plan-stat span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 10px;
      font-weight: 800;
      line-height: 1.2;
    }

    .plan-form {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
      padding: 12px;
      border: 1px solid #dedbf4;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(236, 235, 255, 0.86), rgba(255, 255, 255, 0.98));
    }

    .plan-form-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px;
    }

    .plan-input,
    .plan-select {
      width: 100%;
      min-height: 36px;
      padding: 0 10px;
      border: 1px solid #dcd8fb;
      border-radius: 8px;
      color: var(--ink);
      background: #ffffff;
      font-size: 13px;
    }

    .plan-card {
      position: relative;
      overflow: hidden;
    }

    .plan-card.done {
      border-color: #bde6ce;
      background: linear-gradient(135deg, #f5fff8, #ffffff);
    }

    .plan-card.missed {
      border-color: #efd3bb;
      background: linear-gradient(135deg, #fff8ef, #ffffff);
    }

    .plan-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 7px;
    }

    .plan-type {
      display: inline-flex;
      align-items: center;
      padding: 5px 8px;
      border-radius: 999px;
      color: #4735a9;
      background: #efedff;
      font-size: 11px;
      font-weight: 900;
    }

    .plan-state {
      color: var(--muted);
      font-size: 11px;
      font-weight: 850;
    }

    .plan-reason {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      color: #735126;
      background: #fff5e8;
      font-size: 12px;
      line-height: 1.45;
    }

    .plan-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 11px;
    }

    .plan-actions button {
      min-height: 30px;
      padding: 0 10px;
      color: #4a35a3;
      background: #efedff;
      font-size: 12px;
      font-weight: 850;
    }

    .plan-actions button.danger {
      color: #9a2f4d;
      background: #fff0f4;
    }

    .tag {
      display: inline-flex;
      margin: 6px 6px 0 0;
      padding: 6px 9px;
      border-radius: 8px;
      color: #4735a9;
      background: #efedff;
      font-size: 12px;
      line-height: 1.2;
    }

    .module-grid {
      display: grid;
      gap: 10px;
    }

    .support-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .module-card {
      padding: 13px;
      border: 1px solid #e1ddfb;
      border-radius: 8px;
      background: var(--paper);
      text-align: left;
    }

    .module-card.primary-module {
      padding: 15px;
      border-color: #cbc6ff;
      background:
        linear-gradient(180deg, rgba(236, 235, 255, 0.9), rgba(255, 255, 255, 0.98)),
        #ffffff;
    }

    .module-card.rest-module {
      background: #fffaf4;
      border-color: #ead8bf;
    }

    .module-head {
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
    }

    .module-mark {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      color: #ffffff;
      background: var(--brand);
      font-size: 15px;
      font-weight: 900;
    }

    .module-card:nth-child(2) .module-mark {
      background: var(--cyan);
    }

    .module-card:nth-child(3) .module-mark {
      background: #6d5bd0;
    }

    .module-card:nth-child(4) .module-mark {
      background: #b36a2e;
    }

    .support-module:nth-child(1) .module-mark {
      background: var(--cyan);
    }

    .support-module:nth-child(2) .module-mark {
      background: #6d5bd0;
    }

    .rest-module .module-mark {
      background: #b36a2e;
    }

    .module-title {
      font-size: 16px;
      font-weight: 850;
      line-height: 1.2;
    }

    .module-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 11px;
    }

    .mission-option {
      min-height: 32px;
      padding: 0 9px;
      border: 1px solid #dcd8fb;
      color: #3c3671;
      background: #fafaff;
      font-size: 13px;
      font-weight: 750;
    }

    .primary-module .mission-option {
      min-height: 34px;
      padding: 0 10px;
    }

    .rest-module .mission-option {
      min-height: 30px;
      color: #765018;
      border-color: #ecd9bd;
      background: #fffdf9;
      font-size: 12px;
    }

    .mission-option.active {
      color: #ffffff;
      border-color: var(--brand);
      background: var(--brand);
    }

    .quest-card.mission-option {
      min-height: 0;
      padding: 9px;
      color: inherit;
      background: #ffffff;
      border-color: #dcd8fb;
      font-size: inherit;
      font-weight: inherit;
    }

    .quest-card.mission-option.active {
      color: inherit;
      background: #ffffff;
      border-color: var(--brand);
    }

    .primary,
    .secondary {
      min-height: 38px;
      padding: 0 13px;
      font-size: 14px;
      font-weight: 700;
    }

    .primary {
      color: #ffffff;
      background: var(--brand);
    }

    .secondary {
      color: var(--blue);
      background: var(--blue-soft);
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 13px;
    }

    .messages {
      display: grid;
      align-content: start;
      gap: 10px;
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 2px 2px 18px;
      background: transparent;
    }

    .message {
      padding: 11px 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.55;
      white-space: pre-wrap;
    }

    .message-row {
      display: flex;
      align-items: flex-start;
      gap: 9px;
    }

    .message-row.child-row {
      justify-content: flex-end;
    }

    .message-row.coach-row {
      justify-content: flex-start;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      flex: 0 0 36px;
      border: 1px solid var(--line);
      border-radius: 8px;
      object-fit: cover;
      background: var(--brand-soft);
    }

    .child-row .message {
      max-width: 86%;
    }

    .coach-row .message {
      max-width: calc(86% - 45px);
    }

    .message.child {
      background: var(--brand-soft);
    }

    .message.coach {
      border: 1px solid var(--line);
      background: #ffffff;
    }

    .thinking-dots {
      display: inline-flex;
      gap: 3px;
      padding: 3px 0;
      vertical-align: middle;
    }

    .thinking-dots span {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: var(--muted);
      animation: thinking-pulse 1s infinite ease-in-out;
    }

    .thinking-dots span:nth-child(2) {
      animation-delay: 0.15s;
    }

    .thinking-dots span:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes thinking-pulse {
      0%,
      80%,
      100% {
        opacity: 0.35;
        transform: translateY(0);
      }
      40% {
        opacity: 1;
        transform: translateY(-2px);
      }
    }

    textarea,
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #cfdcd5;
      border-radius: 8px;
      background: #ffffff;
      font-size: 15px;
    }

    textarea {
      min-height: 82px;
      resize: none;
    }

    .composer {
      position: sticky;
      bottom: 0;
      margin-top: 12px;
      padding-top: 8px;
      background: var(--wash);
    }

    .chat-composer {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: auto;
      padding: 7px 0 0;
      border-top: 1px solid var(--line);
      background: var(--wash);
    }

    textarea.chat-input {
      min-height: 38px;
      max-height: 92px;
      padding: 9px 12px;
      border-color: #d6d2ef;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.45;
    }

    .send-icon {
      width: 38px;
      height: 38px;
      flex: 0 0 38px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      color: #ffffff;
      background: var(--brand);
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
    }

    .field {
      display: grid;
      gap: 7px;
      margin-bottom: 13px;
    }

    .field label {
      font-size: 14px;
      font-weight: 800;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
    }

    .metric {
      padding: 13px 8px;
      text-align: center;
    }

    .metric strong {
      display: block;
      color: var(--brand);
      font-size: 26px;
      line-height: 1.15;
    }

    .risk {
      padding: 10px 0;
      border-bottom: 1px solid #edf2ef;
    }

    .risk:last-child {
      border-bottom: 0;
    }

    .risk strong {
      color: var(--amber);
    }

    .bottom-nav {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      padding: 6px 16px 9px;
      border-top: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.96);
    }

    .bottom-nav button {
      min-height: 42px;
      display: grid;
      place-items: center;
      padding: 0;
      color: var(--muted);
      background: transparent;
    }

    .nav-icon {
      width: 22px;
      height: 22px;
      display: block;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .bottom-nav button.active {
      color: var(--brand);
      background: var(--brand-soft);
    }

    .reward-overlay {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 24px;
      pointer-events: none;
      opacity: 0;
      transform: scale(0.94);
      transition: opacity 160ms ease, transform 160ms ease;
    }

    .reward-overlay.show {
      opacity: 1;
      transform: scale(1);
    }

    .reward-panel {
      display: grid;
      justify-items: center;
      gap: 10px;
      padding: 22px 24px 20px;
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 8px;
      background:
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.82), transparent 34%),
        linear-gradient(155deg, rgba(246, 243, 255, 0.96), rgba(226, 244, 255, 0.94));
      box-shadow: 0 26px 70px rgba(36, 33, 58, 0.28);
    }

    .reward-overlay.show .reward-panel {
      animation: reward-pop 760ms cubic-bezier(.2, 1.35, .24, 1) both;
    }

    .reward-medal {
      width: 118px;
      height: 118px;
      display: grid;
      place-items: center;
      border: 7px solid #ffe08a;
      border-radius: 999px;
      color: #31275f;
      background:
        radial-gradient(circle at 36% 28%, #fff9c7, #ffd25f 50%, #f0a928 100%);
      box-shadow:
        inset 0 0 0 5px rgba(255, 255, 255, 0.44),
        0 14px 28px rgba(138, 90, 31, 0.28);
      font-size: 24px;
      font-weight: 950;
      line-height: 1.05;
      text-align: center;
    }

    .reward-points {
      color: var(--brand);
      font-size: 36px;
      font-weight: 950;
      line-height: 1;
    }

    .reward-note {
      color: var(--muted);
      font-size: 13px;
      font-weight: 750;
    }

    @keyframes reward-pop {
      0% {
        opacity: 0;
        transform: translateY(10px) scale(0.72) rotate(-4deg);
      }
      52% {
        opacity: 1;
        transform: translateY(0) scale(1.06) rotate(2deg);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotate(0);
      }
    }

    @media (max-width: 520px) {
      body {
        display: block;
        padding: 0;
        background: var(--wash);
      }

      .phone {
        width: 100%;
        height: 100vh;
        min-height: 0;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="phone">
    <div class="status-bar">
      <span>09:41</span>
      <span class="signal"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    </div>

    <header class="app-header">
      <div class="app-title-row">
        <h1 class="app-title">Star 小宇宙</h1>
        <span class="pill">Hermes ${hermesMode}</span>
      </div>
    </header>

    <main class="screen">
      <section id="home" class="view active">
        <div class="home-hero">
          <div class="hero-kicker">Star 的闯关地图</div>
          <img class="quest-map" src="/assets/quest-map.jpg?v=learning-map-1" alt="闯关地图" />
          <div class="mission-dock">
            <img id="selected-mission-art" class="mission-art" src="/assets/game-english.jpg?v=learning-card-1" alt="" />
            <div>
              <div class="mission-label">已选好</div>
              <div id="selected-mission-title" class="mission-title">单词猜猜看</div>
              <div id="selected-mission-desc" class="mission-desc">听线索，猜英文。</div>
              <div class="button-row">
                <button id="start-mission" class="primary">开始闯关</button>
              </div>
            </div>
          </div>
          <div id="home-playground" class="home-playground" aria-live="polite"></div>
        </div>

        <div class="section">
          <div class="section-head">
            <span class="section-title">学习游戏</span>
          </div>
          <div class="quest-grid">
            <button class="quest-card feature mission-option active" data-kind="word" data-title="单词猜猜看" data-desc="听线索，猜英文。" data-art="/assets/game-english.jpg?v=learning-card-1" data-prompt="盒饭，玩一局猜单词。你给我三个提示，我来猜。猜完帮我造个例句。">
              <img class="quest-card-art" src="/assets/game-english.jpg?v=learning-card-1" alt="" />
              <span class="quest-card-body"><span class="quest-card-title">单词猜猜看</span><span class="quest-card-desc">家庭、朋友、外出主题词</span><span class="quest-card-tags"><span class="quest-card-tag">英语</span><span class="quest-card-tag">连击加分</span></span></span>
            </button>
            <button class="quest-card split mission-option" data-kind="math" data-title="数学换条路" data-desc="一步一步解开。" data-art="/assets/game-math.jpg?v=learning-card-1" data-prompt="盒饭，我想把一道数学题换个思路做。你先问我题目，再带我找两种解法。">
              <span class="quest-card-body"><span class="quest-card-title">数学换条路</span><span class="quest-card-desc">有理数、比例、百分比</span><span class="quest-card-tags"><span class="quest-card-tag">数学</span><span class="quest-card-tag">难度上升</span></span></span>
              <img class="quest-card-art" src="/assets/game-math.jpg?v=learning-card-1" alt="" />
            </button>
            <button class="quest-card scroll mission-option" data-kind="idiom" data-title="诗词小侦探" data-desc="看诗句，抓线索。" data-art="/assets/game-poetry.jpg?v=learning-card-1" data-prompt="盒饭，玩一局诗词小侦探。你给我一句公开古诗词线索，我来猜作者、意象或意思。">
              <span class="quest-card-mark">诗</span>
              <span class="quest-card-body"><span class="quest-card-title">诗词小侦探</span><span class="quest-card-desc">作者、意象、情绪线索</span><span class="quest-card-tags"><span class="quest-card-tag">语文</span><span class="quest-card-tag">观察力</span></span></span>
            </button>
            <button class="quest-card note mission-option" data-kind="mistake" data-title="错题翻盘" data-desc="找错因，再来一题。" data-art="/assets/game-review.jpg?v=learning-card-1" data-prompt="盒饭，我有一道错题想翻盘。你先问我题目和错在哪里，再给我一道类似的小练习。">
              <span class="quest-card-mark">错</span>
              <span class="quest-card-body"><span class="quest-card-title">错题翻盘</span><span class="quest-card-desc">把卡住的地方变成分数</span><span class="quest-card-tags"><span class="quest-card-tag">复盘</span><span class="quest-card-tag">稳一点</span></span></span>
            </button>
            <button class="quest-card mini mission-option" data-kind="reading" data-title="课文找线索" data-desc="找关键词和小秘密。" data-art="/assets/game-poetry.jpg?v=learning-card-1" data-prompt="盒饭，陪我给课文找线索。你先问我课文名，再带我找关键词、中心句和人物变化。">
              <span class="quest-card-mark">读</span>
              <span class="quest-card-body"><span class="quest-card-title">课文找线索</span><span class="quest-card-desc">标题、重复词、人物变化</span><span class="quest-card-tags"><span class="quest-card-tag">阅读</span><span class="quest-card-tag">找证据</span></span></span>
            </button>
            <button class="quest-card mini calm mission-option" data-kind="preview" data-title="明天小预告" data-desc="复习一点，预习一点。" data-art="/assets/game-review.jpg?v=learning-card-1" data-prompt="盒饭，帮我做一个明天小预告。先问我今天学了什么、明天学什么，再排一个短短的复习预习安排。">
              <span class="quest-card-mark">预</span>
              <span class="quest-card-body"><span class="quest-card-title">明天小预告</span><span class="quest-card-desc">给明天留一个小开局</span><span class="quest-card-tags"><span class="quest-card-tag">预习</span><span class="quest-card-tag">轻任务</span></span></span>
            </button>
          </div>
        </div>
      </section>

      <section id="chat" class="view chat-view">
        <div id="messages" class="messages"></div>
        <div class="composer chat-composer">
          <textarea id="chat-input" class="chat-input" maxlength="500" placeholder="问盒饭..."></textarea>
          <button id="send-chat" class="send-icon" aria-label="发送">↑</button>
        </div>
      </section>

      <section id="plan" class="view">
        <div class="section-head">
          <span class="section-title">计划中心</span>
          <button id="regen-plan" class="secondary">生成今日建议</button>
        </div>
        <div id="plan-dashboard"></div>
        <div id="plan-form"></div>
        <div id="plan-list"></div>
      </section>

      <section id="parent" class="view">
        <div class="section-head">
          <span class="section-title">家长观察</span>
          <span class="section-note">摘要视图</span>
        </div>
        <div id="metrics" class="metric-grid"></div>
        <div class="section">
          <article class="card">
            <h3>学习主题</h3>
            <div id="parent-topics"></div>
          </article>
          <article class="card">
            <h3>薄弱点</h3>
            <div id="parent-weak"></div>
          </article>
          <article class="card">
            <h3>风险提醒</h3>
            <div id="parent-risks" class="muted"></div>
          </article>
          <article class="card">
            <h3>隐私边界</h3>
            <div id="privacy-note" class="muted"></div>
          </article>
        </div>
      </section>

      <section id="profile" class="view">
        <div class="section-head">
          <span class="section-title">个人中心</span>
        </div>
        <article class="profile-hero">
          <div class="profile-name">Star 的闯关成绩</div>
          <div class="profile-subtitle">这里只保存学习闯关的分数、等级徽章和最近记录。</div>
          <div class="achievement-grid">
            <div class="achievement-stat">
              <strong id="achievement-score">0</strong>
              <span>总积分</span>
            </div>
            <div class="achievement-stat">
              <strong id="achievement-badges">0</strong>
              <span>点亮</span>
            </div>
            <div class="achievement-stat">
              <strong id="achievement-records">0</strong>
              <span>闯关</span>
            </div>
          </div>
        </article>
        <article class="card bento-shop">
          <div class="bento-head">
            <div>
              <h3>盒饭小店</h3>
              <div class="muted">用闯关积分解锁食材，按顾客要求装盒饭。</div>
            </div>
            <div class="bento-wallet">可用积分<strong id="bento-wallet">0</strong></div>
          </div>
          <div id="bento-game"></div>
        </article>
        <article class="card">
          <h3>我的徽章</h3>
          <div id="badge-list" class="badge-grid"></div>
        </article>
        <article class="card">
          <h3>最近闯关</h3>
          <div id="record-list" class="record-list"></div>
        </article>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="主导航">
      <button class="active" data-view-button="home" aria-label="首页" title="首页">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h5v-5h3v5h5v-9.5" /></svg>
      </button>
      <button data-view-button="chat" aria-label="对话" title="对话">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14v9H8l-3 3v-12Z" /><path d="M8.5 10h7" /><path d="M8.5 13h4.5" /></svg>
      </button>
      <button data-view-button="plan" aria-label="计划" title="计划">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4" /><path d="M17 3v4" /><path d="M4.5 8h15" /><path d="M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="m8 14 2 2 5-5" /></svg>
      </button>
      <button data-view-button="profile" aria-label="个人中心" title="个人中心">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /><path d="m16.5 14.5 1.2 2.4 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4 1.2-2.4Z" /></svg>
      </button>
    </nav>
    <div id="reward-overlay" class="reward-overlay" aria-live="polite" aria-hidden="true">
      <div class="reward-panel">
        <div class="reward-medal">答对了</div>
        <div id="reward-points" class="reward-points">+1 分</div>
        <div id="reward-note" class="reward-note">积分到账</div>
      </div>
    </div>
  </div>

  <script>
    const state = {
      profile: null,
      plan: [],
      planItems: [],
      achievements: null,
      selectedMission: {
        kind: 'word',
        title: '单词猜猜看',
        desc: '听线索，猜英文。',
        prompt: '盒饭，玩一局猜单词。你给我三个提示，我来猜。猜完帮我造个例句。',
        art: '/assets/game-english.jpg?v=learning-card-1'
      },
      homePlaygroundOpen: false,
      gameState: {},
      bento: null,
      jokeIndex: 0,
      messages: [
        {
          role: 'coach',
          text: 'Star，我来啦。今天想先玩一小局，还是先看看哪儿卡住了？你说一句，我跟上。'
        }
      ]
    };

    const PLAN_KEY = 'hefan-star-plan-center-v1';
    const PLAN_TYPES = [
      { key: 'learning', label: '学习', mark: '学' },
      { key: 'sport', label: '运动', mark: '动' },
      { key: 'music', label: '音乐', mark: '乐' },
      { key: 'habit', label: '习惯', mark: '习' }
    ];

    const EXTRA_PLAN_ITEMS = [
      {
        id: 'sport-basketball-footwork',
        type: 'sport',
        title: '篮球脚步 12 分钟',
        minutes: 12,
        status: 'todo',
        reason: '',
        steps: ['热身 2 分钟', '低重心移动 6 组', '记一个今天最稳的动作']
      }
    ];
    const REMOVED_DEMO_PLAN_IDS = [
      'learning-api-1',
      'learning-api-2',
      'music-rhythm-practice',
      'habit-bedtime-bag'
    ];

    const playCards = {
      word: {
        kicker: '英语小游戏',
        title: '猜这个词',
        question: '它是一种水果，常见红色或绿色。英文里常说：an ___ a day。',
        answers: ['apple', '苹果'],
        success: '对啦，是 apple。试试说一句：I like apples.',
        retry: '很接近了。再想想，老师常说“一天一个 ___”。',
        prompt: '盒饭，我想继续玩猜单词。你给我一个新词和三个提示。'
      },
      idiom: {
        kicker: '语文小游戏',
        title: '看诗句抓线索',
        question: '“春色满园关不住”的下一句是？',
        answers: ['一枝红杏出墙来'],
        success: '对，是“一枝红杏出墙来”。',
        retry: '想想春天里从墙边探出来的是什么花枝。',
        prompt: '盒饭，我想继续玩诗词小侦探。你再给我一句公开古诗词线索。'
      },
      math: {
        kicker: '数学小关卡',
        title: '换个想法算',
        question: '36 个篮球平均放进 6 个筐，每个筐放几个？',
        answers: ['6', '六'],
        success: '答对。可以想成 6 个筐一轮一轮放，放 6 轮正好 36 个。',
        retry: '先想 6 乘几等于 36。找到那个数就行。',
        steps: ['看已知：一共有 36 个，分成 6 份。', '找关系：每份数量 = 总数 ÷ 份数。', '换想法：几个 6 能凑成 36？'],
        prompt: '盒饭，我有一道数学题想换个思路做。你先问我题目，再给我两个想法。'
      },
      mistake: {
        kicker: '错题翻盘',
        title: '先抓住错因',
        question: '把错题用一句话写在这里，比如“分数乘法算错了”。',
        notePlaceholder: '这道题我错在...',
        steps: ['圈出变错的那一步。', '写一句“下次我要先检查什么”。', '马上做一道相似小题，确认真的会了。'],
        prompt: '盒饭，我有一道错题想翻盘。你先问我题目和错在哪里。'
      },
      reading: {
        kicker: '阅读小雷达',
        title: '找课文线索',
        question: '先写课文名，盒饭给你一个找线索的顺序。',
        notePlaceholder: '课文名...',
        steps: ['先找人物或事物。', '再找重复出现的关键词。', '最后看结尾有没有点题句。'],
        prompt: '盒饭，陪我给课文找线索。你先问我课文名。'
      },
      preview: {
        kicker: '明天小预告',
        title: '轻轻看一眼明天',
        question: '不用做多，先给明天留三件小事。',
        steps: ['复习今天最容易忘的一点。', '预习明天标题和例题。', '准备一个想问老师的问题。'],
        prompt: '盒饭，帮我做一个明天小预告。先问我今天学了什么、明天学什么。'
      },
      basketball: {
        kicker: '篮球一招',
        title: '今天练低运球',
        question: '30 秒一组，球不要高过膝盖，眼睛尽量看前方。',
        steps: ['右手 30 秒。', '左手 30 秒。', '左右手各 10 下换一次。'],
        prompt: '盒饭，我想练一个篮球动作。你先问我想练哪类，再分成容易跟的几步。'
      },
      dance: {
        kicker: '街舞一拍',
        title: '先跟 8 拍',
        question: '跟着口令试一次：下、停、上、停，右、左、右、停。',
        steps: ['先只做脚步。', '再加肩膀。', '最后跟着 8 拍连起来。'],
        prompt: '盒饭，我想练一小段街舞。你先从一个简单节奏开始带我练。'
      },
      workout: {
        kicker: '15 分钟动一动',
        title: '轻量运动局',
        question: '今天不拼狠，动起来就赢。',
        steps: ['热身 3 分钟：开合跳和肩绕环。', '主练 9 分钟：深蹲、平板支撑、原地高抬腿。', '收尾 3 分钟：拉伸腿和肩。'],
        prompt: '盒饭，今天我想动一动。帮我选一个 15 分钟的小练习。'
      },
      guitar: {
        kicker: '音乐小练习',
        title: '吉他换弦慢慢切',
        question: '先用 C 和 G 来回换，慢一点也没关系。',
        steps: ['先按好 C，数 1、2、3、4。', '换到 G，手指尽量一起走。', '每换一次，只扫一下弦。'],
        prompt: '盒饭，我想练吉他换弦。你先问我会哪些和弦。'
      },
      drum: {
        kicker: '节奏口令',
        title: '咚 哒 咚哒',
        question: '先念口令：咚、哒、咚咚、哒。念顺了再敲桌面。',
        steps: ['咚 = 右手敲低音。', '哒 = 左手轻敲。', '先慢 4 遍，再快一点 4 遍。'],
        prompt: '盒饭，我想练架子鼓节奏。你用简单口令带我过一遍基础鼓点。'
      },
      beat: {
        kicker: '听拍子',
        title: '猜强弱',
        question: '如果节奏是“强 弱 弱，强 弱 弱”，这更像几拍子？',
        answers: ['三拍子', '3拍子', '3/4', '三'],
        success: '对，更像三拍子。像“强弱弱、强弱弱”这样转起来。',
        retry: '数一数，从一个“强”到下一个“强”中间有几下。',
        prompt: '盒饭，陪我玩听拍子。你用文字描述一个节奏，我来猜强弱和拍子。'
      },
      joke: {
        kicker: '笑一笑',
        title: '短短一条',
        question: '为什么数学书总是不开心？因为它有太多问题。',
        prompt: '盒饭，来一个适合小学生的冷笑话，短一点。'
      },
      story: {
        kicker: '小段子',
        title: '轻松 20 秒',
        question: '篮球说：“我今天压力好大。”地板说：“没事，你每次都能弹回来。”',
        prompt: '盒饭，讲一个干净有趣的小段子，最好和学习或运动有关。'
      },
      riddle: {
        kicker: '急转弯',
        title: '先猜再看',
        question: '什么东西越洗越脏？',
        answers: ['水'],
        success: '对，是水。洗东西时，脏东西都进水里了。',
        retry: '想想洗衣服、洗手之后，谁变脏了？',
        prompt: '盒饭，出一道适合小学生的脑筋急转弯。先只给题目。'
      }
    };

    let rewardTimer = null;

    const questionBanks = {
      word: [
        {
          kicker: '英语第 1 关',
          title: '家庭成员',
          question: 'Your father’s or mother’s brother is your ___.',
          answers: ['uncle', '叔叔', '舅舅', '伯伯'],
          success: '对，是 uncle。family 主题里这个词很常见。',
          retry: '想想爸爸或妈妈的兄弟，英文怎么说？',
          steps: ['先看关系：父母的兄弟。', '再想 family 里的称呼。', '最后读一遍：my uncle。']
        },
        {
          kicker: '英语第 2 关',
          title: '好朋友',
          question: 'A good friend is usually kind and ___. 线索：愿意帮忙。',
          answers: ['helpful', '乐于助人的', '愿意帮忙的'],
          success: '对，是 helpful。可以说：He is helpful.',
          retry: 'help 是“帮助”，这个形容词怎么变？'
        },
        {
          kicker: '英语第 3 关',
          title: '一天外出',
          question: 'We can see old things and learn history there. It is a ___.',
          answers: ['museum', '博物馆'],
          success: '对，是 museum。spend a day out 可以去 museum。',
          retry: '线索是 old things 和 history。'
        },
        {
          kicker: '英语第 4 关',
          title: '出行方式',
          question: 'If a place is near, we can go there on ___.',
          answers: ['foot', '脚', '步行'],
          success: '对，是 foot。on foot 就是“步行”。',
          retry: '不是 by bus，也不是 by bike。想想“步行”的固定搭配。'
        },
        {
          kicker: '英语第 5 关',
          title: '频率副词',
          question: 'I ___ play basketball after school. 线索：经常。',
          answers: ['often', '经常'],
          success: '对，是 often。它常放在实义动词前面。',
          retry: 'usually、often、always 里，哪个最像“经常”？'
        },
        {
          kicker: '英语第 6 关',
          title: '过去时间',
          question: 'I went to the park ___. 线索：昨天。',
          answers: ['yesterday', '昨天'],
          success: '对，是 yesterday。看到 went，就要留意过去时间。',
          retry: 'went 是过去式，时间线索也要回到过去。'
        },
        {
          kicker: '英语第 7 关',
          title: '地点介词',
          question: 'The book is ___ the desk. 线索：在桌子上。',
          answers: ['on', '在上面'],
          success: '对，是 on。on the desk = 在桌子上。',
          retry: 'in 是里面，under 是下面。桌面上用哪个？'
        },
        {
          kicker: '英语第 8 关',
          title: '兴趣表达',
          question: 'Star likes music. He can ___ the piano.',
          answers: ['play', '弹', '演奏'],
          success: '对，是 play。play the piano 要加 the。',
          retry: '球类也用 play，乐器也常用 play。'
        }
      ],
      idiom: [
        {
          kicker: '诗词第 1 关',
          title: '诗人是谁',
          question: '“千磨万击还坚劲，任尔东西南北风。”这首《竹石》的作者是谁？',
          answers: ['郑燮', '郑板桥'],
          success: '对，是郑燮，也叫郑板桥。这句写的是竹子的坚韧。',
          retry: '这位诗人也叫郑板桥。'
        },
        {
          kicker: '诗词第 2 关',
          title: '下一句',
          question: '“春色满园关不住”的下一句是？',
          answers: ['一枝红杏出墙来'],
          success: '对，是“一枝红杏出墙来”。画面一下就亮了。',
          retry: '想想春天里从墙边探出来的是什么花枝。'
        },
        {
          kicker: '诗词第 3 关',
          title: '抓意象',
          question: '“明月几时有，把酒问青天。”这里最明显的意象是什么？',
          answers: ['明月', '月亮', '月'],
          success: '对，是明月。抓住意象，理解诗就容易多了。',
          retry: '先找这句里最亮、最像画面的那个词。'
        },
        {
          kicker: '诗词第 4 关',
          title: '判断季节',
          question: '“接天莲叶无穷碧，映日荷花别样红。”写的是哪个季节？',
          answers: ['夏天', '夏季', '夏'],
          success: '对，是夏天。莲叶、荷花就是关键线索。',
          retry: '荷花最常和哪个季节联系在一起？'
        },
        {
          kicker: '诗词第 5 关',
          title: '看情绪',
          question: '“劝君更尽一杯酒，西出阳关无故人。”这两句更像在表达什么心情？',
          answers: ['送别', '离别', '不舍', '惜别'],
          success: '对，是送别时的不舍。先抓“阳关”和“无故人”。',
          retry: '朋友要去远方，诗人在劝他再喝一杯。'
        },
        {
          kicker: '诗词第 6 关',
          title: '诗句出处',
          question: '“粉骨碎身浑不怕，要留清白在人间。”出自哪首诗？',
          answers: ['石灰吟'],
          success: '对，是《石灰吟》。这类题先抓“清白”这个关键词。',
          retry: '题目和“石灰”有关，诗名三个字。'
        },
        {
          kicker: '诗词第 7 关',
          title: '修辞小眼睛',
          question: '“飞流直下三千尺，疑是银河落九天。”这里主要用了夸张还是反问？',
          answers: ['夸张'],
          success: '对，是夸张。三千尺让瀑布显得特别有气势。',
          retry: '想想“三千尺”是不是故意把感觉放大了。'
        },
        {
          kicker: '诗词第 8 关',
          title: '关键词',
          question: '“山重水复疑无路，柳暗花明又一村。”哪两个字最能表示“转机出现”？',
          answers: ['又一村', '柳暗花明'],
          success: '对，“柳暗花明”就是从困难里看见新路。',
          retry: '前半句像没路了，后半句突然出现了什么？'
        }
      ],
      math: [
        {
          kicker: '数学第 1 关',
          title: '数轴距离',
          question: '数轴上 -3 到 2 的距离是多少？',
          answers: ['5', '五'],
          success: '对。2 - (-3) = 5，也可以数格子。',
          retry: '从 -3 走到 0 是 3 格，从 0 走到 2 是 2 格。',
          steps: ['先画数轴。', '分段数：到 0，再到 2。', '把两段加起来。']
        },
        {
          kicker: '数学第 2 关',
          title: '相反数',
          question: '-7 的相反数是多少？',
          answers: ['7', '+7', '七'],
          success: '对。相反数只看方向相反，距离 0 一样远。',
          retry: '一个在 0 的左边 7 格，另一个就在右边 7 格。'
        },
        {
          kicker: '数学第 3 关',
          title: '比例未知数',
          question: '2:5 = 8:x，x 等于多少？',
          answers: ['20', '二十'],
          success: '对。2 变 8 是乘 4，所以 5 也乘 4 得 20。',
          retry: '先看 2 到 8 放大了几倍。'
        },
        {
          kicker: '数学第 4 关',
          title: '百分比',
          question: '80 的 25% 是多少？',
          answers: ['20', '二十'],
          success: '对。25% 是四分之一，80 ÷ 4 = 20。',
          retry: '25% 可以先想成 1/4。'
        },
        {
          kicker: '数学第 5 关',
          title: '百分比应用',
          question: '一件 200 元的球衣打 8 折，现价是多少元？',
          answers: ['160', '160元', '一百六十'],
          success: '对。8 折就是 80%，200 × 80% = 160。',
          retry: '8 折不是减 8 元，而是按原价的 80% 算。'
        },
        {
          kicker: '数学第 6 关',
          title: '圆的周长',
          question: '半径 3 cm 的圆，周长是多少？用 π 表示。',
          answers: ['6π', '6pi', '6πcm', '6π厘米'],
          success: '对。圆周长 C = 2πr，所以是 6π cm。',
          retry: '周长公式是 C = 2πr，r = 3。'
        },
        {
          kicker: '数学第 7 关',
          title: '圆的面积',
          question: '半径 4 cm 的圆，面积是多少？用 π 表示。',
          answers: ['16π', '16pi', '16πcm²', '16π平方厘米'],
          success: '对。面积 S = πr²，所以是 16π 平方厘米。',
          retry: '面积公式是 πr²，4 的平方是多少？'
        },
        {
          kicker: '数学第 8 关',
          title: '可能性',
          question: '袋子里有 2 个红球、3 个蓝球，随机摸 1 个，摸到红球的可能性是？',
          answers: ['2/5', '五分之二', '0.4', '40%'],
          success: '对。红球 2 个，总数 5 个，所以是 2/5。',
          retry: '先算总球数，再看红球占几份。'
        }
      ],
      mistake: [
        {
          kicker: '错题第 1 关',
          title: '有理数符号',
          question: '写下这道错题最可能错在：符号、运算顺序、还是抄错数？',
          notePlaceholder: '我这次错在...',
          steps: ['先圈出第一个变错的位置。', '再判断是不是正负号。', '最后写一句下次检查点。']
        },
        {
          kicker: '错题第 2 关',
          title: '百分比单位',
          question: '百分比题先找“单位 1”。把你题里的单位 1 写出来。',
          notePlaceholder: '单位 1 是...',
          steps: ['先找“谁的百分之几”。', '单位 1 通常在“的”前面。', '不确定就把原句读慢一点。']
        },
        {
          kicker: '错题第 3 关',
          title: '圆的公式',
          question: '这题用的是圆周长还是圆面积？写下你选的公式。',
          notePlaceholder: '我选的公式是...',
          steps: ['问“边上一圈”就是周长。', '问“里面大小”就是面积。', '先写公式，再代数字。']
        },
        {
          kicker: '错题第 4 关',
          title: '英语句型',
          question: '把英语错句里的动词圈出来，写下它是不是过去式。',
          notePlaceholder: '动词是...，时态是...',
          steps: ['先找动词。', '再看 yesterday、last 这类时间词。', '最后检查动词形式。']
        }
      ],
      reading: [
        {
          kicker: '阅读第 1 关',
          title: '看标题',
          question: '写下课文标题里最重要的一个词，再猜它可能写什么。',
          notePlaceholder: '关键词是...，我猜...',
          steps: ['标题常常藏着中心。', '先找名词或动词。', '猜错也没关系，读完再改。']
        },
        {
          kicker: '阅读第 2 关',
          title: '找重复词',
          question: '读一段课文，找一个重复出现或反复强调的词。',
          notePlaceholder: '重复词是...',
          steps: ['重复词通常很重要。', '可以是人物、地点、动作或心情。', '把它和标题放在一起想。']
        },
        {
          kicker: '阅读第 3 关',
          title: '抓变化',
          question: '人物或事情前后有什么变化？写一句。',
          notePlaceholder: '变化是...',
          steps: ['先看开头。', '再看结尾。', '比较中间发生了什么。']
        },
        {
          kicker: '阅读第 4 关',
          title: '诗句画面',
          question: '选一句古诗词，写下你脑子里出现的一个画面。',
          notePlaceholder: '我看到的画面是...',
          steps: ['先找景物词。', '再加颜色、声音或动作。', '最后说这句带来的感觉。']
        }
      ],
      preview: [
        {
          kicker: '预习第 1 关',
          title: '语文预习',
          question: '明天的课文标题里，你最不懂或最想问的词是哪一个？',
          notePlaceholder: '我不懂...',
          steps: ['先不急着查答案。', '把问题留下来。']
        },
        {
          kicker: '预习第 2 关',
          title: '数学预习',
          question: '看一个数学例题，写下它第一步在做什么。',
          notePlaceholder: '第一步是...',
          steps: ['只看第一步。', '看不懂也可以照着描述。']
        },
        {
          kicker: '预习第 3 关',
          title: '英语预习',
          question: '从明天的英语单词里挑 1 个，写下你猜的中文意思。',
          notePlaceholder: '我猜...是...',
          steps: ['先看图片或例句。', '猜意思。', '上课再验证。']
        },
        {
          kicker: '预习第 4 关',
          title: '准备问题',
          question: '给明天课堂准备一个真正想问的问题。',
          notePlaceholder: '我想问...',
          steps: ['问题越具体越好。', '上课听到答案就勾掉。']
        }
      ]
    };

    function el(id) {
      return document.getElementById(id);
    }

    async function api(path, options) {
      const response = await fetch(path, {
        method: options && options.method ? options.method : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-role': options && options.role ? options.role : 'child',
          'x-child-id': 'demo-child'
        },
        body: options && options.body ? JSON.stringify(options.body) : undefined
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        throw new Error(data.detail || '请求失败，请稍后再试。');
      }
      return data;
    }

    function showView(name) {
      document.querySelectorAll('.view').forEach(function (node) {
        node.classList.toggle('active', node.id === name);
      });
      document.querySelectorAll('[data-view-button]').forEach(function (node) {
        node.classList.toggle('active', node.dataset.viewButton === name);
      });
      el('messages').scrollTop = el('messages').scrollHeight;
      if (name === 'parent') loadParentSummary();
      if (name === 'profile') renderAchievements();
    }

    function renderTags(containerId, items) {
      el(containerId).innerHTML = (items || [])
        .map(function (item) { return '<span class="tag">' + item + '</span>'; })
        .join('') || '<span class="muted">暂无</span>';
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    const ACHIEVEMENT_KEY = 'hefan-star-achievements-v2';
    const BADGE_FAMILIES = [
      { kind: 'word', title: '单词闪电', icon: '词' },
      { kind: 'idiom', title: '诗词侦探', icon: '诗' },
      { kind: 'math', title: '数学换路', icon: '数' },
      { kind: 'mistake', title: '错题翻盘', icon: '错' },
      { kind: 'reading', title: '阅读雷达', icon: '读' },
      { kind: 'preview', title: '预习小队长', icon: '预' }
    ];
    const BADGE_LEVELS = [
      { key: 'starter', name: '星芽', target: 3 },
      { key: 'bronze', name: '铜星', target: 10 },
      { key: 'silver', name: '银月', target: 25 },
      { key: 'gold', name: '金冠', target: 50 },
      { key: 'crystal', name: '水晶', target: 90 },
      { key: 'galaxy', name: '星耀', target: 150 }
    ];
    const BENTO_KEY = 'hefan-star-bento-v1';
    const BENTO_INGREDIENTS = [
      { key: 'rice', name: '大米饭', mark: '饭', price: 3, level: 1, asset: '/assets/food-rice.png?v=bento-food-1' },
      { key: 'cabbage', name: '白菜', mark: '菜', price: 8, level: 2, asset: '/assets/food-cabbage.png?v=bento-food-1' },
      { key: 'drumstick', name: '鸡腿', mark: '腿', price: 15, level: 3, asset: '/assets/food-drumstick.png?v=bento-food-1' },
      { key: 'egg', name: '煎蛋', mark: '蛋', price: 28, level: 4, asset: '/assets/food-egg.png?v=bento-food-1' },
      { key: 'corn', name: '玉米', mark: '玉', price: 45, level: 5, asset: '/assets/food-corn.png?v=bento-food-1' },
      { key: 'shrimp', name: '虾仁', mark: '虾', price: 70, level: 6, asset: '/assets/food-shrimp.png?v=bento-food-1' }
    ];
    const BENTO_CUSTOMERS = [
      { key: 'momo', name: '墨墨', request: ['rice', 'cabbage'], note: '今天想要清爽一点。' },
      { key: 'dada', name: '达达', request: ['rice', 'drumstick'], note: '练完球，想吃有力气的。' },
      { key: 'nana', name: '娜娜', request: ['rice', 'egg', 'corn'], note: '想要金色盒饭。' }
    ];
    const BENTO_BASE_CAPACITY = 2;
    const BENTO_MAX_CAPACITY_LEVEL = 10;
    const BENTO_MAX_CAPACITY = 11;
    const BENTO_CAPACITY_UPGRADE_PRICES = [6, 12, 20, 32, 48, 70, 96, 128, 165];

    function emptyAchievements() {
      return {
        totalScore: 0,
        badges: [],
        records: [],
        bestScores: {},
        scoreByKind: {}
      };
    }

    function loadAchievements() {
      try {
        const raw = localStorage.getItem(ACHIEVEMENT_KEY);
        if (!raw) return emptyAchievements();
        const saved = JSON.parse(raw);
        return {
          totalScore: Number(saved.totalScore) || 0,
          badges: Array.isArray(saved.badges) ? saved.badges : [],
          records: Array.isArray(saved.records) ? saved.records : [],
          bestScores: saved.bestScores && typeof saved.bestScores === 'object' ? saved.bestScores : {},
          scoreByKind: saved.scoreByKind && typeof saved.scoreByKind === 'object' ? saved.scoreByKind : {}
        };
      } catch (error) {
        return emptyAchievements();
      }
    }

    function saveAchievements() {
      try {
        localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(state.achievements || emptyAchievements()));
      } catch (error) {
        // Local storage can be unavailable in private contexts; the game still works for this session.
      }
    }

    function todayKey() {
      const date = new Date();
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function emptyBento() {
      return {
        spentPoints: 0,
        capacityLevel: 1,
        unlocked: [],
        lunchbox: [],
        servedToday: [],
        servedDate: todayKey(),
        feedback: '空盒饭准备好了，先用积分解锁大米饭。'
      };
    }

    function normalizeBento(saved) {
      const stateValue = saved && typeof saved === 'object' ? saved : emptyBento();
      const currentDay = todayKey();
      const capacityLevel = clampBentoCapacityLevel(stateValue.capacityLevel);
      return {
        spentPoints: Number(stateValue.spentPoints) || 0,
        capacityLevel: capacityLevel,
        unlocked: Array.isArray(stateValue.unlocked) ? stateValue.unlocked : [],
        lunchbox: Array.isArray(stateValue.lunchbox) ? stateValue.lunchbox.slice(0, bentoCapacity(capacityLevel)) : [],
        servedToday: stateValue.servedDate === currentDay && Array.isArray(stateValue.servedToday) ? stateValue.servedToday : [],
        servedDate: currentDay,
        feedback: stateValue.feedback || '空盒饭准备好了，先用积分解锁大米饭。'
      };
    }

    function loadBento() {
      try {
        const raw = localStorage.getItem(BENTO_KEY);
        return normalizeBento(raw ? JSON.parse(raw) : null);
      } catch (error) {
        return emptyBento();
      }
    }

    function saveBento() {
      try {
        localStorage.setItem(BENTO_KEY, JSON.stringify(state.bento || emptyBento()));
      } catch (error) {
        // The shop can still work in memory for this session.
      }
    }

    function ingredientByKey(key) {
      return BENTO_INGREDIENTS.find(function (item) { return item.key === key; });
    }

    function clampBentoCapacityLevel(value) {
      const level = Number(value) || 1;
      return Math.max(1, Math.min(BENTO_MAX_CAPACITY_LEVEL, level));
    }

    function bentoCapacity(level) {
      return Math.min(BENTO_MAX_CAPACITY, BENTO_BASE_CAPACITY + clampBentoCapacityLevel(level) - 1);
    }

    function bentoUpgradePrice(level) {
      const currentLevel = clampBentoCapacityLevel(level);
      if (currentLevel >= BENTO_MAX_CAPACITY_LEVEL) return 0;
      return BENTO_CAPACITY_UPGRADE_PRICES[currentLevel - 1] || 0;
    }

    function availableBentoPoints() {
      const achievements = state.achievements || emptyAchievements();
      const bento = state.bento || emptyBento();
      return Math.max(0, (Number(achievements.totalScore) || 0) - (Number(bento.spentPoints) || 0));
    }

    function canUnlockIngredient(item) {
      const bento = state.bento || emptyBento();
      if (item.level <= 1) return true;
      const previous = BENTO_INGREDIENTS[item.level - 2];
      return Boolean(previous && bento.unlocked.includes(previous.key));
    }

    function requestText(request) {
      return request.map(function (key) {
        const item = ingredientByKey(key);
        return item ? item.name : key;
      }).join(' + ');
    }

    function customerReady(customer) {
      const bento = state.bento || emptyBento();
      return customer.request.every(function (key) {
        return bento.lunchbox.includes(key);
      });
    }

    function renderBentoPiece(key) {
      const item = ingredientByKey(key);
      if (!item) return '<div class="bento-slot">空</div>';
      return '<div class="bento-piece ' + item.key + '"><img class="food-image" src="' + item.asset + '" alt="" /></div>';
    }

    function renderCapacityUpgrade() {
      const bento = state.bento || emptyBento();
      const level = clampBentoCapacityLevel(bento.capacityLevel);
      const capacity = bentoCapacity(level);
      const maxed = level >= BENTO_MAX_CAPACITY_LEVEL;
      const price = bentoUpgradePrice(level);
      const affordable = availableBentoPoints() >= price;
      const disabled = maxed || !affordable;
      const label = maxed ? '已满级' : (affordable ? price + ' 分升级' : '积分不足');
      return [
        '<div class="bento-upgrade-card">',
        '<div>',
        '<div class="upgrade-title">饭盒容量 Lv.' + level + '</div>',
        '<div class="upgrade-meta">现在 ' + capacity + ' 格' + (maxed ? ' · 最多 11 格' : ' · 下一级 ' + bentoCapacity(level + 1) + ' 格') + '</div>',
        '</div>',
        '<button class="bento-buy" data-bento-action="upgrade"' + (disabled ? ' disabled' : '') + '>' + label + '</button>',
        '</div>'
      ].join('');
    }

    function renderLunchbox() {
      const bento = state.bento || emptyBento();
      const level = clampBentoCapacityLevel(bento.capacityLevel);
      const capacity = bentoCapacity(level);
      const slots = Array.from({ length: capacity }, function (_, index) {
        return bento.lunchbox[index] ? renderBentoPiece(bento.lunchbox[index]) : '<div class="bento-slot">空</div>';
      }).join('');
      return [
        '<div class="bento-stage">',
        renderCapacityUpgrade(),
        '<div class="lunchbox">',
        '<div class="lunchbox-title">空盒饭 · ' + capacity + ' 格</div>',
        '<div class="bento-slots">' + slots + '</div>',
        '</div>',
        '<div class="bento-actions">',
        BENTO_INGREDIENTS.filter(function (item) { return bento.unlocked.includes(item.key); }).map(function (item) {
          return '<button class="bento-action" data-bento-action="add" data-ingredient="' + item.key + '">装' + escapeHtml(item.name) + '</button>';
        }).join(''),
        '<button class="bento-action" data-bento-action="clear">清空盒饭</button>',
        '</div>',
        '</div>'
      ].join('');
    }

    function renderIngredientShop() {
      const bento = state.bento || emptyBento();
      const available = availableBentoPoints();
      return '<div class="ingredient-shop">' + BENTO_INGREDIENTS.map(function (item) {
        const unlocked = bento.unlocked.includes(item.key);
        const canStep = canUnlockIngredient(item);
        const affordable = available >= item.price;
        const disabled = unlocked || !canStep || !affordable;
        const label = unlocked ? '已解锁' : (!canStep ? '先解锁上一级' : (affordable ? item.price + ' 分解锁' : '积分不足'));
        return [
          '<div class="ingredient-card ' + (unlocked ? 'unlocked' : 'locked') + '">',
          '<div class="ingredient-icon"><img class="food-image" src="' + item.asset + '" alt="" /></div>',
          '<div><div class="ingredient-name">' + escapeHtml(item.name) + '</div><div class="ingredient-meta">等级 ' + item.level + ' · 价格 ' + item.price + ' 分</div></div>',
          '<button class="bento-buy" data-bento-action="buy" data-ingredient="' + item.key + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button>',
          '</div>'
        ].join('');
      }).join('') + '</div>';
    }

    function renderCustomers() {
      const bento = state.bento || emptyBento();
      return '<div class="customer-list">' + BENTO_CUSTOMERS.map(function (customer) {
        const served = bento.servedToday.includes(customer.key);
        const ready = customerReady(customer);
        return [
          '<div class="customer-card">',
          '<div class="customer-icon">' + escapeHtml(customer.name.slice(0, 1)) + '</div>',
          '<div><div class="customer-name">' + escapeHtml(customer.name) + '</div><div class="customer-request">' + escapeHtml(customer.note) + '<br />要：' + escapeHtml(requestText(customer.request)) + '</div></div>',
          '<button class="bento-serve" data-bento-action="serve" data-customer="' + customer.key + '"' + (served || !ready ? ' disabled' : '') + '>' + (served ? '已完成' : '包装') + '</button>',
          '</div>'
        ].join('');
      }).join('') + '</div>';
    }

    function renderBentoGame() {
      const root = el('bento-game');
      if (!root) return;
      const bento = state.bento || emptyBento();
      el('bento-wallet').textContent = availableBentoPoints();
      root.innerHTML = [
        renderLunchbox(),
        '<div class="bento-feedback">' + escapeHtml(bento.feedback) + '</div>',
        '<h3 style="margin-top:14px">食材解锁</h3>',
        renderIngredientShop(),
        '<h3 style="margin-top:14px">今日顾客</h3>',
        renderCustomers()
      ].join('');
    }

    function buyBentoIngredient(key) {
      const item = ingredientByKey(key);
      if (!item) return;
      const bento = state.bento || emptyBento();
      if (bento.unlocked.includes(key)) return;
      if (!canUnlockIngredient(item)) {
        bento.feedback = '先把前一级食材解锁，再开这一层。';
      } else if (availableBentoPoints() < item.price) {
        bento.feedback = '积分还不够，去闯几关再来。';
      } else {
        bento.unlocked.push(key);
        bento.spentPoints += item.price;
        bento.feedback = item.name + ' 解锁了，盒饭更像样了。';
      }
      state.bento = bento;
      saveBento();
      renderBentoGame();
    }

    function addBentoIngredient(key) {
      const item = ingredientByKey(key);
      const bento = state.bento || emptyBento();
      if (!item || !bento.unlocked.includes(key)) return;
      const capacity = bentoCapacity(bento.capacityLevel);
      if (bento.lunchbox.length >= capacity) {
        bento.feedback = '盒饭已经满了，升级容量或先包装。';
      } else {
        bento.lunchbox.push(key);
        bento.feedback = item.name + ' 装进盒饭了。';
      }
      state.bento = bento;
      saveBento();
      renderBentoGame();
    }

    function clearBento() {
      const bento = state.bento || emptyBento();
      bento.lunchbox = [];
      bento.feedback = '盒饭清空了，可以重新装。';
      state.bento = bento;
      saveBento();
      renderBentoGame();
    }

    function serveBentoCustomer(key) {
      const customer = BENTO_CUSTOMERS.find(function (item) { return item.key === key; });
      if (!customer) return;
      const bento = state.bento || emptyBento();
      if (bento.servedToday.includes(key)) return;
      if (!customerReady(customer)) {
        bento.feedback = customer.name + ' 还缺：' + requestText(customer.request.filter(function (item) { return !bento.lunchbox.includes(item); }));
      } else {
        bento.servedToday.push(key);
        bento.lunchbox = [];
        bento.feedback = customer.name + ' 的盒饭包装好了。下一位顾客来了。';
      }
      state.bento = bento;
      saveBento();
      renderBentoGame();
    }

    function upgradeBentoCapacity() {
      const bento = state.bento || emptyBento();
      const level = clampBentoCapacityLevel(bento.capacityLevel);
      if (level >= BENTO_MAX_CAPACITY_LEVEL) {
        bento.feedback = '饭盒已经满级，最多 11 格。';
      } else {
        const price = bentoUpgradePrice(level);
        if (availableBentoPoints() < price) {
          bento.feedback = '升级饭盒的积分还不够。';
        } else {
          bento.capacityLevel = level + 1;
          bento.spentPoints += price;
          bento.feedback = '饭盒升到 Lv.' + bento.capacityLevel + '，现在有 ' + bentoCapacity(bento.capacityLevel) + ' 格。';
        }
      }
      state.bento = bento;
      saveBento();
      renderBentoGame();
    }

    function handleBentoAction(target) {
      const action = target.dataset.bentoAction;
      if (action === 'buy') buyBentoIngredient(target.dataset.ingredient);
      if (action === 'add') addBentoIngredient(target.dataset.ingredient);
      if (action === 'clear') clearBento();
      if (action === 'serve') serveBentoCustomer(target.dataset.customer);
      if (action === 'upgrade') upgradeBentoCapacity();
    }

    function formatDate(value) {
      const date = value ? new Date(value) : new Date();
      return String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0');
    }

    function addAchievementRecord(kind, game, totalLevels) {
      if (game.saved) return;
      const achievements = state.achievements || emptyAchievements();
      const badge = rewardName(kind);
      const record = {
        kind: kind,
        title: state.selectedMission.title,
        score: game.score,
        streak: game.streak,
        badge: badge,
        totalLevels: totalLevels,
        completedAt: new Date().toISOString()
      };
      achievements.totalScore += game.score;
      achievements.scoreByKind[kind] = (Number(achievements.scoreByKind[kind]) || 0) + game.score;
      if (!achievements.badges.some(function (item) { return item.name === badge; })) {
        achievements.badges.push({
          name: badge,
          kind: kind,
          earnedAt: record.completedAt
        });
      }
      achievements.bestScores[kind] = Math.max(Number(achievements.bestScores[kind]) || 0, game.score);
      achievements.records.unshift(record);
      achievements.records = achievements.records.slice(0, 10);
      state.achievements = achievements;
      game.saved = true;
      saveAchievements();
      renderAchievements();
    }

    function scoreForKind(achievements, kind) {
      const storedTotal = Number(achievements.scoreByKind && achievements.scoreByKind[kind]) || 0;
      if (storedTotal > 0) return storedTotal;
      return (achievements.records || [])
        .filter(function (record) { return record.kind === kind; })
        .reduce(function (total, record) { return total + (Number(record.score) || 0); }, 0);
    }

    function badgeFamiliesFor(achievements) {
      return BADGE_FAMILIES.map(function (family) {
        const progressScore = scoreForKind(achievements, family.kind);
        const levels = BADGE_LEVELS.map(function (level) {
          return {
            key: level.key,
            name: level.name,
            target: level.target,
            unlocked: progressScore >= level.target
          };
        });
        return Object.assign({}, family, {
          progressScore: progressScore,
          levels: levels
        });
      });
    }

    function unlockedBadgeLevelCount(achievements) {
      return badgeFamiliesFor(achievements).reduce(function (count, family) {
        return count + family.levels.filter(function (level) { return level.unlocked; }).length;
      }, 0);
    }

    function renderBadgeFamily(family) {
      return [
        '<div class="badge-family">',
        '<div class="badge-family-head">',
        '<strong>' + escapeHtml(family.title) + '</strong>',
        '<span class="badge-best">累计 ' + family.progressScore + ' 分</span>',
        '</div>',
        '<div class="badge-levels">',
        family.levels.map(function (level) {
          return [
            '<div class="badge-level ' + level.key + ' ' + (level.unlocked ? 'unlocked' : 'locked') + '">',
            '<div class="badge-icon">' + escapeHtml(family.icon) + '</div>',
            '<div class="badge-level-name">' + escapeHtml(level.name) + '</div>',
            '<div class="badge-target">' + (level.unlocked ? '已点亮' : level.target + ' 分点亮') + '</div>',
            '</div>'
          ].join('');
        }).join(''),
        '</div>',
        '</div>'
      ].join('');
    }

    function renderAchievements() {
      const achievements = state.achievements || emptyAchievements();
      const badgeFamilies = badgeFamiliesFor(achievements);
      if (!el('achievement-score')) return;
      el('achievement-score').textContent = achievements.totalScore;
      el('achievement-badges').textContent = unlockedBadgeLevelCount(achievements);
      el('achievement-records').textContent = achievements.records.length;
      el('badge-list').innerHTML = badgeFamilies.map(renderBadgeFamily).join('');
      el('record-list').innerHTML = achievements.records.length
        ? achievements.records.map(function (record) {
          return '<div class="record-item"><strong>' + escapeHtml(record.title) + ' · ' + record.score + ' 分</strong><div class="record-meta">' + escapeHtml(record.badge) + ' · 连对 ' + record.streak + ' · ' + formatDate(record.completedAt) + '</div></div>';
        }).join('')
        : '<div class="muted">最近还没有完整闯关记录。</div>';
      renderBentoGame();
    }

    function renderStepList(steps) {
      if (!Array.isArray(steps) || steps.length === 0) return '';
      return '<ul class="mini-steps">' + steps
        .map(function (step) {
          return '<li>' + escapeHtml(step) + '</li>';
        })
        .join('') + '</ul>';
    }

    function isQuestKind(kind) {
      return Array.isArray(questionBanks[kind]);
    }

    function createGame() {
      return {
        index: 0,
        score: 0,
        streak: 0,
        answered: false,
        complete: false,
        feedback: '',
        feedbackType: '',
        reward: '',
        saved: false
      };
    }

    function getGame(kind) {
      if (!state.gameState[kind]) state.gameState[kind] = createGame();
      return state.gameState[kind];
    }

    function resetGame(kind) {
      state.gameState[kind] = createGame();
      return state.gameState[kind];
    }

    function rewardName(kind) {
      return {
        word: '单词闪电徽章',
        idiom: '诗词侦探徽章',
        math: '数学换路徽章',
        mistake: '错题翻盘徽章',
        reading: '阅读雷达徽章',
        preview: '预习小队长徽章'
      }[kind] || '闯关徽章';
    }

    function pointsForStreak(streak) {
      return Math.max(1, Math.min(5, streak));
    }

    function difficultyLabel(card, index) {
      if (card && card.difficulty) return card.difficulty;
      if (index < 2) return '入门';
      if (index < 5) return '进阶';
      return '挑战';
    }

    function renderQuestMeta(card, game) {
      const nextPoints = pointsForStreak((game ? game.streak : 0) + 1);
      return [
        '<div class="quest-meta">',
        '<span class="quest-chip">难度 ' + escapeHtml(difficultyLabel(card, game ? game.index : 0)) + '</span>',
        '<span class="quest-chip hot">答对 +' + nextPoints + ' 分</span>',
        '</div>'
      ].join('');
    }

    function renderQuestProgress(game, total) {
      const done = Math.min(total, game.index + (game.answered || game.complete ? 1 : 0));
      const percent = total ? Math.round((done / total) * 100) : 0;
      return [
        '<div class="level-row">',
        '<span>第 ' + Math.min(game.index + 1, total) + ' / ' + total + ' 关</span>',
        '<span>' + game.score + ' 分 · 连对 ' + game.streak + '</span>',
        '</div>',
        '<div class="progress-track"><div class="progress-fill" style="width:' + percent + '%"></div></div>'
      ].join('');
    }

    function renderHomeTools(card, game) {
      if (game && game.answered) {
        return '<div id="play-feedback" class="play-feedback ' + (game.feedbackType || '') + '">' + escapeHtml(game.feedback) + '</div>';
      }
      if (Array.isArray(card.answers)) {
        return [
          '<div class="answer-line">',
          '<input id="play-answer" class="play-input" placeholder="写答案..." autocomplete="off" />',
          '<button class="secondary" data-play-action="check-answer">提交</button>',
          '</div>',
          '<div id="play-feedback" class="play-feedback ' + ((game && game.feedbackType) || '') + '">' + escapeHtml((game && game.feedback) || '') + '</div>'
        ].join('');
      }
      if (card.notePlaceholder) {
        return [
          '<div class="answer-line">',
          '<input id="play-note" class="play-input" placeholder="' + escapeHtml(card.notePlaceholder) + '" autocomplete="off" />',
          '<button class="secondary" data-play-action="save-note">过关</button>',
          '</div>',
          '<div id="play-feedback" class="play-feedback ' + ((game && game.feedbackType) || '') + '">' + escapeHtml((game && game.feedback) || '') + '</div>'
        ].join('');
      }
      return '<div id="play-feedback" class="play-feedback"></div>';
    }

    function renderHomePlayground() {
      const kind = state.selectedMission.kind;
      if (isQuestKind(kind)) {
        const bank = questionBanks[kind];
        const game = getGame(kind);
        if (game.complete) {
          el('home-playground').innerHTML = [
            '<article class="play-card">',
            '<div class="play-kicker">闯关完成</div>',
            '<div class="play-title">' + escapeHtml(rewardName(kind)) + ' 到手</div>',
            '<div class="game-complete">这轮拿到 ' + game.score + ' 分。' + escapeHtml(game.reward || '表现很稳，给自己一个轻轻的击掌。') + '</div>',
            renderQuestProgress(game, bank.length),
            '<div class="play-actions">',
            '<button class="secondary" data-play-action="view-profile">去个人中心</button>',
            '<button class="secondary" data-play-action="restart-game">再玩一轮</button>',
            '<button class="secondary ghost-link" data-play-action="ask-hefan">继续问盒饭</button>',
            '</div>',
            '</article>'
          ].join('');
          el('home-playground').classList.add('active');
          return;
        }

        const card = bank[game.index] || bank[0];
        el('home-playground').innerHTML = [
          '<article class="play-card">',
          '<div class="play-kicker">' + escapeHtml(card.kicker) + '</div>',
          '<div class="play-title">' + escapeHtml(card.title) + '</div>',
          renderQuestProgress(game, bank.length),
          renderQuestMeta(card, game),
          '<div class="play-question">' + escapeHtml(card.question) + '</div>',
          renderStepList(card.steps),
          renderHomeTools(card, game),
          '<div class="play-actions">',
          game.answered
            ? '<button class="secondary" data-play-action="next-level">' + (game.index >= bank.length - 1 ? '领奖励' : '下一关') + '</button>'
            : '<button class="secondary" data-play-action="done-play">先这样</button>',
          '<button class="secondary ghost-link" data-play-action="ask-hefan">继续问盒饭</button>',
          '<button class="secondary ghost-link" data-play-action="restart-game">重开</button>',
          '</div>',
          '</article>'
        ].join('');
        el('home-playground').classList.add('active');
        return;
      }

      const card = playCards[kind] || playCards.word;
      el('home-playground').innerHTML = [
        '<article class="play-card">',
        '<div class="play-kicker">' + escapeHtml(card.kicker) + '</div>',
        '<div class="play-title">' + escapeHtml(card.title) + '</div>',
        '<div class="play-question">' + escapeHtml(card.question) + '</div>',
        renderStepList(card.steps),
        renderHomeTools(card),
        '<div class="play-actions">',
        '<button class="secondary" data-play-action="done-play">完成了</button>',
        '<button class="secondary ghost-link" data-play-action="ask-hefan">继续问盒饭</button>',
        '</div>',
        '</article>'
      ].join('');
      el('home-playground').classList.add('active');
    }

    function normalizeAnswer(value) {
      return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s。！？!?,，.]/g, '');
    }

    function setPlayFeedback(text, type) {
      const node = el('play-feedback');
      if (!node) return;
      node.textContent = text;
      node.className = 'play-feedback ' + (type || '');
    }

    function showRewardOverlay(points, note) {
      const overlay = el('reward-overlay');
      if (!overlay) return;
      el('reward-points').textContent = '+' + points + ' 分';
      el('reward-note').textContent = note || '积分到账';
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'false');
      window.requestAnimationFrame(function () {
        overlay.classList.add('show');
      });
      window.clearTimeout(rewardTimer);
      rewardTimer = window.setTimeout(function () {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
      }, 1350);
    }

    function checkHomeAnswer() {
      const kind = state.selectedMission.kind;
      const game = isQuestKind(kind) ? getGame(kind) : null;
      const bank = isQuestKind(kind) ? questionBanks[kind] : null;
      const card = bank ? bank[game.index] : (playCards[kind] || playCards.word);
      const input = el('play-answer');
      const answer = input ? normalizeAnswer(input.value) : '';
      const expected = (card.answers || []).map(normalizeAnswer);
      if (!answer) {
        setPlayFeedback('先大胆写一个，盒饭看着呢。', 'try');
        return;
      }
      if (expected.includes(answer)) {
        if (game) {
          const nextStreak = game.streak + 1;
          const earnedPoints = pointsForStreak(nextStreak);
          game.score += earnedPoints;
          game.streak = nextStreak;
          game.answered = true;
          game.feedbackType = 'good';
          game.feedback = (card.success || '对啦。') + ' 连对 ' + nextStreak + ' 题，+' + earnedPoints + ' 分。';
          renderHomePlayground();
          showRewardOverlay(earnedPoints, nextStreak > 1 ? '连对升级，奖励变多' : '开局拿下');
          return;
        }
        setPlayFeedback(card.success || '对啦。', 'good');
        return;
      }
      if (game) {
        game.streak = 0;
        game.feedback = (card.retry || '差一点，再试一次。') + ' 不扣分，再试一次。';
        game.feedbackType = 'try';
        renderHomePlayground();
        return;
      }
      setPlayFeedback(card.retry || '差一点，再试一次。', 'try');
    }

    function saveHomeNote() {
      const kind = state.selectedMission.kind;
      const game = isQuestKind(kind) ? getGame(kind) : null;
      const input = el('play-note');
      const note = input ? input.value.trim() : '';
      if (note) {
        if (game) {
          const nextStreak = game.streak + 1;
          const earnedPoints = pointsForStreak(nextStreak);
          game.score += earnedPoints;
          game.streak = nextStreak;
          game.answered = true;
          game.feedbackType = 'good';
          game.feedback = '记下来了，连对 ' + nextStreak + ' 题，+' + earnedPoints + ' 分。这个关卡算你过。';
          renderHomePlayground();
          return;
        }
        setPlayFeedback('记下来了：' + note + '。先按下面三步来。', 'good');
        return;
      }
      setPlayFeedback('可以先写一句，不用写很长。', 'try');
    }

    function nextLevel() {
      const kind = state.selectedMission.kind;
      if (!isQuestKind(kind)) return;
      const bank = questionBanks[kind];
      const game = getGame(kind);
      if (!game.answered) {
        setPlayFeedback('先过这一关，再去下一关。', 'try');
        return;
      }
      if (game.index >= bank.length - 1) {
        game.complete = true;
        game.reward = game.score >= bank.length
          ? '连续闯完一轮，很有节奏。'
          : '完成比满分更重要，今天已经推进了。';
        addAchievementRecord(kind, game, bank.length);
        renderHomePlayground();
        return;
      }
      game.index += 1;
      game.answered = false;
      game.feedback = '';
      game.feedbackType = '';
      renderHomePlayground();
    }

    function restartGame() {
      resetGame(state.selectedMission.kind);
      renderHomePlayground();
    }

    function handlePlayAction(action) {
      if (action === 'check-answer') {
        checkHomeAnswer();
        return;
      }
      if (action === 'save-note') {
        saveHomeNote();
        return;
      }
      if (action === 'next-level') {
        nextLevel();
        return;
      }
      if (action === 'restart-game') {
        restartGame();
        return;
      }
      if (action === 'view-profile') {
        showView('profile');
        return;
      }
      if (action === 'done-play') {
        if (isQuestKind(state.selectedMission.kind)) {
          setPlayFeedback('可以先提交答案或写一句，再拿积分过关。', 'try');
          return;
        }
        setPlayFeedback('收到，今天这一小关算过了。', 'good');
        return;
      }
      if (action === 'ask-hefan') {
        el('chat-input').value = state.selectedMission.prompt;
        showView('chat');
      }
    }

    function renderMessages() {
      el('messages').innerHTML = state.messages
        .map(function (message) {
          const text = escapeHtml(message.text);
          if (message.role === 'coach') {
            if (message.thinking) {
              return '<div class="message-row coach-row"><img class="message-avatar" src="/assets/hefan-avatar.png?v=hefan-512" alt="盒饭头像" /><div class="message coach"><span class="thinking-dots" aria-label="盒饭正在想"><span></span><span></span><span></span></span></div></div>';
            }
            return '<div class="message-row coach-row"><img class="message-avatar" src="/assets/hefan-avatar.png?v=hefan-512" alt="盒饭头像" /><div class="message coach">' + text + '</div></div>';
          }
          return '<div class="message-row child-row"><div class="message child">' + text + '</div></div>';
        })
        .join('');
      el('messages').scrollTop = el('messages').scrollHeight;
    }

    function renderSelectedMission() {
      el('selected-mission-title').textContent = state.selectedMission.title;
      el('selected-mission-desc').textContent = state.selectedMission.desc;
      if (el('selected-mission-art') && state.selectedMission.art) {
        el('selected-mission-art').src = state.selectedMission.art;
      }
    }

    function selectMission(button) {
      state.selectedMission = {
        kind: button.dataset.kind,
        title: button.dataset.title,
        desc: button.dataset.desc,
        prompt: button.dataset.prompt,
        art: button.dataset.art
      };
      document.querySelectorAll('.mission-option').forEach(function (node) {
        node.classList.toggle('active', node === button);
      });
      renderSelectedMission();
      if (state.homePlaygroundOpen) renderHomePlayground();
    }

    function startSelectedMission() {
      state.homePlaygroundOpen = true;
      renderHomePlayground();
    }

    function planTypeByKey(key) {
      return PLAN_TYPES.find(function (type) { return type.key === key; }) || PLAN_TYPES[0];
    }

    function defaultPlanSteps(type) {
      if (type === 'sport') return ['热身一下', '练一组动作', '记一个动作感觉'];
      if (type === 'music') return ['慢速来一遍', '卡住处单独练', '录一小段回听'];
      if (type === 'habit') return ['先准备', '做完打勾', '给明天少留一点麻烦'];
      return ['先看目标', '做 15 分钟', '写下一个卡点'];
    }

    function normalizePlanStatus(value) {
      return ['todo', 'doing', 'done', 'missed'].includes(value) ? value : 'todo';
    }

    function normalizePlanItem(item, index) {
      const type = item.type || (item.subject === '运动' ? 'sport' : 'learning');
      return {
        id: item.id || ('plan-' + Date.now() + '-' + index),
        type: planTypeByKey(type).key,
        title: item.title || '小计划',
        minutes: Math.max(1, Number(item.minutes) || 15),
        status: normalizePlanStatus(item.statusKey || item.status),
        reason: item.reason || '',
        steps: Array.isArray(item.steps) && item.steps.length ? item.steps : defaultPlanSteps(type)
      };
    }

    function planItemsFromApi(apiPlan) {
      const learning = (apiPlan || []).slice(0, 1).map(function (item, index) {
        return normalizePlanItem({
          id: 'learning-api-' + index,
          type: 'learning',
          title: item.title,
          minutes: item.minutes,
          status: index === 0 ? 'doing' : 'todo',
          steps: item.steps
        }, index);
      });
      return learning.concat(EXTRA_PLAN_ITEMS.map(normalizePlanItem));
    }

    function pruneDemoPlanItems(items) {
      return items.filter(function (item) {
        return !REMOVED_DEMO_PLAN_IDS.includes(item.id) || item.status === 'done' || item.status === 'missed';
      });
    }

    function loadPlanItems(apiPlan) {
      try {
        const raw = localStorage.getItem(PLAN_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved) && saved.length) return pruneDemoPlanItems(saved.map(normalizePlanItem));
        }
      } catch (error) {
        // Fall back to the generated MVP seed.
      }
      return planItemsFromApi(apiPlan);
    }

    function savePlanItems() {
      try {
        state.planItems = pruneDemoPlanItems(state.planItems || []);
        localStorage.setItem(PLAN_KEY, JSON.stringify(state.planItems || []));
      } catch (error) {
        // Plan center still works for this session.
      }
    }

    function planStatusLabel(status) {
      return {
        todo: '未开始',
        doing: '进行中',
        done: '已完成',
        missed: '未完成'
      }[status] || '未开始';
    }

    function planStats() {
      const items = state.planItems || [];
      const total = items.length;
      const done = items.filter(function (item) { return item.status === 'done'; }).length;
      const doing = items.filter(function (item) { return item.status === 'doing'; }).length;
      const missed = items.filter(function (item) { return item.status === 'missed'; }).length;
      return {
        total: total,
        done: done,
        doing: doing,
        missed: missed,
        rate: total ? Math.round((done / total) * 100) : 0
      };
    }

    function currentPlanItems() {
      return (state.planItems || []).filter(function (item) {
        return item.status !== 'done' && item.status !== 'missed';
      });
    }

    function historicalPlanItems() {
      return (state.planItems || []).filter(function (item) {
        return item.status === 'done' || item.status === 'missed';
      });
    }

    function renderPlanDashboard() {
      const stats = planStats();
      el('plan-dashboard').innerHTML = [
        '<div class="plan-dashboard">',
        '<div class="plan-stat"><strong>' + stats.total + '</strong><span>全部计划</span></div>',
        '<div class="plan-stat"><strong>' + stats.done + '</strong><span>已完成</span></div>',
        '<div class="plan-stat"><strong>' + stats.doing + '</strong><span>进行中</span></div>',
        '<div class="plan-stat"><strong>' + stats.missed + '</strong><span>未完成</span></div>',
        '<div class="plan-stat"><strong>' + stats.rate + '%</strong><span>完成率</span></div>',
        '</div>'
      ].join('');
    }

    function renderPlanForm() {
      el('plan-form').innerHTML = [
        '<div class="plan-form">',
        '<input id="new-plan-title" class="plan-input" placeholder="新计划，比如：低运球 10 分钟" />',
        '<div class="plan-form-row">',
        '<select id="new-plan-type" class="plan-select">',
        PLAN_TYPES.map(function (type) {
          return '<option value="' + type.key + '">' + type.label + '</option>';
        }).join(''),
        '</select>',
        '<input id="new-plan-minutes" class="plan-input" type="number" min="3" max="60" value="15" />',
        '</div>',
        '<button class="secondary" data-plan-action="add">加入计划</button>',
        '</div>'
      ].join('');
    }

    function renderPlanCard(item) {
      const type = planTypeByKey(item.type);
      const actionButtons = item.status === 'done' || item.status === 'missed'
        ? [
            '<button data-plan-action="reset" data-plan-id="' + item.id + '">放回当前</button>',
            '<button class="danger" data-plan-action="delete" data-plan-id="' + item.id + '">删除</button>'
          ].join('')
        : [
            '<button data-plan-action="done" data-plan-id="' + item.id + '">完成</button>',
            '<button data-plan-action="doing" data-plan-id="' + item.id + '">进行中</button>',
            '<button data-plan-action="missed" data-plan-id="' + item.id + '">未完成</button>',
            '<button data-plan-action="reset" data-plan-id="' + item.id + '">重置</button>',
            '<button class="danger" data-plan-action="delete" data-plan-id="' + item.id + '">删除</button>'
          ].join('');
      return [
        '<article class="card plan-card ' + item.status + '">',
        '<div class="plan-topline"><span class="plan-type">' + type.mark + ' ' + type.label + '</span><span class="plan-state">' + item.minutes + ' 分钟 · ' + planStatusLabel(item.status) + '</span></div>',
        '<h3>' + escapeHtml(item.title) + '</h3>',
        '<ol class="steps">' + item.steps.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join('') + '</ol>',
        item.status === 'missed' && item.reason ? '<div class="plan-reason">未完成原因：' + escapeHtml(item.reason) + '</div>' : '',
        '<div class="plan-actions">',
        actionButtons,
        '</div>',
        '</article>'
      ].join('');
    }

    function renderPlan() {
      renderPlanDashboard();
      renderPlanForm();
      const currentItems = currentPlanItems();
      const historyItems = historicalPlanItems();
      el('plan-list').innerHTML = [
        '<div class="plan-section-note">当前计划</div>',
        currentItems.length
          ? currentItems.map(renderPlanCard).join('')
          : '<article class="card muted">当前没有待执行计划，可以新增一个。</article>',
        '<div class="plan-section-note plan-history-title">历史计划</div>',
        historyItems.length
          ? historyItems.slice(0, 6).map(renderPlanCard).join('')
          : '<article class="card muted">完成或未完成的计划会在这里出现。</article>'
      ].join('');
    }

    function addPlanItem() {
      const title = el('new-plan-title').value.trim();
      const type = el('new-plan-type').value;
      const minutes = Number.parseInt(el('new-plan-minutes').value || '15', 10);
      if (!title) {
        alert('先写一个计划名字。');
        return;
      }
      state.planItems.unshift(normalizePlanItem({
        id: 'custom-' + Date.now(),
        type: type,
        title: title,
        minutes: minutes,
        status: 'todo',
        steps: defaultPlanSteps(type)
      }, 0));
      savePlanItems();
      renderPlan();
    }

    function updatePlanItem(id, status) {
      const item = (state.planItems || []).find(function (plan) { return plan.id === id; });
      if (!item) return;
      if (status === 'delete') {
        const confirmed = window.confirm('确定删除这个计划吗？');
        if (!confirmed) return;
        state.planItems = (state.planItems || []).filter(function (plan) { return plan.id !== id; });
        savePlanItems();
        renderPlan();
        return;
      }
      if (status === 'missed') {
        const reason = window.prompt('这次为什么没完成？写短一点就行。', item.reason || '');
        if (reason === null) return;
        item.reason = reason.trim() || '暂时没写原因。';
      }
      if (status === 'reset') {
        item.status = 'todo';
        item.reason = '';
      } else {
        item.status = status;
        if (status !== 'missed') item.reason = '';
      }
      savePlanItems();
      renderPlan();
    }

    function handlePlanAction(target) {
      const action = target.dataset.planAction;
      if (action === 'add') {
        addPlanItem();
        return;
      }
      updatePlanItem(target.dataset.planId, action);
    }

    function renderProfile() {
      const profile = state.profile;
      if (!profile) return;
      const dailyLimit = el('daily-limit');
      const parentConsent = el('parent-consent');
      if (dailyLimit) dailyLimit.value = profile.dailyLimitMinutes || 25;
      if (parentConsent) parentConsent.checked = Boolean(profile.parentConsent);
    }

    async function loadInitialData() {
      state.achievements = loadAchievements();
      state.bento = loadBento();
      const profileResult = await api('/api/profile');
      const planResult = await api('/api/plan');
      state.profile = profileResult.profile;
      state.plan = planResult.plan;
      state.planItems = loadPlanItems(state.plan);
      renderProfile();
      renderPlan();
      renderAchievements();
      renderSelectedMission();
      renderMessages();
    }

    async function sendChat() {
      const input = el('chat-input');
      const text = input.value.trim();
      if (!text) return;

      state.messages.push({ role: 'child', text: text });
      const thinkingMessage = { role: 'coach', text: '盒饭正在想...', thinking: true };
      state.messages.push(thinkingMessage);
      input.value = '';
      renderMessages();

      try {
        const result = await api('/api/chat', {
          method: 'POST',
          role: 'child',
          body: { message: text }
        });
        Object.assign(thinkingMessage, { text: result.answer, thinking: false });
      } catch (error) {
        Object.assign(thinkingMessage, { text: error.message, thinking: false });
      }
      renderMessages();
    }

    async function regeneratePlan() {
      const result = await api('/api/plan', {
        method: 'POST',
        body: { goal: '稳住六年级数学和语文薄弱点' }
      });
      state.plan = result.plan;
      const generatedItems = planItemsFromApi(result.plan);
      const generatedIds = generatedItems.map(function (item) { return item.id; });
      const retainedItems = (state.planItems || []).filter(function (item) {
        return !generatedIds.includes(item.id) || item.status === 'done' || item.status === 'missed';
      });
      state.planItems = generatedItems.concat(retainedItems);
      savePlanItems();
      renderPlan();
    }

    async function loadParentSummary() {
      const result = await api('/api/parent-summary', { role: 'parent' });
      const summary = result.summary;
      el('metrics').innerHTML =
        '<article class="card metric"><strong>' + summary.todayMinutes + '</strong><span class="muted">今日分钟</span></article>' +
        '<article class="card metric"><strong>' + summary.weeklyMinutes + '</strong><span class="muted">本周分钟</span></article>' +
        '<article class="card metric"><strong>' + summary.dailyLimitMinutes + '</strong><span class="muted">每日上限</span></article>';
      renderTags('parent-topics', summary.learningTopics);
      renderTags('parent-weak', summary.weakPoints);
      el('parent-risks').innerHTML = summary.riskAlerts.length
        ? summary.riskAlerts.map(function (item) {
            return '<div class="risk"><strong>' + item.level + ' · ' + item.category + '</strong><br />' + item.summary + '</div>';
          }).join('')
        : '暂无风险提醒。';
      el('privacy-note').textContent = summary.privacyNote;
    }

    async function saveSettings() {
      if (!el('daily-limit') || !el('parent-consent')) return;
      const result = await api('/api/profile', {
        method: 'PUT',
        body: {
          dailyLimitMinutes: Number.parseInt(el('daily-limit').value || '25', 10),
          parentConsent: el('parent-consent').checked
        }
      });
      state.profile = result.profile;
      renderProfile();
      alert('已保存');
    }

    document.querySelectorAll('[data-view-button]').forEach(function (button) {
      button.addEventListener('click', function () {
        showView(button.dataset.viewButton);
      });
    });

    document.querySelectorAll('[data-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        showView(button.dataset.jump);
      });
    });

    document.querySelectorAll('[data-fill]').forEach(function (button) {
      button.addEventListener('click', function () {
        el('chat-input').value = button.dataset.fill;
      });
    });

    document.querySelectorAll('.mission-option').forEach(function (button) {
      button.addEventListener('click', function () {
        selectMission(button);
      });
    });

    document.addEventListener('click', function (event) {
      const bentoTarget = event.target.closest('[data-bento-action]');
      if (bentoTarget) {
        handleBentoAction(bentoTarget);
        return;
      }
      const planTarget = event.target.closest('[data-plan-action]');
      if (planTarget) {
        handlePlanAction(planTarget);
        return;
      }
      const action = event.target.dataset.playAction;
      if (action) handlePlayAction(action);
    });

    el('start-mission').addEventListener('click', startSelectedMission);
    el('send-chat').addEventListener('click', sendChat);
    el('chat-input').addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        sendChat();
      }
    });
    el('regen-plan').addEventListener('click', regeneratePlan);
    if (el('save-settings')) el('save-settings').addEventListener('click', saveSettings);

    loadInitialData().catch(function (error) {
      document.querySelector('.screen').innerHTML = '<div class="card">' + error.message + '</div>';
    });
  </script>
</body>
</html>`;
}

module.exports = { renderStatusPage };

