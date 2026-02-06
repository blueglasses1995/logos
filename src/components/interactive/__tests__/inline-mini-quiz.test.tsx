import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InlineMiniQuiz } from "../inline-mini-quiz"

describe("InlineMiniQuiz", () => {
  const props = {
    question: "P ∧ Q が偽になるのは？",
    options: ["両方偽", "P偽", "Q偽", "どれか1つ偽"],
    correctIndex: 3,
    explanation: "どちらか片方が偽なら ∧ は偽",
  }

  it("renders the question", () => {
    render(<InlineMiniQuiz {...props} />)
    expect(screen.getByText("P ∧ Q が偽になるのは？")).toBeInTheDocument()
  })

  it("shows options as buttons", () => {
    render(<InlineMiniQuiz {...props} />)
    expect(screen.getByRole("button", { name: /両方偽/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /どれか1つ偽/ })).toBeInTheDocument()
  })

  it("reveals explanation after correct answer", async () => {
    const user = userEvent.setup()
    render(<InlineMiniQuiz {...props} />)
    await user.click(screen.getByRole("button", { name: /どれか1つ偽/ }))
    expect(screen.getByText(/どちらか片方が偽なら/)).toBeInTheDocument()
  })

  it("shows incorrect feedback then allows retry", async () => {
    const user = userEvent.setup()
    render(<InlineMiniQuiz {...props} />)
    await user.click(screen.getByRole("button", { name: /両方偽/ }))
    expect(screen.getByText(/不正解/)).toBeInTheDocument()
  })
})
