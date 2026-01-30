import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TruthTableQuiz } from "../TruthTableQuiz"
import type { TruthTableQuiz as TTQuiz } from "@/types/content"

const QUIZ: TTQuiz = {
  id: "tt-test-1",
  type: "truth-table",
  expression: "P ∧ Q",
  variables: ["P", "Q"],
  expectedTable: [
    [true, true, true],
    [true, false, false],
    [false, true, false],
    [false, false, false],
  ],
  blanks: [2, 5, 8, 11],
}

describe("TruthTableQuiz", () => {
  it("renders expression and variable headers", () => {
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    const expressionElements = screen.getAllByText("P ∧ Q")
    expect(expressionElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("P")).toBeInTheDocument()
    expect(screen.getByText("Q")).toBeInTheDocument()
  })

  it("renders blank cells as toggle buttons", () => {
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    const toggleButtons = screen.getAllByRole("button", { name: "?" })
    expect(toggleButtons).toHaveLength(4)
  })

  it("cycles toggle button through ? → T → F → ?", async () => {
    const user = userEvent.setup()
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={vi.fn()} />)

    const toggleButtons = screen.getAllByRole("button", { name: "?" })
    const firstToggle = toggleButtons[0]

    // ? → T
    await user.click(firstToggle)
    expect(firstToggle).toHaveTextContent("T")

    // T → F
    await user.click(firstToggle)
    expect(firstToggle).toHaveTextContent("F")

    // F → ?
    await user.click(firstToggle)
    expect(firstToggle).toHaveTextContent("?")
  })

  it("calls onAnswer with true when all blanks correct", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    const toggleButtons = screen.getAllByRole("button", { name: "?" })

    // Blank 0 (row0, result col): expected true → click once (? → T)
    await user.click(toggleButtons[0])

    // Blank 1 (row1, result col): expected false → click twice (? → T → F)
    await user.click(toggleButtons[1])
    await user.click(toggleButtons[1])

    // Blank 2 (row2, result col): expected false → click twice (? → T → F)
    await user.click(toggleButtons[2])
    await user.click(toggleButtons[2])

    // Blank 3 (row3, result col): expected false → click twice (? → T → F)
    await user.click(toggleButtons[3])
    await user.click(toggleButtons[3])

    await user.click(screen.getByRole("button", { name: /回答/i }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("calls onAnswer with false when any blank incorrect", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<TruthTableQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    const toggleButtons = screen.getAllByRole("button", { name: "?" })

    // Set all to T (only first is correct)
    await user.click(toggleButtons[0])
    await user.click(toggleButtons[1])
    await user.click(toggleButtons[2])
    await user.click(toggleButtons[3])

    await user.click(screen.getByRole("button", { name: /回答/i }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
