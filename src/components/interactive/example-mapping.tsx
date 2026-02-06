interface ExampleMappingProps {
  readonly formula: string
  readonly example: string
  readonly variables: Readonly<Record<string, string>>
  readonly caption?: string
}

export function ExampleMapping({
  formula,
  example,
  variables,
  caption,
}: ExampleMappingProps) {
  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Abstract */}
          <div className="px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              抽象（論理式）
            </div>
            <code className="text-base font-mono text-foreground">{formula}</code>
          </div>
          {/* Concrete */}
          <div className="px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              具体（日常例）
            </div>
            <div className="text-base text-foreground">{example}</div>
          </div>
        </div>
        {/* Variable mapping */}
        <div className="border-t border-border px-5 py-3 flex flex-wrap gap-3">
          {Object.entries(variables).map(([symbol, meaning]) => (
            <span key={symbol} className="text-xs text-muted-foreground">
              <code className="font-mono text-foreground">{symbol}</code> = {meaning}
            </span>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
