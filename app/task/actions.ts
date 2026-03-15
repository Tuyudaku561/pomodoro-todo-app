"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { Achievement } from "./types";

/**
 * タスク名から最適なポモドーロ数をAIに相談するServer Action
 */
export async function getPomodoroSuggestion(taskName: string, count: number, achievements: Achievement[]) {
	if (!taskName || taskName.trim().length < 2) {
		return null;
	}

	try {
		// APIキーの存在確認
		if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
			throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
		}

		const { object } = await generateObject({
			model: google("gemini-2.5-flash-lite"),
			schema: z.object({
				suggestedPomodoros: z.number().min(1).max(10),
				reason: z.string().describe("その数を選んだ理由（過去のデータとの比較など）100字以内"),
			}),
			prompt: `
あなたはポモドーロ・テクニックの専門家です。
ユーザーが新しいタスク「${taskName}」をポモドーロ数${count}で追加しようとしています。
以下の過去の達成度データ（JSON）を元に、このユーザーにとって最適なポモドーロ数（1ポモドーロ=25分）を1以上10以下の整数で提案してください。

過去のデータ:
${JSON.stringify(achievements, null, 2)}

評価（rating）の意味:
1: 未達成 (計画より時間がかかった)
2: 概ね達成 (概ね計画通り)
3: 完全達成 (計画より早く終わった、または非常に集中できた)

ユーザーの傾向を分析し、「${taskName}」に似た過去のタスクや、全体的な見積もりの甘さ・厳しさを考慮して提案してください。
reasonは必ず100文字以内の日本語で回答してください。
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
