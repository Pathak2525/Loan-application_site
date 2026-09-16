import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { loanDetailsSchema } from '../validation/schemas.js';
import { calculateEMI, rateForLoanType } from '../utils/emiCalculator.js';
import { InputField } from '../components/InputField.jsx';
import StepShell from '../components/StepShell.jsx';

export default function LoanDetails() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const loanType = data.loanType.loanType;
  const isHome = loanType === 'home';
  const rate = rateForLoanType(loanType);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: { ...data.loanDetails, loanType },
  });

  const [amount, tenure] = watch(['loanAmount', 'tenureMonths']);
  const emi = amount > 0 && tenure > 0 ? calculateEMI(Number(amount), rate, Number(tenure)) : 0;

  function onSubmit(values) {
    setStepData('loanDetails', { ...values, loanType });
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={loanType} {...register('loanType')} />
      <StepShell title="Loan details" description={`Indicative interest rate for a ${loanType} loan: ${rate}% p.a.`} onBack={goBack} isSubmitting={isSubmitting}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Loan amount (₹)" name="loanAmount" type="number" register={register} error={errors.loanAmount} />
          <InputField label="Tenure (months)" name="tenureMonths" type="number" register={register} error={errors.tenureMonths} placeholder="e.g. 60" />
        </div>
        <InputField label="Purpose of loan" name="purpose" register={register} error={errors.purpose} placeholder="e.g. Home renovation" />

        {isHome && (
          <div className="rounded-xl border border-teal-100 bg-teal-100/30 p-4">
            <p className="mb-4 text-sm font-medium text-navy-700">Property details</p>
            <div className="flex flex-col gap-5">
              <InputField label="Property city" name="propertyCity" register={register} error={errors.propertyCity} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField label="Property value (₹)" name="propertyValue" type="number" register={register} error={errors.propertyValue} />
                <InputField label="Down payment (₹)" name="downPayment" type="number" register={register} error={errors.downPayment} />
              </div>
            </div>
          </div>
        )}

        {emi > 0 && (
          <div className="rounded-xl bg-navy-700 p-4 text-white">
            <p className="text-xs text-teal-100">Estimated monthly EMI</p>
            <p className="text-2xl font-bold">₹{Math.round(emi).toLocaleString('en-IN')}</p>
            <p className="mt-1 text-xs text-teal-100">Based on {rate}% p.a. for {tenure || 0} months. Final rate depends on credit assessment.</p>
          </div>
        )}
      </StepShell>
    </form>
  );
}
