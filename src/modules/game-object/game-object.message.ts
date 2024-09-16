import { getGeneralMessage } from "@/shared/utils";

export const GAME_OBJECT_MESSAGES = {
    ...getGeneralMessage("game object"),
    GET_CURRENT_USER_GAME_PROFILE: "GET_CURRENT_USER_GAME_PROFILE_SUCCESS",
    UPDATE_CURRENT_USER_GAME_PROFILE: "UPDATE_CURRENT_USER_GAME_PROFILE_SUCCESS",
};
