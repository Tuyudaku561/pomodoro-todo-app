"use client";

import "./sample.css";
import InputSpace from "./input_space";
import TaskList from "./task_list";
import { useTasks } from "./TaskContext";

/**
 * タスク管理ページのコンポーネント
 */
export default function TaskPage() {
	const { tasks, achievements, clearAchievements } = useTasks();
	const DEBUG = false; // デバッグ用: trueでachievementsを表示、falseで非表示

	return (
		<div className="task-page">
			<InputSpace />
			<TaskList tasks={tasks} />
			{DEBUG && (
				<div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
					<h3>Debug: Achievements</h3>
					<pre>{JSON.stringify(achievements, null, 2)}</pre>
					<button onClick={() => {
						if (confirm("achievementsを初期化しますか？")) {
							clearAchievements();
						}
					}}>achievementsを初期化</button>
				</div>
			)}
		</div>
	);
}