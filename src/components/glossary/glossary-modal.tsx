"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type GlossaryEntry } from "../../../content/glossary"
import Link from "next/link"

interface GlossaryModalProps {
  readonly entry: GlossaryEntry | null
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function GlossaryModal({ entry, open, onOpenChange }: GlossaryModalProps) {
  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry.term}
            {entry.reading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                （{entry.reading}）
              </span>
            )}
          </DialogTitle>
          <DialogDescription>{entry.description}</DialogDescription>
        </DialogHeader>
        {entry.relatedChapters.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              関連する章:
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.relatedChapters.map((ch) => (
                <Link key={`${ch.slug}-${ch.label}`} href={`/chapters/${ch.slug}`}>
                  <Button variant="outline" size="sm">
                    {ch.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
