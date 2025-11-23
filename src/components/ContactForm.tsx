'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact'
import { Button } from '@/components/ui/button'
import { FloatingLabelInput, FloatingLabelTextarea } from '@/components/ui/floating-label-input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ContactFormProps {
    formStrings?: {
        nameLabel: string;
        emailLabel: string;
        messageLabel: string;
        sendButtonText: string;
        sendingButtonText: string;
        successMessage: string;
        errorMessage: string;
    };
}

export default function ContactForm({ formStrings }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Default values if Sanity data is missing
    const labels = {
        name: formStrings?.nameLabel || 'Name',
        email: formStrings?.emailLabel || 'Email',
        message: formStrings?.messageLabel || 'Message',
        send: formStrings?.sendButtonText || 'Send Message',
        sending: formStrings?.sendingButtonText || 'Sending...',
        success: formStrings?.successMessage || 'Message sent successfully!',
        error: formStrings?.errorMessage || 'Something went wrong. Please try again.',
    }

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: 'onBlur', // Validate on blur as requested
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    })

    const { isValid } = form.formState

    async function onSubmit(data: ContactFormData) {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message')
            }

            toast.success(labels.success)
            form.reset()
        } catch (error) {
            toast.error(labels.error)
            console.error('Contact form error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <FloatingLabelInput
                        id="name"
                        label={labels.name}
                        {...form.register('name')}
                        error={form.formState.errors.name?.message}
                    />
                </div>

                <div className="space-y-1">
                    <FloatingLabelInput
                        id="email"
                        type="email"
                        label={labels.email}
                        {...form.register('email')}
                        error={form.formState.errors.email?.message}
                    />
                </div>

                <div className="space-y-1">
                    <FloatingLabelTextarea
                        id="message"
                        label={labels.message}
                        {...form.register('message')}
                        onChange={(e) => {
                            form.register('message').onChange(e);
                            form.trigger('message');
                        }}
                        error={form.formState.errors.message?.message}
                    />
                </div>
            </div>

            <Button
                type="submit"
                className={cn(
                    "w-full h-12 text-base font-medium transition-all duration-300",
                    isValid && !isSubmitting
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_20px_-5px_hsl(var(--accent))] hover:shadow-[0_0_25px_-5px_hsl(var(--accent))]"
                        : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                )}
                disabled={isSubmitting || !isValid}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {labels.sending}
                    </>
                ) : (
                    labels.send
                )}
            </Button>
        </form>
    )
}
