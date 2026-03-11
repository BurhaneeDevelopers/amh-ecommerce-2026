"use client"

import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Use_login } from "@/api/user.service"
import { toast } from "sonner"

const AuthSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
})

interface AuthModalProps {
    setAuthModalOpen: (open: boolean) => void
}

const AuthForm: React.FC<AuthModalProps> = ({ setAuthModalOpen }) => {
    const { mutate: login, isPending: is_logging } = Use_login();

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={AuthSchema}
            onSubmit={(values, { resetForm }) => {
                login(values, {
                    onSuccess: async () => {
                        toast.success("Logged In Successfully");
                        resetForm();
                        setAuthModalOpen(false)
                    },
                    onError: (error) => {
                        toast.error(error.message || "Error logging in");
                    },
                });
            }}
        >

            <Form className="flex flex-col gap-4">
                <div>
                    <Field
                        as={Input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full"
                    />
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>

                <div>
                    <Field
                        as={Input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full"
                    />
                    <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>

                <Button type="submit" disabled={is_logging} className="w-full">
                    {is_logging ? "fetching details..." : "Sign In"}
                </Button>
            </Form>

        </Formik>
    )
}

export default AuthForm
