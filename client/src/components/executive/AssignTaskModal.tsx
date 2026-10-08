import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export interface ExecutiveOption {
  id: string;
  name?: string | null;
  email: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

export interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  executives: ExecutiveOption[];
  onSubmit: (data: CreateTaskInput) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface FormState {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

type FormErrors = Partial<Record<"title" | "assignedTo" | "dueDate", string>>;

const emptyForm: FormState = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
};

const getExecutiveLabel = (executive: ExecutiveOption): string => {
  const name = executive.name?.trim();
  return name ? name : executive.email;
};

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Task title is required.";
  }
  if (!form.assignedTo) {
    errors.assignedTo = "Please select an executive.";
  }
  if (!form.dueDate) {
    errors.dueDate = "Due date is required.";
  }

  return errors;
};

const inputBase =
  "w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60";
const inputOk =
  "border-white/10 hover:border-white/20 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/30";
const inputError =
  "border-rose-400/50 focus-visible:border-rose-400/60 focus-visible:ring-rose-400/30";

const AssignTaskModal = ({
  isOpen,
  onClose,
  executives,
  onSubmit,
  isSubmitting = false,
}: AssignTaskModalProps) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Start from a clean form every time the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [isOpen]);

  // Allow closing with the Escape key while not submitting.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange =
    (field: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));

      if (field !== "description" && errors[field]) {
        setErrors((previous) => ({ ...previous, [field]: undefined }));
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const data: CreateTaskInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      assignedTo: form.assignedTo,
      dueDate: form.dueDate,
    };

    // The parent owns the request and its error handling; a rejected
    // promise is intentionally not rethrown from this presentational form.
    void Promise.resolve(onSubmit(data)).catch(() => undefined);
  };

  const hasExecutives = executives.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      role="presentation"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-task-heading"
        className="relative my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1115] shadow-2xl shadow-black/50"
      >
        <header className="border-b border-white/10 px-6 py-5">
          <h2
            id="assign-task-heading"
            className="text-lg font-semibold text-white"
          >
            Assign Task
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Create a new task and assign it to an executive.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset
            disabled={isSubmitting}
            className="min-w-0 space-y-5 border-0 px-6 py-5"
          >
            <div>
              <label
                htmlFor="assign-task-title"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Task Title <span className="text-rose-300">*</span>
              </label>
              <input
                id="assign-task-title"
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Enter a short, clear title"
                autoFocus
                aria-required="true"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "assign-task-title-error" : undefined}
                className={`${inputBase} ${errors.title ? inputError : inputOk}`}
              />
              {errors.title ? (
                <p
                  id="assign-task-title-error"
                  className="mt-1.5 text-xs text-rose-300"
                >
                  {errors.title}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="assign-task-description"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Description{" "}
                <span className="text-xs font-normal text-gray-500">
                  (optional)
                </span>
              </label>
              <textarea
                id="assign-task-description"
                rows={4}
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Add any details the executive should know"
                className={`${inputBase} ${inputOk} resize-y`}
              />
            </div>

            <div>
              <label
                htmlFor="assign-task-assignee"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Assign To <span className="text-rose-300">*</span>
              </label>
              <select
                id="assign-task-assignee"
                value={form.assignedTo}
                onChange={handleChange("assignedTo")}
                disabled={isSubmitting || !hasExecutives}
                aria-required="true"
                aria-invalid={Boolean(errors.assignedTo)}
                aria-describedby={
                  errors.assignedTo ? "assign-task-assignee-error" : undefined
                }
                className={`${inputBase} ${errors.assignedTo ? inputError : inputOk}`}
              >
                <option value="" className="bg-[#0f1115] text-gray-400">
                  {hasExecutives
                    ? "Select an executive"
                    : "No executives available"}
                </option>
                {executives.map((executive) => (
                  <option
                    key={executive.id}
                    value={executive.id}
                    className="bg-[#0f1115] text-gray-100"
                  >
                    {getExecutiveLabel(executive)}
                  </option>
                ))}
              </select>
              {errors.assignedTo ? (
                <p
                  id="assign-task-assignee-error"
                  className="mt-1.5 text-xs text-rose-300"
                >
                  {errors.assignedTo}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="assign-task-due-date"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Due Date <span className="text-rose-300">*</span>
              </label>
              <input
                id="assign-task-due-date"
                type="date"
                value={form.dueDate}
                onChange={handleChange("dueDate")}
                aria-required="true"
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={
                  errors.dueDate ? "assign-task-due-date-error" : undefined
                }
                className={`${inputBase} ${errors.dueDate ? inputError : inputOk} [color-scheme:dark]`}
              />
              {errors.dueDate ? (
                <p
                  id="assign-task-due-date-error"
                  className="mt-1.5 text-xs text-rose-300"
                >
                  {errors.dueDate}
                </p>
              ) : null}
            </div>
          </fieldset>

          <footer className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Assigning..." : "Assign Task"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;