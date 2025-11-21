'use client';

import { useMemo, useState } from "react";
import type { ChecklistItem, ChecklistItemStatus } from "@/types";

type ChecklistBoardProps = {
  items: ChecklistItem[];
  onUpdateStatus: (id: string, status: ChecklistItemStatus) => void;
  onAddItem: (item: Omit<ChecklistItem, "id">) => void;
};

const statusPalette: Record<ChecklistItemStatus, string> = {
  "Not started":
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  "In progress":
    "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
  Completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Blocked:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
};

const categoryTitles: Record<ChecklistItem["category"], string> = {
  Onboarding: "الانضمام",
  Offboarding: "إنهاء الخدمة",
  Compliance: "الامتثال",
  Engagement: "التفاعل الوظيفي",
};

export function ChecklistBoard({
  items,
  onUpdateStatus,
  onAddItem,
}: ChecklistBoardProps) {
  const [showForm, setShowForm] = useState(false);

  const grouped = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.category].push(item);
        return acc;
      },
      {
        Onboarding: [] as ChecklistItem[],
        Offboarding: [] as ChecklistItem[],
        Compliance: [] as ChecklistItem[],
        Engagement: [] as ChecklistItem[],
      },
    );
  }, [items]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            قوائم العمل الذكية
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            وزّع المهام على الأقسام المختلفة وتابع التقدم لحظة بلحظة.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
          onClick={() => setShowForm(true)}
        >
          إضافة مهمة
        </button>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(
          Object.keys(grouped) as Array<keyof typeof grouped>
        ).map((category) => (
          <article
            key={category}
            className="flex h-full flex-col gap-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/50"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {categoryTitles[category]}
              </h3>
              <span className="text-xs text-zinc-400">
                {grouped[category].length}
              </span>
            </header>
            <div className="space-y-3">
              {grouped[category].length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-200 bg-white p-3 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
                  لا توجد مهام حالياً
                </p>
              ) : (
                grouped[category]
                  .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-transparent bg-white p-3 shadow-sm transition hover:border-zinc-200 hover:shadow-md dark:bg-zinc-950/60 dark:hover:border-zinc-700"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            المسؤول: {item.owner}
                          </p>
                        </div>
                        <select
                          value={item.status}
                          onChange={(event) =>
                            onUpdateStatus(
                              item.id,
                              event.target.value as ChecklistItemStatus,
                            )
                          }
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusPalette[item.status]}`}
                        >
                          {(
                            [
                              "Not started",
                              "In progress",
                              "Completed",
                              "Blocked",
                            ] as ChecklistItemStatus[]
                          ).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <footer className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>تاريخ الاستحقاق: {item.dueDate}</span>
                        <span>
                          {item.status === "Completed"
                            ? "✓ منجز"
                            : item.status === "Blocked"
                              ? "⚠ متعثر"
                              : "قيد المتابعة"}
                        </span>
                      </footer>
                    </div>
                  ))
              )}
            </div>
          </article>
        ))}
      </div>
      {showForm ? (
        <ChecklistForm
          onSubmit={(payload) => {
            onAddItem(payload);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      ) : null}
    </section>
  );
}

type ChecklistFormProps = {
  onSubmit: (item: Omit<ChecklistItem, "id">) => void;
  onClose: () => void;
};

function ChecklistForm({ onSubmit, onClose }: ChecklistFormProps) {
  const [form, setForm] = useState<Omit<ChecklistItem, "id">>({
    title: "",
    owner: "",
    dueDate: "",
    category: "Onboarding",
    status: "Not started",
  });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            إضافة مهمة جديدة
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            ×
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
            setForm({
              title: "",
              owner: "",
              dueDate: "",
              category: "Onboarding",
              status: "Not started",
            });
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              العنوان
            </span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              المسؤول
            </span>
            <input
              value={form.owner}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, owner: event.target.value }))
              }
              required
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                التاريخ المستهدف
              </span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                }
                required
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                التصنيف
              </span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value as ChecklistItem["category"],
                  }))
                }
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="Onboarding">الانضمام</option>
                <option value="Offboarding">إنهاء الخدمة</option>
                <option value="Compliance">الامتثال</option>
                <option value="Engagement">التفاعل الوظيفي</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              الحالة
            </span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as ChecklistItemStatus,
                }))
              }
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="Not started">لم يبدأ</option>
              <option value="In progress">قيد التنفيذ</option>
              <option value="Completed">منجز</option>
              <option value="Blocked">متعثر</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            حفظ المهمة
          </button>
        </form>
      </div>
    </div>
  );
}

