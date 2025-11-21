'use client';

import { useMemo, useState } from "react";
import type {
  Workflow,
  WorkflowAction,
  WorkflowTrigger,
} from "@/types";

type WorkflowBuilderProps = {
  workflows: Workflow[];
  onAddWorkflow: (workflow: Omit<Workflow, "id" | "lastRunAt">) => void;
};

const triggers: WorkflowTrigger[] = [
  "New hire created",
  "Leave request submitted",
  "Probation period ending",
  "Contract expiring",
  "Policy acknowledgement overdue",
];

const actions: WorkflowAction[] = [
  "Send email to employee",
  "Create IT ticket",
  "Notify manager",
  "Generate document",
  "Schedule meeting",
  "Assign checklist",
];

export function WorkflowBuilder({
  workflows,
  onAddWorkflow,
}: WorkflowBuilderProps) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredWorkflows = useMemo(() => {
    if (!search) return workflows;
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, workflows]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            أتمتة العمليات
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            صمم مسارات ذكية تربط بين الإجراءات المتكررة لتقليل العمل اليدوي.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
          onClick={() => setShowForm(true)}
        >
          إنشاء أتمتة
        </button>
      </header>

      <div className="mt-6 flex items-center justify-between gap-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="ابحث في الأتمتة حسب الاسم أو الوصف"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filteredWorkflows.map((workflow) => (
          <article
            key={workflow.id}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/60"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {workflow.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {workflow.description}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="font-medium text-zinc-500 dark:text-zinc-400">
                  Trigger
                </div>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {workflow.trigger}
                </p>
                <div className="mt-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Actions
                </div>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {workflow.actions.map((action) => (
                    <li
                      key={action}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <footer className="flex items-center justify-between text-xs text-zinc-500">
              <span>آخر تشغيل: {workflow.lastRunAt}</span>
              <span>مالك المسار: {workflow.owner}</span>
            </footer>
          </article>
        ))}
      </div>

      {showForm ? (
        <WorkflowForm
          onClose={() => setShowForm(false)}
          onSubmit={(payload) => {
            onAddWorkflow(payload);
            setShowForm(false);
          }}
        />
      ) : null}
    </section>
  );
}

type WorkflowFormProps = {
  onClose: () => void;
  onSubmit: (workflow: Omit<Workflow, "id" | "lastRunAt">) => void;
};

function WorkflowForm({ onClose, onSubmit }: WorkflowFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    trigger: triggers[0],
    actions: [] as WorkflowAction[],
    owner: "",
  });

  const toggleAction = (action: WorkflowAction) => {
    setForm((prev) => {
      const exists = prev.actions.includes(action);
      return {
        ...prev,
        actions: exists
          ? prev.actions.filter((item) => item !== action)
          : [...prev.actions, action],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            إنشاء سير عمل آلي
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
              name: "",
              description: "",
              trigger: triggers[0],
              actions: [],
              owner: "",
            });
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              اسم المسار
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              الوصف
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              المشغل (Trigger)
            </span>
            <select
              value={form.trigger}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  trigger: event.target.value as WorkflowTrigger,
                }))
              }
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            >
              {triggers.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {trigger}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              الإجراءات
            </span>
            <div className="grid gap-2 md:grid-cols-2">
              {actions.map((action) => {
                const active = form.actions.includes(action);
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(action)}
                    className={`rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition ${
                      active
                        ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:border-violet-400 dark:text-violet-200"
                        : "border-dashed border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    {action}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              المالك
            </span>
            <input
              value={form.owner}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, owner: event.target.value }))
              }
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
          >
            حفظ الأتمتة
          </button>
        </form>
      </div>
    </div>
  );
}

