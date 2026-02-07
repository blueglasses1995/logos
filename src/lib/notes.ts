/**
 * CRUD operations for study notes stored in localStorage.
 */

export interface StudyNote {
  readonly id: string
  readonly chapterSlug: string
  readonly section: "theory" | "practice" | "philosophy"
  readonly content: string
  readonly createdAt: string
  readonly updatedAt: string
}

const STORAGE_KEY = "logos-notes"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadAllNotes(): readonly StudyNote[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StudyNote[]
  } catch {
    return []
  }
}

function saveAllNotes(notes: readonly StudyNote[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function getNotesForChapter(
  chapterSlug: string
): readonly StudyNote[] {
  return loadAllNotes().filter((n) => n.chapterSlug === chapterSlug)
}

export function getAllNotes(): readonly StudyNote[] {
  return loadAllNotes()
}

export function createNote(
  chapterSlug: string,
  section: StudyNote["section"],
  content: string
): StudyNote {
  const now = new Date().toISOString()
  const note: StudyNote = {
    id: generateId(),
    chapterSlug,
    section,
    content,
    createdAt: now,
    updatedAt: now,
  }
  const existing = loadAllNotes()
  saveAllNotes([...existing, note])
  return note
}

export function updateNote(
  id: string,
  content: string
): StudyNote | null {
  const notes = loadAllNotes()
  const index = notes.findIndex((n) => n.id === id)
  if (index === -1) return null

  const updated: StudyNote = {
    ...notes[index],
    content,
    updatedAt: new Date().toISOString(),
  }
  const next = notes.map((n, i) => (i === index ? updated : n))
  saveAllNotes(next)
  return updated
}

export function deleteNote(id: string): boolean {
  const notes = loadAllNotes()
  const filtered = notes.filter((n) => n.id !== id)
  if (filtered.length === notes.length) return false
  saveAllNotes(filtered)
  return true
}
