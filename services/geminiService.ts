
import { GoogleGenAI, Type } from "@google/genai";
import { UserResponses, BranchResult, BranchCode, BranchMatch } from "../types";
import { BRANCH_NAMES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdvancedInsight = async (
  name: string,
  topBranch: BranchCode,
  sortedScores: { code: BranchCode, score: number }[],
  responses: UserResponses
): Promise<BranchResult> => {
  const branchName = BRANCH_NAMES[topBranch];
  const secondaryCodes = sortedScores.slice(1, 3).map(s => s.code);
  const secondaries = secondaryCodes.map(b => BRANCH_NAMES[b]);
  
  const traitsText = Object.entries(responses)
    .filter(([k]) => k !== 'name' && k !== 'confidence')
    .map(([k, v]) => `${v}`).join(', ');

  const prompt = `
    Perform a professional "Engineering Branch Insight" analysis for a student named ${name}.
    Based on our weighted algorithm, their best fit is ${branchName} at MIT Muzaffarpur.
    
    Traits Summary from symbolic questioning: ${traitsText}
    The user's self-reflection confidence level: ${responses.confidence || 'unspecified'}.

    Task:
    1. Provide a professional "Reasoning" summary (2-3 sentences) linking their traits specifically to ${branchName}.
    2. Provide 3 specific bullet points for "Why This Branch Fits You" (e.g. "Strong preference for logical problem solving").
    3. Provide a "Personality Summary" (e.g., "Analytical Visionary" or "Structural Architect").
    4. Provide 3 symbolic "Palm Insights" (Head Line, Life Line, Palm Shape) that reflect their decision-making profile.
    5. Provide a short "Academic Explanation" for professors (describing how this app demonstrates structured logic and weighted decision support in a UX context).
    
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            reasoningBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            personalitySummary: { type: Type.STRING },
            palmInsights: {
              type: Type.OBJECT,
              properties: {
                headLine: { type: Type.STRING },
                lifeLine: { type: Type.STRING },
                palmShape: { type: Type.STRING }
              },
              required: ["headLine", "lifeLine", "palmShape"]
            },
            academicExplanation: { type: Type.STRING }
          },
          required: ["reasoning", "reasoningBullets", "personalitySummary", "palmInsights", "academicExplanation"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    const comparisons: BranchMatch[] = sortedScores.map((s, idx) => ({
      code: s.code,
      label: BRANCH_NAMES[s.code],
      level: idx === 0 ? 'High' : (idx < 3 ? 'Medium' : 'Low')
    }));

    return {
      suggestedBranch: branchName,
      secondaryBranches: secondaries,
      reasoning: data.reasoning,
      reasoningBullets: data.reasoningBullets,
      personalitySummary: data.personalitySummary,
      palmInsights: data.palmInsights,
      date: new Date().toLocaleDateString(),
      colorTheme: topBranch,
      userName: name,
      comparisons: comparisons,
      academicExplanation: data.academicExplanation
    };
  } catch (error) {
    console.error("Error generating advanced insight:", error);
    return {
      suggestedBranch: branchName,
      secondaryBranches: secondaries,
      reasoning: `Your patterns of thinking and learning align exceptionally well with ${branchName} at MIT Muzaffarpur.`,
      reasoningBullets: [
        "Strong inclination toward logical problem solving",
        "Preference for abstract systems design",
        "Focus on optimized execution"
      ],
      personalitySummary: "Strategic Engineering Mind",
      palmInsights: {
        headLine: "Structured and focused cognitive pathway.",
        lifeLine: "Stable and consistent problem-solving endurance.",
        palmShape: "Analytical profile with balanced practical depth."
      },
      date: new Date().toLocaleDateString(),
      colorTheme: topBranch,
      userName: name,
      comparisons: sortedScores.map((s, idx) => ({
        code: s.code,
        label: BRANCH_NAMES[s.code],
        level: idx === 0 ? 'High' : (idx < 3 ? 'Medium' : 'Low')
      })),
      academicExplanation: "This prototype demonstrates the use of structured questioning and weighted heuristic mapping to provide data-driven branch recommendations for educational exploration."
    };
  }
};
