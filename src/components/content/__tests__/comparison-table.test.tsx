import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ComparisonTable } from "../comparison-table"

describe("ComparisonTable", () => {
  it("renders two columns with headers and rows", () => {
    render(
      <ComparisonTable
        headers={["正しい", "間違い"]}
        rows={[
          ["∀x(P(x) → Q(x))", "∀x(P(x) ∧ Q(x))"],
          ["→ で条件を絞る", "∧ で全対象に適用"],
        ]}
      />
    )
    expect(screen.getByText("正しい")).toBeInTheDocument()
    expect(screen.getByText("間違い")).toBeInTheDocument()
    expect(screen.getByText("∀x(P(x) → Q(x))")).toBeInTheDocument()
  })
})
