interface PendingRegistrationData {
    address: string;
    referralCode: string;
    timestamp: number;
    userAgent: string;
}

const pendingRegistrations = new Map<string, PendingRegistrationData>();

export function storePendingRegistration(
    address: string,
    referralCode: string,
    userAgent: string
): string {
    const key = generateKey(userAgent);
    const data: PendingRegistrationData = {
        address,
        referralCode,
        timestamp: Date.now(),
        userAgent,
    };

    pendingRegistrations.set(key, data);

    cleanupOldEntries();

    console.log("Stored pending registration with key:", key, data);
    return key;
}

export function retrievePendingRegistration(userAgent: string): PendingRegistrationData | null {
    const key = generateKey(userAgent);
    const data = pendingRegistrations.get(key);

    if (!data) {
        console.log("No pending registration found for key:", key);
        return null;
    }

    const isExpired = Date.now() - data.timestamp > 10 * 60 * 1000;
    if (isExpired) {
        pendingRegistrations.delete(key);
        console.log("Pending registration expired for key:", key);
        return null;
    }

    console.log("Retrieved pending registration for key:", key, data);
    return data;
}

export function removePendingRegistration(userAgent: string): void {
    const key = generateKey(userAgent);
    pendingRegistrations.delete(key);
    console.log("Removed pending registration for key:", key);
}

function generateKey(userAgent: string): string {
    let hash = 0;
    for (let i = 0; i < userAgent.length; i++) {
        const char = userAgent.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `reg_${Math.abs(hash)}`;
}

function cleanupOldEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, data] of pendingRegistrations.entries()) {
        if (now - data.timestamp > 10 * 60 * 1000) {
            expiredKeys.push(key);
        }
    }

    expiredKeys.forEach((key) => pendingRegistrations.delete(key));

    if (expiredKeys.length > 0) {
        console.log("Cleaned up expired registrations:", expiredKeys);
    }
}
