import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function StepShell({ title, description, children, onBack, isFirstStep, isSubmitting, nextLabel = 'Continue' }) {
  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      </div>

      <div className="flex flex-col gap-5">{children}</div>

      <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className="btn-secondary"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {nextLabel} {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
