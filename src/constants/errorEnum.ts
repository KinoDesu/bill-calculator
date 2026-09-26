type Toast = {
    description: string;
    toastType: "error" | "fatal" | "info" | "success" | "warning";
};

const ErrorEnum: Record<"ERROR" | "FATAL" | "INFO" | "SUCCESS" | "WARNING", Toast> = {
    ERROR: {
        description: "ERROR",
        toastType: "error",
    },
    FATAL: {
        description: "FATAL",
        toastType: "error",
    },
    INFO: {
        description: "INFO",
        toastType: "info",
    },
    SUCCESS: {
        description: "SUCCESS",
        toastType: "success",
    },
    WARNING: {
        description: "WARNING",
        toastType: "error",
    },
};

export default ErrorEnum;
