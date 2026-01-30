import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { MultipleChoiceQuiz } from "../MultipleChoiceQuiz"
import type { MultipleChoiceQuiz as MCQuiz } from "@/types/content"

const QUIZ: MCQuiz = {
  id: "test-1",
  type: "multiple-choice",
  question: "1 + 1 = ?",
  options: ["1", "2", "3", "4"],
  correctIndex: 1,
  explanation: "1 + 1 equals 2.",
}

describe("MultipleChoiceQuiz", () => {
  it("renders question and options", () => {
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={vi.fn()} />)
    expect(screen.getByText("1 + 1 = ?")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("calls onAnswer with true when correct option selected", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("shows explanation after answering", async () => {
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={vi.fn()} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(screen.getByText("1 + 1 equals 2.")).toBeInTheDocument()
  })

  it("calls onAnswer with false when wrong option selected", async () => {
    const onAnswer = vi.fn()
    const user = userEvent.setup()
    render(<MultipleChoiceQuiz quiz={QUIZ} onAnswer={onAnswer} />)

    await user.click(screen.getByText("3"))
    await user.click(screen.getByRole("button", { name: /回答/i }))

    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
