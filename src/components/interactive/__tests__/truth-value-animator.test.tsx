import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TruthValueAnimator } from "../truth-value-animator"

describe("TruthValueAnimator", () => {
  it("renders variable toggle buttons", () => {
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    expect(screen.getByRole("button", { name: /P/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Q/ })).toBeInTheDocument()
  })

  it("shows initial values as True", () => {
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    expect(screen.getByTestId("result-value")).toHaveTextContent("T")
  })

  it("updates result when toggling a variable", async () => {
    const user = userEvent.setup()
    render(
      <TruthValueAnimator
        variables={["P", "Q"]}
        formula="P ∧ Q"
        evaluate={(vals) => vals.P && vals.Q}
      />
    )
    // Toggle P to false → P ∧ Q becomes false
    await user.click(screen.getByRole("button", { name: /P/ }))
    expect(screen.getByTestId("result-value")).toHaveTextContent("F")
  })

  it("displays the formula", () => {
    render(
      <TruthValueAnimator
        variables={["P"]}
        formula="¬P"
        evaluate={(vals) => !vals.P}
      />
    )
    expect(screen.getByText("¬P")).toBeInTheDocument()
  })
})
