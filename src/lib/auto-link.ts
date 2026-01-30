interface TextSegment {
  readonly type: "text" | "term"
  readonly value: string
}

/**
 * Split text into segments, identifying glossary terms.
 * Terms are matched longest-first. Each term is only matched once per call.
 * Pass alreadyLinked to skip terms that were already linked in a prior paragraph.
 */
export function splitTextByTerms(
  text: string,
  sortedTerms: readonly string[],
  alreadyLinked: ReadonlySet<string> = new Set()
): readonly TextSegment[] {
  if (text.length === 0) return []

  const linkedInThisCall = new Set<string>(alreadyLinked)
  const segments: TextSegment[] = []
  let remaining = text

  while (remaining.length > 0) {
    let earliestIndex = Infinity
    let matchedTerm: string | undefined

    for (const term of sortedTerms) {
      if (linkedInThisCall.has(term)) continue
      const idx = remaining.indexOf(term)
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx
        matchedTerm = term
      }
    }

    if (matchedTerm === undefined || earliestIndex === Infinity) {
      segments.push({ type: "text", value: remaining })
      break
    }

    if (earliestIndex > 0) {
      segments.push({ type: "text", value: remaining.slice(0, earliestIndex) })
    }

    segments.push({ type: "term", value: matchedTerm })
    linkedInThisCall.add(matchedTerm)
    remaining = remaining.slice(earliestIndex + matchedTerm.length)
  }

  return segments
}
