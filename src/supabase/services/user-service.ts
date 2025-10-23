import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../client";
import { User_Profile } from "../schema/schema.type";

class UsersService {
    private table = "users";

    async get_current_user(): Promise<User & User_Profile | null> {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user && error) throw error;

        const { data: currentUser, error: currentUserError } = await supabase.from(this.table)
            .select("*")
            .eq("id", user && user.id)
            .single()

        if (currentUserError) throw currentUserError;

        if (currentUser) {
            const userData = {
                ...user,
                ...currentUser
            }

            return userData;
        }

        return null
    }

    async get_session(): Promise<Session | null> {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }

    // register a new user
    async signup_user(payload: Omit<User_Profile, 'id' | 'profile_image'>): Promise<User | null> {
        // Step 1: Create account in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
        });

        if (authError) throw authError;

        const user = authData.user;
        if (!user) return null;

        // Step 2: Insert extra data into users table
        const userPayload = {
            id: user.id, // match auth user id
            email: user.email,
            full_name: payload.full_name,
            phone: payload.phone,
            company_name: payload.company_name,
            city: payload.city,
            state: payload.state,
        };

        const { data: db_user, error: dbError } = await supabase
            .from(this.table)
            .insert([userPayload])
            .select("*")
            .single();

        if (dbError) throw dbError;

        // Step 3: Merge Auth + DB data
        return {
            ...user,
            ...db_user,
        };
    }


    // Login user
    async login_user(email: string, password: string): Promise<Session | null> {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw signInError;

        return signInData.session;
    }

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    async sign_out(): Promise<AuthError | void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
}

export const users_service = new UsersService();