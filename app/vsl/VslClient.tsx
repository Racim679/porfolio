'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import photoRacim from '../../assets/photo_racim.png';

const css = `
  .vsl-root *,
  .vsl-root *::before,
  .vsl-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vsl-root {
    --black: #0a0a0a;
    --white: #f5f2ec;
    --gold: #c9a84c;
    --gold-light: #e8c96a;
    --red: #d63b2f;
    --grey: #1a1a1a;
    --grey-mid: #2a2a2a;
    --text-muted: #888;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-dm-sans), sans-serif;
    font-weight: 300;
    line-height: 1.6;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* ─── TOPBAR ─── */
  .vsl-topbar {
    background: var(--gold);
    color: var(--black);
    text-align: center;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .vsl-topbar span { opacity: 0.55; margin: 0 12px; }

  /* ─── HERO ─── */
  .vsl-pre-headline {
    text-align: center;
    padding: 60px 20px 20px;
    font-size: 13px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
  }

  .vsl-hero-headline {
    text-align: center;
    padding: 0 20px 10px;
    max-width: 900px;
    margin: 0 auto;
  }

  .vsl-hero-headline h1 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(42px, 7vw, 88px);
    line-height: 0.95;
    letter-spacing: 0.02em;
    color: var(--white);
  }

  .vsl-hero-headline h1 em {
    font-family: var(--font-instrument-serif), serif;
    font-style: italic;
    color: var(--gold);
  }

  .vsl-hero-subhead {
    text-align: center;
    max-width: 620px;
    margin: 24px auto 0;
    padding: 0 20px;
    font-size: 17px;
    color: #bbb;
    line-height: 1.7;
  }

  /* ─── VIDEO ─── */
  .vsl-video-section {
    padding: 50px 20px;
    max-width: 860px;
    margin: 0 auto;
  }

  .vsl-video-promise {
    text-align: center;
    font-size: 15px;
    color: #aaa;
    line-height: 1.7;
    max-width: 640px;
    margin: 0 auto 24px;
  }

  .vsl-post-video-text {
    text-align: center;
    font-size: 16px;
    color: var(--white);
    line-height: 1.7;
    max-width: 560px;
    margin: 32px auto 0;
  }

  .vsl-video-wrapper {
    position: relative;
    background: var(--grey);
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 16/9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .vsl-video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  .vsl-video-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
  }

  .vsl-video-placeholder {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .vsl-play-btn {
    width: 80px;
    height: 80px;
    background: var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    transition: transform 0.2s, background 0.2s;
  }

  .vsl-play-btn:hover { transform: scale(1.1); background: var(--gold-light); }

  .vsl-play-btn svg { width: 28px; fill: #0a0a0a; margin-left: 4px; }

  .vsl-video-placeholder p {
    font-size: 14px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .vsl-video-badge {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .vsl-video-badge span {
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .vsl-video-badge span::before {
    content: '✓';
    color: var(--gold);
    font-size: 14px;
  }

  /* ─── CTA ─── */
  .vsl-cta-block {
    text-align: center;
    padding: 20px 20px 60px;
    max-width: 600px;
    margin: 0 auto;
  }

  .vsl-cta-btn {
    display: inline-block;
    background: var(--red);
    color: #fff;
    font-family: var(--font-dm-sans), sans-serif;
    font-size: 17px;
    font-weight: 600;
    padding: 20px 44px;
    border-radius: 3px;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: transform 0.15s, background 0.15s;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: none;
  }

  .vsl-cta-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: rgba(255,255,255,0.12);
    transform: skewX(-20deg);
    transition: left 0.4s;
  }

  .vsl-cta-btn:hover { transform: translateY(-2px); background: #c03020; }
  .vsl-cta-btn:hover::after { left: 150%; }

  .vsl-cta-subtext {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 14px;
    line-height: 1.5;
  }

  /* ─── QUI SUIS-JE ─── */
  .vsl-identity-section {
    max-width: 560px;
    margin: 0 auto;
    padding: 48px 20px 40px;
    text-align: center;
  }

  .vsl-identity-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .vsl-identity-photo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--gold);
  }

  .vsl-identity-name {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 28px;
    letter-spacing: 0.02em;
    color: var(--white);
    line-height: 1;
  }

  .vsl-identity-bio {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 420px;
  }

  /* ─── DIVIDER ─── */
  .vsl-divider {
    border: none;
    border-top: 1px solid #1e1e1e;
    max-width: 900px;
    margin: 0 auto;
  }

  /* ─── SECTION LABEL ─── */
  .vsl-section-label {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    font-weight: 500;
  }

  /* ─── PAIN POINTS ─── */
  .vsl-pain-section {
    max-width: 860px;
    margin: 0 auto;
    padding: 70px 20px;
  }

  .vsl-pain-section h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    line-height: 1;
    margin-bottom: 50px;
  }

  .vsl-pain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1px;
    background: #1a1a1a;
    border: 1px solid #1a1a1a;
  }

  .vsl-pain-item {
    background: var(--black);
    padding: 32px 28px;
    border-left: 3px solid transparent;
    transition: border-color 0.3s;
  }

  .vsl-pain-item:hover { border-left-color: var(--red); }

  .vsl-pain-icon {
    font-size: 28px;
    margin-bottom: 16px;
    display: block;
  }

  .vsl-pain-item h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--white);
  }

  .vsl-pain-item p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* ─── SOLUTION ─── */
  .vsl-solution-section {
    max-width: 860px;
    margin: 0 auto;
    padding: 70px 20px;
  }

  .vsl-solution-section h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    line-height: 1;
    margin-bottom: 50px;
  }

  .vsl-steps-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .vsl-step {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0 32px;
    position: relative;
    padding-bottom: 48px;
  }

  .vsl-step:last-child { padding-bottom: 0; }

  .vsl-step-num {
    text-align: right;
    padding-top: 4px;
  }

  .vsl-step-num span {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 52px;
    color: #1e1e1e;
    line-height: 1;
    display: block;
    transition: color 0.3s;
  }

  .vsl-step:hover .vsl-step-num span { color: var(--gold); }

  .vsl-step-line {
    position: absolute;
    left: 80px;
    top: 60px;
    bottom: 0;
    width: 1px;
    background: #1e1e1e;
  }

  .vsl-step:last-child .vsl-step-line { display: none; }

  .vsl-step-content h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-top: 6px;
  }

  .vsl-step-content p {
    font-size: 15px;
    color: #999;
    line-height: 1.7;
  }

  /* ─── INCLUDED ─── */
  .vsl-included-section {
    background: var(--grey);
    border-top: 1px solid #1e1e1e;
    border-bottom: 1px solid #1e1e1e;
    padding: 70px 20px;
  }

  .vsl-included-inner {
    max-width: 860px;
    margin: 0 auto;
  }

  .vsl-included-inner h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    line-height: 1;
    margin-bottom: 50px;
  }

  .vsl-included-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }

  .vsl-included-card {
    border: 1px solid #2a2a2a;
    padding: 28px;
    border-radius: 2px;
    background: var(--black);
    position: relative;
    overflow: hidden;
  }

  .vsl-included-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s;
  }

  .vsl-included-card:hover::after { transform: scaleX(1); }

  .vsl-card-icon {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .vsl-included-card h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .vsl-included-card p {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* ─── FOUNDER OFFER ─── */
  .vsl-founder-section {
    max-width: 700px;
    margin: 0 auto;
    padding: 70px 20px;
    text-align: center;
  }

  .vsl-founder-box {
    border: 1px solid var(--gold);
    padding: 48px 40px;
    position: relative;
    background: #0d0d0d;
  }

  .vsl-founder-box::before {
    content: 'OFFRE FONDATEUR';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gold);
    color: var(--black);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    padding: 4px 16px;
    white-space: nowrap;
  }

  .vsl-founder-box h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 42px;
    margin-bottom: 20px;
    line-height: 1;
  }

  .vsl-founder-box p {
    font-size: 15px;
    color: #aaa;
    margin-bottom: 30px;
    line-height: 1.7;
  }

  .vsl-spots-counter {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    padding: 12px 24px;
    margin-bottom: 32px;
    font-size: 14px;
    color: var(--white);
  }

  .vsl-spots-dot {
    width: 8px; height: 8px;
    background: var(--red);
    border-radius: 50%;
    animation: vslPulse 1.5s infinite;
  }

  @keyframes vslPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .vsl-founder-cta {
    margin-top: 24px;
    display: inline-block;
  }

  .vsl-guarantee {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid #1e1e1e;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.7;
  }

  .vsl-guarantee strong { color: var(--white); }

  /* ─── TÉMOIGNAGES ─── */
  .vsl-testimonials-section {
    max-width: 860px;
    margin: 0 auto;
    padding: 70px 20px;
  }

  .vsl-testimonials-section h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    line-height: 1;
    margin-bottom: 40px;
    text-align: center;
  }

  .vsl-testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .vsl-testimonial-card {
    border: 1px solid #2a2a2a;
    padding: 28px;
    border-radius: 2px;
    background: var(--grey);
    position: relative;
  }

  .vsl-testimonial-card::before {
    content: '"';
    position: absolute;
    top: 16px;
    left: 20px;
    font-family: var(--font-instrument-serif), serif;
    font-size: 48px;
    color: var(--gold);
    opacity: 0.4;
    line-height: 1;
  }

  .vsl-testimonial-text {
    font-size: 15px;
    color: var(--white);
    line-height: 1.7;
    margin-bottom: 20px;
    font-style: italic;
  }

  .vsl-testimonial-author {
    font-size: 13px;
    font-weight: 600;
    color: var(--gold);
  }

  .vsl-testimonial-role {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ─── FAQ ─── */
  .vsl-faq-section {
    max-width: 700px;
    margin: 0 auto;
    padding: 70px 20px;
  }

  .vsl-faq-section h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 44px;
    margin-bottom: 40px;
  }

  .vsl-faq-item {
    border-bottom: 1px solid #1a1a1a;
    padding: 20px 0;
    cursor: pointer;
  }

  .vsl-faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 500;
    color: var(--white);
    user-select: none;
  }

  .vsl-faq-toggle {
    width: 24px; height: 24px;
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--gold);
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .vsl-faq-item.open .vsl-faq-toggle { transform: rotate(45deg); }

  .vsl-faq-answer {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s;
  }

  .vsl-faq-item.open .vsl-faq-answer {
    max-height: 300px;
    padding-top: 16px;
  }

  /* ─── FINAL CTA ─── */
  .vsl-final-cta {
    background: var(--grey);
    border-top: 1px solid #1e1e1e;
    text-align: center;
    padding: 80px 20px;
  }

  .vsl-final-cta h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: clamp(36px, 6vw, 72px);
    line-height: 1;
    margin-bottom: 20px;
  }

  .vsl-final-cta h2 em {
    font-family: var(--font-instrument-serif), serif;
    font-style: italic;
    color: var(--gold);
  }

  .vsl-final-cta p {
    font-size: 16px;
    color: #aaa;
    margin-bottom: 36px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .vsl-trust-row {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .vsl-trust-item {
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .vsl-trust-item::before { content: '🔒'; font-size: 13px; }

  /* ─── FOOTER ─── */
  .vsl-footer {
    padding: 30px 20px;
    text-align: center;
    border-top: 1px solid #111;
    font-size: 12px;
    color: #444;
  }

  /* ─── FADE-IN ─── */
  .vsl-fade {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .vsl-fade.visible { opacity: 1; transform: none; }

  /* ─── STICKY CTA BAR (mobile) ─── */
  .vsl-sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    padding: 14px 20px;
    background: var(--black);
    border-top: 1px solid #2a2a2a;
    display: none;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .vsl-sticky-cta.visible {
    transform: translateY(0);
  }

  .vsl-sticky-cta .vsl-cta-btn {
    width: 100%;
    max-width: 320px;
    text-align: center;
  }

  @media (max-width: 768px) {
    .vsl-sticky-cta { display: flex; }
  }

  @media (min-width: 769px) {
    .vsl-sticky-cta { display: none !important; }
  }

  @media (max-width: 600px) {
    .vsl-step { grid-template-columns: 50px 1fr; }
    .vsl-step-num span { font-size: 36px; }
    .vsl-step-line { left: 50px; }
    .vsl-founder-box { padding: 40px 24px; }
  }
`;

