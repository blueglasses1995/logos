import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ArgumentTree } from "../argument-tree"

describe("ArgumentTree", () => {
  it("renders premises and conclusion", () => {
    render(
      <ArgumentTree
        premises={["P → Q", "P"]}
        conclusion="Q"
        rule="Modus Ponens"
      />
    )
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("P")).toBeInTheDocument()
    expect(screen.getByText("Q")).toBeInTheDocument()
    expect(screen.getByText("Modus Ponens")).toBeInTheDocument()
  })

  it("renders the SVG element", () => {
    const { container } = render(
      <ArgumentTree
        premises={["A", "B"]}
        conclusion="C"
        rule="Rule"
      />
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders a caption when provided", () => {
    render(
      <ArgumentTree
        premises={["P"]}
        conclusion="Q"
        rule="Rule"
        caption="Example argument"
      />
    )
    expect(screen.getByText("Example argument")).toBeInTheDocument()
  })
})
