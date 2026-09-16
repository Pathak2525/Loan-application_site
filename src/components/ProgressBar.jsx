import { Check } from 'lucide-react';
import { STEPS, STEP_LABELS } from '../store/loanStore.js';

export default function ProgressBar({ currentStepIndex, furthestStepIndex, onStepClick }) {
  const percent = Math.round((currentStepIndex / (STEPS.length - 1)) * 100);

  return (
    <div className="w-full">
      {/* Mobile: compact bar + label */}
      <div className="mb-4 sm:hidden">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
          <span>{percent}% complete</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-ink-900">{STEP_LABELS[STEPS[currentStepIndex]]}</p>
      </div>

      {/* Desktop: numbered vertical/horizontal step list */}
      <ol className="hidden sm:flex sm:flex-col sm:gap-1">
        {STEPS.map((key, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isReachable = index <= furthestStepIndex;
          return (
            <li key={key}>
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && onStepClick(index)}
                className={[
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition',
                  isCurrent ? 'bg-navy-700 text-white' : 'text-ink-700 hover:bg-sand-100',
                  !isReachable && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isCurrent
                      ? 'bg-white text-navy-700'
                      : isDone
                      ? 'bg-teal-500 text-white'
                      : 'bg-ink-100 text-ink-500',
                  ].join(' ')}
                >
                  {isDone ? <Check size={14} /> : index + 1}
                </span>
                {STEP_LABELS[key]}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
