"use client";

import "./sample.css";
import InputSpace from "./input_space";
import TaskList from "./task_list";
import { useTasks } from "./TaskContext";

/**
 * タスク管理ページのコンポーネント
 */
export default function TaskPage() {
	const { tasks } = useTasks();

	return (
		<div className="task-page">
			<h1>ポモドーロ・タスク管理</h1>
			<InputSpace />
			<TaskList tasks={tasks} />
		</div>
	);
}