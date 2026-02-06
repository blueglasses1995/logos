import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VennDiagram } from "../venn-diagram"

describe("VennDiagram", () => {
  it("renders two circle labels", () => {
    render(<VennDiagram labelA="Dogs" labelB="Pets" />)
    expect(screen.getByText("Dogs")).toBeInTheDocument()
    expect(screen.getByText("Pets")).toBeInTheDocument()
  })

  it("renders SVG element", () => {
    const { container } = render(<VennDiagram labelA="A" labelB="B" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("highlights a region when clicked", async () => {
    const user = userEvent.setup()
    render(<VennDiagram labelA="A" labelB="B" interactive />)
    const regionButton = screen.getByRole("button", { name: /A ∩ B/ })
    await user.click(regionButton)
    expect(regionButton).toHaveAttribute("aria-pressed", "true")
  })

  it("shows a formula label when provided", () => {
    render(
      <VennDiagram
        labelA="P(x)"
        labelB="Q(x)"
        formulaLabel="∀x (P(x) → Q(x))"
      />
    )
    expect(screen.getByText("∀x (P(x) → Q(x))")).toBeInTheDocument()
  })
})
