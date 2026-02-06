"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ProofBuilderQuiz as ProofBuilderQuizType } from "@/types/content"

function SortablePremise({
  id,
  label,
  rule,
  disabled,
  status,
}: {
  id: string
  label: string
  rule: string
  disabled: boolean
  status?: "correct" | "wrong"
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        px-4 py-3 rounded-md border-2 font-mono text-sm
        transition-colors duration-200 select-none
        ${disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
        ${
          status === "correct"
            ? "bg-emerald-100 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-400"
            : status === "wrong"
              ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-400"
              : "bg-background border-border hover:border-primary/50"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-xs text-muted-foreground ml-3">{rule}</span>
      </div>
    </div>
  )
}

interface Props {
  readonly quiz: ProofBuilderQuizType
  readonly onAnswer: (correct: boolean) => void
}

export function ProofBuilderQuiz({ quiz, onAnswer }: Props) {
  const [items, setItems] = useState(() =>
    quiz.availablePremises.map((p) => p.id)
  )
  const [submitted, setSubmitted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const isCorrect =
    items.length === quiz.correctOrder.length &&
    items.every((id, i) => id === quiz.correctOrder[i])

  const handleSubmit = () => {
    setSubmitted(true)
    onAnswer(isCorrect)
  }

  const premiseMap = new Map(
    quiz.availablePremises.map((p) => [p.id, p])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          以下の前提を正しい順序に並べ替えて、結論を導いてください
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((id, index) => {
                const premise = premiseMap.get(id)!
                const status = submitted
                  ? id === quiz.correctOrder[index]
                    ? "correct"
                    : "wrong"
                  : undefined
                return (
                  <SortablePremise
                    key={id}
                    id={id}
                    label={premise.label}
                    rule={premise.rule}
                    disabled={submitted}
                    status={status}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        <div className="border-t border-border pt-3">
          <div className="font-mono text-base font-bold text-foreground">
            ∴ {quiz.conclusion}
          </div>
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} aria-label="提出">
            提出
          </Button>
        )}

        {submitted && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${
              isCorrect
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="font-medium mb-1">
              {isCorrect ? "正解！" : "不正解"}
            </div>
            {quiz.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
