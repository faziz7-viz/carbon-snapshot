import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add window interfaces for PapaParse and jsPDF
declare global {
  interface Window {
    Papa: any;
    jspdf: {
      jsPDF: any;
    };
  }
}
