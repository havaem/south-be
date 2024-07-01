import { getGeneralMessage } from "@/shared/utils";

export const AUTH_MESSAGES = {
    ...getGeneralMessage("auth"),
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    GET_PROFILE_SUCCESS: "GET_PROFILE_SUCCESS",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    REGISTER_SUCCESS: "REGISTER_SUCCESS",
};
