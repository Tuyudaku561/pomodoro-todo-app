"use client";

import { useRouter } from "next/navigation";
import type { Task } from "./types";
import { useTasks } from "./TaskContext";

/**
 * タスク一覧を表示するコンポーネント
 */
interface TaskListProps {
	tasks: Task[];
}

/**
 * タスクのタイトルとポモドーロ数を表示するためのコンポーネント
 */
export default function TaskList({ tasks }: TaskListProps) {
	const router = useRouter();
	const { startTask } = useTasks();

	const handleStart = (taskId: number) => {
		startTask(taskId);
		router.push(`/timer?taskId=${taskId}`);
	};

	return (
		<div>
			<h2>タスク一覧</h2>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						{task.title} - ポモドーロ数: {task.pomodoroCount} 
						{task.isRunning ? (
							<span> (実行中)</span>
						) : (
							<button onClick={() => handleStart(task.id)}>
								start
							</button>
							)
						}
					</li>
				))}
			</ul>
		</div>
	);
}