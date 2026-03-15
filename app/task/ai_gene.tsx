"use client";

import { useState } from "react";
import { getPomodoroSuggestion } from "./actions";

/**
 * AIによるタスク助言を生成するコンポーネント
 */
interface AiGeneProps {
	taskInput: string;
	onSuggest: (count: number) => void;
}

export default function AiGene({ taskInput, onSuggest }: AiGeneProps) {
	const [suggestion, setSuggestion] = useState<{
		suggestedPomodoros: number;
		reason: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);

	/**
	 * ボタンクリック時にAIに相談する
	 */
	const handleGetSuggestion = async () => {
		if (taskInput.trim().length < 2) return;

		setLoading(true);
		try {
			const res = await getPomodoroSuggestion(taskInput);
			if (res) {
				setSuggestion(res);
			}
		} catch (error) {
			console.error("AI suggestion error:", error);
		} finally {
			setLoading(false);
		}
	};

	// 入力が空になったら提案をクリア
	if (taskInput.trim().length === 0 && suggestion) {
		setSuggestion(null);
	}

	return (
		<div className="ai-gene-container">
			{/* AIに相談するトリガーボタン */}
			<button
				type="button"
				className="ai-consult-button"
				onClick={handleGetSuggestion}
				disabled={loading || taskInput.trim().length < 2}
			>
				{loading ? "分析中..." : "✨ AIにポモドーロ数を相談する"}
			</button>

			{suggestion && !loading && (
				<div className="ai-suggestion-box">
					<div className="suggestion-header">
						✨ AIによる提案: <strong>{suggestion.suggestedPomodoros}ポモドーロ</strong>
					</div>
					<p className="suggestion-reason">{suggestion.reason}</p>
					<button
						type="button"
						className="apply-button"
						onClick={() => onSuggest(suggestion.suggestedPomodoros)}
					>
						この提案を適用する
					</button>
				</div>
			)}
		</div>
	);
}
