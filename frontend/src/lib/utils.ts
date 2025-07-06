import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ Add this part:
export const PartyColors = {
  D: "bg-blue-100 text-blue-800",
  R: "bg-red-100 text-red-800",
}
