import {
  ChecklistItem,
  DocumentTemplate,
  Employee,
  LeaveRequest,
  Workflow,
} from "@/types";

const today = new Date();

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const employeesSeed: Employee[] = [
  {
    id: "emp-001",
    name: "Lina Al-Mutairi",
    department: "Talent Acquisition",
    role: "Senior Recruiter",
    status: "Active",
    startDate: "2021-03-15",
    location: "Riyadh",
    manager: "Faisal Al-Harbi",
    email: "lina.mutairi@example.com",
    phone: "+966-50-123-4567",
    tags: ["Arabic/English", "Recruitment"],
    lastReviewScore: 4.7,
  },
  {
    id: "emp-002",
    name: "Sara Al-Qahtani",
    department: "People Operations",
    role: "HRBP",
    status: "Onboarding",
    startDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    ),
    location: "Jeddah",
    manager: "Lina Al-Mutairi",
    email: "sara.qahtani@example.com",
    phone: "+966-50-222-7890",
    tags: ["Onboarding"],
    lastReviewScore: 0,
  },
  {
    id: "emp-003",
    name: "Omar Al-Shehri",
    department: "Learning & Development",
    role: "Training Specialist",
    status: "Active",
    startDate: "2020-11-02",
    location: "Remote",
    manager: "Faisal Al-Harbi",
    email: "omar.shehri@example.com",
    phone: "+966-55-333-9090",
    tags: ["Remote", "Trainer"],
    lastReviewScore: 4.4,
  },
  {
    id: "emp-004",
    name: "Huda Al-Khalifa",
    department: "Compensation & Benefits",
    role: "Benefits Analyst",
    status: "Leave",
    startDate: "2019-07-08",
    location: "Dammam",
    manager: "Faisal Al-Harbi",
    email: "huda.khalifa@example.com",
    phone: "+966-56-111-4455",
    tags: ["Hybrid"],
    lastReviewScore: 4.2,
  },
  {
    id: "emp-005",
    name: "Nawaf Al-Zahrani",
    department: "Employee Relations",
    role: "Case Manager",
    status: "Active",
    startDate: "2022-05-20",
    location: "Riyadh",
    manager: "Amal Al-Otaibi",
    email: "nawaf.zahrani@example.com",
    phone: "+966-56-567-2222",
    tags: ["Employee Relations"],
    lastReviewScore: 4.5,
  },
];

export const leaveRequestsSeed: LeaveRequest[] = [
  {
    id: "leave-001",
    employeeId: "emp-004",
    type: "Parental",
    startDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12),
    ),
    endDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18),
    ),
    notes: "Maternity leave - medical documentation attached.",
    status: "Approved",
    approver: "Faisal Al-Harbi",
    createdAt: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25),
    ),
  },
  {
    id: "leave-002",
    employeeId: "emp-001",
    type: "Vacation",
    startDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
    ),
    endDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 22),
    ),
    notes: "Family travel to Abha.",
    status: "Pending",
    approver: "Faisal Al-Harbi",
    createdAt: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    ),
  },
  {
    id: "leave-003",
    employeeId: "emp-005",
    type: "Sick",
    startDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    ),
    endDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    ),
    notes: "Doctor note attached.",
    status: "Pending",
    approver: "Amal Al-Otaibi",
    createdAt: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    ),
  },
];

export const workflowsSeed: Workflow[] = [
  {
    id: "wf-001",
    name: "مسار توظيف جديد",
    description:
      "يرسل بريدًا إلكترونيًا للموظف الجديد، ويُنشئ طلبات تقنية المعلومات، ويعين قائمة المهام للمشرف.",
    trigger: "New hire created",
    actions: [
      "Send email to employee",
      "Create IT ticket",
      "Assign checklist",
      "Notify manager",
    ],
    owner: "Lina Al-Mutairi",
    lastRunAt: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    ),
  },
  {
    id: "wf-002",
    name: "تنبيه انتهاء فترة التجربة",
    description:
      "يرسل تذكيرًا للمدير لتقييم الموظف قبل انتهاء فترة التجربة بسبعة أيام.",
    trigger: "Probation period ending",
    actions: ["Notify manager", "Schedule meeting"],
    owner: "Amal Al-Otaibi",
    lastRunAt: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9),
    ),
  },
];

