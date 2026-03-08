import React from "react";
import Markdown from "react-markdown";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Report } from "../types";
import { Calendar, Clock } from "lucide-react";

interface ReportViewProps {
  report: Report | null;
  isGenerating: boolean;
}

export function ReportView({ report, isGenerating }: ReportViewProps) {
  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">
          오늘의 시장 레포트를 생성 중입니다...
        </h2>
        <p className="mt-2 text-sm">
          최신 뉴스 및 시장 데이터를 분석하고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700">
          선택된 레포트가 없습니다.
        </h2>
        <p className="mt-2 text-sm max-w-md text-center">
          왼쪽 사이드바에서 과거 레포트를 선택하거나, "새 레포트 생성" 버튼을
          눌러 오늘의 투자 인사이트를 확인하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            나스닥 & 코스피 모닝 브리핑
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(parseISO(report.date), "yyyy년 MM월 dd일 EEEE", {
                  locale: ko,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                생성 시간: {format(report.createdAt, "HH:mm", { locale: ko })}
              </span>
            </div>
          </div>
        </header>

        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-xl">
          <Markdown>{report.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
