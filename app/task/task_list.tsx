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
	const { startTask, editTask, deleteTask, stopTask } = useTasks();
	const router = useRouter();
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editPomodoroCount, setEditPomodoroCount] = useState(1);

	const hasRunningTask = tasks.some(task => task.isRunning);

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
		<div className="task-list">
			<h2>タスク一覧</h2>
			<ul>
				{tasks.map((task) => (
					<li key={task.id} className={editingTaskId === task.id ? "editing" : task.isRunning ? "running" : ""}>
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
								{/* 1. テキストを span で囲む */}
								<span style={{ flex: 1 }}>
									{task.title} - ポモドーロ数: {task.pomodoroCount}
									{task.isRunning && <span> (実行中)</span>}
								</span>

								{/* 2. ボタン全体を div で囲む */}
								<div className="button-group">
									{task.isRunning ? (
										// 実行中の表示
										<button onClick={() => {
											stopTask(task.id);
											router.push("/timer");
										}}>強制終了</button>
									) : (
										// 停止中の表示
										<>
											{!hasRunningTask && <button onClick={() => handleStart(task.id)}>start</button>}
											<button onClick={() => handleEdit(task)}>編集</button>
											<button onClick={() => handleDelete(task.id)}>削除</button>
										</>
									)}

								</div>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}