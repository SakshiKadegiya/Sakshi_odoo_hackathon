import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isWeekend, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateReadable(date: string | Date): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatTime(date: string | Date): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "hh:mm a");
}

export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  holidays: (string | Date)[] = [],
  isHalfDay: boolean = false
): number {
  let count = 0;
  let current = new Date(startDate);
  
  const holidayDates = holidays.map((h) =>
    typeof h === "string" ? new Date(h).toDateString() : h.toDateString()
  );
  
  while (current <= endDate) {
    if (!isWeekend(current)) {
      const isHoliday = holidayDates.includes(current.toDateString());
      if (!isHoliday) {
        count++;
      }
    }
    current = addDays(current, 1);
  }
  
  return isHalfDay ? count - 0.5 : count;
}

export function checkPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) score++;
  else feedback.push("At least 8 characters");
  
  if (password.length >= 12) score++;
  
  if (/[a-z]/.test(password)) score++;
  else feedback.push("Add lowercase letters");
  
  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Add uppercase letters");
  
  if (/[0-9]/.test(password)) score++;
  else feedback.push("Add numbers");
  
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push("Add special characters");
  
  if (score <= 2) return { score, label: "Weak", color: "text-destructive", feedback };
  if (score <= 4) return { score, label: "Medium", color: "text-yellow-500", feedback };
  return { score, label: "Strong", color: "text-green-500", feedback };
}
