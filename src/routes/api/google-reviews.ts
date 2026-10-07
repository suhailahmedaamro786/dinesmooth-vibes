import { createFileRoute } from "@tanstack/react-router";

const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export const Route = createFileRoute("/api/google-reviews")({
  server: {
    handlers: {
      GET: async () => {
        if (!PLACE_ID || !API_KEY) {
          return Response.json(
            { error: "Google reviews are not configured yet." },
            { status: 503 },
          );
        }

        const response = await fetch(
          `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`,
          {
            headers: {
              "X-Goog-Api-Key": API_KEY,
              "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
            },
          },
        );

        if (!response.ok) {
          return Response.json(
            { error: "Unable to load Google reviews right now." },
            { status: 502 },
          );
        }

        const data = await response.json();

        return Response.json(
          {
            rating: typeof data.rating === "number" ? data.rating : null,
            reviewCount:
              typeof data.userRatingCount === "number"
                ? data.userRatingCount
                : null,
            reviews: Array.isArray(data.reviews)
              ? data.reviews.map((review: any) => ({
                  name: review.authorAttribution?.displayName ?? "Google user",
                  rating:
                    typeof review.rating === "number" ? review.rating : null,
                  text: review.text?.text ?? "",
                  relativeTime: review.relativePublishTimeDescription ?? "",
                  authorUrl: review.authorAttribution?.uri ?? null,
                }))
              : [],
          },
          {
            headers: {
              "Cache-Control":
                "public, max-age=300, stale-while-revalidate=1800",
            },
          },
        );
      },
    },
  },
});