export const checklistSeed: ChecklistItem[] = [
  {
    id: "check-001",
    title: "إنشاء حسابات الوصول",
    owner: "IT Service Desk",
    dueDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    ),
    category: "Onboarding",
    status: "In progress",
  },
  {
    id: "check-002",
    title: "توقيع سياسة العمل عن بعد",
    owner: "People Operations",
    dueDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    ),
    category: "Compliance",
    status: "Not started",
  },
  {
    id: "check-003",
    title: "مقابلة التعريف بالقيم",
    owner: "Culture Team",
    dueDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    ),
    category: "Engagement",
    status: "Completed",
  },
  {
    id: "check-004",
    title: "تسليم معدات نهاية الخدمة",
    owner: "Facilities",
    dueDate: formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    ),
    category: "Offboarding",
    status: "In progress",
  },
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "offer-letter",
    name: "خطاب عرض وظيفي",
    description:
      "إنشاء خطاب عرض وظيفي رسمي يتضمن تفاصيل الراتب والمزايا وتاريخ البدء.",
    fields: [
      { id: "candidateName", label: "اسم المرشح" },
      { id: "position", label: "المسمى الوظيفي" },
      { id: "startDate", label: "تاريخ البدء", type: "date" },
      { id: "manager", label: "اسم المدير المباشر" },
      { id: "salary", label: "الراتب الشهري", type: "number" },
    ],
    body: `
السيد/ة {{candidateName}},

يسعدنا تقديم عرض عمل لك للانضمام إلى فريقنا بمنصب {{position}} تحت إشراف {{manager}}.
سيكون تاريخ بدء العمل المتوقع في {{startDate}}، مع راتب شهري مقداره {{salary}} ريال سعودي إضافة إلى حزمة مزايا تنافسية.

نرجو منك تأكيد قبول العرض خلال خمسة أيام عمل عبر البريد الإلكتروني.

مع خالص التحية،
إدارة الموارد البشرية
    `,
  },
  {
    id: "salary-certificate",
    name: "شهادة تعريف بالراتب",
    description: "شهادة رسمية توضح بيانات الموظف وصافي راتبه الشهري.",
    fields: [
      { id: "employeeName", label: "اسم الموظف" },
      { id: "employeeId", label: "رقم الموظف" },
      { id: "department", label: "الإدارة" },
      { id: "salary", label: "الراتب الشهري", type: "number" },
      { id: "issueDate", label: "تاريخ الإصدار", type: "date" },
    ],
    body: `
نشهد نحن إدارة الموارد البشرية بأن الموظف/ة {{employeeName}} رقم {{employeeId}} يعمل لدينا في إدارة {{department}}،
ويتقاضى راتبًا شهريًا قدره {{salary}} ريال سعودي. تم إصدار هذه الشهادة بناءً على طلبه دون تحمل أي مسؤولية تجاه الغير.

صادر بتاريخ {{issueDate}}.
    `,
  },
  {
    id: "exit-clearance",
    name: "نموذج إخلاء طرف",
    description:
      "قائمة تحقق لضمان استكمال جميع إجراءات تسليم العهد وإنهاء الخدمة.",
    fields: [
      { id: "employeeName", label: "اسم الموظف" },
      { id: "handoverDate", label: "تاريخ التسليم", type: "date" },
      { id: "department", label: "الإدارة" },
      { id: "notes", label: "ملاحظات إضافية", type: "textarea" },
    ],
    body: `
تم إنهاء خدمات الموظف/ة {{employeeName}} في إدارة {{department}} بتاريخ {{handoverDate}}،
وتم التأكد من تسليم جميع الممتلكات والعهد. ملاحظات إضافية: {{notes}}.
    `,
  },
];

