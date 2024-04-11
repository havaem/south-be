/**
 * @description get message for required field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getRequiredMessage = (path: string): string => {
    return `${convertMessage(path.toUpperCase())}_IS_REQUIRED`;
};

/**
 * @description get message for unique field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getUniqueMessage = (path: string): string => {
    return `${convertMessage(path.toUpperCase())}_IS_UNIQUE`;
};

/**
 * @description get message for invalid field
 * @param path {string} - path to the field
 * @returns {string} message
 */
export const getInvalidMessage = (path: string): string => {
    return `${convertMessage(path.toUpperCase())}_IS_INVALID`;
};

/**
 * @description convert message to uppercase and replace spaces with underscore
 * @param message message to be converted
 * @returns {string} converted message
 */
export const convertMessage = (message: string): string => {
    return message.replaceAll(" ", "_").toUpperCase();
};

/**
 * @description get message for success
 * @param path {string} - path to the field
 * @returns {string} message
 * @example
 * getSuccesMessage("register");
 * returns "REGISTER_SUCCESS"
 */
export const getSuccessMessage = (path: string): string => {
    return `${convertMessage(path)}_SUCCESSFULLY`;
};

/**
 * @description get message for not found
 * @param path {string} - path to the field
 * @returns {string} message
 * @example
 * getNotFoundMessage("user");
 * returns "USER_NOT_FOUND"
 */
export const getNotFoundMessage = (path: string): string => {
    return `${convertMessage(path)}_NOT_FOUND`;
};

export const getGeneralMessage = (path: string) => {
    return {
        FIND_ALL: getSuccessMessage(`find_all_${path + "s"}`),
        FIND: getSuccessMessage(`find_one_${path}`),
        CREATE: getSuccessMessage(`created_${path}`),
        UPDATE: getSuccessMessage(`updated_${path}`),
        REMOVE: getSuccessMessage(`removed_${path}`),
        DELETE: getSuccessMessage(`deleted_${path}`),
        NOT_FOUND: getNotFoundMessage(path),
    };
};
