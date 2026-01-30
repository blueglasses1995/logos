"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactNode,
  type ReactElement,
} from "react"
import { getGlossaryEntry, getMatchableTerms } from "../../../content/glossary"
import { splitTextByTerms } from "@/lib/auto-link"
import { GlossaryModal } from "./glossary-modal"
import type { GlossaryEntry } from "../../../content/glossary"

const PARAGRAPH_TAGS = new Set(["p", "li", "blockquote", "td"])

export function AutoLinkedArticle({
  children,
}: {
  readonly children: ReactNode
}) {
  const [modalEntry, setModalEntry] = useState<GlossaryEntry | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const terms = getMatchableTerms()

  function handleTermClick(term: string) {
    const entry = getGlossaryEntry(term)
    if (entry) {
      setModalEntry(entry)
      setModalOpen(true)
    }
  }

  function processNode(node: ReactNode, linkedInScope: Set<string>): ReactNode {
    if (typeof node === "string") {
      return renderLinkedText(node, terms, linkedInScope, handleTermClick)
    }

    if (!isValidElement(node)) return node

    const element = node as ReactElement<{ children?: ReactNode }>
    const tag = typeof element.type === "string" ? element.type : null

    // For paragraph-level elements, reset per-paragraph tracking
    const scopeForChildren = tag && PARAGRAPH_TAGS.has(tag)
      ? new Set<string>()
      : linkedInScope

    const newChildren = Children.map(
      element.props.children,
      (child) => processNode(child, scopeForChildren)
    )

    return cloneElement(element, {}, newChildren)
  }

  const processed = Children.map(children, (child) =>
    processNode(child, new Set())
  )

  return (
    <>
      {processed}
      <GlossaryModal
        entry={modalEntry}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}

function renderLinkedText(
  text: string,
  terms: readonly string[],
  linkedInScope: Set<string>,
  onClick: (term: string) => void
): ReactNode {
  const segments = splitTextByTerms(text, terms, linkedInScope)

  // Track which terms were linked
  for (const seg of segments) {
    if (seg.type === "term") {
      linkedInScope.add(seg.value)
    }
  }

  if (segments.length === 1 && segments[0].type === "text") {
    return text
  }

  return segments.map((seg, i) =>
    seg.type === "term" ? (
      <button
        key={`${seg.value}-${i}`}
        type="button"
        className="glossary-term text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
        onClick={() => onClick(seg.value)}
      >
        {seg.value}
      </button>
    ) : (
      <span key={i}>{seg.value}</span>
    )
  )
}
