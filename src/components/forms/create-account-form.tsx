"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Use_create_cew_user } from "@/api/user.service"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface FormValues {
    full_name: string
    company_name: string
    phone: string
    email: string
    password: string
}

export function CreateAccountForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const createUserMutation = Use_create_cew_user()

    const formik = useFormik<FormValues>({
        initialValues: {
            full_name: "",
            company_name: "",
            phone: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            full_name: Yup.string()
                .min(2, "Full name must be at least 2 characters")
                .required("Full name is required"),
            company_name: Yup.string().required("Company name is required"),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
                .required("Phone is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setErrorMessage(null)
                await createUserMutation.mutateAsync(values)
                
                toast.success("Account created successfully!", {
                    description: "Welcome to MSI E-commerce. Redirecting to home...",
                })
                
                // Redirect to home page after successful signup
                setTimeout(() => {
                    router.push("/")
                }, 1500)
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to create account. Please try again."
                setErrorMessage(message)
                
                toast.error("Error", {
                    description: message,
                })
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <form
            onSubmit={formik.handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Fill in your details to create an account
                </p>
                {errorMessage && (
                    <div className="w-full p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {errorMessage}
                    </div>
                )}
            </div>

            <div className="grid gap-6">
                {/* Full Name */}
                <div className="grid gap-2">
                    <label htmlFor="full_name">Full Name</label>
                    <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        {...formik.getFieldProps("full_name")}
                    />
                    {formik.touched.full_name && formik.errors.full_name && (
                        <p className="text-sm text-red-500">{formik.errors.full_name}</p>
                    )}
                </div>

                {/* Company Name */}
                <div className="grid gap-2">
                    <label htmlFor="company_name">Company Name</label>
                    <Input
                        id="company_name"
                        type="text"
                        placeholder="Acme Corp"
                        {...formik.getFieldProps("company_name")}
                    />
                    {formik.touched.company_name && formik.errors.company_name && (
                        <p className="text-sm text-red-500">{formik.errors.company_name}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                    <label htmlFor="phone">Phone</label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        {...formik.getFieldProps("phone")}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-sm text-red-500">{formik.errors.phone}</p>
                    )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <label htmlFor="password">Password</label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">{formik.errors.password}</p>
                    )}
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Creating account..." : "Create Account"}
                </Button>

                {/* Divider */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>

                {/* Social Login */}
                <Button variant="outline" className="w-full" type="button">
                    Sign up with Google
                </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                    Login
                </a>
            </div>
        </form>
    )
}