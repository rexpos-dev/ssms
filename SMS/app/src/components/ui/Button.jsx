export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center font-label-md rounded-xl transition-all duration-200 active:scale-95';

  const variants = {
    primary:
      'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_6px_20px_rgba(0,6,102,0.28)] hover:shadow-[0_10px_28px_rgba(0,6,102,0.42)] hover:brightness-110',
    secondary:
      'border border-outline-variant/70 bg-surface-container-lowest/60 text-on-surface backdrop-blur hover:bg-surface-container',
    text: 'text-primary hover:underline',
    danger:
      'bg-gradient-to-br from-error to-error/80 text-on-error shadow-[0_6px_20px_rgba(186,26,26,0.28)] hover:brightness-110',
  };

  const sizes = {
    sm: 'px-sm py-xs text-label-sm',
    md: 'px-lg py-sm text-label-md',
    lg: 'px-xl py-md text-body-md',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
