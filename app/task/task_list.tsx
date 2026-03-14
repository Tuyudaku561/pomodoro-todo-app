"use client";

import { useState } from "react";
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
	const { startTask, editTask, deleteTask } = useTasks();
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editPomodoroCount, setEditPomodoroCount] = useState(1);

	const handleStart = (taskId: number) => {
		startTask(taskId);
		router.push(`/timer?taskId=${taskId}`);
	};

	const handleEdit = (task: Task) => {
		setEditingTaskId(task.id);
		setEditTitle(task.title);
		setEditPomodoroCount(task.pomodoroCount);
	};

	const handleSave = () => {
		if (editingTaskId !== null) {
			editTask(editingTaskId, {
				title: editTitle.trim(),
				pomodoroCount: editPomodoroCount,
			});
			setEditingTaskId(null);
		}
	};

	const handleCancel = () => {
		setEditingTaskId(null);
	};

	const handleDelete = (taskId: number) => {
		if (confirm("このタスクを削除しますか？")) {
			deleteTask(taskId);
		}
	};

	return (
		<div>
			<h2>タスク一覧</h2>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						{editingTaskId === task.id ? (
							<>
								<input
									type="text"
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
								/>
								<select
									value={editPomodoroCount}
									onChange={(e) => setEditPomodoroCount(Number(e.target.value))}
								>
									{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
										<option key={num} value={num}>
											{num}
										</option>
									))}
								</select>
								<button onClick={handleSave}>保存</button>
								<button onClick={handleCancel}>キャンセル</button>
							</>
						) : (
							<>
								{task.title} - ポモドーロ数: {task.pomodoroCount}
								{task.isRunning ? (
									<span> (実行中)</span>
								) : (
									<button onClick={() => handleStart(task.id)}>
										start
									</button>
								)}
								<button onClick={() => handleEdit(task)}>編集</button>
								<button onClick={() => handleDelete(task.id)}>削除</button>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}