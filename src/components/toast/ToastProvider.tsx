import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './toast.scss';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <XCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<{
    opts: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    warning: (msg: string) => addToast('warning', msg),
    info: (msg: string) => addToast('info', msg),
  };

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ opts, resolve });
    });
  }, []);

  const handleConfirm = (val: boolean) => {
    confirmState?.resolve(val);
    setConfirmState(null);
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toast Container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.type}`}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="toast__icon">{ICONS[t.type]}</span>
              <span className="toast__message">{t.message}</span>
              <button
                className="toast__close"
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmState && (
          <motion.div
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <div className="confirm-dialog__icon">
                {confirmState.opts.danger
                  ? <XCircle size={32} color="#ef4444" />
                  : <AlertTriangle size={32} color="#f59e0b" />}
              </div>
              <h3 className="confirm-dialog__title">
                {confirmState.opts.title || 'Are you sure?'}
              </h3>
              <p className="confirm-dialog__message">
                {confirmState.opts.message}
              </p>
              <div className="confirm-dialog__actions">
                <button
                  className="confirm-dialog__btn confirm-dialog__btn--cancel"
                  onClick={() => handleConfirm(false)}
                >
                  {confirmState.opts.cancelLabel || 'Cancel'}
                </button>
                <button
                  className={`confirm-dialog__btn ${confirmState.opts.danger ? 'confirm-dialog__btn--danger' : 'confirm-dialog__btn--confirm'}`}
                  onClick={() => handleConfirm(true)}
                >
                  {confirmState.opts.confirmLabel || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
