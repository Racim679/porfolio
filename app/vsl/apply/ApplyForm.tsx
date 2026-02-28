'use client';

import { useState, FormEvent } from 'react';

const applyStyles = `
  .vsl-apply-root {
    --black: #0a0a0a;
    --white: #f5f2ec;
    --gold: #c9a84c;
    --red: #d63b2f;
    --grey: #1a1a1a;
    --text-muted: #888;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-dm-sans), sans-serif;
    min-height: 100vh;
    padding: 48px 20px 80px;
  }

  .vsl-apply-inner {
    max-width: 480px;
    margin: 0 auto;
  }

  .vsl-apply-title {
    font-family: var(--font-bebas-neue), sans-serif;
    font-size: 36px;
    letter-spacing: 0.02em;
    margin-bottom: 12px;
    line-height: 1;
  }

  .vsl-apply-subtitle {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 40px;
  }

  .vsl-apply-form label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--white);
  }

  .vsl-apply-form select {
    width: 100%;
    padding: 14px 16px;
    font-size: 15px;
    font-family: inherit;
    background: var(--grey);
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: var(--white);
    margin-bottom: 24px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
  }

  .vsl-apply-form select:focus {
    outline: none;
    border-color: var(--gold);
  }

  .vsl-apply-form select option {
    background: var(--grey);
    color: var(--white);
  }

  .vsl-apply-submit {
    display: block;
    width: 100%;
    background: var(--red);
    color: #fff;
    font-family: inherit;
    font-size: 17px;
    font-weight: 600;
    padding: 18px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 32px;
    transition: background 0.2s;
  }

  .vsl-apply-submit:hover {
    background: #c03020;
  }

  .vsl-apply-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .vsl-apply-message {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 24px;
    padding: 16px;
    background: var(--grey);
    border-radius: 4px;
  }

  .vsl-apply-back {
    display: inline-block;
    font-size: 14px;
    color: var(--gold);
    margin-bottom: 32px;
    text-decoration: none;
  }

  .vsl-apply-back:hover {
    text-decoration: underline;
  }
`;

const BUDGET_OPTIONS = [
  { value: '', label: '— Choisir —' },
  { value: '500-1k', label: '500 – 1 000 €' },
  { value: '1k-2k', label: '1 000 – 2 000 €' },
  { value: '2k+', label: '2 000 € et plus' },
  { value: 'undefined', label: 'Pas encore défini' },
];

const YES_NO_OPTIONS = [
  { value: '', label: '— Choisir —' },
  { value: 'yes', label: 'Oui' },
  { value: 'no', label: 'Non' },
];

const NEED_OPTIONS = [
  { value: '', label: '— Choisir —' },
  { value: 'yes', label: 'Oui' },
  { value: 'no', label: 'Non' },
  { value: 'unsure', label: 'Pas sûr' },
];

const TIMING_OPTIONS = [
  { value: '', label: '— Choisir —' },
  { value: 'yes', label: 'Oui, dans les 2–4 prochaines semaines' },
  { value: 'later', label: 'Plus tard' },
  { value: 'unsure', label: 'Pas sûr' },
];

export default function ApplyForm() {
  const [budget, setBudget] = useState('');
  const [authority, setAuthority] = useState('');
  const [need, setNeed] = useState('');
  const [timing, setTiming] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [configMissing, setConfigMissing] = useState(false);

  // Set NEXT_PUBLIC_VSL_CALENDLY_URL in .env.local to redirect to your Calendly after the form
  const calendlyUrl = process.env.NEXT_PUBLIC_VSL_CALENDLY_URL;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!calendlyUrl) {
      setConfigMissing(true);
      return;
    }
    setSubmitted(true);
    window.location.href = calendlyUrl;
  };

  const isValid = budget && authority && need && timing;

  return (
    <>
      <style>{applyStyles}</style>
      <div className="vsl-apply-root">
        <div className="vsl-apply-inner">
          <a href="/vsl" className="vsl-apply-back">
            ← Retour à la page VSL
          </a>

          <h1 className="vsl-apply-title">Réserver mon appel stratégique</h1>
          <p className="vsl-apply-subtitle">
            Réponds à 4 questions rapides. On vérifie ensemble si ton profil et ton timing matchent avec l&apos;offre. Si oui, tu choisis ton créneau.
          </p>

          <form className="vsl-apply-form" onSubmit={handleSubmit}>
            <label htmlFor="budget">Quel investissement es-tu prêt à mettre pour ce type d&apos;accompagnement ?</label>
            <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} required>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label htmlFor="authority">C&apos;est toi qui décides pour ton activité ?</label>
            <select id="authority" value={authority} onChange={(e) => setAuthority(e.target.value)} required>
              {YES_NO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label htmlFor="need">Tu es en train de chercher à remplir ton pipeline / arrêter de prospecter à la main ?</label>
            <select id="need" value={need} onChange={(e) => setNeed(e.target.value)} required>
              {NEED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label htmlFor="timing">Tu veux avancer dans les 2–4 prochaines semaines ?</label>
            <select id="timing" value={timing} onChange={(e) => setTiming(e.target.value)} required>
              {TIMING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button type="submit" className="vsl-apply-submit" disabled={!isValid || submitted}>
              {submitted ? 'Redirection…' : '→ Choisir mon créneau'}
            </button>
          </form>

          {configMissing && (
            <p className="vsl-apply-message">
              Le lien de réservation n&apos;est pas encore configuré (NEXT_PUBLIC_VSL_CALENDLY_URL). Contacte-moi directement pour réserver ton appel.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
