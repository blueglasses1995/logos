import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ExampleMapping } from "../example-mapping"

describe("ExampleMapping", () => {
  it("renders formula and example side by side", () => {
    render(
      <ExampleMapping
        formula="P → Q"
        example="雨が降る → 傘を持つ"
        variables={{ P: "雨が降る", Q: "傘を持つ" }}
      />
    )
    expect(screen.getByText("P → Q")).toBeInTheDocument()
    expect(screen.getByText("雨が降る → 傘を持つ")).toBeInTheDocument()
  })

  it("renders variable mappings", () => {
    render(
      <ExampleMapping
        formula="P ∧ Q"
        example="晴れかつ暖かい"
        variables={{ P: "晴れ", Q: "暖かい" }}
      />
    )
    expect(screen.getAllByText(/P/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/晴れ/).length).toBeGreaterThan(0)
  })
})
