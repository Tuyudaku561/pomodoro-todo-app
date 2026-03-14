"use client";

import { useState } from "react";
import type { Task } from "./types";
import InputSpace from "./input_space";
import TaskList from "./task_list";

/**
 * タスク管理ページのコンポーネント
 */
export default function TaskPage() {
	const [tasks, setTasks] = useState<Task[]>([]);

	const addTask = (newTask: Omit<Task, 'id'>) => {
		const task: Task = {
			...newTask,
			id: Date.now(), // シンプルなID生成
		};
		setTasks((prevTasks) => [...prevTasks, task]);
	};

	return (
		<div>
			<InputSpace onAddTask={addTask} />
			<TaskList tasks={tasks} />
		</div>
	);
}