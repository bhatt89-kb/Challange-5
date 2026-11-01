'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { EventInput, EventType } from '@/schemas/eventSchemas';
import { translations, Language } from '@/lib/translations';

interface EventFormProps {
  onSubmit: (data: EventInput) => Promise<void>;
  language: Language;
  isLoading: boolean;
}

export default function EventForm({ onSubmit, language, isLoading }: EventFormProps) {
  const t = translations[language];
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    location: '',
    budget: '',
    guestCount: '',
    additionalDetails: '',
    weddingStyle: 'traditional',
    ceremonies: '',
    ageGroup: 'adult',
    theme: '',
    eventCategory: 'festival',
    isPublic: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    try {
      const baseData = {
        eventType,
        eventName: formData.eventName,
        date: formData.date,
        location: formData.location,
        budget: Number(formData.budget),
        guestCount: Number(formData.guestCount),
        language,
        additionalDetails: formData.additionalDetails || undefined
      };

      let eventData: EventInput;

      if (eventType === 'wedding') {
        eventData = {
          ...baseData,
          eventType: 'wedding',
          weddingStyle: formData.weddingStyle as 'traditional' | 'modern' | 'destination' | 'intimate',
          ceremonies: formData.ceremonies.split(',').map(c => c.trim()).filter(Boolean)
        };
      } else if (eventType === 'birthday') {
        eventData = {
          ...baseData,
          eventType: 'birthday',
          ageGroup: formData.ageGroup as 'child' | 'teen' | 'adult' | 'senior',
          theme: formData.theme || undefined
        };
      } else {
        eventData = {
          ...baseData,
          eventType: 'community',
          eventCategory: formData.eventCategory as 'festival' | 'charity' | 'sports' | 'cultural' | 'social',
          isPublic: formData.isPublic
        };
      }

      await onSubmit(eventData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form" noValidate>
      <div className="form-group">
        <label htmlFor="eventType" className="form-label">
          {t.form.eventType} <span className="required">*</span>
        </label>
        <select
          id="eventType"
          name="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          className="form-select"
          disabled={isLoading}
          required
        >
          <option value="wedding">{t.eventTypes.wedding}</option>
          <option value="birthday">{t.eventTypes.birthday}</option>
          <option value="community">{t.eventTypes.community}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="eventName" className="form-label">
          {t.form.eventName} <span className="required">*</span>
        </label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          className={`form-input ${errors.eventName ? 'error' : ''}`}
          disabled={isLoading}
          required
          aria-required="true"
          aria-invalid={!!errors.eventName}
          aria-describedby={errors.eventName ? 'eventName-error' : undefined}
        />
        {errors.eventName && (
          <span id="eventName-error" className="error-message" role="alert">
            {errors.eventName}
          </span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            {t.form.date} <span className="required">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'error' : ''}`}
            disabled={isLoading}
            required
            aria-required="true"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <span id="date-error" className="error-message" role="alert">
              {errors.date}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            {t.form.location} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`form-input ${errors.location ? 'error' : ''}`}
            disabled={isLoading}
            required
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
          />
          {errors.location && (
            <span id="location-error" className="error-message" role="alert">
              {errors.location}
            </span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="budget" className="form-label">
            {t.form.budget} <span className="required">*</span>
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={`form-input ${errors.budget ? 'error' : ''}`}
            disabled={isLoading}
            min="100"
            required
            aria-required="true"
            aria-invalid={!!errors.budget}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
          />
          {errors.budget && (
            <span id="budget-error" className="error-message" role="alert">
              {errors.budget}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="guestCount" className="form-label">
            {t.form.guestCount} <span className="required">*</span>
          </label>
          <input
            type="number"
            id="guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            className={`form-input ${errors.guestCount ? 'error' : ''}`}
            disabled={isLoading}
            min="1"
            required
            aria-required="true"
            aria-invalid={!!errors.guestCount}
            aria-describedby={errors.guestCount ? 'guestCount-error' : undefined}
          />
          {errors.guestCount && (
            <span id="guestCount-error" className="error-message" role="alert">
              {errors.guestCount}
            </span>
          )}
        </div>
      </div>

      {eventType === 'wedding' && (
        <>
          <div className="form-group">
            <label htmlFor="weddingStyle" className="form-label">
              {t.form.weddingStyle}
            </label>
            <select
              id="weddingStyle"
              name="weddingStyle"
              value={formData.weddingStyle}
              onChange={handleChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="traditional">{t.weddingStyles.traditional}</option>
              <option value="modern">{t.weddingStyles.modern}</option>
              <option value="destination">{t.weddingStyles.destination}</option>
              <option value="intimate">{t.weddingStyles.intimate}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ceremonies" className="form-label">
              {t.form.ceremonies}
            </label>
            <input
              type="text"
              id="ceremonies"
              name="ceremonies"
              value={formData.ceremonies}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
              placeholder="Mehendi, Sangeet, Wedding"
            />
          </div>
        </>
      )}

      {eventType === 'birthday' && (
        <>
          <div className="form-group">
            <label htmlFor="ageGroup" className="form-label">
              {t.form.ageGroup}
            </label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="child">{t.ageGroups.child}</option>
              <option value="teen">{t.ageGroups.teen}</option>
              <option value="adult">{t.ageGroups.adult}</option>
              <option value="senior">{t.ageGroups.senior}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="theme" className="form-label">
              {t.form.theme}
            </label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {eventType === 'community' && (
        <>
          <div className="form-group">
            <label htmlFor="eventCategory" className="form-label">
              {t.form.eventCategory}
            </label>
            <select
              id="eventCategory"
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="festival">{t.categories.festival}</option>
              <option value="charity">{t.categories.charity}</option>
              <option value="sports">{t.categories.sports}</option>
              <option value="cultural">{t.categories.cultural}</option>
              <option value="social">{t.categories.social}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                disabled={isLoading}
              />
              {t.form.isPublic}
            </label>
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="additionalDetails" className="form-label">
          {t.form.additionalDetails}
        </label>
        <textarea
          id="additionalDetails"
          name="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleChange}
          className="form-textarea"
          disabled={isLoading}
          rows={4}
          maxLength={1000}
        />
      </div>

      {errors.submit && (
        <div className="error-message" role="alert">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? t.form.generating : t.form.submit}
      </button>
    </form>
  );
}
