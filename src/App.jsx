import { useState } from 'react';
import { Landmark, X } from 'lucide-react';
import { useLoanStore, STEPS } from './store/loanStore.js';
import ProgressBar from './components/ProgressBar.jsx';

import LoanType from './pages/LoanType.jsx';
import PersonalDetails from './pages/PersonalDetails.jsx';
import ContactDetails from './pages/ContactDetails.jsx';
import AddressDetails from './pages/AddressDetails.jsx';
import EmploymentDetails from './pages/EmploymentDetails.jsx';
import LoanDetails from './pages/LoanDetails.jsx';
import Documents from './pages/Documents.jsx';
import Verification from './pages/Verification.jsx';
import Signature from './pages/Signature.jsx';
import Review from './pages/Review.jsx';

const STEP_COMPONENTS = {
  loanType: LoanType,
  personalDetails: PersonalDetails,
  contactDetails: ContactDetails,
  addressDetails: AddressDetails,
  employmentDetails: EmploymentDetails,
  loanDetails: LoanDetails,
  documents: Documents,
  verification: Verification,
  signature: Signature,
  review: Review,
};

export default function App() {
  const { currentStepIndex, furthestStepIndex, goToStep, resetApplication, lastSavedAt, submitted } = useLoanStore();
  const [dismissedResume, setDismissedResume] = useState(false);

  const showResumeBanner = !dismissedResume && !submitted && currentStepIndex > 0 && currentStepIndex < STEPS.length - 1;
  const StepComponent = STEP_COMPONENTS[STEPS[currentStepIndex]];

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700 text-white">
            <Landmark size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">Northbridge Finance</p>
            <p className="text-xs text-ink-500">Loan application</p>
          </div>
        </div>
      </header>

      {showResumeBanner && (
        <div className="border-b border-teal-100 bg-teal-100/40">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5 text-sm text-navy-900 sm:px-6">
            <span>
              Welcome back — we've restored your saved draft
              {lastSavedAt ? ` from ${new Date(lastSavedAt).toLocaleString('en-IN')}` : ''}.
            </span>
            <button onClick={() => setDismissedResume(true)} className="rounded-full p-1 hover:bg-white/50" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[220px_1fr]">
          <aside>
            <ProgressBar currentStepIndex={currentStepIndex} furthestStepIndex={furthestStepIndex} onStepClick={goToStep} />
          </aside>
          <div>
            <StepComponent key={STEPS[currentStepIndex]} />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pb-8 text-center text-xs text-ink-300 sm:px-6">
        <button onClick={resetApplication} className="underline decoration-dotted underline-offset-2 hover:text-ink-500">
          Clear saved draft and start over
        </button>
      </footer>
    </div>
  );
}
