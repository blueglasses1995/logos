interface PullQuoteProps {
  readonly quote: string
  readonly attribution?: string
}

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <figure className="not-prose my-10 border-l-4 border-primary/40 pl-6 py-2">
      <blockquote className="text-lg font-serif italic text-foreground/80 leading-relaxed">
        {quote}
      </blockquote>
      {attribution && (
        <figcaption className="text-sm text-muted-foreground mt-3">
          — {attribution}
        </figcaption>
      )}
    </figure>
  )
}
