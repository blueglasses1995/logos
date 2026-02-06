import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GapFillProofQuiz } from "../GapFillProofQuiz"
import type { GapFillProofQuiz as GapFillProofQuizType } from "@/types/content"

describe("GapFillProofQuiz", () => {
  const quiz: GapFillProofQuizType = {
    id: "gf-test",
    type: "gap-fill-proof",
    steps: [
      { id: "s1", content: "P → Q", type: "given" },
      { id: "s2", content: "___", type: "gap", correctValue: "P", options: ["P", "Q", "¬P", "¬Q"] },
      { id: "s3", content: "Q", type: "derived", rule: "モーダスポネンス (1, 2)" },
    ],
    explanation: "モーダスポネンスにはP→QとPが必要",
  }

  it("renders given steps", () => {
    render(<GapFillProofQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("モーダスポネンス (1, 2)")).toBeInTheDocument()
  })

  it("renders gap with dropdown options", () => {
    render(<GapFillProofQuiz quiz={quiz} onAnswer={vi.fn()} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("correct selection yields correct answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<GapFillProofQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.selectOptions(screen.getByRole("combobox"), "P")
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("incorrect selection yields incorrect answer", async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<GapFillProofQuiz quiz={quiz} onAnswer={onAnswer} />)
    await user.selectOptions(screen.getByRole("combobox"), "¬Q")
    await user.click(screen.getByRole("button", { name: /提出/ }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
