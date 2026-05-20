import { createFileRoute } from "@tanstack/react-router";

/**
 * Mock real-time orders endpoint.
 * The client uses Zustand for the live admin sync; this endpoint
 * simulates a server acknowledgement (and could be wired to a DB later).
 */
export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown = null;
        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({ ok: true, receivedAt: Date.now(), order: payload }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
      GET: async () =>
        new Response(JSON.stringify({ ok: true, message: "DFC orders endpoint" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    },
  },
});
