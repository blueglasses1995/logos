import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LogicSandbox } from "../logic-sandbox"

describe("LogicSandbox", () => {
  const formulas = [
    { label: "P ∧ Q", evaluate: (v: Record<string, boolean>) => v.P && v.Q },
    { label: "P ∨ Q", evaluate: (v: Record<string, boolean>) => v.P || v.Q },
    { label: "P → Q", evaluate: (v: Record<string, boolean>) => !v.P || v.Q },
  ]

  it("renders variable toggles", () => {
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    expect(screen.getByRole("button", { name: /P/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Q/ })).toBeInTheDocument()
  })

  it("renders all formula labels", () => {
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    expect(screen.getByText("P ∧ Q")).toBeInTheDocument()
    expect(screen.getByText("P ∨ Q")).toBeInTheDocument()
    expect(screen.getByText("P → Q")).toBeInTheDocument()
  })

  it("updates all results when toggling a variable", async () => {
    const user = userEvent.setup()
    render(<LogicSandbox variables={["P", "Q"]} formulas={formulas} />)
    // Initially P=T, Q=T → all formulas true
    const results = screen.getAllByTestId("sandbox-result")
    expect(results[0]).toHaveTextContent("T") // P ∧ Q
    expect(results[1]).toHaveTextContent("T") // P ∨ Q
    expect(results[2]).toHaveTextContent("T") // P → Q

    // Toggle Q → P=T, Q=F
    await user.click(screen.getByRole("button", { name: /Q/ }))
    const updatedResults = screen.getAllByTestId("sandbox-result")
    expect(updatedResults[0]).toHaveTextContent("F") // P ∧ Q = F
    expect(updatedResults[1]).toHaveTextContent("T") // P ∨ Q = T
    expect(updatedResults[2]).toHaveTextContent("F") // P → Q = F
  })
})
