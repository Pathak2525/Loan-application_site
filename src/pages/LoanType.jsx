import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { loanTypeSchema } from '../validation/schemas.js';
import { RadioCardGroup } from '../components/InputField.jsx';
import StepShell from '../components/StepShell.jsx';

const OPTIONS = [
  { value: 'personal', title: 'Personal loan', description: 'For weddings, travel, medical or other personal needs.' },
  { value: 'home', title: 'Home loan', description: 'To buy, build, or renovate a property.' },
  { value: 'business', title: 'Business loan', description: 'To fund working capital or business growth.' },
];

export default function LoanType() {
  const { data, setStepData, goNext, currentStepIndex, goBack } = useLoanStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loanTypeSchema),
    defaultValues: { loanType: data.loanType.loanType || '' },
  });

  function onSubmit(values) {
    setStepData('loanType', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell
        title="What are you applying for?"
        description="Choose the loan type that best fits your need. This changes the questions we ask next."
        onBack={goBack}
        isFirstStep={currentStepIndex === 0}
        isSubmitting={isSubmitting}
      >
        <RadioCardGroup register={register} name="loanType" options={OPTIONS} error={errors.loanType} />
      </StepShell>
    </form>
  );
}
