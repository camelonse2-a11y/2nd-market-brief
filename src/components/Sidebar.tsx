import React from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Report } from "../types";
import { FileText, PlusCircle, Trash2 } from "lucide-react";

interface SidebarProps {
  reports: Report[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onGenerateNew: () => void;
  onDelete: (id: string) => void;
  isGenerating: boolean;
}

export function Sidebar({
  reports,
  selectedId,
  onSelect,
  onGenerateNew,
  onDelete,
  isGenerating,
}: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Market Brief
        </h1>
      </div>

      <div className="p-4">
        <button
          onClick={onGenerateNew}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          <span className="font-medium">
            {isGenerating ? "레포트 생성 중..." : "새 레포트 생성"}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          최근 레포트
        </div>
        <ul className="space-y-1 px-2">
          {reports.length === 0 ? (
            <li className="px-3 py-4 text-sm text-slate-500 text-center">
              저장된 레포트가 없습니다.
            </li>
          ) : (
            reports.map((report) => (
              <li key={report.id} className="group flex items-center">
                <button
                  onClick={() => onSelect(report.id)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedId === report.id
                      ? "bg-indigo-500/10 text-indigo-400 font-medium"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {format(parseISO(report.date), "yyyy년 MM월 dd일 (E)", {
                    locale: ko,
                  })}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(report.id);
                  }}
                  className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
