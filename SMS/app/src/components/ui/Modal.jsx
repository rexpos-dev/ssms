import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-tertiary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest/90 border border-white/60 rounded-2xl p-xl max-w-md w-full backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,6,102,0.30)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-lg">
          <h2 className="font-headline-sm text-headline-sm text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg p-xs transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-lg max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {actions && (
          <div className="flex gap-md justify-end items-center pt-md border-t border-surface-variant/60">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
