import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useLoanStore } from '../store/loanStore.js';
import { verificationSchema } from '../validation/schemas.js';
import { verifyPAN, verifyAadhaar } from '../utils/validation.js';
import StepShell from '../components/StepShell.jsx';

function VerifyRow({ label, value, status, message, onVerify }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="text-xs text-ink-500">{value}</p>
        {message && (
          <p className={`mt-1 text-xs ${status === 'verified' ? 'text-teal-600' : 'text-danger-600'}`}>{message}</p>
        )}
      </div>
      <button type="button" onClick={onVerify} disabled={status === 'loading' || status === 'verified'} className="btn-secondary shrink-0">
        {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
        {status === 'verified' && <CheckCircle2 size={16} className="text-teal-600" />}
        {status === 'error' && <XCircle size={16} className="text-danger-600" />}
        {status === 'verified' ? 'Verified' : status === 'error' ? 'Retry' : 'Verify now'}
      </button>
    </div>
  );
}

export default function Verification() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const [panStatus, setPanStatus] = useState(data.verification.panVerified ? 'verified' : 'idle');
  const [aadhaarStatus, setAadhaarStatus] = useState(data.verification.aadhaarVerified ? 'verified' : 'idle');
  const [panMessage, setPanMessage] = useState('');
  const [aadhaarMessage, setAadhaarMessage] = useState('');

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: data.verification,
  });

  async function handleVerifyPan() {
    setPanStatus('loading');
    const result = await verifyPAN(data.personalDetails.panNumber, data.personalDetails.fullName);
    setPanMessage(result.message);
    setPanStatus(result.verified ? 'verified' : 'error');
    setValue('panVerified', result.verified, { shouldValidate: true });
  }

  async function handleVerifyAadhaar() {
    setAadhaarStatus('loading');
    const result = await verifyAadhaar(data.personalDetails.aadhaarNumber);
    setAadhaarMessage(result.message);
    setAadhaarStatus(result.verified ? 'verified' : 'error');
    setValue('aadhaarVerified', result.verified, { shouldValidate: true });
  }

  function onSubmit(values) {
    setStepData('verification', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell title="Verify your identity" description="We run a quick check against your PAN and Aadhaar." onBack={goBack} isSubmitting={isSubmitting}>
        <div className="mb-1 flex items-center gap-2 text-xs text-ink-500">
          <ShieldCheck size={14} className="text-teal-600" />
          This is a simulated check for demo purposes — no data leaves your browser.
        </div>
        <VerifyRow
          label="PAN verification"
          value={data.personalDetails.panNumber}
          status={panStatus}
          message={panMessage}
          onVerify={handleVerifyPan}
        />
        <VerifyRow
          label="Aadhaar verification"
          value={data.personalDetails.aadhaarNumber}
          status={aadhaarStatus}
          message={aadhaarMessage}
          onVerify={handleVerifyAadhaar}
        />
        {(errors.panVerified || errors.aadhaarVerified) && (
          <p className="field-error">Please complete both verifications before continuing.</p>
        )}
      </StepShell>
    </form>
  );
}
