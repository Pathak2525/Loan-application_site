import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useLoanStore } from '../store/loanStore.js';
import { crossStepValidate, rateForLoanType } from '../validation/schemas.js';
import { evaluatePreApproval, amortizationSummary } from '../utils/emiCalculator.js';

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-ink-100 p-4">
      <p className="mb-2 text-sm font-semibold text-ink-900">{title}</p>
      <div className="divide-y divide-ink-100/70">{children}</div>
    </div>
  );
}

export default function Review() {
  const { data, goBack, markSubmitted, resetApplication } = useLoanStore();
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | error | success
  const { loanType } = data.loanType;

  const crossErrors = useMemo(() => crossStepValidate(data), [data]);
  const rate = rateForLoanType(loanType);
  const amount = Number(data.loanDetails?.loanAmount || 0);
  const tenure = Number(data.loanDetails?.tenureMonths || 0);
  const summary = amount && tenure ? amortizationSummary(amount, rate, tenure) : null;

  const preApproval = useMemo(
    () =>
      evaluatePreApproval({
        loanType,
        monthlyIncome: Number(data.employmentDetails?.monthlyIncome || 0),
        loanAmount: amount,
        tenureMonths: tenure,
        employmentType: data.employmentDetails?.employmentType,
        yearsInJob: Number(data.employmentDetails?.yearsInJob || 0),
      }),
    [data, loanType, amount, tenure]
  );

  async function handleSubmit() {
    setSubmitStatus('loading');
    await new Promise((r) => setTimeout(r, 1500));
    // Simulated 10% failure rate to exercise the error state.
    if (Math.random() < 0.1) {
      setSubmitStatus('error');
      return;
    }
    markSubmitted();
    setSubmitStatus('success');
  }

  if (submitStatus === 'success') {
    return (
      <div className="card text-center">
        <CheckCircle2 className="mx-auto mb-4 text-teal-600" size={48} />
        <h2 className="text-xl font-semibold text-ink-900">Application submitted</h2>
        <p className="mt-2 text-sm text-ink-500">
          Reference ID <span className="font-mono font-semibold text-ink-900">{useLoanStore.getState().applicationId}</span>
        </p>
        <div
          className={`mx-auto mt-6 max-w-sm rounded-xl p-4 text-sm ${
            preApproval.status === 'approved'
              ? 'bg-teal-100 text-navy-900'
              : preApproval.status === 'review'
              ? 'bg-amber-100 text-amber-900'
              : 'bg-danger-100 text-danger-600'
          }`}
        >
          {preApproval.status === 'approved' && 'You are pre-approved for this loan amount.'}
          {preApproval.status === 'review' && 'Your application needs manual review before final approval.'}
          {preApproval.status === 'declined' && 'This amount is unlikely to be approved — a lower amount may work better.'}
        </div>
        <button type="button" onClick={resetApplication} className="btn-secondary mt-6">
          Start a new application
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Review your application</h2>
        <p className="mt-1.5 text-sm text-ink-500">Check everything carefully — you can go back to fix any step.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Section title="Loan">
          <Row label="Loan type" value={loanType} />
          <Row label="Amount" value={amount ? `₹${amount.toLocaleString('en-IN')}` : ''} />
          <Row label="Tenure" value={tenure ? `${tenure} months` : ''} />
          <Row label="Purpose" value={data.loanDetails?.purpose} />
        </Section>

        <Section title="Applicant">
          <Row label="Name" value={data.personalDetails?.fullName} />
          <Row label="DOB" value={data.personalDetails?.dob} />
          <Row label="PAN" value={data.personalDetails?.panNumber} />
          <Row label="Email" value={data.contactDetails?.email} />
          <Row label="Phone" value={data.contactDetails?.phone} />
        </Section>

        <Section title="Address">
          <Row label="Line 1" value={data.addressDetails?.addressLine1} />
          <Row label="City / State" value={[data.addressDetails?.city, data.addressDetails?.state].filter(Boolean).join(', ')} />
          <Row label="PIN code" value={data.addressDetails?.pincode} />
        </Section>

        <Section title="Employment & income">
          <Row label="Type" value={data.employmentDetails?.employmentType} />
          <Row label="Employer/Business" value={data.employmentDetails?.employerName} />
          <Row label="Monthly income" value={data.employmentDetails?.monthlyIncome ? `₹${Number(data.employmentDetails.monthlyIncome).toLocaleString('en-IN')}` : ''} />
        </Section>

        {summary && (
          <Section title="Estimated repayment">
            <Row label="Interest rate" value={`${rate}% p.a.`} />
            <Row label="Monthly EMI" value={`₹${summary.emi.toLocaleString('en-IN')}`} />
            <Row label="Total interest" value={`₹${summary.totalInterest.toLocaleString('en-IN')}`} />
            <Row label="Total payment" value={`₹${summary.totalPayment.toLocaleString('en-IN')}`} />
            <Row label="Max eligible amount" value={`₹${preApproval.maxEligibleAmount.toLocaleString('en-IN')}`} />
          </Section>
        )}

        {crossErrors.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle size={16} />
              <p className="text-sm font-medium">Please review before submitting</p>
            </div>
            <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
              {crossErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center gap-2 rounded-xl border border-danger-100 bg-danger-100 p-3 text-sm text-danger-600">
            <XCircle size={16} /> Something went wrong submitting your application. Please try again.
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
        <button type="button" onClick={goBack} className="btn-secondary" disabled={submitStatus === 'loading'}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} className="btn-primary" disabled={submitStatus === 'loading'}>
          {submitStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {submitStatus === 'loading' ? 'Submitting…' : 'Submit application'}
        </button>
      </div>
    </div>
  );
}
