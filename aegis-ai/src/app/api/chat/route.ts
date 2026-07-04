import { NextRequest } from "next/server";
import { getAdvisorResponse } from "@/lib/advisor-engine";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { message, history } = (await req.json()) as {
    message: string;
    history: ChatMessage[];
  };

  const response = getAdvisorResponse(message, history || []);
  const words = response.text.split(" ");

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Simulate thinking latency before the first token, like a real model call
      await new Promise((r) => setTimeout(r, 450));

      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "token", value: chunk })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 30));
      }

      if (response.cards) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "cards", value: response.cards })}\n\n`
          )
        );
      }
      if (response.quickReplies) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "quickReplies", value: response.quickReplies })}\n\n`
          )
        );
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
