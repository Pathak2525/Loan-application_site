import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { personalDetailsSchema } from '../validation/schemas.js';
import { InputField, SelectField } from '../components/InputField.jsx';
import StepShell from '../components/StepShell.jsx';

export default function PersonalDetails() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data.personalDetails,
  });

  function onSubmit(values) {
    setStepData('personalDetails', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell title="Tell us about yourself" description="This should match your government ID exactly." onBack={goBack} isSubmitting={isSubmitting}>
        <InputField label="Full name" name="fullName" register={register} error={errors.fullName} placeholder="As per PAN / Aadhaar" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Date of birth" name="dob" type="date" register={register} error={errors.dob} />
          <SelectField
            label="Gender"
            name="gender"
            register={register}
            error={errors.gender}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            label="PAN number"
            name="panNumber"
            register={register}
            error={errors.panNumber}
            placeholder="ABCDE1234F"
            style={{ textTransform: 'uppercase' }}
            maxLength={10}
          />
          <InputField
            label="Aadhaar number"
            name="aadhaarNumber"
            register={register}
            error={errors.aadhaarNumber}
            placeholder="12-digit number"
            maxLength={12}
          />
        </div>
      </StepShell>
    </form>
  );
}
