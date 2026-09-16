import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoanStore } from '../store/loanStore.js';
import { addressDetailsSchema } from '../validation/schemas.js';
import { InputField, SelectField } from '../components/InputField.jsx';
import AddressAutocomplete from '../components/AddressAutocomplete.jsx';
import StepShell from '../components/StepShell.jsx';

export default function AddressDetails() {
  const { data, setStepData, goNext, goBack } = useLoanStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: data.addressDetails,
  });

  const pincode = watch('pincode');

  function onSubmit(values) {
    setStepData('addressDetails', values);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepShell title="Current address" description="Used for communication and address verification." onBack={goBack} isSubmitting={isSubmitting}>
        <div>
          <InputField label="PIN code" name="pincode" register={register} error={errors.pincode} placeholder="e.g. 110001" maxLength={6} />
          <AddressAutocomplete
            pincode={pincode}
            onResolved={({ city, state }) => {
              setValue('city', city, { shouldValidate: true });
              setValue('state', state, { shouldValidate: true });
            }}
          />
        </div>
        <InputField label="Address line 1" name="addressLine1" register={register} error={errors.addressLine1} placeholder="House / flat no., street" />
        <InputField label="Address line 2" name="addressLine2" register={register} error={errors.addressLine2} placeholder="Landmark, area (optional)" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="City" name="city" register={register} error={errors.city} />
          <InputField label="State" name="state" register={register} error={errors.state} />
        </div>
        <SelectField
          label="Residence type"
          name="residenceType"
          register={register}
          error={errors.residenceType}
          options={[
            { value: 'owned', label: 'Owned' },
            { value: 'rented', label: 'Rented' },
            { value: 'family', label: 'Living with family' },
          ]}
        />
      </StepShell>
    </form>
  );
}
