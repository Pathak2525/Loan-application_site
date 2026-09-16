import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { employmentDetailsSchema } from '../validation/schemas.js';
import { InputField, SelectField } from '../components/InputField.jsx';
import StepShell from '../components/StepShell.jsx';

export default function EmploymentDetails() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const loanType = data.loanType.loanType;
  const isBusiness = loanType === 'business';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employmentDetailsSchema),
    defaultValues: { ...data.employmentDetails, loanType },
  });

  const employmentType = watch('employmentType');

  function onSubmit(values) {
    setStepData('employmentDetails', { ...values, loanType });
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={loanType} {...register('loanType')} />
      <StepShell
        title={isBusiness ? 'Business & income details' : 'Employment & income'}
        description="This helps us calculate how much you're eligible to borrow."
        onBack={goBack}
        isSubmitting={isSubmitting}
      >
        <SelectField
          label="Employment type"
          name="employmentType"
          register={register}
          error={errors.employmentType}
          options={[
            { value: 'salaried', label: 'Salaried' },
            { value: 'self-employed', label: 'Self-employed' },
          ]}
        />
        <InputField
          label={employmentType === 'salaried' ? 'Employer name' : 'Business / firm name'}
          name="employerName"
          register={register}
          error={errors.employerName}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Monthly income (₹)" name="monthlyIncome" type="number" register={register} error={errors.monthlyIncome} />
          <InputField label="Years in current job/business" name="yearsInJob" type="number" register={register} error={errors.yearsInJob} />
        </div>

        {isBusiness && (
          <div className="rounded-xl border border-teal-100 bg-teal-100/30 p-4">
            <p className="mb-4 text-sm font-medium text-navy-700">Additional details for business loans</p>
            <div className="flex flex-col gap-5">
              <InputField label="Registered business name" name="businessName" register={register} error={errors.businessName} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField label="Business vintage (years)" name="businessVintageYears" type="number" register={register} error={errors.businessVintageYears} />
                <InputField label="Annual turnover (₹)" name="annualTurnover" type="number" register={register} error={errors.annualTurnover} />
              </div>
              <InputField label="GSTIN" name="gstNumber" register={register} error={errors.gstNumber} placeholder="Optional" />
            </div>
          </div>
        )}
      </StepShell>
    </form>
  );
}
