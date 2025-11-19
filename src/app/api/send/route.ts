import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactFormSchema } from '@/lib/validations/contact'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery } from '@/lib/sanity/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const result = contactFormSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { name, email, message } = result.data

        // Fetch Sanity configuration
        const { data: sanityData } = await sanityFetch({ query: contactPageQuery })
        const confirmationConfig = sanityData?.confirmationEmail

        // Send notification email (to owner)
        const notificationEmail = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Update this with your verified domain
            to: 'mevans212@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            replyTo: email,
        })

        if (notificationEmail.error) {
            return NextResponse.json({ error: notificationEmail.error.message }, { status: 400 })
        }

        // Send confirmation email (to user) if enabled
        if (confirmationConfig?.enabled) {
            const fromName = confirmationConfig.fromName || 'Michael Evans'
            const subject = confirmationConfig.subject || 'Thanks for reaching out!'
            const bodyText = confirmationConfig.body || 'Thanks for your message. I will get back to you shortly.'
            const cc = confirmationConfig.cc

            await resend.emails.send({
                from: `${fromName} <onboarding@resend.dev>`, // Update this with your verified domain
                to: email,
                cc: cc,
                subject: subject,
                text: bodyText,
            })
        }

        return NextResponse.json({ success: true, data: notificationEmail.data })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
