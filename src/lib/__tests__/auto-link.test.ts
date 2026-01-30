import { describe, it, expect } from "vitest"
import { splitTextByTerms } from "../auto-link"

describe("splitTextByTerms", () => {
  const terms = ["述語論理", "論理", "フレーゲ"]

  it("returns original text as single segment when no terms match", () => {
    const result = splitTextByTerms("関係のないテキスト", terms)
    expect(result).toEqual([{ type: "text", value: "関係のないテキスト" }])
  })

  it("splits text around a matching term", () => {
    const result = splitTextByTerms("フレーゲは偉大だ", terms)
    expect(result).toEqual([
      { type: "term", value: "フレーゲ" },
      { type: "text", value: "は偉大だ" },
    ])
  })

  it("matches longer terms first (述語論理 before 論理)", () => {
    const result = splitTextByTerms("述語論理を学ぶ", terms)
    expect(result).toEqual([
      { type: "term", value: "述語論理" },
      { type: "text", value: "を学ぶ" },
    ])
  })

  it("marks only the first occurrence per term in a single call", () => {
    const result = splitTextByTerms(
      "フレーゲはフレーゲの著作を書いた",
      terms
    )
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(1)
    expect(termSegments[0].value).toBe("フレーゲ")
  })

  it("handles multiple different terms in one text", () => {
    const result = splitTextByTerms(
      "フレーゲは述語論理を作った",
      terms
    )
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(2)
    expect(termSegments.map((s) => s.value)).toContain("フレーゲ")
    expect(termSegments.map((s) => s.value)).toContain("述語論理")
  })

  it("handles empty text", () => {
    const result = splitTextByTerms("", terms)
    expect(result).toEqual([])
  })

  it("handles text that is exactly a term", () => {
    const result = splitTextByTerms("フレーゲ", terms)
    expect(result).toEqual([{ type: "term", value: "フレーゲ" }])
  })

  it("respects alreadyLinked set to skip terms", () => {
    const alreadyLinked = new Set(["フレーゲ"])
    const result = splitTextByTerms("フレーゲは述語論理を作った", terms, alreadyLinked)
    const termSegments = result.filter((s) => s.type === "term")
    expect(termSegments).toHaveLength(1)
    expect(termSegments[0].value).toBe("述語論理")
  })
})
