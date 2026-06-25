export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center font-label-md rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed gap-sm relative overflow-hidden group';

  const variants = {
    primary:
      'bg-gradient-to-br from-primary via-primary-container to-primary-container text-on-primary shadow-[0_6px_20px_rgba(76,86,175,0.28)] hover:shadow-[0_12px_32px_rgba(76,86,175,0.42)] hover:brightness-110 active:shadow-[0_4px_12px_rgba(76,86,175,0.2)]',
    secondary:
      'border-2 border-outline-variant/70 bg-surface-container-lowest/60 text-on-surface backdrop-blur hover:bg-surface-container hover:border-outline-variant/100 active:bg-surface-container-low',
    tertiary:
      'bg-gradient-to-br from-tertiary/80 to-tertiary-container/60 text-on-tertiary-container shadow-[0_4px_16px_rgba(111,104,175,0.2)] hover:shadow-[0_8px_24px_rgba(111,104,175,0.32)]',
    success:
      'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-[0_6px_20px_rgba(34,197,94,0.28)] hover:shadow-[0_10px_28px_rgba(34,197,94,0.42)] hover:brightness-110',
    warning:
      'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-[0_6px_20px_rgba(202,138,4,0.28)] hover:shadow-[0_10px_28px_rgba(202,138,4,0.42)] hover:brightness-110',
    danger:
      'bg-gradient-to-br from-error via-error/90 to-error/80 text-on-error shadow-[0_6px_20px_rgba(186,26,26,0.28)] hover:shadow-[0_10px_28px_rgba(186,26,26,0.42)] hover:brightness-110',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_4px_12px_rgba(76,86,175,0.15)]',
    text: 'text-primary hover:bg-primary/10 hover:underline',
    ghost: 'text-on-surface hover:bg-surface-variant/50',
  };

  const sizes = {
    sm: 'px-md py-xs text-label-sm h-9',
    md: 'px-lg py-sm text-label-md h-10',
    lg: 'px-xl py-md text-body-md h-12',
    xl: 'px-2xl py-lg text-body-md h-14',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />

      {/* Content */}
      <div className="flex items-center justify-center gap-sm relative z-10">
        {loading && (
          <div className="inline-flex animate-spin">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {icon && !loading && iconPosition === 'left' && (
          <span className="inline-flex items-center justify-center">{icon}</span>
        )}

        {children}

        {icon && !loading && iconPosition === 'right' && (
          <span className="inline-flex items-center justify-center">{icon}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
