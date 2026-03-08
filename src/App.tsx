import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ReportView } from "./components/ReportView";
import { getReports, saveReport, deleteReport } from "./utils/storage";
import { generateDailyReport } from "./services/gemini";
import { Report } from "./types";
import { format } from "date-fns";

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      const today = new Date();
      const dateString = format(today, "yyyy-MM-dd");
      const content = await generateDailyReport(dateString);

      const newReport: Report = {
        id: dateString,
        date: today.toISOString(),
        content,
        createdAt: today.getTime(),
      };

      saveReport(newReport);
      const updatedReports = getReports();
      setReports(updatedReports);
      setSelectedId(newReport.id);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("레포트 생성에 실패했습니다. API 키나 네트워크 상태를 확인해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const loadedReports = getReports();
    setReports(loadedReports);
    
    const today = new Date();
    const dateString = format(today, "yyyy-MM-dd");
    const hasTodayReport = loadedReports.some((r) => r.id === dateString);
    
    if (loadedReports.length > 0 && !hasTodayReport) {
      setSelectedId(loadedReports[0].id);
    } else if (hasTodayReport) {
      setSelectedId(dateString);
    }

    // Auto-generate if it's past 7 AM and today's report doesn't exist
    if (!hasTodayReport && today.getHours() >= 7) {
      handleGenerateNew();
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("정말로 이 레포트를 삭제하시겠습니까?")) {
      deleteReport(id);
      const updatedReports = getReports();
      setReports(updatedReports);
      if (selectedId === id) {
        setSelectedId(updatedReports.length > 0 ? updatedReports[0].id : null);
      }
    }
  };

  const selectedReport = reports.find((r) => r.id === selectedId) || null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        reports={reports}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onGenerateNew={handleGenerateNew}
        onDelete={handleDelete}
        isGenerating={isGenerating}
      />
      <ReportView report={selectedReport} isGenerating={isGenerating} />
    </div>
  );
}
