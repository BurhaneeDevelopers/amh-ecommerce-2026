import { CreateAccountForm } from "@/components/forms/create-account-form"
import Image from "next/image"

export default function CreateAccount() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-5">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <Image
                            alt="MSI"
                            src={"/logo.png"}
                            width={500}
                            height={500}
                            className="object-cover w-28 h-16"
                        />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <CreateAccountForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width={500}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
