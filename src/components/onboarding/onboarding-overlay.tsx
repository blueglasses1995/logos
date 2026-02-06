"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, RotateCcw, ArrowRight } from "lucide-react"

interface OnboardingOverlayProps {
  readonly onComplete: () => void
}

const STEPS = [
  {
    icon: BookOpen,
    title: "Logosへようこそ",
    description:
      "論理学の基礎を体系的に学ぶインタラクティブ学習アプリです。全11章の学問・実践・哲学の3セクションで構成されています。",
  },
  {
    icon: ArrowRight,
    title: "3つのセクション",
    description:
      "各チャプターは「学問編」（理論と確認クイズ）、「実践編」（応用シナリオ）、「哲学コラム」（歴史的背景）で構成されています。",
  },
  {
    icon: RotateCcw,
    title: "間隔反復で定着",
    description:
      "クイズに回答すると自動的に復習キューに追加され、SM-2アルゴリズムで最適なタイミングで復習できます。",
  },
] as const

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0)

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 max-w-md w-full rounded-xl border border-border bg-card p-8 text-center space-y-6 shadow-lg">
        <Icon className="size-10 text-primary mx-auto" />
        <div>
          <h2 className="text-xl font-serif text-foreground">{current.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full transition-colors ${
                i === step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={isLast ? onComplete : () => setStep((s) => s + 1)}
          className="w-full"
        >
          {isLast ? "学習を始める" : "次へ"}
        </Button>
      </div>
    </div>
  )
}