const STICKY_CTA_SCROLL_THRESHOLD = 300;
// Optional: set NEXT_PUBLIC_VSL_VIDEO_URL (YouTube/Vimeo embed URL) to show the VSL video instead of placeholder
const videoEmbedUrl = process.env.NEXT_PUBLIC_VSL_VIDEO_URL;

export default function VslClient() {
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.vsl-fade').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setStickyCtaVisible(window.scrollY > STICKY_CTA_SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleFaq(e: React.MouseEvent<HTMLDivElement>) {
    const item = (e.currentTarget as HTMLElement).closest('.vsl-faq-item') as HTMLElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.vsl-faq-item').forEach((i) => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  return (
    <>
      <style>{css}</style>
      <div className="vsl-root">

        {/* TOPBAR */}
        <div className="vsl-topbar">
          🔴 Places limitées — Seulement 5 indépendants acceptés ce mois-ci <span>|</span> Offre Fondateur active
        </div>

        {/* HERO */}
        <p className="vsl-pre-headline">Pour les freelances &amp; indépendants ambitieux</p>

        <div className="vsl-hero-headline vsl-fade">
          <h1>
            Arrête de courir<br />après les clients.<br />
            <em>Laisse le système<br />travailler.</em>
          </h1>
        </div>

        <p className="vsl-hero-subhead vsl-fade">
          Un système tout-en-un qui capte, qualifie et convertit tes prospects automatiquement — pour que tu passes tes journées à facturer, pas à prospecter sur LinkedIn.
        </p>

        {/* VIDEO */}
        <div className="vsl-video-section vsl-fade">
          <p className="vsl-video-promise">
            Dans cette vidéo : la promesse, les 4 étapes du système, les objections qu&apos;on me pose tout le temps, et des résultats clients. ~15–20 min.
          </p>
          <div className="vsl-video-wrapper">
            {videoEmbedUrl ? (
              <iframe
                src={videoEmbedUrl}
                title="VSL — Système client automatisé"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="vsl-video-placeholder">
                <div className="vsl-play-btn">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p>Regarder la vidéo</p>
              </div>
            )}
          </div>
          <div className="vsl-video-badge">
            <span>Aucune obligation</span>
            <span>100% gratuit à regarder</span>
            <span>Résultats concrets</span>
          </div>
          <p className="vsl-post-video-text">
            Tu as vu comment le système attire, qualifie et chauffe tes prospects. Si tu veux qu&apos;on l&apos;applique à ton cas, réserve l&apos;appel ci-dessous.
          </p>
        </div>

        {/* QUI SUIS-JE */}
        <section className="vsl-identity-section vsl-fade">
          <div className="vsl-identity-inner">
            <Image src={photoRacim} alt="" width={96} height={96} className="vsl-identity-photo" />
            <p className="vsl-identity-name">Si Smail Racim</p>
            <p className="vsl-identity-bio">
              Ingénieur &amp; freelance. J&apos;ai mis en place des systèmes d&apos;acquisition pour des indépendants et des petites structures. Je lance cette offre pour accompagner un petit nombre d&apos;indépendants avec la même rigueur.
            </p>
          </div>
        </section>

        {/* PRIMARY CTA */}
        <div className="vsl-cta-block vsl-fade">
          <a href="/vsl/apply" className="vsl-cta-btn">→ Réserver mon appel gratuit de 20 min</a>
          <p className="vsl-cta-subtext">En cliquant, tu remplis 4 questions rapides. On vérifie ensemble si ton profil et ton timing matchent avec l&apos;offre. Si oui, tu choisis ton créneau.</p>
        </div>

        <hr className="vsl-divider" />

        {/* PAIN POINTS */}
        <section className="vsl-pain-section">
          <p className="vsl-section-label vsl-fade">Le problème</p>
          <h2 className="vsl-fade">Tu reconnais ces situations ?</h2>
          <div className="vsl-pain-grid">
            <div className="vsl-pain-item vsl-fade">
              <span className="vsl-pain-icon">📉</span>
              <h3>Revenus irréguliers</h3>
              <p>Des mois à 6K, des mois à 0. L&apos;incertitude financière t&apos;épuise et te force à accepter n&apos;importe quel client à n&apos;importe quel tarif.</p>
            </div>
            <div className="vsl-pain-item vsl-fade">
              <span className="vsl-pain-icon">⏳</span>
              <h3>La prospection chronophage</h3>
              <p>Tu passes 2h par jour sur LinkedIn à envoyer des messages à froid qui restent sans réponse. Du temps que tu pourrais facturer.</p>
            </div>
            <div className="vsl-pain-item vsl-fade">
              <span className="vsl-pain-icon">🕳️</span>
              <h3>Le cycle infernal prospection / livraison</h3>
              <p>Quand tu as un gros projet en cours, tu ne prospectes plus. Et quand il se termine, tu repars de zéro. Le cycle infernal du freelance.</p>
            </div>
            <div className="vsl-pain-item vsl-fade">
              <span className="vsl-pain-icon">🏢</span>
              <h3>La concurrence des agences</h3>
              <p>Les agences ont des équipes entières dédiées à la prospection et au marketing. Toi, tu fais tout seul avec 24h dans ta journée.</p>
            </div>
          </div>
        </section>

        <hr className="vsl-divider" />

        {/* SOLUTION */}
        <section className="vsl-solution-section">
          <p className="vsl-section-label vsl-fade">La solution</p>
          <h2 className="vsl-fade">Comment le système<br />travaille pour toi</h2>
          <div className="vsl-steps-list">
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>01</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Attraction en continu</h3>
                <p>Des contenus optimisés et des publicités ciblées attirent tes clients idéaux vers toi — 24h/24, 7j/7, même quand tu es en train de livrer un projet.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>02</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Qualification automatique</h3>
                <p>Chaque prospect entre dans un tunnel qui pose les bonnes questions : budget, délai, périmètre. Seuls les projets rentables et sérieux arrivent jusqu&apos;à toi.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>03</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Nurturing & relances auto</h3>
                <p>Les prospects pas encore prêts sont chauffés automatiquement — emails, séquences, contenu de valeur — jusqu&apos;au moment où ils sont prêts à signer.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>04</span></div>
              <div className="vsl-step-content">
                <h3>Tu livres. Le reste, c&apos;est nous.</h3>
                <p>Tu n&apos;interviens que pour les appels de closing et les projets confirmés. Ton pipeline se remplit pendant que tu travailles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* INCLUDED */}
        <section className="vsl-included-section">
          <div className="vsl-included-inner">
            <p className="vsl-section-label vsl-fade">Ce que tu obtiens</p>
            <h2 className="vsl-fade">Tout ce qui est inclus<br />dans le système</h2>
            <div className="vsl-included-grid">
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">🎯</div>
                <h3>Stratégie de positionnement</h3>
                <p>On affine ton offre, ton client cible et ton message pour que tu attires des prospects qualifiés et payants, pas des curieux.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">⚙️</div>
                <h3>Tunnel de qualification</h3>
                <p>Landing page + formulaire intelligent qui filtre les prospects et collecte les informations clés avant même le premier appel.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">📲</div>
                <h3>Séquences de nurturing</h3>
                <p>Emails et follow-ups automatiques pour maintenir le lien avec les prospects tièdes jusqu&apos;à ce qu&apos;ils soient prêts à acheter.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">📢</div>
                <h3>Acquisition organique & payante</h3>
                <p>Stratégie de contenu LinkedIn + campagnes publicitaires ciblées pour générer un flux régulier de demandes entrantes.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">📊</div>
                <h3>Tableau de bord simplifié</h3>
                <p>Un dashboard clair : nombre de leads, taux de conversion, coût par client. Tu sais exactement ce qui fonctionne.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">🤝</div>
                <h3>Accompagnement 30 jours</h3>
                <p>Accès direct pendant les 30 premiers jours pour ajuster, optimiser et s&apos;assurer que le système tourne à plein régime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="vsl-testimonials-section">
          <h2 className="vsl-fade">Ils ont mis le système en place</h2>
          <div className="vsl-testimonials-grid">
            <div className="vsl-testimonial-card vsl-fade">
              <p className="vsl-testimonial-text">
                Avant je passais mes soirées à prospecter. Aujourd&apos;hui les leads arrivent tout seuls et je ne prends que les appels de closing. Chiffre d&apos;affaires en hausse, stress en baisse.
              </p>
              <p className="vsl-testimonial-author">— Thomas M.</p>
              <p className="vsl-testimonial-role">Consultant indépendant, secteur tech</p>
            </div>
            <div className="vsl-testimonial-card vsl-fade">
              <p className="vsl-testimonial-text">
                Le tunnel de qualification m&apos;a changé la vie : plus de perte de temps avec des prospects pas prêts. Je reçois uniquement des gens sérieux avec un budget et un projet clair.
              </p>
              <p className="vsl-testimonial-author">— Sarah L.</p>
              <p className="vsl-testimonial-role">Designer freelance</p>
            </div>
          </div>
        </section>

        <hr className="vsl-divider" />

        {/* FOUNDER OFFER */}
        <section className="vsl-founder-section">
          <div className="vsl-founder-box vsl-fade">
            <h2>Offre réservée aux<br />5 premiers indépendants</h2>
            <p>
              Je démarre avec un groupe restreint de freelances pour déployer ce système, l&apos;affiner et construire des résultats réels ensemble. En échange de ta confiance, tu bénéficies d&apos;un tarif fondateur et d&apos;un accès prioritaire à toutes les améliorations futures.
            </p>
            <div className="vsl-spots-counter">
              <div className="vsl-spots-dot" />
              <span>5 places disponibles ce mois-ci</span>
            </div>
            <a href="/vsl/apply" className="vsl-cta-btn vsl-founder-cta">→ Réserver mon appel gratuit</a>
            <div className="vsl-guarantee">
              <strong>Garantie 30 jours.</strong> Si tu n&apos;as pas reçu au moins 5 leads qualifiés dans les 30 jours suivant le lancement du système, je te rembourse intégralement. Aucune question posée.
            </div>
          </div>
        </section>

        <hr className="vsl-divider" />

        {/* FAQ */}
        <section className="vsl-faq-section">
          <h2 className="vsl-fade">Questions fréquentes</h2>

          {[
            {
              q: "Je n'ai pas le temps en ce moment",
              a: "On peut avancer par étapes. L'appel dure 20 min — juste pour voir si ton profil et ton timing matchent. Si c'est pas le bon moment, on en reparle plus tard, sans engagement.",
            },
            {
              q: "C'est cher / je n'ai pas le budget",
              a: "Garantie 30 jours : si tu n'as pas reçu au moins 5 leads qualifiés, remboursement intégral. L'objectif est que le ROI couvre l'investissement dès le premier mois. Le budget pub peut rester modeste (150–300€/mois) au démarrage.",
            },
            {
              q: "J'ai déjà essayé des trucs qui n'ont pas marché",
              a: "La différence ici, c'est la structure : pas juste du contenu ou de la pub, mais un tunnel (capture + qualification + nurturing) qui filtre et chauffe les prospects. On connecte tout en un système cohérent.",
            },
            {
              q: "Comment je sais que c'est pas du flan ?",
              a: "Témoignages sur la page, garantie 30 jours par écrit, et tout le processus est détaillé dans la vidéo. Tu peux regarder avant de t'engager.",
            },
            {
              q: "Je débute en freelance, est-ce que ça marche pour moi ?",
              a: "Ce système est conçu pour les indépendants qui ont déjà une offre définie et quelques clients, et qui veulent stabiliser et scaler leurs revenus. Si tu débutes complètement, on en parle lors de l'appel.",
            },
            {
              q: "Combien de temps avant de voir les premiers résultats ?",
              a: "Le système est configuré en 7 à 10 jours. Les premiers prospects qualifiés arrivent généralement dans les 2 à 3 premières semaines selon ton marché et ton budget.",
            },
            {
              q: "J'ai déjà essayé LinkedIn sans résultats, pourquoi ça serait différent ?",
              a: "La différence, c'est la structure. Poster du contenu sans système de capture et de nurturing derrière, ça ne convertit pas. On connecte chaque point de contact à un pipeline automatisé.",
            },
            {
              q: "Quel budget pub faut-il prévoir ?",
              a: "On peut démarrer avec des budgets modestes (150-300€/mois) et les augmenter progressivement selon le retour sur investissement. L'objectif est que le coût d'acquisition soit couvert par les premiers contrats.",
            },
            {
              q: "Et si ça ne fonctionne pas pour moi ?",
              a: "La garantie 30 jours est là pour ça. Si tu n'es pas satisfait des résultats dans le premier mois, je rembourse intégralement. Tu ne prends aucun risque financier.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="vsl-faq-item vsl-fade" onClick={toggleFaq}>
              <div className="vsl-faq-question">
                {q}
                <div className="vsl-faq-toggle">+</div>
              </div>
              <div className="vsl-faq-answer">{a}</div>
            </div>
          ))}
        </section>

        {/* FINAL CTA */}
        <section className="vsl-final-cta">
          <h2 className="vsl-fade">
            Prêt à avoir un pipeline<br /><em>qui tourne en automatique ?</em>
          </h2>
          <p className="vsl-fade">
            Un appel de 20 minutes. On analyse ta situation, ton offre, ton marché. Et on te montre exactement comment le système s&apos;appliquerait à ton activité.
          </p>
          <a href="/vsl/apply" className="vsl-cta-btn vsl-fade">→ Réserver mon appel stratégique gratuit</a>
          <div className="vsl-trust-row vsl-fade">
            <span className="vsl-trust-item">Aucun engagement</span>
            <span className="vsl-trust-item">Garantie 30 jours</span>
            <span className="vsl-trust-item">5 places restantes</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="vsl-footer">
          © 2026 — Mentions légales · Politique de confidentialité
        </footer>

        {/* STICKY CTA (mobile, after 300px scroll) */}
        <div className={`vsl-sticky-cta ${stickyCtaVisible ? 'visible' : ''}`} aria-hidden="true">
          <a href="/vsl/apply" className="vsl-cta-btn">→ Réserver mon appel gratuit</a>
        </div>

      </div>
    </>
  );
}
