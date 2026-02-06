import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProofBuilderQuiz } from "../ProofBuilderQuiz"
import type { ProofBuilderQuiz as ProofBuilderQuizType } from "@/types/content"

describe("ProofBuilderQuiz", () => {
  const quiz: ProofBuilderQuizType = {
    id: "pb-test",
    type: "proof-builder",
    conclusion: "Q",
    availablePremises: [
      { id: "p1", label: "P → Q", rule: "前提" },
      { id: "p2", label: "P", rule: "前提" },
    ],
    correctOrder: ["p2", "p1"],
    explanation: "モーダスポネンス: PとP→QからQを導く",
  }

  it("renders all premise cards", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("P")).toBeInTheDocument()
  })

  it("renders the conclusion", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/∴ Q/)).toBeInTheDocument()
  })

  it("has a submit button", () => {
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /提出/ })).toBeInTheDocument()
  })

  it("shows explanation after submission", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<ProofBuilderQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(screen.getByText(/モーダスポネンス/)).toBeInTheDocument()
    expect(onAnswer).toHaveBeenCalled()
  })
})
