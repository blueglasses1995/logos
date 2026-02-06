import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FallacySpotterQuiz } from "../FallacySpotterQuiz"
import type { FallacySpotterQuiz as FallacySpotterQuizType } from "@/types/content"

describe("FallacySpotterQuiz", () => {
  const quiz: FallacySpotterQuizType = {
    id: "fs-test",
    type: "fallacy-spotter",
    passage: "彼は若いから、提案は信用できない。",
    fallacyType: "ad-hominem",
    distractors: ["straw-man", "false-dilemma", "slippery-slope"],
    explanation: "人の属性で議論を退けるのは人身攻撃",
  }

  it("renders the passage", () => {
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText(/彼は若いから/)).toBeInTheDocument()
  })

  it("renders fallacy options", () => {
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("button", { name: /人身攻撃/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /藁人形論法/ })).toBeInTheDocument()
  })

  it("shows correct feedback on right answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /人身攻撃/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
    expect(screen.getByText(/人の属性で/)).toBeInTheDocument()
  })

  it("shows incorrect feedback on wrong answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FallacySpotterQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.click(screen.getByRole("button", { name: /藁人形論法/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
