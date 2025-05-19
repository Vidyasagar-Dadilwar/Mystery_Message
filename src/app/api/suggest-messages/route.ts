import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { Stream } from 'openai/streaming.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const prompt = "Create a list of 3 open-ended and engaging questions that can be formatted as a single string. Each question should be separeted by '||'. These question are for an anonynous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on univresal themes that encourages friendly interaction. For example, 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity and contribute to a positive and welcoming conversational evnvironment.";

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 2000,
            stream: true,
            prompt
        });
    
        const stream = OpenAIStream(response);
        return new NextResponse(stream);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            console.error('OpenAI API Error:', { name, status, headers, message });

            return NextResponse.json(
                {
                    name, status, headers, message
                },
                { status: status }
            );
        } 
        else {
            console.error('Unexpected error:', error);
        }
        
    }
}

function OpenAIStream(response: Stream<OpenAI.Completions.Completion> & { _request_id?: string | null; }) {
    // Example: pipe the OpenAI stream to a ReadableStream for Next.js Edge API
    const reader = response as unknown as ReadableStream<Uint8Array>;
    return reader;
}
