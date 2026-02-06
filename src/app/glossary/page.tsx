"use client"

import { useState, useMemo } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { GlossarySearch } from "@/components/glossary/glossary-search"
import { GlossaryList } from "@/components/glossary/glossary-list"
import { GLOSSARY } from "../../../content/glossary"

export default function GlossaryPage() {
  const [query, setQuery] = useState("")

  const sortedEntries = useMemo(
    () => [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "ja")),
    []
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return sortedEntries
    const q = query.trim().toLowerCase()
    return sortedEntries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.reading?.toLowerCase().includes(q)
    )
  }, [query, sortedEntries])

  return (
    <>
      <SiteHeader />
      <PageShell variant="quiz">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "用語集" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-serif">用語集</h1>
          <p className="text-muted-foreground mt-2">
            論理学の主要な用語と概念 ({sortedEntries.length}件)
          </p>
        </div>

        <div className="space-y-6">
          <GlossarySearch value={query} onChange={setQuery} />
          <GlossaryList entries={filtered} />
        </div>
      </PageShell>
    </>
  )
}
