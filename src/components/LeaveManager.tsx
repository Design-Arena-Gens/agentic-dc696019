'use client';

import { useMemo, useState } from "react";
import type { Employee, LeaveRequest, LeaveStatus, LeaveType } from "@/types";

type LeaveManagerProps = {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
  onCreateLeave: (
    request: Omit<LeaveRequest, "id" | "status" | "createdAt"> & {
      status?: LeaveStatus;
    },
  ) => void;
};

const leaveTypes: LeaveType[] = [
  "Vacation",
  "Sick",
  "Unpaid",
  "Remote",
  "Parental",
];

const statusBadge: Record<LeaveStatus, string> = {
  Approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Rejected:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function LeaveManager({
  employees,
  leaveRequests,
  onUpdateStatus,
  onCreateLeave,
}: LeaveManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | "الكل">(
    "الكل",
  );

  const decoratedRequests = useMemo(() => {
    return leaveRequests
      .map((request) => {
        const employee = employees.find(
          (candidate) => candidate.id === request.employeeId,
        );
        return {
          ...request,
          employeeName: employee?.name ?? "موظف غير معروف",
          department: employee?.department ?? "—",
          manager: employee?.manager ?? "—",
        };
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [employees, leaveRequests]);

  const filteredRequests = useMemo(() => {
    if (filterStatus === "الكل") return decoratedRequests;
    return decoratedRequests.filter((request) => request.status === filterStatus);
  }, [decoratedRequests, filterStatus]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            إدارة الإجازات
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            راجع ووافق على طلبات الإجازة في نفس اللحظة مع سجل كامل للإجراءات.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          تسجيل طلب إجازة
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3 text-xs">
          {(["الكل", "Pending", "Approved", "Rejected"] as const).map(
            (statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() =>
                  setFilterStatus(statusOption as LeaveStatus | "الكل")
                }
                className={`rounded-full border px-3 py-1.5 font-medium transition ${
                  filterStatus === statusOption
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-transparent bg-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {statusOption === "Pending"
                  ? "قيد الانتظار"
                  : statusOption === "Approved"
                    ? "تمت الموافقة"
                    : statusOption === "Rejected"
                      ? "مرفوض"
                      : "الكل"}
              </button>
            ),
          )}
        </div>
        <small className="text-xs text-zinc-500 dark:text-zinc-400">
          متوسط وقت الاستجابة الحالي:{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            12 ساعة
          </span>
        </small>
      </div>

      <div className="mt-6 space-y-3">
        {filteredRequests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300">
            لا توجد طلبات حسب الفلتر الحالي.
          </p>
        ) : (
          filteredRequests.map((request) => (
            <article
              key={request.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/60 md:flex-row md:items-center"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {request.employeeName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[request.status]}`}
                  >
                    {request.status === "Pending"
                      ? "قيد الانتظار"
                      : request.status === "Approved"
                        ? "معتمد"
                        : "مرفوض"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>القسم: {request.department}</span>
                  <span>المدير: {request.manager}</span>
                  <span>
                    من {request.startDate} إلى {request.endDate}
                  </span>
                  <span>نوع الإجازة: {request.type}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {request.notes}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateStatus(request.id, "Approved")}
                  className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400 dark:hover:text-zinc-900"
                >
                  اعتماد
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(request.id, "Rejected")}
                  className="rounded-full border border-rose-400 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:border-rose-400 dark:text-rose-300 dark:hover:bg-rose-400 dark:hover:text-zinc-900"
                >
                  رفض
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                تسجيل طلب إجازة جديد
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full px-2 py-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                ×
              </button>
            </div>
            <LeaveForm
              employees={employees}
              onSubmit={(payload) => {
                onCreateLeave(payload);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

type LeaveFormProps = {
  employees: Employee[];
  onSubmit: (
    request: Omit<LeaveRequest, "id" | "status" | "createdAt"> & {
      status?: LeaveStatus;
    },
  ) => void;
};

function LeaveForm({ employees, onSubmit }: LeaveFormProps) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id ?? "",
    type: leaveTypes[0],
    startDate: "",
    endDate: "",
    notes: "",
    status: "Pending" as LeaveStatus,
    approver: employees.find((emp) => emp.id === employees[0]?.id)?.manager ?? "",
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
        setForm((prev) => ({
          ...prev,
          startDate: "",
          endDate: "",
          notes: "",
        }));
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          الموظف
        </span>
        <select
          value={form.employeeId}
          onChange={(event) => {
            const selected = employees.find(
              (employee) => employee.id === event.target.value,
            );
            setForm((prev) => ({
              ...prev,
              employeeId: event.target.value,
              approver: selected?.manager ?? prev.approver,
            }));
          }}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} · {employee.department}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          نوع الإجازة
        </span>
        <select
          value={form.type}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              type: event.target.value as LeaveType,
            }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          {leaveTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            تاريخ البداية
          </span>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, startDate: event.target.value }))
            }
            required
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            تاريخ النهاية
          </span>
          <input
            type="date"
            value={form.endDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, endDate: event.target.value }))
            }
            required
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          ملاحظات
        </span>
        <textarea
        value={form.notes}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, notes: event.target.value }))
        }
        rows={3}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          الحالة
        </span>
        <select
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.value as LeaveStatus,
            }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          {(["Pending", "Approved", "Rejected"] as LeaveStatus[]).map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ),
          )}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          المعتمد
        </span>
        <input
          value={form.approver}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, approver: event.target.value }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="اسم المدير المعتمد"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:text-zinc-900"
      >
        حفظ الطلب
      </button>
    </form>
  );
}
