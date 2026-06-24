export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'bg-primary-fixed text-on-primary-fixed-variant ring-primary/20',
    success: 'bg-green-100 text-green-800 ring-green-500/20',
    warning: 'bg-yellow-100 text-yellow-800 ring-yellow-500/20',
    error: 'bg-error/10 text-error ring-error/20',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed ring-secondary/20',
  };

  const sizes = {
    sm: 'px-sm py-0.5 text-label-sm',
    md: 'px-md py-1 text-label-sm',
    lg: 'px-md py-sm text-body-sm',
  };

  return (
    <span
      className={`rounded-full font-label-md inline-flex items-center ring-1 ring-inset ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
