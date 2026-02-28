'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CALENDLY_URL = 'https://calendly.com/buffedbean/30min';
const CALENDLY_REDIRECT = process.env.NEXT_PUBLIC_VSL_CALENDLY_URL || CALENDLY_URL;
const N8N_WEBHOOK = 'https://n8n.srv933307.hstgr.cloud/webhook/77ccd585-25f2-4fa5-bdee-6313eaa90d4f';

const applyStyles = `
  .vsl-apply-root {
    --black: #0a0a0a;
    --white: #f5f2ec;
    --gold: #c9a84c;
    --red: #d63b2f;
    --grey: #1a1a1a;
    --grey-mid: #2a2a2a;
    --text-muted: #888;
    font-family: var(--font-dm-sans), sans-serif;
    min-height: 100vh;
    background: var(--black);
    color: var(--white);
  }

  .vsl-apply-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  @media (min-width: 1024px) {
    .vsl-apply-container {
      flex-direction: row;
    }
  }

  .vsl-apply-form-panel {
    flex: 1;
    padding: 32px 20px 48px;
    background: var(--black);
  }

  @media (min-width: 1024px) {
    .vsl-apply-form-panel {
      padding: 50px;
      max-width: 560px;
    }
  }

  .vsl-apply-back {
    display: inline-block;
    font-size: 14px;
    color: var(--gold);
    margin-bottom: 24px;
    text-decoration: none;
  }

  .vsl-apply-back:hover { text-decoration: underline; }

  .vsl-apply-title {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 32px;
    letter-spacing: 0.02em;
    margin-bottom: 12px;
    line-height: 1.1;
  }

  .vsl-apply-subtitle {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .vsl-apply-box {
    background: var(--grey);
    border: 1px solid var(--grey-mid);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 28px;
  }

  .vsl-apply-box-item {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .vsl-apply-box-item:last-child { margin-bottom: 0; }

  .vsl-apply-form label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--white);
  }

  .vsl-apply-form input,
  .vsl-apply-form textarea {
    width: 100%;
    padding: 14px 16px;
    font-size: 15px;
    font-family: inherit;
    background: var(--grey);
    border: 1px solid var(--grey-mid);
    border-radius: 8px;
    color: var(--white);
    margin-bottom: 20px;
    transition: border-color 0.2s;
  }

  .vsl-apply-form input:focus,
  .vsl-apply-form textarea:focus {
    outline: none;
    border-color: var(--gold);
  }

  .vsl-apply-form textarea {
    min-height: 100px;
    resize: vertical;
  }

  .vsl-apply-form textarea.tall { min-height: 90px; }

  .vsl-apply-sector-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  @media (min-width: 480px) {
    .vsl-apply-sector-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .vsl-apply-sector-label {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    background: var(--grey);
    border: 2px solid var(--grey-mid);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--white);
    font-size: 14px;
  }

  .vsl-apply-sector-label:hover { border-color: var(--gold); }

  .vsl-apply-sector-label.checked {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.12);
  }

  .vsl-apply-sector-label input {
    margin: 0 10px 0 0;
    width: 18px;
    height: 18px;
    accent-color: var(--gold);
  }

  .vsl-apply-radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
  }

  @media (min-width: 480px) {
    .vsl-apply-radio-group { flex-direction: row; }
  }

  .vsl-apply-radio-label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    background: var(--grey);
    border: 2px solid var(--grey-mid);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--white);
    font-size: 14px;
    font-weight: 500;
  }

  .vsl-apply-radio-label:hover { border-color: var(--gold); }

  .vsl-apply-radio-label.checked {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.12);
  }

  .vsl-apply-radio-label input { display: none; }

  .vsl-apply-submit {
    width: 100%;
    padding: 18px;
    background: var(--red);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;
  }

  .vsl-apply-submit:hover:not(:disabled) { background: #c03020; }

  .vsl-apply-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .vsl-apply-teaser {
    flex: 1;
    min-height: 320px;
    background: linear-gradient(135deg, var(--grey) 0%, #252525 100%);
    border-left: none;
    border-top: 1px solid var(--grey-mid);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }

  @media (min-width: 1024px) {
    .vsl-apply-teaser {
      min-height: auto;
      border-top: none;
      border-left: 1px solid var(--grey-mid);
    }
  }

  .vsl-apply-success {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
    background: var(--black);
  }

  .vsl-apply-success-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    font-size: 40px;
    color: #fff;
  }

  .vsl-apply-success h2 {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 36px;
    margin-bottom: 12px;
  }

  .vsl-apply-success p {
    color: var(--text-muted);
    font-size: 16px;
    margin-bottom: 24px;
    max-width: 400px;
    line-height: 1.6;
  }

  .vsl-apply-success strong { color: var(--gold); }

  .vsl-apply-email-box {
    padding: 16px 24px;
    background: var(--grey);
    border-radius: 8px;
    border: 1px solid var(--grey-mid);
    font-size: 14px;
    color: var(--gold);
    font-weight: 600;
  }
`;

