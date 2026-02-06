import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CounterexampleQuiz } from "../CounterexampleQuiz"
import type { CounterexampleQuiz as CounterexampleQuizType } from "@/types/content"

describe("CounterexampleQuiz", () => {
  const quiz: CounterexampleQuizType = {
    id: "ce-test",
    type: "counterexample",
    argument: "すべての鳥は飛べる。ペンギンは鳥だ。よってペンギンは飛べる。",
    premises: ["すべての鳥は飛べる", "ペンギンは鳥だ"],
    conclusion: "ペンギンは飛べる",
    vulnerablePremiseIndex: 0,
    counterexamples: [
      { id: "ce1", text: "ペンギンは飛べない鳥である", isValid: true },
      { id: "ce2", text: "タカは速く飛べる", isValid: false },
      { id: "ce3", text: "ダチョウは飛べない鳥である", isValid: true },
      { id: "ce4", text: "飛行機は飛べる", isValid: false },
    ],
    explanation: "「すべての鳥は飛べる」は偽。ペンギンやダチョウは反例。",
  }

  it("renders the argument", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/すべての鳥は飛べる。ペンギンは鳥だ。よってペンギンは飛べる。/)).toBeInTheDocument()
  })

  it("renders premise labels with highlight on vulnerable one", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("すべての鳥は飛べる")).toBeInTheDocument()
    expect(screen.getByText("ペンギンは鳥だ")).toBeInTheDocument()
  })

  it("renders counterexample options", () => {
    render(<CounterexampleQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /ペンギンは飛べない鳥/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /タカは速く飛べる/ })).toBeInTheDocument()
  })

  it("correct answer triggers onAnswer(true)", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<CounterexampleQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /ペンギンは飛べない鳥/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("wrong answer triggers onAnswer(false)", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<CounterexampleQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /タカは速く飛べる/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
