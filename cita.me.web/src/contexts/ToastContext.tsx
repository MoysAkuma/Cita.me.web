import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

type ToastPayload = {
  message: string;
  severity?: ToastSeverity;
  autoHideDuration?: number;
};

type ToastState = {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  autoHideDuration: number;
};

type ToastContextType = {
  showToast: (payload: ToastPayload) => void;
  closeToast: () => void;
};

const defaultDuration = 4500;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: defaultDuration,
  });

  const showToast = useCallback(({ message, severity = 'info', autoHideDuration = defaultDuration }: ToastPayload) => {
    setToast({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast((current) => ({ ...current, open: false }));
  }, []);

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    closeToast();
  }, [closeToast]);

  const value = useMemo(
    () => ({
      showToast,
      closeToast,
    }),
    [showToast, closeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
