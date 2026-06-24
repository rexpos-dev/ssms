export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="mb-lg">
      {label && (
        <label className="font-label-md text-label-md text-on-surface mb-sm block">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`input-field ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-label-sm mt-xs">{error}</p>}
      {helperText && !error && <p className="text-on-surface-variant text-label-sm mt-xs">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-lg">
      {label && (
        <label className="font-label-md text-label-md text-on-surface mb-sm block">
          {label}
        </label>
      )}
      <textarea
        className={`input-field resize-none ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-label-sm mt-xs">{error}</p>}
      {helperText && !error && <p className="text-on-surface-variant text-label-sm mt-xs">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  options,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-lg">
      {label && (
        <label className="font-label-md text-label-md text-on-surface mb-sm block">
          {label}
        </label>
      )}
      <select
        className={`input-field ${error ? 'border-error' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-label-sm mt-xs">{error}</p>}
      {helperText && !error && <p className="text-on-surface-variant text-label-sm mt-xs">{helperText}</p>}
    </div>
  );
};

export default Input;
