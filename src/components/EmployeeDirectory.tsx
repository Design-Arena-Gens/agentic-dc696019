'use client';

import { useMemo, useState } from "react";
import { EmploymentStatus, Employee } from "@/types";

type EmployeeDirectoryProps = {
  employees: Employee[];
  onAddEmployee: (
    employee: Omit<Employee, "id" | "lastReviewScore"> & {
      lastReviewScore?: number;
    },
  ) => void;
  onUpdateStatus: (id: string, status: EmploymentStatus) => void;
};

const statusOptions: EmploymentStatus[] = [
  "Active",
  "Onboarding",
  "Leave",
  "Offboarding",
];

export function EmployeeDirectory({
  employees,
  onAddEmployee,
  onUpdateStatus,
}: EmployeeDirectoryProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("الكل");
  const [status, setStatus] = useState<EmploymentStatus | "الكل">("الكل");
  const [showForm, setShowForm] = useState(false);

  const departments = useMemo(() => {
    const values = Array.from(
      new Set(employees.map((employee) => employee.department)),
    );
    return ["الكل", ...values];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        search.length === 0 ||
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.department.toLowerCase().includes(search.toLowerCase()) ||
        employee.role.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment =
        department === "الكل" || employee.department === department;
      const matchesStatus =
        status === "الكل" || employee.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [department, employees, search, status]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            دليل الموظفين
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            بحث شامل في الموظفين مع إمكانية تحديث الحالة في لحظة.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => setShowForm(true)}
        >
          إضافة موظف
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          className="flex-1 min-w-[220px] rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="ابحث بالاسم أو القسم أو المسمى الوظيفي"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="min-w-[180px] rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          {departments.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="min-w-[180px] rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as EmploymentStatus | "الكل")
          }
        >
          {["الكل", ...statusOptions].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <tr className="[&>th]:px-4 [&>th]:py-3">
              <th>الاسم</th>
              <th>القسم</th>
              <th>المسمى الوظيفي</th>
              <th>الحالة</th>
              <th>تاريخ البدء</th>
              <th>المدير</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                  <div className="flex flex-col">
                    <span>{employee.name}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {employee.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{employee.department}</td>
                <td className="px-4 py-3">{employee.role}</td>
                <td className="px-4 py-3">
                  <select
                    value={employee.status}
                    onChange={(event) =>
                      onUpdateStatus(
                        employee.id,
                        event.target.value as EmploymentStatus,
                      )
                    }
                    className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{employee.startDate}</td>
                <td className="px-4 py-3">{employee.manager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  إضافة موظف جديد
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  أدخل البيانات الأساسية للموظف وسيتم حفظها فورًا.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-transparent p-2 text-zinc-500 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                onClick={() => setShowForm(false)}
              >
                <span className="sr-only">إغلاق</span>
                ×
              </button>
            </div>
            <EmployeeForm
              onSubmit={(payload) => {
                onAddEmployee(payload);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

type EmployeeFormProps = {
  onSubmit: (
    employee: Omit<Employee, "id" | "lastReviewScore"> & {
      lastReviewScore?: number;
    },
  ) => void;
};

function EmployeeForm({ onSubmit }: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: "",
    department: "",
    role: "",
    status: "Onboarding" as EmploymentStatus,
    startDate: "",
    location: "",
    manager: "",
    email: "",
    phone: "",
    tags: "",
    lastReviewScore: "4.0",
  });

  return (
    <form
      className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name: form.name,
          department: form.department,
          role: form.role,
          status: form.status,
          startDate: form.startDate,
          location: form.location,
          manager: form.manager,
          email: form.email,
          phone: form.phone,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          lastReviewScore: Number.parseFloat(form.lastReviewScore),
        });
        setForm({
          name: "",
          department: "",
          role: "",
          status: "Onboarding",
          startDate: "",
          location: "",
          manager: "",
          email: "",
          phone: "",
          tags: "",
          lastReviewScore: "4.0",
        });
      }}
    >
      {(
        [
          ["name", "الاسم الكامل"],
          ["email", "البريد الإلكتروني"],
          ["department", "القسم"],
          ["role", "المسمى الوظيفي"],
          ["manager", "المدير المباشر"],
          ["location", "موقع العمل"],
          ["phone", "رقم التواصل"],
          ["startDate", "تاريخ البدء"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            {label}
          </span>
          <input
            required={key !== "phone"}
            type={key === "startDate" ? "date" : "text"}
            value={form[key]}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [key]: event.target.value }))
            }
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      ))}
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          الحالة
        </span>
        <select
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.value as EmploymentStatus,
            }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          الوسوم (افصل بينها بفاصلة)
        </span>
        <input
          value={form.tags}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, tags: event.target.value }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="مثال: عن بعد, بدوام جزئي"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          آخر تقييم أداء
        </span>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={form.lastReviewScore}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              lastReviewScore: event.target.value,
            }))
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-zinc-700 hover:via-zinc-700 hover:to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-white dark:text-zinc-900"
        >
          حفظ الموظف
        </button>
      </div>
    </form>
  );
}