const DISCOVERY_ITEMS = [
  { emoji: '📍', short: 'Analyser ton activité', full: 'Analyser ton activité en profondeur → Identifier comment tu génères de la valeur, tes flux de travail actuels et tes leviers de croissance.' },
  { emoji: '🤖', short: 'Opportunités d\'automatisation', full: 'Détecter les opportunités d\'automatisation et d\'optimisation → Repérer les tâches répétitives que l\'IA peut fluidifier.' },
  { emoji: '📊', short: 'Stratégie d\'acquisition', full: 'Faire le point sur ta stratégie d\'acquisition et d\'opération → Comprendre comment tu attires et convertis tes clients.' },
  { emoji: '⚙️', short: 'Plan d\'action personnalisé', full: 'Te donner un plan d\'action clair et personnalisé → Intégrer l\'IA dans ton business et scaler plus vite.' },
];

const SECTOR_OPTIONS = ['Immobilier', 'Coaching / Formation', 'Services B2B', 'Bâtiment / Artisanat', 'Restauration', 'Bien être / Santé', 'Autre'];

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    sector: [] as string[],
    revenue: '',
    available: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isNameValid = formData.name.trim().length > 0;
  const isEmailValid = formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  useEffect(() => {
    setShowAdditionalFields(isNameValid && isEmailValid);
  }, [isNameValid, isEmailValid]);

  useEffect(() => {
    if (!isFormSubmitted || typeof window === 'undefined') return;
    const url = new URL(CALENDLY_REDIRECT);
    url.searchParams.set('name', formData.name);
    url.searchParams.set('email', formData.email);
    url.searchParams.set('a1', formData.description);

    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          window.location.href = url.toString();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isFormSubmitted, formData.name, formData.email, formData.description]);

  const canSubmit = showAdditionalFields
    ? formData.description.trim() && formData.sector.length > 0 && formData.revenue.trim() && formData.available
    : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showAdditionalFields && (!formData.sector.length || !formData.revenue.trim() || !formData.available)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setIsFormSubmitted(true);
      else alert('Une erreur est survenue. Veuillez réessayer.');
    } catch {
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSector = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      sector: prev.sector.includes(option)
        ? prev.sector.filter((s) => s !== option)
        : [...prev.sector, option],
    }));
  };

  if (isFormSubmitted) {
    return (
      <>
        <style>{applyStyles}</style>
        <motion.div
          className="vsl-apply-success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="vsl-apply-success-icon">✓</div>
          <h2>Parfait !</h2>
          <p>
            Vos informations ont été enregistrées avec succès.
            <br /><br />
            <strong>Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}…</strong>
          </p>
          <div className="vsl-apply-email-box">📧 {formData.email}</div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <style>{applyStyles}</style>
      <div
        className="vsl-apply-container"
        style={{
          flexDirection: isMobile || isTablet ? 'column' : 'row',
        }}
      >
        <motion.div
          className="vsl-apply-form-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="/vsl" className="vsl-apply-back">← Retour à la page VSL</a>

          <h2 className="vsl-apply-title">Renseignement pour l&apos;appel de découverte</h2>
          <p style={{ color: 'var(--gold)', fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
            Durant cet appel, nous allons :
          </p>
          <div className="vsl-apply-box">
            {DISCOVERY_ITEMS.map((item, i) => (
              <motion.p
                key={i}
                className="vsl-apply-box-item"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.emoji}</span>
                <span>{isMobile ? item.short : item.full}</span>
              </motion.p>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', marginBottom: 24 }}>
            Réponds à quelques questions pour qu’on prépare au mieux ton créneau.
          </p>

          <form className="vsl-apply-form" onSubmit={handleSubmit}>
            <label>Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Adresse électronique *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="adresse@exemple.com"
              required
            />

            {showAdditionalFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <label>Décrivez au mieux ce que vous attendez de nous *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                <label>Quel est votre secteur d&apos;activité ? *</label>
                <div className="vsl-apply-sector-grid">
                  {SECTOR_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`vsl-apply-sector-label ${formData.sector.includes(opt) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sector.includes(opt)}
                        onChange={() => toggleSector(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                <label>Quel est ton chiffre d&apos;affaires ? *</label>
                <textarea
                  name="revenue"
                  className="tall"
                  value={formData.revenue}
                  onChange={handleChange}
                  placeholder="Décrivez votre CA..."
                  required
                />

                <label>Es-tu sûr à 100% d&apos;être disponible à l&apos;heure que tu as choisie ? *</label>
                <div className="vsl-apply-radio-group">
                  {['Oui je serai présent', 'Non je ne suis pas sûr'].map((opt) => (
                    <label
                      key={opt}
                      className={`vsl-apply-radio-label ${formData.available === opt ? 'checked' : ''}`}
                    >
                      <input
                        type="radio"
                        name="available"
                        value={opt}
                        checked={formData.available === opt}
                        onChange={handleChange}
                        required
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="vsl-apply-submit"
              disabled={isSubmitting || (showAdditionalFields && !canSubmit)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Envoi en cours…' : 'Continuer →'}
            </motion.button>
          </form>
        </motion.div>

        <div className="vsl-apply-teaser">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ textAlign: 'center', maxWidth: 360 }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 20px',
                background: 'rgba(201, 168, 76, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}
            >
              📅
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
              Ton créneau t&apos;attend
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.5 }}>
              Remplis le formulaire puis tu pourras choisir ton horaire sur Calendly.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
