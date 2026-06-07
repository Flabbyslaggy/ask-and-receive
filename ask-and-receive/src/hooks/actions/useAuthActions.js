import { supabase } from "../../supabaseClient"

export function useAuthActions() {
    async function handleLogout() {
        await supabase.auth.signOut()
    }

    return {
        handleLogout,
    }
}