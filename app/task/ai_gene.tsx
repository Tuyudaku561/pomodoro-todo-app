"use client";

import { useEffect, useState } from "react";
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

	// タスク入力が変更されたらAIに相談する
	// ※頻繁なリクエストを防ぐためにデバウンス処理を入れる
	useEffect(() => {
		const timer = setTimeout(async () => {
			if (taskInput.trim().length < 2) {
				setSuggestion(null);
				return;
			}
			setLoading(true);
			const res = await getPomodoroSuggestion(taskInput);
			if (res) {
				setSuggestion(res);
			}
			setLoading(false);
		}, 1000); // 1秒のデバウンス

		return () => clearTimeout(timer);
	}, [taskInput]);

	if (loading) {
		return <div className="ai-suggestion loading">AIが分析中...</div>;
	}

	if (!suggestion) {
		return null;
	}

	return (
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
	);
}
