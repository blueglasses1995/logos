"use client"

import { useState, useCallback, useEffect } from "react"
import {
  type StudyNote,
  getNotesForChapter,
  createNote,
  updateNote,
  deleteNote,
} from "@/lib/notes"

// --- Types ---

interface StudyNotesProps {
  readonly chapterSlug: string
  readonly section?: StudyNote["section"]
  readonly caption?: string
}

const SECTION_LABELS: Readonly<Record<StudyNote["section"], string>> = {
  theory: "理論",
  practice: "演習",
  philosophy: "哲学",
}

// --- Helpers ---

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

// --- Component ---

export function StudyNotes({
  chapterSlug,
  section = "theory",
  caption,
}: StudyNotesProps) {
  const [notes, setNotes] = useState<readonly StudyNote[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [activeSection, setActiveSection] =
    useState<StudyNote["section"]>(section)

  // Load notes on mount and when chapter changes
  useEffect(() => {
    setNotes(getNotesForChapter(chapterSlug))
  }, [chapterSlug])

  const filteredNotes = notes.filter((n) => n.section === activeSection)

  const handleCreate = useCallback(() => {
    if (draft.trim() === "") return
    const created = createNote(chapterSlug, activeSection, draft.trim())
    if (created) {
      setNotes(getNotesForChapter(chapterSlug))
      setDraft("")
      setIsAdding(false)
    }
  }, [chapterSlug, activeSection, draft])

  const handleUpdate = useCallback(
    (id: string) => {
      if (draft.trim() === "") return
      const updated = updateNote(id, draft.trim())
      if (updated) {
        setNotes(getNotesForChapter(chapterSlug))
        setDraft("")
        setEditingId(null)
      }
    },
    [chapterSlug, draft]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteNote(id)
      setNotes(getNotesForChapter(chapterSlug))
      if (editingId === id) {
        setEditingId(null)
        setDraft("")
      }
    },
    [chapterSlug, editingId]
  )

  const handleStartEdit = useCallback((note: StudyNote) => {
    setEditingId(note.id)
    setDraft(note.content)
    setIsAdding(false)
  }, [])

  const handleStartAdd = useCallback(() => {
    setIsAdding(true)
    setEditingId(null)
    setDraft("")
  }, [])

  const handleCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
    setDraft("")
  }, [])

  return (
    <figure className="not-prose my-6">
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header / Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              学習ノート
            </span>
            {notes.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {notes.length}
              </span>
            )}
          </div>
          <span
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* Collapsible body */}
        {isOpen && (
          <div className="px-6 py-4 space-y-4">
            {/* Section tabs */}
            <div className="flex gap-2">
              {(
                Object.entries(SECTION_LABELS) as [
                  StudyNote["section"],
                  string,
                ][]
              ).map(([key, label]) => {
                const count = notes.filter((n) => n.section === key).length
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveSection(key)
                      handleCancel()
                    }}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        activeSection === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {label}
                    {count > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({count})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Notes list */}
            {filteredNotes.length === 0 && !isAdding && (
              <div className="text-sm text-muted-foreground py-4 text-center">
                このセクションにはまだノートがありません
              </div>
            )}

            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="border border-border rounded-md bg-background/50"
                >
                  {editingId === note.id ? (
                    /* Edit mode */
                    <div className="p-3 space-y-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-md text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(note.id)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground transition-all duration-200 hover:opacity-90"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Read mode */
                    <div className="p-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.updatedAt)}
                          {note.updatedAt !== note.createdAt && " (編集済み)"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(note)}
                            className="text-xs text-primary hover:underline"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(note.id)}
                            className="text-xs text-falsehood hover:underline"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new note */}
            {isAdding ? (
              <div className="space-y-2 pt-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="学んだことや気づきをメモしましょう..."
                  autoFocus
                  className="w-full px-3 py-2 rounded-md text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:opacity-90"
                  >
                    ノートを追加
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartAdd}
                className="w-full py-2.5 rounded-md text-sm font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200"
              >
                + ノートを追加
              </button>
            )}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
