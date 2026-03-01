'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import photoRacim from '../../assets/photo_racim.png';
import AuditButton from '../../components/AuditButton';

const CALENDLY_URL = 'https://calendly.com/buffedbean/30min';
const N8N_WEBHOOK = 'https://n8n.srv933307.hstgr.cloud/webhook/77ccd585-25f2-4fa5-bdee-6313eaa90d4f';

const DISCOVERY_ITEMS = [
  { emoji: '??', short: 'Analyser ton activite en profondeur', full: 'Analyser ton activite en profondeur ? Identifier comment tu generes de la valeur, tes flux de travail actuels et tes leviers de croissance.' },
  { emoji: '??', short: 'Detecter les opportunites d\'automatisation', full: 'Detecter les opportunites d\'automatisation et d\'optimisation ? Reperer les taches repetitives, les processus manuels ou les pertes de temps que l\'IA peut fluidifier.' },
  { emoji: '??', short: 'Faire le point sur ta strategie d\'acquisition', full: 'Faire le point sur ta strategie d\'acquisition et d\'operation ? Comprendre comment tu attires, convertis et geres tes clients ? et comment l\'automatisation peut accelerer chaque etape.' },
  { emoji: '??', short: 'Te donner un plan d\'action clair', full: 'Te donner un plan d\'action clair et personnalise ? Un plan concret pour integrer l\'IA dans ton business, gagner en productivite, reduire la friction et scaler plus vite.' },
];

const SECTOR_OPTIONS = ['Immobilier', 'Coaching / Formation', 'Services B2B', 'Batiment / Artisanat', 'Restauration', 'Bien etre / Sante', 'Autre'];

