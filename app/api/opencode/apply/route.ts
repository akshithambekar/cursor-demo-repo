import { NextRequest, NextResponse } from 'next/server';
import { createOpencodeClient } from '@opencode-ai/sdk';

export async function POST(request: NextRequest) {
  // DEV-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const opencodeUrl = process.env.OPENCODE_SERVER_URL || 'http://localhost:3001';

    // Initialize OpenCode client
    const client = createOpencodeClient({ baseUrl: opencodeUrl });

    try {
      // Send message to OpenCode via session prompt
      const sessionResponse = await client.session.create({ body: { title: 'PR Preview Change'}, query: {
        directory: "/Users/liammonaghan/JS/cursor-demo-repo"
      } });
      const sessionId = sessionResponse.data?.id;

      if (!sessionId) {
        throw new Error('Failed to create session');
      }

      const promptResponse = await client.session.prompt({
        path: { id: sessionId },
        body: { parts: [{ type: 'text', text: message }] }
      });

      // Get the result from response data
      const result = promptResponse.data?.parts
        ?.map((part) => {
          if (part.type === 'text' && 'text' in part) {
            return part.text;
          }
          return '';
        })
        .join('') || '';

      return NextResponse.json({
        success: true,
        response: result
      });
    } catch (fetchError: any) {
      // Handle connection errors specifically
      if (fetchError.cause?.code === 'ECONNREFUSED') {
        return NextResponse.json(
          {
            success: false,
            response: `Cannot connect to OpenCode server at ${opencodeUrl}. Please ensure the OpenCode server is running.`
          },
          { status: 503 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('OpenCode API error:', error);
    return NextResponse.json(
      { success: false, response: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
