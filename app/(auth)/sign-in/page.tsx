'use client';

import React from 'react'
import { useForm } from 'react-hook-form'
import InputField from '@/components/forms/InputField'
import { Button } from '@/components/ui/button'
import FooterLink from '@/components/forms/FooterLink'

type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        defaultValues: { email: '', password: '' },
        mode: 'onBlur'
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log('Sign in:', data)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <h1 className="form-title">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="example@gmail.com"
                    type="email"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required' }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

                <FooterLink text="Don\'t have an account?" linkText="Sign up" href="/sign-up" />
            </form>
        </>
    )
}

export default SignIn
