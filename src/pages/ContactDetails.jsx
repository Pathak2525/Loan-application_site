import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { contactDetailsSchema } from '../validation/schemas.js';
import { InputField } from '../components/InputField.jsx';
import StepShell from '../components/StepShell.jsx';

export default function ContactDetails() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: data.contactDetails,
  });

  function onSubmit(values) {
    setStepData('contactDetails', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell title="How can we reach you?" description="We'll send application updates to these details." onBack={goBack} isSubmitting={isSubmitting}>
        <InputField label="Email address" name="email" type="email" register={register} error={errors.email} placeholder="you@example.com" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Mobile number" name="phone" register={register} error={errors.phone} placeholder="9876543210" maxLength={10} />
          <InputField
            label="Alternate number"
            name="alternatePhone"
            register={register}
            error={errors.alternatePhone}
            placeholder="Optional"
            maxLength={10}
          />
        </div>
      </StepShell>
    </form>
  );
}
