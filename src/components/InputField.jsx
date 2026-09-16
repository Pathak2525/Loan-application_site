export function InputField({ label, hint, error, register, name, type = 'text', placeholder, ...rest }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`input-base ${error ? 'input-error' : ''}`}
        {...register(name)}
        {...rest}
      />
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}

export function SelectField({ label, error, register, name, options, placeholder = 'Select an option' }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} className={`input-base ${error ? 'input-error' : ''}`} {...register(name)}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}

export function RadioCardGroup({ label, error, register, name, options }) {
  return (
    <div>
      {label && <p className="field-label">{label}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 text-sm transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-100/40 has-[:checked]:ring-1 has-[:checked]:ring-teal-500"
          >
            <input type="radio" value={opt.value} className="mt-1" {...register(name)} />
            <span>
              <span className="block font-medium text-ink-900">{opt.title}</span>
              {opt.description && <span className="mt-0.5 block text-xs text-ink-500">{opt.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}
