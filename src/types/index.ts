export type EmploymentStatus = "Active" | "Onboarding" | "Leave" | "Offboarding";

export type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  status: EmploymentStatus;
  startDate: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  tags: string[];
  lastReviewScore: number;
};

export type LeaveType = "Vacation" | "Sick" | "Unpaid" | "Remote" | "Parental";

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type LeaveRequest = {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  notes: string;
  status: LeaveStatus;
  approver: string;
  createdAt: string;
};

export type WorkflowTrigger =
  | "New hire created"
  | "Leave request submitted"
  | "Probation period ending"
  | "Contract expiring"
  | "Policy acknowledgement overdue";

export type WorkflowAction =
  | "Send email to employee"
  | "Create IT ticket"
  | "Notify manager"
  | "Generate document"
  | "Schedule meeting"
  | "Assign checklist";

export type Workflow = {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  owner: string;
  lastRunAt: string;
};

export type ChecklistItemStatus = "Not started" | "In progress" | "Completed" | "Blocked";

export type ChecklistItem = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  category: "Onboarding" | "Offboarding" | "Compliance" | "Engagement";
  status: ChecklistItemStatus;
};

export type DocumentTemplate = {
  id: string;
  name: string;
  description: string;
  fields: {
    id: string;
    label: string;
    placeholder?: string;
    type?: "text" | "textarea" | "date" | "number";
  }[];
  body: string;
};

