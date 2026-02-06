interface ArgumentTreeProps {
  readonly premises: readonly string[]
  readonly conclusion: string
  readonly rule: string
  readonly caption?: string
}

const NODE_WIDTH = 140
const NODE_HEIGHT = 40
const VERTICAL_GAP = 60
const HORIZONTAL_GAP = 16

export function ArgumentTree({
  premises,
  conclusion,
  rule,
  caption,
}: ArgumentTreeProps) {
  const totalWidth = premises.length * NODE_WIDTH + (premises.length - 1) * HORIZONTAL_GAP
  const svgWidth = Math.max(totalWidth, NODE_WIDTH) + 40
  const svgHeight = NODE_HEIGHT * 2 + VERTICAL_GAP + 60

  const premiseY = 20
  const conclusionY = premiseY + NODE_HEIGHT + VERTICAL_GAP
  const conclusionX = svgWidth / 2

  return (
    <figure className="not-prose my-6">
      <div className="bg-secondary border border-border rounded-md px-4 py-4 flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-lg"
          role="img"
          aria-label={`論証構造: ${premises.join(", ")} → ${conclusion}`}
        >
          {/* Premises */}
          {premises.map((premise, i) => {
            const x =
              (svgWidth - totalWidth) / 2 +
              i * (NODE_WIDTH + HORIZONTAL_GAP) +
              NODE_WIDTH / 2
            return (
              <g key={premise}>
                {/* Premise box */}
                <rect
                  x={x - NODE_WIDTH / 2}
                  y={premiseY}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={6}
                  className="fill-primary/10 stroke-primary/40"
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={premiseY + NODE_HEIGHT / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-mono fill-foreground"
                >
                  {premise}
                </text>
                {/* Connecting line */}
                <line
                  x1={x}
                  y1={premiseY + NODE_HEIGHT}
                  x2={conclusionX}
                  y2={conclusionY}
                  className="stroke-primary/30"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              </g>
            )
          })}

          {/* Rule label */}
          <text
            x={conclusionX + NODE_WIDTH / 2 + 8}
            y={(premiseY + NODE_HEIGHT + conclusionY) / 2}
            className="text-[10px] fill-muted-foreground italic"
            dominantBaseline="middle"
          >
            {rule}
          </text>

          {/* Conclusion box */}
          <rect
            x={conclusionX - NODE_WIDTH / 2}
            y={conclusionY}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx={6}
            className="fill-primary/20 stroke-primary"
            strokeWidth={2}
          />
          <text
            x={conclusionX}
            y={conclusionY + NODE_HEIGHT / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-mono font-bold fill-foreground"
          >
            <tspan>∴ </tspan>
            <tspan>{conclusion}</tspan>
          </text>
        </svg>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
