import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QuizRunner } from "../QuizRunner"
import type { Quiz } from "@/types/content"

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "Q1: What is 1+1?",
    options: ["1", "2"],
    correctIndex: 1,
    explanation: "It's 2.",
  },
  {
    id: "q2",
    type: "multiple-choice",
    question: "Q2: What is 2+2?",
    options: ["3", "4"],
    correctIndex: 1,
    explanation: "It's 4.",
  },
]

describe("QuizRunner", () => {
  it("shows first quiz initially", () => {
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)
    expect(screen.getByText("Q1: What is 1+1?")).toBeInTheDocument()
  })

  it("shows progress indicator", () => {
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("advances to next quiz after answering", async () => {
    const user = userEvent.setup()
    render(<QuizRunner quizzes={QUIZZES} onComplete={vi.fn()} />)

    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /次へ/i }))

    expect(screen.getByText("Q2: What is 2+2?")).toBeInTheDocument()
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
  })

  it("calls onComplete with results after last quiz", async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<QuizRunner quizzes={QUIZZES} onComplete={onComplete} />)

    // Answer Q1
    await user.click(screen.getByText("2"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /次へ/i }))

    // Answer Q2
    await user.click(screen.getByText("4"))
    await user.click(screen.getByRole("button", { name: /回答/i }))
    await user.click(screen.getByRole("button", { name: /完了/i }))

    expect(onComplete).toHaveBeenCalledWith([
      { quizId: "q1", correct: true },
      { quizId: "q2", correct: true },
    ])
  })
})
