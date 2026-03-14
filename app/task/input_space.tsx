"use client";

import { useState } from "react";
import type { Task } from "./types";

/**
 * タスク追加のための入力スペースコンポーネント
 */
interface InputSpaceProps {
	onAddTask: (task: Omit<Task, 'id'>) => void;
}

/**
 * タスクのタイトルとポモドーロ数を入力して、タスクを追加するためのコンポーネント
 */
export default function InputSpace({ onAddTask }: InputSpaceProps) {
	const [input, setInput] = useState("");
	const [pomodoroCount, setPomodoroCount] = useState(1);

	/**
	 * フォームの送信処理
	 */
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (input.trim()) {
			onAddTask({
				title: input.trim(),
				completed: false,
				pomodoroCount,
			});
			setInput("");
			setPomodoroCount(1);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="タスク名を入力..."
				/>
				<select
					value={pomodoroCount}
					onChange={(e) => setPomodoroCount(Number(e.target.value))}
				>
					{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
				<button type="submit">追加</button>
			</form>
		</div>
	);
}