type Unit = "B" | "KB" | "MB" | "GB" | "TB";
export const convertToBytes = (size: number, unit: Unit): number => {
    switch (unit) {
        case "B":
            return size;
        case "KB":
            return size * 1024;
        case "MB":
            return size * 1024 * 1024;
        case "GB":
            return size * 1024 * 1024 * 1024;
        case "TB":
            return size * 1024 * 1024 * 1024 * 1024;
        default:
            return size;
    }
};
