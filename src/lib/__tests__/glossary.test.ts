import { describe, it, expect } from "vitest"
import { GLOSSARY, getGlossaryEntry, getMatchableTerms } from "../../../content/glossary"

describe("glossary", () => {
  it("exports a non-empty array of glossary entries", () => {
    expect(GLOSSARY.length).toBeGreaterThan(0)
  })

  it("each entry has required fields", () => {
    for (const entry of GLOSSARY) {
      expect(entry.term).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(Array.isArray(entry.relatedChapters)).toBe(true)
    }
  })

  it("getGlossaryEntry finds entry by term", () => {
    const entry = getGlossaryEntry("述語論理")
    expect(entry).toBeDefined()
    expect(entry?.term).toBe("述語論理")
  })

  it("getGlossaryEntry returns undefined for unknown term", () => {
    expect(getGlossaryEntry("存在しない用語")).toBeUndefined()
  })

  it("getMatchableTerms returns terms sorted by length descending", () => {
    const terms = getMatchableTerms()
    for (let i = 1; i < terms.length; i++) {
      expect(terms[i - 1].length).toBeGreaterThanOrEqual(terms[i].length)
    }
  })

  it("has no duplicate terms", () => {
    const terms = GLOSSARY.map((e) => e.term)
    expect(new Set(terms).size).toBe(terms.length)
  })
})
