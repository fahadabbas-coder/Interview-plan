import { toast } from 'react-toastify';

export const toastSuccess = (response, fallback = 'Success.') => {
  const message = typeof response === 'string' ? response : response?.message;
  toast.success(typeof message === 'string' && message ? message : fallback);
};

export const toastError = (error, fallback = 'Something went wrong.') => {
  const responseData = error?.response?.data;
  const validationMessage = responseData?.errors
    ?.map(({ msg }) => msg)
    .filter(Boolean)
    .join(', ');
  const message = validationMessage || responseData?.message || error?.message || error;
  toast.error(typeof message === 'string' && message ? message : fallback);
};