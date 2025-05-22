import {resend} from '../lib/resend';

import VerificationEmail from '../../emails/VerificationEmails';

import { ApiResponse } from '@/types/ApiResponse';

export const sendVerificationEmail = async (
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse<void>> => {
    try {
        const emailContent = VerificationEmail({ username, otp });

        const response = await resend.emails.send({
            from: 'Mystery Message <onboarding@resend.dev>',
            to: "nexeki6184@mowline.com",               // since using test email
            // to: email,               // correct way to send email
            subject: 'Verification Email',
            react: VerificationEmail({ username, otp }), 
        });
        console.log('Email sent successfully:', response);
        return {
            success: true,
            message: 'Verification email sent successfully',
        };
    } 
    catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}
export default sendVerificationEmail;