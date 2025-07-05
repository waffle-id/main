import { useLoaderData } from "react-router";
import type { User } from "~/types/auth";

export function useUser(): User | null {
    const data = useLoaderData() as { user?: User };
    return data?.user || null;
}

export function useOptionalUser(): User | null {
    const data = useLoaderData() as { user?: User };
    return data?.user || null;
}
