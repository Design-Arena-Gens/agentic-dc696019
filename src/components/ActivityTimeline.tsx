'use client';

import { useMemo } from "react";
import type {
  ChecklistItem,
  Employee,
  LeaveRequest,
  Workflow,
} from "@/types";

type ActivityTimelineProps = {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  checklist: ChecklistItem[];
  workflows: Workflow[];
};

type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  badge: string;
  tone: "info" | "success" | "warning" | "neutral";
};

const toneStyles: Record<TimelineEntry["tone"], string> = {
  info: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-200",
  success:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-200",
  warning:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-200",
  neutral:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-200",
};

export function ActivityTimeline({
  employees,
  leaveRequests,
  checklist,
  workflows,
}: ActivityTimelineProps) {
  const entries = useMemo<TimelineEntry[]>(() => {
    const items: TimelineEntry[] = [];

    employees
      .filter((employee) => employee.status === "Onboarding")
      .forEach((employee) => {
        items.push({
          id: `employee-${employee.id}`,
          date: employee.startDate,
          title: `إنضمام ${employee.name}`,
          description: `سيبدأ ${employee.role} في ${employee.department} تحت إشراف ${employee.manager}.`,
          badge: "موظف جديد",
          tone: "info",
        });
      });

    leaveRequests
      .filter((leave) => leave.status === "Pending")
      .forEach((leave) => {
        const employee = employees.find(
          (candidate) => candidate.id === leave.employeeId,
        );
        items.push({
          id: `leave-${leave.id}`,
          date: leave.startDate,
          title: `طلب إجازة: ${employee?.name ?? leave.employeeId}`,
          description: `${leave.type} من ${leave.startDate} حتى ${leave.endDate}.`,
          badge: "قرار مطلوب",
          tone: "warning",
        });
      });

    checklist
      .filter((item) => item.status !== "Completed")
      .forEach((item) => {
        items.push({
          id: `check-${item.id}`,
          date: item.dueDate,
          title: item.title,
          description: `المسؤول: ${item.owner} · التصنيف: ${item.category}`,
          badge:
            item.status === "Blocked"
              ? "متابعة عاجلة"
              : item.status === "In progress"
                ? "قيد التنفيذ"
                : "لم يبدأ",
          tone: item.status === "Blocked" ? "warning" : "neutral",
        });
      });

    workflows
      .filter((workflow) => workflow.lastRunAt)
      .forEach((workflow) => {
        items.push({
          id: `wf-${workflow.id}`,
          date: workflow.lastRunAt,
          title: workflow.name,
          description: `آخر تنفيذ بواسطة ${workflow.owner}. عدد الإجراءات: ${workflow.actions.length}`,
          badge: "أتمتة",
          tone: "success",
        });
      });

    return items.sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 8);
  }, [checklist, employees, leaveRequests, workflows]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        لوحة المتابعة السريعة
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        نظرة مختصرة على أهم المستجدات خلال الأسبوع الحالي.
      </p>
      <div className="mt-6 space-y-4">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="flex items-start gap-4 rounded-2xl border border-transparent bg-zinc-50/70 p-4 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm dark:bg-zinc-900/40 dark:hover:border-zinc-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {entry.date}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {entry.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneStyles[entry.tone]}`}
                >
                  {entry.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {entry.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

