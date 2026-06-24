export const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-surface-container-lowest/80 border border-white/60 p-lg rounded-2xl backdrop-blur-xl shadow-[0_8px_30px_rgba(0,6,102,0.06)] transition-all duration-300 hover:shadow-[0_14px_44px_rgba(0,6,102,0.12)] ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => {
  return (
    <div className="pb-md border-b border-surface-variant/60 flex justify-between items-start mb-lg">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
        {subtitle && <p className="text-body-sm text-on-surface-variant mt-xs">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`pt-lg border-t border-surface-variant/60 flex gap-md justify-end ${className}`}>
      {children}
    </div>
  );
};

export default Card;
