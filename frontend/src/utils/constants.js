export const HOST = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AUTH_ROUTES = "api/auth";

export const USER_ROUTES = "api/user";

export const UPLOAD_ROUTES = "api/upload";

export const IMAGE_UPLOAD_ROUTES = `${UPLOAD_ROUTES}/image`;

export const MESSAGE_ROUTES = "/api/messages";

export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;

export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;

export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`;

export const NON_FRIENDS_ROUTES = `${USER_ROUTES}/non-friends`;

export const PROFILE_ROUTES = `${USER_ROUTES}/profile-setup`;

export const ADD_FRIEND_ROUTES = `${USER_ROUTES}/add-friend`;

export const DELETE_FRIEND_ROUTES = `${USER_ROUTES}/friends/delete`;

export const FRIEND_ROUTES = `${USER_ROUTES}/friends`;

export const USER_INFO_ROUTES = `${USER_ROUTES}/info`;

export const DELETE_ALL_MESSAGES_ROUTES = `${MESSAGE_ROUTES}/deleteAll`;

export const DELETE_MESSAGE_ROUTES = `${MESSAGE_ROUTES}/delete`;
