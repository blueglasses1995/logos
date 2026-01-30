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
            <th className="text-left px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium border border-zinc-200 dark:border-zinc-700">
              {headers[0]}
            </th>
            <th className="text-left px-4 py-2 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 font-medium border border-zinc-200 dark:border-zinc-700">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                {row[0]}
              </td>
              <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
