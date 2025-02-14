import { toast } from "react-toastify";

const toastSuccess = (title: string) => {
  toast.success(title, {
    position: "top-center",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: true,
    theme: "colored",
  });
};

const toastError = (title: string) => {
  toast.error(title, {
    position: "top-center",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: true,
    theme: "colored",
  });
};

const toastPending = (title: string) => {
  const id = toast.loading(title, {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    pauseOnHover: true,
    hideProgressBar: true,
    theme: "dark",
  });
  return id;
};
const updateSuccess = (title: string) => {
  return {
    render: title,
    type: "success",
    isLoading: false,
    closeOnClick: true,
    autoClose: 2000,
    hideProgressBar: true,
    theme: "colored",
  };
};

const updateError = (title: string) => {
  return {
    render: title,
    type: "error",
    isLoading: false,
    closeOnClick: true,
    autoClose: 2000,
    hideProgressBar: true,
    theme: "colored",
  };
};

export { toastSuccess, toastError, toastPending, updateSuccess, updateError };
