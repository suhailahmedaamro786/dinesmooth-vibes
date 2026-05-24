import { Star } from "lucide-react";
import { useState } from "react";

export function StarRating({
  value,
  size = 14,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const full = Math.round(value);
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= full ? "fill-amber-brand text-amber-brand" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  size = 26,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            width={size}
            height={size}
            className={i <= display ? "fill-amber-brand text-amber-brand" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}
