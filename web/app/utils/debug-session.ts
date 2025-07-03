import { sessionStorage } from "~/services/session.server";

export async function debugSession(request: Request, label: string = "Session Debug") {
    try {
        const session = await sessionStorage.getSession(request.headers.get("Cookie"));
        const data = {
            user: session.get("user"),
            pendingRegistration: session.get("pendingRegistration"),
        };
        console.log(`${label}:`, data);
        return data;
    } catch (error) {
        console.error(`${label} Error:`, error);
        return null;
    }
}
