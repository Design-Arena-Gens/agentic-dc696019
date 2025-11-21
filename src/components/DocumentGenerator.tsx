'use client';

import { useMemo, useState } from "react";
import type { DocumentTemplate } from "@/types";

type DocumentGeneratorProps = {
  templates: DocumentTemplate[];
};

export function DocumentGenerator({ templates }: DocumentGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!selectedTemplate) return "";
    let text = selectedTemplate.body.trim();
    selectedTemplate.fields.forEach((field) => {
      const value = values[field.id] ?? `{${field.label}}`;
      text = text.replaceAll(`{{${field.id}}}`, value || "");
    });
    return text;
  }, [selectedTemplate, values]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            توليد المستندات الذكية
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            اختر نموذجًا، أدخل البيانات الأساسية، واحصل على مستند جاهز للنسخ أو الإرسال.
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          متوافق مع الخطابات العربية
        </span>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-3">
          {templates.map((template) => {
            const active = selectedTemplate.id === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(template);
                  setValues({});
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-right transition ${
                  active
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-sm dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-200"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }`}
              >
                <div className="text-sm font-semibold">{template.name}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {template.description}
                </div>
              </button>
            );
          })}
        </aside>

        <div className="space-y-4">
          <form className="grid gap-4 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/40 md:grid-cols-2">
            {selectedTemplate.fields.map((field) => (
              <label key={field.id} className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-600 dark:text-zinc-300">
                  {field.label}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={values[field.id] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : field.type ?? "text"}
                    value={values[field.id] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                  />
                )}
              </label>
            ))}
          </form>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-inner dark:border-zinc-700 dark:bg-zinc-950/70">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                المعاينة الفورية
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {copied ? "تم النسخ ✨" : "نسخ المحتوى"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
              {output || "ابدأ بتعبئة الحقول لعرض النص النهائي."}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

