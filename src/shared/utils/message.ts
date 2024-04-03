/**
 * @description get message for required field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getRequiredMessage = (path: string): string => {
    return `${path.toUpperCase()}_IS_REQUIRED`;
};

/**
 * @description get message for unique field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getUniqueMessage = (path: string): string => {
    return `${path.toUpperCase()}_IS_UNIQUE`;
};

/**
 * @description get message for invalid field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getInvalidMessage = (path: string): string => {
    return `${path.toUpperCase()}_IS_INVALID`;
};

/**
 * @description convert message to uppercase and replace spaces with underscore
 * @param message message to be converted
 * @returns {string} converted message
 */
export const convertMessage = (message: string): string => {
    return message.replaceAll(" ", "_").toUpperCase();
};
