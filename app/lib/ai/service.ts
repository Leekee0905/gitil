import {GoogleGenAI} from '@google/genai';
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const genAI = new GoogleGenAI({apiKey})

export async function generateSummary(content: string): Promise<string> {
  if (!apiKey) {
      console.error("[Gemini Service] NEXT_PUBLIC_GEMINI_API_KEY is not set. Please check your .env file.")
      return "(Error: API Key missing. Please check server logs.)"
  }

  try {
    const systemPrompt = `당신은 개발자를 돕는 AI 어시스턴트입니다. 아래의 Git 커밋 또는 PR 로그를 바탕으로 개발 블로그 포스팅을 위한 '오늘 배운 것(TIL)' 요약을 작성해 주세요. 기술적인 도전 과제, 해결 방법, 그리고 핵심 배운 점에 집중해 주세요.

출력 형식:
'Insights' 섹션에 들어갈 마크다운 내용만 출력해 주세요. 'Date'나 'Summary' 같은 헤더는 포함하지 말고, 블로그 글에 적합한 구어체(해요체)로 작성해 주세요. 불렛 포인트나 문단을 적절히 섞어서 가독성 있게 만들어 주세요.`;
    console.log(content)
    const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: {
                parts: [ { text: systemPrompt } ]
            },
            thinkingConfig: {
                thinkingBudget: 0,
            },
        },
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: content
                    }
                ]
            }
        ]
    })
    
    // In @google/genai, .text is a getter property, not a function
    console.log(result || "No summary generated.")
    return result.text || 'no summary'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Gemini API Error Detail:", JSON.stringify(error, null, 2))
    return `(Failed to generate AI summary: ${error.message || "Unknown Error"})`
  }
}
