import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { signatureSchema } from '../validation/schemas.js';
import SignaturePad from '../components/SignaturePad.jsx';
import StepShell from '../components/StepShell.jsx';

export default function Signature() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signatureSchema),
    defaultValues: data.signature,
  });

  const signatureDataUrl = watch('signatureDataUrl');

  function onSubmit(values) {
    setStepData('signature', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell title="Sign your application" description="Your signature confirms the details you've provided are accurate." onBack={goBack} isSubmitting={isSubmitting}>
        <SignaturePad
          value={signatureDataUrl}
          onChange={(dataUrl) => setValue('signatureDataUrl', dataUrl, { shouldValidate: true })}
          error={errors.signatureDataUrl}
        />
        <label className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-sand-50 p-4 text-sm text-ink-700">
          <input type="checkbox" className="mt-0.5" {...register('consent')} />
          <span>
            I declare that the information provided in this application is true and complete to the best of my
            knowledge, and I authorise verification of the details submitted.
          </span>
        </label>
        {errors.consent && <p className="field-error">{errors.consent.message}</p>}
      </StepShell>
    </form>
  );
}
