import { Report } from "../types";

const STORAGE_KEY = "nasdaq_reports";

export function getReports(): Report[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to parse reports from localStorage", e);
  }
  return [];
}

export function saveReport(report: Report) {
  const reports = getReports();
  // Check if it already exists
  const existingIndex = reports.findIndex((r) => r.id === report.id);
  if (existingIndex >= 0) {
    reports[existingIndex] = report;
  } else {
    reports.push(report);
  }
  // Sort descending by date
  reports.sort((a, b) => b.id.localeCompare(a.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReport(id: string) {
  const reports = getReports();
  const filtered = reports.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
