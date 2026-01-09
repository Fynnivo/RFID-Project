import toast from 'react-hot-toast';

export const customToast = {
  success: (message, options) => toast.success(message, {
    duration: 3000,
    position: 'top-center',
    className: '!bg-success !text-success-foreground !border !border-success',
    ...options
  }),
  error: (message, options) => toast.error(message, {
    duration: 3000,
    position: 'top-center',
    className: '!bg-destructive !text-destructive-foreground !border !border-destructive',
    ...options
  }),
};

export default customToast;