'use client';

import { ChevronDown, CircleCheck, TriangleAlert } from 'lucide-react';
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { sendContactMessage, type ContactFormState, type ContactFormValues } from '@/app/contact/actions';
import type { ContactFormCopy } from '@/lib/content/schemas';
import { cx } from '@/lib/format';

const EMPTY: ContactFormValues = { name: '', email: '', phone: '', topic: '', message: '' };

/**
 * The contact form (RULES P22). Every word is the backend's; the parts that
 * may carry links (the consent line and the three outcomes) arrive already
 * rendered from the server, so this file never parses content marks.
 */
export function ContactForm({
  copy,
  consent,
  success,
  failure,
  limited,
}: {
  copy: Omit<ContactFormCopy, 'consent' | 'successBody' | 'errorBody' | 'rateLimitedBody'>;
  consent: ReactNode;
  success: ReactNode;
  failure: ReactNode;
  limited: ReactNode;
}) {
  const [state, send, sending] = useActionState<ContactFormState, FormData>(sendContactMessage, { status: 'idle' });
  // Controlled, so what was typed survives a refusal: the form is never emptied until it is sent.
  const [values, setValues] = useState<ContactFormValues>({ ...EMPTY, topic: copy.topics[0] ?? '' });
  // When the form was drawn, so the server can tell a person from a script.
  const drawnAt = useRef(0);
  useEffect(() => {
    drawnAt.current = Date.now();
  }, []);
  const submit = (form: FormData) => {
    form.set('startedAt', String(drawnAt.current));
    send(form);
  };

  if (state.status === 'sent') {
    return (
      <div className="flex gap-4" role="status">
        <span className="icon-box [--size:2.75rem]">
          <CircleCheck className="size-4.5 text-positive" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-medium text-ink">{copy.successTitle}</h3>
          <p className="mt-1 leading-relaxed text-ink-2">{success}</p>
        </div>
      </div>
    );
  }

  const fields = state.status === 'invalid' ? state.fields : {};
  const set = (key: keyof ContactFormValues) => (event: { target: { value: string } }) =>
    setValues(current => ({ ...current, [key]: event.target.value }));

  return (
    <form action={submit} className="space-y-5">
      {state.status === 'limited' || state.status === 'error' ? (
        <div className="well flex gap-3 p-4 text-sm leading-relaxed text-ink-2" role="alert">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden="true" />
          <p className="prose-legal text-sm">{state.status === 'limited' ? limited : failure}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label={copy.nameLabel} error={fields.name}>
          <input
            id="contact-name"
            name="name"
            className="input"
            autoComplete="name"
            required
            maxLength={80}
            value={values.name}
            onChange={set('name')}
            aria-invalid={fields.name ? true : undefined}
            aria-describedby={fields.name ? 'contact-name-error' : undefined}
          />
        </Field>
        <Field id="contact-email" label={copy.emailLabel} error={fields.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            required
            maxLength={160}
            value={values.email}
            onChange={set('email')}
            aria-invalid={fields.email ? true : undefined}
            aria-describedby={fields.email ? 'contact-email-error' : undefined}
          />
        </Field>
      </div>

      <div className={cx('grid gap-5', copy.phoneLabel && 'sm:grid-cols-2')}>
        {copy.phoneLabel ? (
          <Field id="contact-phone" label={copy.phoneLabel} error={fields.phone}>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              className="input"
              autoComplete="tel"
              maxLength={20}
              value={values.phone}
              onChange={set('phone')}
              aria-invalid={fields.phone ? true : undefined}
              aria-describedby={fields.phone ? 'contact-phone-error' : undefined}
            />
          </Field>
        ) : null}
        <Field id="contact-topic" label={copy.topicLabel} error={fields.topic}>
          <div className="relative">
            <select id="contact-topic" name="topic" className="input" value={values.topic} onChange={set('topic')}>
              {copy.topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
          </div>
        </Field>
      </div>

      <Field id="contact-message" label={copy.messageLabel} error={fields.message}>
        <textarea
          id="contact-message"
          name="message"
          className="input"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          placeholder={copy.messagePlaceholder ?? undefined}
          value={values.message}
          onChange={set('message')}
          aria-invalid={fields.message ? true : undefined}
          aria-describedby={fields.message ? 'contact-message-error' : undefined}
        />
      </Field>

      {/* Not for people: a box only a script fills in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {consent ? <p className="prose-legal max-w-md text-sm leading-relaxed">{consent}</p> : <span />}
        <button type="submit" className="btn btn-primary shrink-0" disabled={sending}>
          {sending ? copy.sendingLabel : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
