import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/google-reviews')({
  server: {
    handlers: {
      GET: async () => Response.json({ configured: Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID) }),
    },
  },
})
