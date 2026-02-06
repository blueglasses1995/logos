"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { PageShell } from "@/components/layout/page-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ActivityHeatmap } from "@/components/stats/activity-heatmap"
import { StatsSummary } from "@/components/stats/stats-summary"
import { AchievementList } from "@/components/stats/achievement-list"
import { useProgress } from "@/hooks/use-progress"

export default function StatsPage() {
  const { progress } = useProgress()

  return (
    <>
      <SiteHeader />
      <PageShell variant="dashboard">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "統計" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-serif">学習統計</h1>
          <p className="text-muted-foreground mt-2">
            あなたの学習の軌跡
          </p>
        </div>

        <div className="space-y-10">
          <StatsSummary progress={progress} />
          <ActivityHeatmap logs={progress.dailyLogs} />
          <AchievementList achievements={progress.achievements} />
        </div>
      </PageShell>
    </>
  )
}
