import { CreateAccountForm } from "@/components/forms/create-account-form"
import Link from "next/link"
import Image from "next/image"

export default function CreateAccount() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Create your account
                        </h1>
                        <p className="text-muted-foreground">
                            Join us to access exclusive products and services
                        </p>
                    </div>
                    <CreateAccountForm />
                </div>
            </div>
        </div>
    )
}
