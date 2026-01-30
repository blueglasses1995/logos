"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TruthTableQuiz as TTQuiz } from "@/types/content"

interface Props {
  readonly quiz: TTQuiz
  readonly onAnswer: (correct: boolean) => void
}

type CellValue = "?" | "T" | "F"

const CYCLE: Record<CellValue, CellValue> = {
  "?": "T",
  T: "F",
  F: "?",
}

function cellToBool(value: CellValue): boolean | null {
  if (value === "T") return true
  if (value === "F") return false
  return null
}

export function TruthTableQuiz({ quiz, onAnswer }: Props) {
  const { expression, variables, expectedTable, blanks } = quiz
  const cols = variables.length + 1
  const blankSet = new Set(blanks)

  const [cellValues, setCellValues] = useState<ReadonlyMap<number, CellValue>>(
    () => new Map(blanks.map((idx) => [idx, "?" as CellValue]))
  )
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<ReadonlyMap<number, boolean>>(
    () => new Map()
  )

  function handleToggle(flatIndex: number) {
    if (submitted) return
    const current = cellValues.get(flatIndex) ?? "?"
    const next = CYCLE[current]
    setCellValues((prev) => {
      const updated = new Map(prev)
      updated.set(flatIndex, next)
      return updated
    })
  }

  function handleSubmit() {
    const newResults = new Map<number, boolean>()
    let allCorrect = true

    for (const flatIndex of blanks) {
      const row = Math.floor(flatIndex / cols)
      const col = flatIndex % cols
      const expected = expectedTable[row][col]
      const userVal = cellToBool(cellValues.get(flatIndex) ?? "?")
      const isCorrect = userVal === expected
      newResults.set(flatIndex, isCorrect)
      if (!isCorrect) allCorrect = false
    }

    setResults(newResults)
    setSubmitted(true)
    onAnswer(allCorrect)
  }

  function renderCell(row: number, col: number) {
    const flatIndex = row * cols + col
    const value = expectedTable[row][col]

    if (blankSet.has(flatIndex)) {
      const cellValue = cellValues.get(flatIndex) ?? "?"
      const result = results.get(flatIndex)

      return (
        <td key={col} className="border px-3 py-2 text-center">
          <button
            type="button"
            disabled={submitted}
            onClick={() => handleToggle(flatIndex)}
            className={cn(
              "min-w-[2rem] rounded px-2 py-1 font-mono font-bold transition-colors",
              !submitted && "bg-muted hover:bg-muted/80 cursor-pointer",
              submitted && result === true && "bg-green-200 text-green-800",
              submitted && result === false && "bg-red-200 text-red-800"
            )}
          >
            {cellValue}
          </button>
        </td>
      )
    }

    return (
      <td key={col} className="border px-3 py-2 text-center font-mono">
        {value ? "T" : "F"}
      </td>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{expression}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr>
              {variables.map((v) => (
                <th key={v} className="border bg-muted px-3 py-2">
                  {v}
                </th>
              ))}
              <th className="border bg-muted px-3 py-2">{expression}</th>
            </tr>
          </thead>
          <tbody>
            {expectedTable.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((_, colIdx) => renderCell(rowIdx, colIdx))}
              </tr>
            ))}
          </tbody>
        </table>

        {!submitted && (
          <Button onClick={handleSubmit} className="mt-4">
            回答
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
