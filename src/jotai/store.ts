import { User_Profile } from '@/supabase/schema/schema.type'
import { User } from '@supabase/supabase-js'
import { atom } from 'jotai'

export const toggleAllCategoriesAtom = atom<boolean>(true)

export const current_user_auth_atom = atom<User & User_Profile | null>()