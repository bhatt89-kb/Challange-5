'use client';

import { useState } from 'react';
import EventForm from '@/components/EventForm';
import PlanDisplay from '@/components/PlanDisplay';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useEventPlanner } from '@/hooks/useEventPlanner';
import { translations, Language } from '@/lib/translations';
import { EventInput } from '@/schemas/eventSchemas';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const { plan, isLoading, error, generatePlan, clearPlan, clearError } = useEventPlanner();

  const t = translations[language];

  const handleSubmit = async (data: EventInput): Promise<void> => {
    clearError();
    try {
      await generatePlan(data);
    } catch {
      // Error is already set by the hook
    }
  };

  const toggleLanguage = (): void => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t.skipToContent}
      </a>

      <div className="container">
        <header className="header">
          <h1 className="title">{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
          <button
            onClick={toggleLanguage}
            className="language-toggle"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </header>

        <main id="main-content" className="main">
          <ErrorBoundary>
            {!plan ? (
              <section aria-labelledby="form-title">
                <h2 id="form-title" className="section-title">{t.form.title}</h2>
                {error && (
                  <div className="error-banner" role="alert">
                    {error}
                  </div>
                )}
                <EventForm
                  onSubmit={handleSubmit}
                  language={language}
                  isLoading={isLoading}
                />
              </section>
            ) : (
              <section aria-labelledby="plan-title">
                <button
                  onClick={clearPlan}
                  className="back-button"
                  aria-label="Create new plan"
                >
                  ← {language === 'en' ? 'New Plan' : 'नई योजना'}
                </button>
                <PlanDisplay plan={plan} language={language} />
              </section>
            )}
          </ErrorBoundary>
        </main>

        <footer className="footer">
          <p>
            {language === 'en'
              ? '© 2024 GenAI Event Planner. Built with Next.js 14 & Google Gemini.'
              : '© 2024 जेनएआई इवेंट प्लानर। Next.js 14 और Google Gemini के साथ निर्मित।'}
          </p>
        </footer>
      </div>
    </>
  );
}
