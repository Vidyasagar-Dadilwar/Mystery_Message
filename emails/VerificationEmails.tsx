import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text ,
    Button,
} from '@react-email/components';
import React from 'react';

interface VerificationEmaitProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmaitProps) {
    return (
        <Html>
            <Head />
            <Preview>Verification Email</Preview>
            <Font
                fontFamily="Arial, sans-serif" fallbackFontFamily={'Arial'}            />
            <Section>
                <Row>
                    <Heading>Welcome {username}!</Heading>
                    <Text>Your OTP is: {otp}</Text>
                    {/* <Button href="#">Verify Now</Button> */}
                </Row>
            </Section>
        </Html>
    );
}