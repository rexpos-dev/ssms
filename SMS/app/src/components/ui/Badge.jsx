export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  dot = false,
  animated = false,
  href = null,
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary/15 to-primary-container/10 text-primary ring-1 ring-primary/30 font-medium',
    success: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 ring-1 ring-green-500/30 font-medium',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 ring-1 ring-yellow-500/30 font-medium',
    danger: 'bg-gradient-to-r from-error/10 to-error/5 text-error ring-1 ring-error/30 font-medium',
    error: 'bg-gradient-to-r from-error/10 to-error/5 text-error ring-1 ring-error/30 font-medium',
    secondary: 'bg-gradient-to-r from-secondary/15 to-secondary-container/10 text-on-secondary ring-1 ring-secondary/30 font-medium',
    tertiary: 'bg-gradient-to-r from-tertiary/15 to-tertiary-container/10 text-on-tertiary ring-1 ring-tertiary/30 font-medium',
    info: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 ring-1 ring-blue-500/30 font-medium',
    outline: 'bg-transparent text-primary ring-2 ring-primary/40 font-medium hover:bg-primary/5',
    ghost: 'bg-transparent text-on-surface-variant ring-0 font-medium',
  };

  const sizes = {
    sm: 'px-xs py-0.5 text-label-xs',
    md: 'px-sm py-1 text-label-sm',
    lg: 'px-md py-sm text-body-xs',
    xl: 'px-lg py-md text-body-sm',
  };

  const baseClass = `rounded-full font-label-md inline-flex items-center gap-xs transition-all duration-300 ${
    animated ? 'animate-pulse' : ''
  }`;

  const content = (
    <>
      {dot && <span className="w-2 h-2 rounded-full bg-current" />}
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClass} ${variants[variant]} ${sizes[size]} hover:shadow-md cursor-pointer`}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={`${baseClass} ${variants[variant]} ${sizes[size]}`}>
      {content}
    </span>
  );
};

export default Badge;
