import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateDailyReport(dateString: string): Promise<string> {
  const prompt = `
당신은 나스닥(NASDAQ) 및 코스피(KOSPI) 주식 시장 전문 애널리스트입니다.
오늘(${dateString})을 기준으로 주식 투자를 위한 일일 레포트를 작성해주세요.
다음 5가지 항목을 반드시 포함하여 마크다운(Markdown) 형식으로 작성해야 합니다.

1. **주요 뉴스 요약 (5개 이상)**: 나스닥 및 코스피 시장에 영향을 미칠 수 있는 가장 중요한 최신 경제 및 기업 뉴스들을 5개 이상 상세히 정리해주세요.
2. **시장 방향성 예측**: 위 뉴스들과 현재 시장 상황을 종합하여 향후 나스닥 및 코스피 주식 시장의 방향성을 각각 예측해주세요.
3. **투자 아이디어 및 추천 종목 (확대)**: 분석된 내용을 바탕으로 개인 투자자에게 유용한 주식 투자 종목 추천 및 구체적인 투자 아이디어를 풍부하게(3~5개 이상) 제공해주세요. 나스닥과 코스피 종목을 모두 포함해주세요.
4. **주의해야 할 종목 및 섹터**: 현재 시장 상황에서 투자에 주의해야 하거나 비중 축소가 필요한 종목, 섹터 및 잠재적인 리스크 요인들을 명시해주세요.
5. **오늘의 한 줄 평**: 오늘의 양대 시장 상황을 요약하는 핵심적인 한 줄 평을 작성해주세요.

전문적이고 신뢰감 있는 어조로 작성하며, 가독성을 높이기 위해 적절한 제목(Heading), 글머리 기호(Bullet points), 강조(Bold) 등을 사용해주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text || "레포트를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("레포트 생성 중 오류가 발생했습니다.");
  }
}
