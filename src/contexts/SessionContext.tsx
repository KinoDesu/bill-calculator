import { TableSession } from "@/models/TableSession";
import { TableSessionService } from "@/services/tableSessionService";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface SessionContextData {
    session: TableSession | null;
    loading: boolean;
    saveSession: (session: TableSession) => Promise<void>;
    clearSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextData>(
    {} as SessionContextData
);

interface SessionProviderProps {
    children: ReactNode;
}

export function SessionProvider({
    children,
}: SessionProviderProps) {
    const [session, setSession] = useState<TableSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSession();
    }, []);

    async function loadSession() {
        try {
            const savedSession = await TableSessionService.get();

            setSession(savedSession);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    async function saveSession(newSession: TableSession) {
        await TableSessionService.save(newSession);

        setSession(newSession);
    }

    async function clearSession() {
        await TableSessionService.clear();

        setSession(null);
    }

    return (
        <SessionContext.Provider
            value={{
                session,
                loading,
                saveSession,
                clearSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}