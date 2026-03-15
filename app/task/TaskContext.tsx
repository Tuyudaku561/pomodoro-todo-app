"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { Task } from "./types";

export type NewTask = Omit<Task, "id" | "isRunning">;

type TaskContextValue = {
	tasks: Task[];
	addTask: (task: NewTask) => void;
	startTask: (taskId: number) => void;
	stopTask: (taskId: number) => void;
	editTask: (id: number, updates: Partial<NewTask>) => void;
	deleteTask: (id: number) => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const TASKS_STORAGE_KEY = "pomodoro-tasks";

/**
 * タスク管理の状態を提供するプロバイダーコンポーネント
 */
export function TaskProvider({ children }: { children: React.ReactNode }) {
	const [tasks, setTasks] = useState<Task[]>([]);

	// ローカルストレージからタスクを読み込む
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
			if (storedTasks) {
				try {
					setTasks(JSON.parse(storedTasks));
				} catch (error) {
					console.error("Failed to parse tasks from localStorage:", error);
				}
			}
		}
	}, []);

	// タスクが変更されたらローカルストレージに保存
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
		}
	}, [tasks]);

	/**
	 * 新しいタスクを生成して一覧に追加する
	 */
	const addTask = (newTask: NewTask) => {
		const task: Task = {
			...newTask,
			id: Date.now(),
			isRunning: false,
		};
		setTasks((prev) => [...prev, task]);
	};

	/**
	 * 指定したIDのタスクを開始し、それ以外を停止する
	 * （一度に一つのタスクのみ実行可能な仕様）
	 */
	const startTask = (taskId: number) => {
		setTasks((prev) =>
			prev.map((task) => ({
				...task,
				isRunning: task.id === taskId,
			}))
		);
	};

	/**
	 * 指定したIDのタスクの実行状態を解除する
	 */
	const stopTask = (taskId: number) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, isRunning: false } : task
			)
		);
	};

	/**
	 * 指定したIDのタスクを更新する
	 */
	const editTask = (id: number, updates: Partial<NewTask>) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, ...updates } : task
			)
		);
	};

	/**
	 * 指定したIDのタスクを削除する
	 */
	const deleteTask = (id: number) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	};

	/**
	 * コンテキストに渡す値をメモ化
	 * tasks配列が変更された時のみ、オブジェクトを再生成して不要な再レンダリングを抑止する
	 */
	const value = useMemo(
		() => ({ tasks, addTask, startTask, stopTask, editTask, deleteTask }),
		[tasks]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/**
 * 各コンポーネントからTaskContextを利用するためのカスタムフック
 * Providerの配下でない場所で呼び出すとエラーを投げる安全設計
 */
export function useTasks() {
	const ctx = useContext(TaskContext);
	if (!ctx) {
		throw new Error("useTasks must be used within TaskProvider");
	}
	return ctx;
}
