export const Card = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  elevated = false,
  onClick = null,
}) => {
  const variants = {
    default: 'bg-surface-container-lowest/95 border border-white/70',
    primary: 'bg-primary border border-primary text-on-primary',
    elevated: 'bg-surface-container-low/90 border border-white/80 shadow-[0_12px_40px_rgba(0,6,102,0.12)]',
    ghost: 'bg-transparent border border-surface-variant/30',
    gradient: 'bg-gradient-to-br from-surface-container-lowest/95 to-surface-container-low/80 border border-white/70',
    danger: 'bg-error/5 border border-error/20',
    success: 'bg-green-50/20 border border-green-300/30',
    warning: 'bg-yellow-50/20 border border-yellow-300/30',
    info: 'bg-blue-50/20 border border-blue-300/30',
  };

  // If the caller supplies a bg-* override via className, drop the variant's own
  // background so it doesn't win on stylesheet order and hide the custom color.
  const variantClass = /(^|\s)bg-/.test(className) ? '' : variants[variant];

  const baseClass = 'p-lg rounded-2xl backdrop-blur-xl transition-all duration-300';
  const shadowClass = elevated
    ? 'shadow-[0_12px_40px_rgba(0,6,102,0.12)]'
    : 'shadow-[0_8px_30px_rgba(0,6,102,0.06)]';
  const hoverClass = interactive || onClick
    ? 'hover:shadow-[0_16px_48px_rgba(0,6,102,0.16)] hover:translate-y-[-2px] cursor-pointer'
    : 'hover:shadow-[0_14px_44px_rgba(0,6,102,0.12)]';

  return (
    <div
      className={`${baseClass} ${variantClass} ${shadowClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  action,
  icon = null,
  badge = null,
}) => {
  return (
    <div className="pb-md border-b border-surface-variant/60 flex justify-between items-start mb-lg gap-md">
      <div className="flex items-start gap-md flex-1">
        {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
        <div>
          <div className="flex items-center gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
            {badge && <span className="text-label-xs px-sm py-xs bg-primary/20 text-primary rounded-full">{badge}</span>}
          </div>
          {subtitle && <p className="text-body-sm text-on-surface-variant mt-xs">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`transition-all duration-300 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '', divider = true }) => {
  return (
    <div className={`${divider ? 'pt-lg border-t border-surface-variant/60' : ''} flex gap-md justify-end ${className}`}>
      {children}
    </div>
  );
};

export default Card;
