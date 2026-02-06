interface ComparisonTableProps {
  readonly headers: readonly [string, string]
  readonly rows: readonly (readonly [string, string])[]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-4 py-2 bg-truth/10 text-truth font-medium border border-border">
              {headers[0]}
            </th>
            <th className="text-left px-4 py-2 bg-falsehood/10 text-falsehood font-medium border border-border">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border border-border text-foreground/80">
                {row[0]}
              </td>
              <td className="px-4 py-2 border border-border text-foreground/80">
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
