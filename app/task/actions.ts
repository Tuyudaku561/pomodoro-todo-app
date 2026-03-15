"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { SAMPLE_ACHIEVEMENTS } from "./sample_data";

/**
 * タスク名から最適なポモドーロ数をAIに相談するServer Action
 */
export async function getPomodoroSuggestion(taskName: string) {
	if (!taskName || taskName.trim().length < 2) {
		return null;
	}

	try {
		const { object } = await generateObject({
			model: google("gemini-2.0-flash"),
			schema: z.object({
				suggestedPomodoros: z.number().min(1).max(10),
				reason: z.string().describe("その数を選んだ理由（過去のデータとの比較など）"),
			}),
			prompt: `
あなたはポモドーロ・テクニックの専門家です。
ユーザーが新しいタスク「${taskName}」を追加しようとしています。
以下の過去の達成度データ（JSON）を元に、このユーザーにとって最適なポモドーロ数（1ポモドーロ=25分）を提案してください。

過去のデータ:
${JSON.stringify(SAMPLE_ACHIEVEMENTS, null, 2)}

評価（rating）の意味:
1: 期待を下回った (計画より時間がかかりすぎた)
2: 期待通り (計画通り)
3: 期待を上回った (計画より早く終わった、または非常に集中できた)

ユーザーの傾向を分析し、「${taskName}」に似た過去のタスクや、全体的な見積もりの甘さ・厳しさを考慮して提案してください。
日本語で回答してください。
`,
		});

		return object;
	} catch (error) {
		console.error("AI suggestion error:", error);
		return {
			suggestedPomodoros: 2,
			reason: "AIによる提案の生成中にエラーが発生しました。デフォルトとして2ポモドーロを提案します。",
		};
	}
}
