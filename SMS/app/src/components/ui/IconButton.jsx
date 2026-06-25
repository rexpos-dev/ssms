export const IconButton = ({
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick = null,
  title = '',
  badge = null,
  animated = false,
  disabled = false,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-lg transition-all duration-300 relative disabled:opacity-50 disabled:cursor-not-allowed group';

  const variants = {
    primary:
      'bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_4px_12px_rgba(76,86,175,0.2)]',
    secondary:
      'bg-secondary/10 text-secondary hover:bg-secondary/20 hover:shadow-[0_4px_12px_rgba(123,93,253,0.2)]',
    tertiary:
      'bg-tertiary/10 text-tertiary hover:bg-tertiary/20 hover:shadow-[0_4px_12px_rgba(111,104,175,0.2)]',
    danger: 'bg-error/10 text-error hover:bg-error/20 hover:shadow-[0_4px_12px_rgba(186,26,26,0.2)]',
    success: 'bg-green-100/50 text-green-600 hover:bg-green-200/50 hover:shadow-[0_4px_12px_rgba(34,197,94,0.2)]',
    ghost: 'text-on-surface hover:bg-surface-variant/50',
    outline:
      'border-2 border-primary text-primary hover:bg-primary/5 hover:shadow-[0_4px_12px_rgba(76,86,175,0.15)]',
  };

  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-14 h-14 text-3xl',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      {...props}
    >
      <div className={`flex items-center justify-center ${animated ? 'animate-spin' : ''}`}>
        {icon}
      </div>

      {badge && (
        <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold">
          {badge}
        </span>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </button>
  );
};

export default IconButton;
