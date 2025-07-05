export type User = {
    id: number;
    screen_name: string;
    name: string;
    profile_image_url: string;
    email?: string;
    address?: string;
    isRegistered?: boolean;
};

export type PendingRegistration = {
    address: string;
    referralCode: string;
};

export type AuthenticationResult = {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
    needsTwitterRegistration?: boolean;
};

export type UserAuthStatus = {
    canLoginWithWallet: boolean;
    needsTwitterRegistration: boolean;
    username?: string;
    isRegistered: boolean;
};
