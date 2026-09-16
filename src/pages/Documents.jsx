import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { documentsSchema } from '../validation/schemas.js';
import FileUpload from '../components/FileUpload.jsx';
import StepShell from '../components/StepShell.jsx';

export default function Documents() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(documentsSchema),
    defaultValues: data.documents,
  });

  const values = watch();

  function onSubmit(vals) {
    setStepData('documents', vals);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell
        title="Upload your documents"
        description="Clear photos or scans work best. Images are compressed automatically before upload."
        onBack={goBack}
        isSubmitting={isSubmitting}
      >
        <FileUpload
          label="ID proof (PAN card / Passport / Voter ID)"
          value={values.idProof}
          onChange={(f) => setValue('idProof', f, { shouldValidate: true })}
          error={errors.idProof}
        />
        <FileUpload
          label="Address proof (Utility bill / Aadhaar)"
          value={values.addressProof}
          onChange={(f) => setValue('addressProof', f, { shouldValidate: true })}
          error={errors.addressProof}
        />
        <FileUpload
          label="Income proof (Salary slip / ITR / Bank statement)"
          value={values.incomeProof}
          onChange={(f) => setValue('incomeProof', f, { shouldValidate: true })}
          error={errors.incomeProof}
        />
      </StepShell>
    </form>
  );
}
