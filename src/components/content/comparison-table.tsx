interface ComparisonTableProps {
  readonly headers: readonly string[]
  readonly rows: readonly (readonly string[])[]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  const isTwo = headers.length === 2
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className={`text-left px-4 py-2 font-medium border border-border ${
                  isTwo && i === 0
                    ? "bg-truth/10 text-truth"
                    : isTwo && i === 1
                      ? "bg-falsehood/10 text-falsehood"
                      : "bg-muted text-foreground/80"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2 border border-border text-foreground/80"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
