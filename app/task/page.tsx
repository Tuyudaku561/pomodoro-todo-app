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
			<InputSpace />
			<TaskList tasks={tasks} />
		</div>
	);
}