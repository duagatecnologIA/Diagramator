import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { messages, prompt } = await request.json();
    
    // Debug: Log de mensajes recibidos
    console.log('Mensajes recibidos:', JSON.stringify(messages, null, 2));

    // Verificar que tenemos la API key de OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    // Verificar si hay imágenes en los mensajes
    const hasImages = messages.some((msg: any) => 
      msg.files && msg.files.some((file: any) => file.type.startsWith('image/'))
    );

    let openaiMessages;

    if (hasImages) {
      // Procesar mensajes con imágenes usando formato multimodal
      openaiMessages = messages.map((msg: any) => {
        if (msg.files && msg.files.some((file: any) => file.type.startsWith('image/'))) {
          const content: any[] = [
            {
              type: 'text',
              text: msg.content || 'Analiza esta imagen y genera un diagrama BPMS basado en el contenido visual que veas.'
            }
          ];
          
          // Agregar imágenes
          msg.files.forEach((file: any) => {
            if (file.type.startsWith('image/')) {
              // Validar que la URL base64 sea válida
              if (file.url && file.url.startsWith('data:image/')) {
                content.push({
                  type: 'image_url',
                  image_url: {
                    url: file.url
                  }
                });
              } else {
                console.warn('URL de imagen inválida:', file.url);
              }
            }
          });
          
          return {
            role: msg.role,
            content: content
          };
        } else {
          return {
            role: msg.role,
            content: msg.content
          };
        }
      });
    } else {
      // Procesar mensajes sin imágenes
      openaiMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
    }

    // Agregar mensaje del sistema
    const systemMessage = {
      role: 'system' as const,
      content: prompt
    };
    
    const finalMessages = [systemMessage, ...openaiMessages];

    // Debug: Log de mensajes procesados
    console.log('Mensajes procesados para OpenAI:', JSON.stringify(finalMessages, null, 2));

    if (hasImages) {
      // Usar OpenAI directamente para mensajes con imágenes
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const response = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: finalMessages as any,
          temperature: 0.7,
          stream: true,
        });

        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              }
              controller.close();
            } catch (error) {
              console.error('Streaming error:', error);
              controller.error(error);
            }
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        });
      } catch (error: any) {
        console.error('OpenAI API error:', error);
        
        // Si es un error de imagen inválida, devolver mensaje específico
        if (error.message && error.message.includes('unsupported image')) {
          return new Response('Error: Formato de imagen no soportado. Use PNG, JPEG, GIF o WebP.', { status: 400 });
        }
        
        return new Response('Error procesando imagen: ' + error.message, { status: 500 });
      }
    } else {
      // Usar Vercel AI SDK para mensajes sin imágenes
      const result = await streamText({
        model: openai('gpt-4o'),
        messages: finalMessages,
        temperature: 0.7,
      });

      return result.toTextStreamResponse();
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
