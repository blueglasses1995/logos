import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { KeyPoint } from "../key-point"

describe("KeyPoint", () => {
  it("renders key point content", () => {
    render(<KeyPoint>∀は例外なくすべてを要求する。</KeyPoint>)
    expect(screen.getByText("∀は例外なくすべてを要求する。")).toBeInTheDocument()
  })
})
