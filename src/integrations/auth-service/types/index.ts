export type AuthRegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type AuthLoginRequest = {
    email: string;
    password: string;
};

export type AuthVerifyCodeRequest = {
    userId: string;
    code: string;
};

export type AuthRefreshTokenRequest = {
    refreshToken: string;
};

export type AuthPasswordResetRequest = {
    email: string;
};

export type AuthPasswordResetConfirmRequest = {
    email: string;
    code: string;
    password: string;
};

export type AuthAdminCreateUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type AuthUserUpdateRequest = {
    firstName?: string;
    lastName?: string;
    password?: string;
};

export type AuthUserEnable2FARequest = {
    enabled2FA: boolean;
};

export type SocialAccountProvider = "GOOGLE" | "GITHUB" | "MICROSOFT" | string;

export type AuthSocialRequest = {
    provider: SocialAccountProvider;
    code: string;
    codeVerifier?: string;
};

export type AuthTokenResponse = {
    accessToken: string;
    refreshToken: string;
    userId: string;
    message: string;
};

export type AuthMessageResponse = {
    message: string;
};

export type AuthErrorResponse = {
    name?: string;
    code?: number;
    message: string;
    errors?: Record<string, string>;
};

export type AuthValidationResponse = {
    id: string;
    createdAt: string;
    updatedAt: string;
    client: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    enabled2FA: boolean;
    role: string;
};

export type AuthUserResponse = {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    enabled2FA: boolean;
};

export type AuthPageMeta = {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export type AuthSortOrder = {
    property: string;
    direction: string;
};

export type AuthUsersReportResponse = {
    content: AuthUserResponse[];
    page: AuthPageMeta;
    sort: AuthSortOrder[];
};

export type AuthServiceResponse<TBody> = {
    status: number;
    body: TBody | AuthErrorResponse | AuthMessageResponse | Record<string, unknown>;
};
