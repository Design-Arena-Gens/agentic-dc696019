'use client';

import { useMemo } from "react";
import type { ChecklistItem, Employee, LeaveRequest } from "@/types";

type DashboardMetricsProps = {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  checklist: ChecklistItem[];
};

const statusColors: Record<string, string> = {
  Active: "from-emerald-500/15 via-emerald-500/10 to-emerald-500/0",
  Onboarding: "from-sky-500/15 via-sky-500/10 to-sky-500/0",
  Leave: "from-amber-500/15 via-amber-500/10 to-amber-500/0",
  Offboarding: "from-rose-500/15 via-rose-500/10 to-rose-500/0",
};

export function DashboardMetrics({
  employees,
  leaveRequests,
  checklist,
}: DashboardMetricsProps) {
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (employee) => employee.status === "Active",
    ).length;
    const onboarding = employees.filter(
      (employee) => employee.status === "Onboarding",
    ).length;
    const averageScore =
      employees.reduce((acc, curr) => acc + curr.lastReviewScore, 0) /
      Math.max(activeEmployees, 1);
    const pendingChecklists = checklist.filter(
      (task) => task.status !== "Completed",
    ).length;
    const pendingLeave = leaveRequests.filter(
      (leave) => leave.status === "Pending",
    ).length;

    return [
      {
        title: "إجمالي الموظفين",
        value: totalEmployees,
        subtitle: `${activeEmployees} موظف نشط حاليًا`,
        accent: "from-blue-500/15 via-blue-500/10 to-blue-500/0",
      },
      {
        title: "المنضمون الجدد",
        value: onboarding,
        subtitle: "الموظفون المتوقع انضمامهم خلال الأسبوعين القادمين",
        accent: "from-sky-500/15 via-sky-500/10 to-sky-500/0",
      },
      {
        title: "متوسط التقييم",
        value: averageScore ? averageScore.toFixed(1) : "—",
        subtitle: "آخر تقييم أداء للفرق المرتبطة بك",
        accent: "from-violet-500/15 via-violet-500/10 to-violet-500/0",
      },
      {
        title: "طلبات بحاجة إلى إجراء",
        value: pendingLeave + pendingChecklists,
        subtitle: `${pendingLeave} إجازة · ${pendingChecklists} مهام`,
        accent: "from-amber-500/15 via-amber-500/10 to-amber-500/0",
      },
    ];
  }, [employees, leaveRequests, checklist]);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={metric.title}
          className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.accent}`}
          />
          <div className="relative space-y-3">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {metric.title}
            </span>
            <div className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
              {metric.value}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {metric.subtitle}
            </p>
          </div>
        </article>
      ))}
      <article className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/0"
        />
        <div className="relative space-y-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            توزيع الحالة
          </span>
          <div className="space-y-2">
            {["Active", "Onboarding", "Leave", "Offboarding"].map((status) => {
              const count = employees.filter(
                (employee) => employee.status === status,
              ).length;
              const percent = Math.round(
                (count / Math.max(employees.length, 1)) * 100,
              );
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <span>{status}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${statusColors[status] ?? "from-emerald-500/50 via-emerald-500/40 to-emerald-500/30"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </section>
  );
}

