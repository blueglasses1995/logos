import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Callout } from "../callout"

describe("Callout", () => {
  it("renders children with definition variant", () => {
    render(
      <Callout variant="definition" label="定義">
        述語とは何か
      </Callout>
    )
    expect(screen.getByText("定義")).toBeInTheDocument()
    expect(screen.getByText("述語とは何か")).toBeInTheDocument()
  })

  it("renders warning variant", () => {
    render(
      <Callout variant="warning" label="注意">
        よくある間違い
      </Callout>
    )
    expect(screen.getByText("注意")).toBeInTheDocument()
  })

  it("renders tip variant without label", () => {
    render(<Callout variant="tip">ヒント内容</Callout>)
    expect(screen.getByText("ヒント内容")).toBeInTheDocument()
  })
})
