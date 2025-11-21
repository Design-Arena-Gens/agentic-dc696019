"use client";

import { useMemo, useState } from "react";
import {
  checklistSeed,
  documentTemplates,
  employeesSeed,
  leaveRequestsSeed,
  workflowsSeed,
} from "@/data";
import {
  ChecklistItem,
  ChecklistItemStatus,
  Employee,
  EmploymentStatus,
  LeaveRequest,
  LeaveStatus,
  Workflow,
} from "@/types";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { EmployeeDirectory } from "@/components/EmployeeDirectory";
import { LeaveManager } from "@/components/LeaveManager";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { ChecklistBoard } from "@/components/ChecklistBoard";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { ActivityTimeline } from "@/components/ActivityTimeline";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>(employeesSeed);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(leaveRequestsSeed);
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowsSeed);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistSeed);

  const addEmployee = (
    employee: Omit<Employee, "id" | "lastReviewScore"> & {
      lastReviewScore?: number;
    },
  ) => {
    setEmployees((prev) => [
      {
        ...employee,
        id: createId(),
        lastReviewScore: employee.lastReviewScore ?? 4.2,
      },
      ...prev,
    ]);
  };

  const updateEmployeeStatus = (id: string, status: EmploymentStatus) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, status } : employee,
      ),
    );
  };

  const addLeaveRequest = (
    request: Omit<LeaveRequest, "id" | "status" | "createdAt"> & {
      status?: LeaveStatus;
    },
  ) => {
    const now = new Date().toISOString().split("T")[0];
    setLeaveRequests((prev) => [
      {
        ...request,
        id: createId(),
        status: request.status ?? "Pending",
        createdAt: now,
      },
      ...prev,
    ]);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
    setLeaveRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    );
  };

  const addWorkflow = (workflow: Omit<Workflow, "id" | "lastRunAt">) => {
    const today = new Date().toISOString().split("T")[0];
    setWorkflows((prev) => [
      {
        ...workflow,
        id: createId(),
        lastRunAt: today,
      },
      ...prev,
    ]);
  };

  const updateChecklistStatus = (id: string, status: ChecklistItemStatus) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const addChecklistItem = (item: Omit<ChecklistItem, "id">) => {
    setChecklist((prev) => [
      {
        ...item,
        id: createId(),
      },
      ...prev,
    ]);
  };

  const focusAreas = useMemo(() => {
    const blocked = checklist.filter((item) => item.status === "Blocked");
    const pendingLeaves = leaveRequests.filter(
      (request) => request.status === "Pending",
    );
    const onboardingSoon = employees.filter(
      (employee) => employee.status === "Onboarding",
    );

    return [
      {
        title: "قرارات عاجلة",
        description:
          "طلبات إجازة تنتظر اعتمادك النهائي قبل نهاية اليوم.",
        count: pendingLeaves.length,
        accent: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
      },
      {
        title: "انضمامات قريبة",
        description:
          "تأكد من جاهزية أجهزة وبيانات الزملاء قبل تاريخ البدء.",
        count: onboardingSoon.length,
        accent:
          "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200",
      },
      {
        title: "مهام تحتاج متابعة",
        description:
          "بعض المهام متعثرة وتحتاج إلى إعادة جدولة أو مساعدة.",
        count: blocked.length,
        accent:
          "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
      },
    ];
  }, [checklist, employees, leaveRequests]);

  return (
    <main className="min-h-screen bg-zinc-50 pb-16 text-right text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-200/60 via-transparent to-transparent blur-3xl dark:from-violet-500/10"
        />
        <header className="relative flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white/95 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              لوحة تحكم الموارد البشرية
            </span>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
              أتمتة مكتب الموارد البشرية
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
              منصة عملية لإدارة الموظفين، متابعة الإجازات، بناء الأتمتة الذكية،
              وتوليد المستندات باللغة العربية — كل ذلك في شاشة واحدة.
            </p>
          </div>
          <div className="grid max-w-xs gap-3 text-sm">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-zinc-100 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {area.title}
                  </span>
                  <span
                    className={`inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2 text-sm font-semibold ${area.accent}`}
                  >
                    {area.count}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </header>

        <DashboardMetrics
          employees={employees}
          leaveRequests={leaveRequests}
          checklist={checklist}
        />

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <EmployeeDirectory
              employees={employees}
              onAddEmployee={addEmployee}
              onUpdateStatus={updateEmployeeStatus}
            />
            <LeaveManager
              employees={employees}
              leaveRequests={leaveRequests}
              onCreateLeave={addLeaveRequest}
              onUpdateStatus={updateLeaveStatus}
            />
            <ChecklistBoard
              items={checklist}
              onAddItem={addChecklistItem}
              onUpdateStatus={updateChecklistStatus}
            />
            <WorkflowBuilder workflows={workflows} onAddWorkflow={addWorkflow} />
          </div>
          <div className="space-y-6">
            <ActivityTimeline
              employees={employees}
              leaveRequests={leaveRequests}
              checklist={checklist}
              workflows={workflows}
            />
            <DocumentGenerator templates={documentTemplates} />
          </div>
        </div>
      </div>
    </main>
  );
}
