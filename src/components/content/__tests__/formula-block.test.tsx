import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FormulaBlock } from "../formula-block"

describe("FormulaBlock", () => {
  it("renders formula text", () => {
    render(<FormulaBlock>∀x (P(x) → Q(x))</FormulaBlock>)
    expect(screen.getByText("∀x (P(x) → Q(x))")).toBeInTheDocument()
  })

  it("renders with caption", () => {
    render(
      <FormulaBlock caption="ド・モルガンの法則">
        ¬(A ∧ B) ≡ ¬A ∨ ¬B
      </FormulaBlock>
    )
    expect(screen.getByText("ド・モルガンの法則")).toBeInTheDocument()
  })
})