const css = `
  .vsl-root *,
  .vsl-root *::before,
  .vsl-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vsl-root {
    --black: #ffffff;
    --white: #0f172a;
    --gold: #2563eb;
    --gold-light: #3b82f6;
    --red: #2563eb;
    --grey: #f1f5f9;
    --grey-mid: #e2e8f0;
    --text-muted: #64748b;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-dm-sans), sans-serif;
    font-weight: 300;
    line-height: 1.6;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* ??? TOPBAR ??? */
  .vsl-topbar {
    background: var(--gold); color: #fff;
    text-align: center;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .vsl-topbar span { opacity: 0.55; margin: 0 12px; }

  /* ??? HERO ??? */
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
    font-size: clamp(28px, 4.5vw, 58px);
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
    color: var(--text-muted);
    line-height: 1.7;
  }

  /* ??? VIDEO ??? */
  .vsl-video-section {
    padding: 50px 20px;
    max-width: 860px;
    margin: 0 auto;
  }

  .vsl-video-promise {
    text-align: center;
    font-size: 15px;
    color: var(--text-muted);
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
    border: 1px solid var(--grey-mid);
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
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
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

  .vsl-play-btn svg { width: 28px; fill: #fff; margin-left: 4px; }

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
    content: '?';
    color: var(--gold);
    font-size: 14px;
  }

  /* ??? CTA ??? */
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

  .vsl-cta-btn:hover { transform: translateY(-2px); background: #1d4ed8; }
  .vsl-cta-btn:hover::after { left: 150%; }

  .vsl-cta-subtext {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 14px;
    line-height: 1.5;
  }

  /* ??? QUI SUIS-JE ??? */
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

  /* ??? DIVIDER ??? */
  .vsl-divider {
    border: none;
    border-top: 1px solid var(--grey-mid);
    max-width: 900px;
    margin: 0 auto;
  }

  /* ??? SECTION LABEL ??? */
  .vsl-section-label {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    font-weight: 500;
  }

  /* ??? PAIN POINTS ??? */
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
    background: var(--grey-mid);
    border: 1px solid var(--grey-mid);
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

  /* ??? SOLUTION ??? */
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
    color: var(--grey-mid);
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
    background: var(--grey-mid);
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

  /* ??? INCLUDED ??? */
  .vsl-included-section {
    background: var(--grey);
    border-top: 1px solid var(--grey-mid);
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
    border: 1px solid var(--grey-mid);
    padding: 28px;
    border-radius: 2px;
    background: #fff;
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

  /* ??? FOUNDER OFFER ??? */
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
    background: #fff;
  }

  .vsl-founder-box::before {
    content: 'OFFRE FONDATEUR';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gold); color: #fff;
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
    color: var(--text-muted);
    margin-bottom: 30px;
    line-height: 1.7;
  }

  .vsl-spots-counter {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--grey);
    border: 1px solid var(--grey-mid);
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
    border-top: 1px solid var(--grey-mid);
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.7;
  }

  .vsl-guarantee strong { color: var(--white); }

  /* ??? TEMOIGNAGES ??? */
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

  /* ??? FAQ ??? */
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
    border-bottom: 1px solid var(--grey-mid);
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
    border: 1px solid var(--grey-mid);
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

  /* ??? FINAL CTA ??? */
  .vsl-final-cta {
    background: var(--grey);
    border-top: 1px solid var(--grey-mid);
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
    color: var(--text-muted);
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

  .vsl-trust-item::before { content: '??'; font-size: 13px; }

  /* ??? FORM SECTION ??? */
  .vsl-form-section {
    max-width: 960px;
    margin: 0 auto;
    padding: 70px 20px;
  }

  .vsl-form-inner {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--grey-mid);
  }

  @media (min-width: 1024px) {
    .vsl-form-inner { flex-direction: row; }
  }

  .vsl-form-panel {
    flex: 1;
    padding: 40px 30px;
    background: #fff;
    color: #1a1a2e;
  }

  @media (min-width: 1024px) {
    .vsl-form-panel { padding: 50px; }
  }

  .vsl-form-title {
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 700;
    margin-bottom: 16px;
    color: #1a1a2e;
    line-height: 1.2;
    font-family: Georgia, serif;
  }

  .vsl-form-subtitle {
    color: #5B8BC1;
    font-size: 15px;
    margin-bottom: 20px;
    font-weight: 500;
  }

  .vsl-form-info-box {
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid rgba(91, 139, 193, 0.1);
  }

  .vsl-form-info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: #4a5568;
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .vsl-form-info-item:last-child { margin-bottom: 0; }

  .vsl-form-info-emoji { font-size: 18px; flex-shrink: 0; }

  .vsl-form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
  }

  .vsl-form-input,
  .vsl-form-textarea {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
    color: #1a1a2e;
    background: #fff;
    margin-bottom: 20px;
  }

  .vsl-form-input:focus,
  .vsl-form-textarea:focus {
    border-color: #5B8BC1;
    box-shadow: 0 0 0 3px rgba(91, 139, 193, 0.12);
  }

  .vsl-form-textarea { min-height: 110px; resize: vertical; }
  .vsl-form-textarea.short { min-height: 90px; }

  .vsl-form-sector-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }

  @media (min-width: 480px) {
    .vsl-form-sector-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .vsl-form-sector-label {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
    color: #2d3748;
    user-select: none;
  }

  .vsl-form-sector-label input {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    cursor: pointer;
    accent-color: #5B8BC1;
  }

  .vsl-form-sector-label.checked {
    background: linear-gradient(135deg, #5B8BC1 0%, #4a7aa8 100%);
    border-color: #5B8BC1;
    color: #fff;
  }

  .vsl-form-radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
  }

  @media (min-width: 480px) {
    .vsl-form-radio-group { flex-direction: row; }
  }

  .vsl-form-radio-label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
    color: #2d3748;
    user-select: none;
  }

  .vsl-form-radio-label input { display: none; }

  .vsl-form-radio-label.checked {
    background: linear-gradient(135deg, #5B8BC1 0%, #4a7aa8 100%);
    border-color: #5B8BC1;
    color: #fff;
  }

  .vsl-form-submit {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #5B8BC1 0%, #4a7aa8 100%);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 10px 30px rgba(91, 139, 193, 0.35);
    transition: opacity 0.2s;
  }

  .vsl-form-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .vsl-form-teaser {
    flex: 1;
    background: linear-gradient(135deg, #5B8BC1 0%, #3d6fa0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    min-height: 300px;
    position: relative;
    overflow: hidden;
  }

  .vsl-form-teaser-blur {
    position: absolute;
    inset: 0;
    filter: blur(10px);
    opacity: 0.3;
    pointer-events: none;
  }

  .vsl-form-teaser-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 320px;
  }

  .vsl-form-teaser-icon {
    width: 64px;
    height: 64px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(20px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    border: 2px solid rgba(255,255,255,0.3);
    font-size: 30px;
  }

  .vsl-form-teaser h3 {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .vsl-form-teaser p {
    font-size: 15px;
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    text-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .vsl-form-success {
    width: 100%;
    padding: 60px 40px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .vsl-form-success-icon {
    width: 90px;
    height: 90px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    font-size: 44px;
    color: #fff;
    box-shadow: 0 20px 50px rgba(16, 185, 129, 0.3);
  }

  .vsl-form-success h2 {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 16px;
    font-family: Georgia, serif;
  }

  .vsl-form-success p {
    font-size: 17px;
    color: #4a5568;
    line-height: 1.7;
    max-width: 440px;
    margin-bottom: 28px;
  }

  .vsl-form-success-email {
    padding: 16px 28px;
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
    border-radius: 12px;
    border: 2px solid rgba(91,139,193,0.2);
    font-size: 15px;
    color: #5B8BC1;
    font-weight: 600;
  }

  /* ??? FOOTER ??? */
  .vsl-footer {
    padding: 30px 20px;
    text-align: center;
    border-top: 1px solid var(--grey-mid);
    font-size: 12px;
    color: var(--text-muted);
  }

  /* ??? FADE-IN ??? */
  .vsl-fade {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .vsl-fade.visible { opacity: 1; transform: none; }

  /* ??? STICKY CTA BAR (mobile) ??? */
  .vsl-sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    padding: 14px 20px;
    background: #fff;
    border-top: 1px solid var(--grey-mid);
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
  const formRef = useRef<HTMLElement>(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', description: '', sector: [] as string[], revenue: '', available: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  const isNameValid = formData.name.trim().length > 0;
  const isEmailValid = formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  useEffect(() => {
    setShowAdditionalFields(isNameValid && isEmailValid);
  }, [isNameValid, isEmailValid]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isFormSubmitted || typeof window === 'undefined') return;
    const url = new URL(CALENDLY_URL);
    url.searchParams.set('name', formData.name);
    url.searchParams.set('email', formData.email);
    url.searchParams.set('a1', formData.description);
    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(t); window.location.href = url.toString(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isFormSubmitted, formData.name, formData.email, formData.description]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSector = (opt: string) => {
    setFormData((prev) => ({ ...prev, sector: prev.sector.includes(opt) ? prev.sector.filter((s) => s !== opt) : [...prev.sector, opt] }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(N8N_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) setIsFormSubmitted(true);
      else alert('Une erreur est survenue. Veuillez reessayer.');
    } catch { alert('Une erreur est survenue. Veuillez reessayer.'); }
    finally { setIsSubmitting(false); }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

        {/* HERO */}
        <p className="vsl-pre-headline">Pour les freelances &amp; independants ambitieux</p>

        <div className="vsl-hero-headline vsl-fade">
          <h1>
            Arrete de courir<br />apres les clients.<br />
            <em>Laisse le systeme<br />travailler.</em>
          </h1>
        </div>

        {/* VIDEO */}
        <div className="vsl-video-section vsl-fade">
          <div className="vsl-video-wrapper">
            {videoEmbedUrl ? (
              <iframe
                src={videoEmbedUrl}
                title="VSL ? Systeme client automatise"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="vsl-video-placeholder">
                <div className="vsl-play-btn">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p>Regarder la video</p>
              </div>
            )}
          </div>
        </div>

        <div className="vsl-cta-block vsl-fade">
          <div style={{ width: '100%', maxWidth: 360, height: 56 }}>
            <AuditButton
              text="Je reserve mon appel strategique"
              fontSize={13}
              onClick={scrollToForm}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p className="vsl-cta-subtext">En cliquant, tu remplis 4 questions rapides. On verifie ensemble si ton profil et ton timing matchent avec l&apos;offre. Si oui, tu choisis ton creneau.</p>
        </div>

        <hr className="vsl-divider" />

        {/* SOLUTION */}
        <section className="vsl-solution-section">
          <p className="vsl-section-label vsl-fade">La solution</p>
          <h2 className="vsl-fade">Comment le systeme<br />travaille pour toi</h2>
          <div className="vsl-steps-list">
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>01</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Attraction en continu</h3>
                <p>Des contenus optimises et des publicites ciblees attirent tes clients ideaux vers toi ? 24h/24, 7j/7, meme quand tu es en train de livrer un projet.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>02</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Qualification automatique</h3>
                <p>Chaque prospect entre dans un tunnel qui pose les bonnes questions : budget, delai, perimetre. Seuls les projets rentables et serieux arrivent jusqu&apos;a toi.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>03</span></div>
              <div className="vsl-step-line" />
              <div className="vsl-step-content">
                <h3>Nurturing & relances auto</h3>
                <p>Les prospects pas encore prets sont chauffes automatiquement ? emails, sequences, contenu de valeur ? jusqu&apos;au moment ou ils sont prets a signer.</p>
              </div>
            </div>
            <div className="vsl-step vsl-fade">
              <div className="vsl-step-num"><span>04</span></div>
              <div className="vsl-step-content">
                <h3>Tu livres. Le reste, c&apos;est nous.</h3>
                <p>Tu n&apos;interviens que pour les appels de closing et les projets confirmes. Ton pipeline se remplit pendant que tu travailles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* INCLUDED */}
        <section className="vsl-included-section">
          <div className="vsl-included-inner">
            <p className="vsl-section-label vsl-fade">Ce que tu obtiens</p>
            <h2 className="vsl-fade">Tout ce qui est inclus<br />dans le systeme</h2>
            <div className="vsl-included-grid">
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Strategie de positionnement</h3>
                <p>On affine ton offre, ton client cible et ton message pour que tu attires des prospects qualifies et payants, pas des curieux.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Tunnel de qualification</h3>
                <p>Landing page + formulaire intelligent qui filtre les prospects et collecte les informations cles avant meme le premier appel.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Sequences de nurturing</h3>
                <p>Emails et follow-ups automatiques pour maintenir le lien avec les prospects tiedes jusqu&apos;a ce qu&apos;ils soient prets a acheter.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Acquisition organique & payante</h3>
                <p>Strategie de contenu LinkedIn + campagnes publicitaires ciblees pour generer un flux regulier de demandes entrantes.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Tableau de bord simplifie</h3>
                <p>Un dashboard clair : nombre de leads, taux de conversion, cout par client. Tu sais exactement ce qui fonctionne.</p>
              </div>
              <div className="vsl-included-card vsl-fade">
                <div className="vsl-card-icon">??</div>
                <h3>Accompagnement 30 jours</h3>
                <p>Acces direct pendant les 30 premiers jours pour ajuster, optimiser et s&apos;assurer que le systeme tourne a plein regime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULAIRE DE RESERVATION */}
        <section id="form" ref={formRef} className="vsl-form-section">
          <div className="vsl-form-inner" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            {!isFormSubmitted ? (
              <>
                {/* Panneau formulaire */}
                <motion.div
                  className="vsl-form-panel"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="vsl-form-title">Renseignement pour l&apos;appel de decouverte</h2>
                  <p className="vsl-form-subtitle">Durant cet appel, nous allons :</p>
                  <div className="vsl-form-info-box">
                    {DISCOVERY_ITEMS.map((item, i) => (
                      <motion.p
                        key={i}
                        className="vsl-form-info-item"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="vsl-form-info-emoji">{item.emoji}</span>
                        <span>{isMobile ? item.short : item.full}</span>
                      </motion.p>
                    ))}
                  </div>
                  <p style={{ color: '#4a5568', fontSize: 14, fontStyle: 'italic', marginBottom: 24 }}>
                    Permettez nous de vous poser quelques questions pour mieux comprendre vos besoins.
                  </p>

                  <form onSubmit={handleFormSubmit}>
                    <label className="vsl-form-label">Nom *</label>
                    <input className="vsl-form-input" type="text" name="name" value={formData.name} onChange={handleFormChange} required />

                    <label className="vsl-form-label">Adresse electronique *</label>
                    <input className="vsl-form-input" type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="adresse@place.holder" required />

                    {showAdditionalFields && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <label className="vsl-form-label">Decrivez au mieux ce que vous attendez de nous *</label>
                        <textarea className="vsl-form-textarea" name="description" value={formData.description} onChange={handleFormChange} required />

                        <label className="vsl-form-label">Quel est votre secteur d&apos;activite ? *</label>
                        <div className="vsl-form-sector-grid">
                          {SECTOR_OPTIONS.map((opt) => (
                            <label key={opt} className={`vsl-form-sector-label ${formData.sector.includes(opt) ? 'checked' : ''}`}>
                              <input type="checkbox" checked={formData.sector.includes(opt)} onChange={() => toggleSector(opt)} />
                              {opt}
                            </label>
                          ))}
                        </div>

                        <label className="vsl-form-label">Quel est ton chiffre d&apos;affaires ? *</label>
                        <textarea className="vsl-form-textarea short" name="revenue" value={formData.revenue} onChange={handleFormChange} placeholder="Decrivez votre CA..." required />

                        <label className="vsl-form-label">Es-tu sur a 100% d&apos;etre disponible a l&apos;heure que tu as choisie ? *</label>
                        <div className="vsl-form-radio-group">
                          {['Oui je serai present', 'Non je ne suis pas sur'].map((opt) => (
                            <label key={opt} className={`vsl-form-radio-label ${formData.available === opt ? 'checked' : ''}`}>
                              <input type="radio" name="available" value={opt} checked={formData.available === opt} onChange={handleFormChange} required />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      className="vsl-form-submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Continuer ?'}
                    </motion.button>
                  </form>
                </motion.div>

                {/* Panneau Calendly flou */}
                <div className="vsl-form-teaser">
                  <motion.div
                    className="vsl-form-teaser-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="vsl-form-teaser-icon">??</div>
                    <h3>Votre creneau vous attend</h3>
                    <p>Merci de remplir le formulaire avant de choisir votre creneau horaire.</p>
                  </motion.div>
                </div>
              </>
            ) : (
              /* Succes */
              <motion.div
                className="vsl-form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="vsl-form-success-icon">?</div>
                <h2>Parfait !</h2>
                <p>
                  Vos informations ont ete enregistrees avec succes.<br /><br />
                  <strong style={{ color: '#5B8BC1', fontSize: 20 }}>
                    Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}...
                  </strong>
                </p>
                <div className="vsl-form-success-email">?? {formData.email}</div>
              </motion.div>
            )}
          </div>
        </section>

        <hr className="vsl-divider" />

        {/* FOUNDER OFFER */}
        <section className="vsl-founder-section">
          <div className="vsl-founder-box vsl-fade">
            <h2>Offre reservee aux<br />5 premiers independants</h2>
            <p>
              Je demarre avec un groupe restreint de freelances pour deployer ce systeme, l&apos;affiner et construire des resultats reels ensemble. En echange de ta confiance, tu beneficies d&apos;un tarif fondateur et d&apos;un acces prioritaire a toutes les ameliorations futures.
            </p>
            <div className="vsl-spots-counter">
              <div className="vsl-spots-dot" />
              <span>5 places disponibles ce mois-ci</span>
            </div>
            <div style={{ marginTop: 24, width: '100%', maxWidth: 360, height: 56 }}>
              <AuditButton
                text="Je reserve mon appel strategique"
                fontSize={13}
                onClick={scrollToForm}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="vsl-guarantee">
              <strong>Garantie 30 jours.</strong> Si tu n&apos;as pas recu au moins 5 leads qualifies dans les 30 jours suivant le lancement du systeme, je te rembourse integralement. Aucune question posee.
            </div>
          </div>
        </section>

        <hr className="vsl-divider" />

        {/* FAQ */}
        <section className="vsl-faq-section">
          <h2 className="vsl-fade">Questions frequentes</h2>

          {[
            {
              q: "Je n'ai pas le temps en ce moment",
              a: "On peut avancer par etapes. L'appel dure 20 min ? juste pour voir si ton profil et ton timing matchent. Si c'est pas le bon moment, on en reparle plus tard, sans engagement.",
            },
            {
              q: "C'est cher / je n'ai pas le budget",
              a: "Garantie 30 jours : si tu n'as pas recu au moins 5 leads qualifies, remboursement integral. L'objectif est que le ROI couvre l'investissement des le premier mois. Le budget pub peut rester modeste (150?300?/mois) au demarrage.",
            },
            {
              q: "J'ai deja essaye des trucs qui n'ont pas marche",
              a: "La difference ici, c'est la structure : pas juste du contenu ou de la pub, mais un tunnel (capture + qualification + nurturing) qui filtre et chauffe les prospects. On connecte tout en un systeme coherent.",
            },
            {
              q: "Comment je sais que c'est pas du flan ?",
              a: "Temoignages sur la page, garantie 30 jours par ecrit, et tout le processus est detaille dans la video. Tu peux regarder avant de t'engager.",
            },
            {
              q: "Je debute en freelance, est-ce que ca marche pour moi ?",
              a: "Ce systeme est concu pour les independants qui ont deja une offre definie et quelques clients, et qui veulent stabiliser et scaler leurs revenus. Si tu debutes completement, on en parle lors de l'appel.",
            },
            {
              q: "Combien de temps avant de voir les premiers resultats ?",
              a: "Le systeme est configure en 7 a 10 jours. Les premiers prospects qualifies arrivent generalement dans les 2 a 3 premieres semaines selon ton marche et ton budget.",
            },
            {
              q: "J'ai deja essaye LinkedIn sans resultats, pourquoi ca serait different ?",
              a: "La difference, c'est la structure. Poster du contenu sans systeme de capture et de nurturing derriere, ca ne convertit pas. On connecte chaque point de contact a un pipeline automatise.",
            },
            {
              q: "Quel budget pub faut-il prevoir ?",
              a: "On peut demarrer avec des budgets modestes (150-300?/mois) et les augmenter progressivement selon le retour sur investissement. L'objectif est que le cout d'acquisition soit couvert par les premiers contrats.",
            },
            {
              q: "Et si ca ne fonctionne pas pour moi ?",
              a: "La garantie 30 jours est la pour ca. Si tu n'es pas satisfait des resultats dans le premier mois, je rembourse integralement. Tu ne prends aucun risque financier.",
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

        {/* FOOTER */}
        <footer className="vsl-footer">
          ? 2026 ? Mentions legales ? Politique de confidentialite
        </footer>

        {/* STICKY CTA (mobile, after 300px scroll) */}
        <div className={`vsl-sticky-cta ${stickyCtaVisible ? 'visible' : ''}`} aria-hidden="true">
          <div style={{ width: '100%', maxWidth: 360, height: 56 }}>
            <AuditButton
              text="Je reserve mon appel strategique"
              fontSize={13}
              onClick={scrollToForm}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

      </div>
    </>
  );
}

