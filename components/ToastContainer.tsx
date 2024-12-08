import { Toaster } from "react-hot-toast";

const ToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          style: {
            background: "#D4EDDA",
            border: "1px solid #28A745",
            color: "#155724",
            padding: "12px",
            borderRadius: "8px",
          },
        },
        error: {
          style: {
            background: "#f8d7da",
            border: "1px solid #dc3545",
            color: "#721c24",
            padding: "12px",
            borderRadius: "8px",
          },
        },
      }}
    />
  );
};

export default ToastContainer;
