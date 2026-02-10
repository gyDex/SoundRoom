import React, { useState, useEffect, createContext, useContext } from 'react';
import styles from './TosterProvider.module.scss';
import Loader from '@/widgets/Loader/Loader';
import { RxCross2 } from 'react-icons/rx';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';

type ToastStatus = 'success' | 'error';

type ToastState = {
  isShow: boolean;
  isClosing: boolean;
  isLoading: boolean;
  title: string;
  status: ToastStatus | null;
  progress: number;
};

type ToastAction = {
  title: string;
  status: ToastStatus;
  isLoading: boolean;
};

type Toaster = {
  showToast: (action: ToastAction) => void;
  isShow: boolean;
};

export const ToasterContext = createContext<Toaster | null>(null);

export const TosterProvider: React.FC<{ children: React.ReactNode; position?: 'bottom' | 'top' }> = ({
  children,
  position = 'top',
}) => {
  const [toast, setToast] = useState<ToastState>({
    isShow: false,
    isClosing: false,
    isLoading: false,
    title: '',
    status: null,
    progress: 100,
  });

  useEffect(() => {
    if (!toast.isShow || toast.isClosing) return;

    const interval = setInterval(() => {
      setToast(prev => {
        if (prev.progress <= 0) {
          clearInterval(interval);
          return { ...prev, isClosing: true, progress: 0 };
        }
        return { ...prev, progress: prev.progress - 1 };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.isShow, toast.isClosing]);

  useEffect(() => {
    if (!toast.isClosing) return;

    const timer = setTimeout(() => {
      setToast({
        isShow: false,
        isClosing: false,
        isLoading: false,
        title: '',
        status: null,
        progress: 100,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [toast.isClosing]);

  function showToast(values: ToastAction) {
    setToast({
      isShow: true,
      isClosing: false,
      isLoading: values.isLoading,
      title: values.title,
      status: values.status,
      progress: 100,
    });
  }

  return (
    <ToasterContext.Provider value={{ showToast, isShow: toast.isShow }}>
      {toast.isShow && (
        <div
          className={`
            ${styles['toster-provider']}
            ${!toast.isClosing ? styles['toster-provider_show'] : styles['toster-provider_hide']}
            ${position === 'top' ? styles['toster-provider_top'] : styles['toster-provider_bottom']}
          `}
          style={{ ['--progress' as any]: `${toast.progress}%` }}
        >
          <div className={styles['toster-provider__content']}>
            {toast.isLoading ? (
              <div className={styles['toster-provider__loader-content']}>
                <div className={styles['toster-provider__loader']}>
                  <Loader isActiveTitle={false} />
                </div>
                <span className={styles['toster-provider__loader-text']}>Loading...</span>
              </div>
            ) : (
              <>
                <div className={styles['toster-provider__top']}>
                  <button onClick={() => setToast(prev => ({ ...prev, isClosing: true }))} className={styles['toster-provider__btn']}>
                    <RxCross2 size={16} />
                  </button>
                </div>
                <span className={styles['toster-provider__title']}>
                  {toast.status === 'success' && <FaCircleCheck color="white" size={16} />}
                  {toast.status === 'error' && <MdError color="white" size={16} />}
                  {toast.title}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      {children}
    </ToasterContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToasterContext);
  if (!context) throw new Error('useToast must be used within TosterProvider');
  return context;
};
