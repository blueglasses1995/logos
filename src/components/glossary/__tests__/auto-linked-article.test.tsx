import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AutoLinkedArticle } from "../auto-linked-article"

describe("AutoLinkedArticle", () => {
  it("renders children without modification when no terms match", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>関係のないテキスト</p>
        </article>
      </AutoLinkedArticle>
    )
    expect(screen.getByText("関係のないテキスト")).toBeInTheDocument()
  })

  it("converts glossary terms into clickable links", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲは述語論理を作った。</p>
        </article>
      </AutoLinkedArticle>
    )
    const termButton = screen.getByRole("button", { name: "フレーゲ" })
    expect(termButton).toBeInTheDocument()
    expect(termButton).toHaveClass("glossary-term")
  })

  it("opens modal when a term is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲは述語論理を作った。</p>
        </article>
      </AutoLinkedArticle>
    )
    await user.click(screen.getByRole("button", { name: "フレーゲ" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/ドイツの数学者・論理学者/)).toBeInTheDocument()
  })

  it("links only the first occurrence of a term per paragraph", () => {
    render(
      <AutoLinkedArticle>
        <article>
          <p>フレーゲはフレーゲの著作を書いた。</p>
        </article>
      </AutoLinkedArticle>
    )
    const buttons = screen.getAllByRole("button", { name: "フレーゲ" })
    expect(buttons).toHaveLength(1)
  })
})
