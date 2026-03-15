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
		let ignore = false;

		// 入力値が短すぎる場合は即座にクリアしてタイマーを待たない
		if (taskInput.trim().length < 2) {
			setSuggestion(null);
			setLoading(false);
			return;
		}

		const timer = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await getPomodoroSuggestion(taskInput);
				if (!ignore && res) {
					setSuggestion(res);
				}
			} catch (error) {
				console.error("AI suggestion error:", error);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		}, 1000); // 1秒のデバウンス

		return () => {
			ignore = true;
			clearTimeout(timer);
		};
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