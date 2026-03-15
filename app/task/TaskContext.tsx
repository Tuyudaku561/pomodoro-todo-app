"use client";

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import type { Task, Achievement } from "./types";

export type NewTask = Omit<Task, "id" | "isRunning" | "completed">;

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

type TimerMode = "work" | "break";

type TaskContextValue = {
	tasks: Task[];
	addTask: (task: NewTask) => void;
	startTask: (taskId: number) => void;
	stopTask: (taskId: number) => void;
	editTask: (id: number, updates: Partial<NewTask>) => void;
	deleteTask: (id: number) => void;
	// タイマー関連の状態と操作
	mode: TimerMode;
	setMode: (mode: TimerMode) => void;
	timeLeft: number;
	setTimeLeft: (time: number) => void;
	isTimerRunning: boolean;
	setIsTimerRunning: (running: boolean) => void;
	pomodoroCount: number;
	setPomodoroCount: (count: number) => void;
	targetPomodoros: number;
	setTargetPomodoros: (count: number) => void;
	totalFocusSeconds: number;
	setTotalFocusSeconds: (seconds: number) => void;
	activeTaskId: number | null;
	resetTimer: () => void;
	handleRatingSelect: (rating: 1 | 2 | 3) => void;
	showEvaluation: boolean;
	setShowEvaluation: (show: boolean) => void;
	achievements: Achievement[];
	clearAchievements: () => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const TASKS_STORAGE_KEY = "pomodoro-tasks";
const TIMER_STORAGE_KEY = "pomodoro-timer";

/**
 * タスク管理とタイマーの状態を提供するプロバイダーコンポーネント
 */
export function TaskProvider({ children }: { children: React.ReactNode }) {
	const DEBUG = true; // デバッグ用: trueでachievementsをコンソール出力、falseで無効化
	const [tasks, setTasks] = useState<Task[]>([]);
	const [achievements, setAchievements] = useState<Achievement[]>([]);

	// タイマーの状態
	const [mode, setMode] = useState<TimerMode>("work");
	const [timeLeft, setTimeLeft] = useState(WORK_TIME);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [pomodoroCount, setPomodoroCount] = useState(0);
	const [targetPomodoros, setTargetPomodoros] = useState(4);
	const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
	const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
	const [showEvaluation, setShowEvaluation] = useState(false);

	// ローカルストレージからタスクとタイマーの状態を読み込む
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
			if (storedTasks) {
				try {
					const parsedTasks = JSON.parse(storedTasks);
					queueMicrotask(() => setTasks(parsedTasks));
				} catch (error) {
					console.error("Failed to parse tasks from localStorage:", error);
				}
			}

			const storedTimer = localStorage.getItem(TIMER_STORAGE_KEY);
			if (storedTimer) {
				try {
					const timerData = JSON.parse(storedTimer);
					queueMicrotask(() => {
						if (timerData.mode) setMode(timerData.mode);
						if (timerData.timeLeft !== undefined) setTimeLeft(timerData.timeLeft);
						if (timerData.isTimerRunning !== undefined) setIsTimerRunning(timerData.isTimerRunning);
						if (timerData.pomodoroCount !== undefined) setPomodoroCount(timerData.pomodoroCount);
						if (timerData.targetPomodoros !== undefined) setTargetPomodoros(timerData.targetPomodoros);
						if (timerData.totalFocusSeconds !== undefined) setTotalFocusSeconds(timerData.totalFocusSeconds);
						if (timerData.activeTaskId !== undefined) setActiveTaskId(timerData.activeTaskId);
					});
				} catch (error) {
					console.error("Failed to parse timer:", error);
				}
			}

			const storedAchievements = localStorage.getItem("achievements");
			if (storedAchievements) {
				try {
					const parsedAchievements = JSON.parse(storedAchievements);
					queueMicrotask(() => setAchievements(parsedAchievements));
				} catch (error) {
					console.error("Failed to parse achievements from localStorage:", error);
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

	// タイマーの状態が変更されたらローカルストレージに保存
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const timerData = {
				mode,
				timeLeft,
				isTimerRunning,
				pomodoroCount,
				targetPomodoros,
				totalFocusSeconds,
				activeTaskId,
			};
			localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerData));
		}
	}, [mode, timeLeft, isTimerRunning, pomodoroCount, targetPomodoros, totalFocusSeconds, activeTaskId]);

	// タイマーロジック
	useEffect(() => {
		if (!isTimerRunning) return;

		if (timeLeft <= 0) {
			queueMicrotask(() => {
				if (mode === "work") {
					setPomodoroCount(prev => {
						const nextCount = prev + 1;
						if (nextCount >= targetPomodoros) {
							setIsTimerRunning(false);
							setShowEvaluation(true);
							// タスクの実行状態を解除
							if (activeTaskId) {
								setTasks(currentTasks => currentTasks.map(t => t.id === activeTaskId ? { ...t, isRunning: false } : t));
							}
						} else {
							setMode("break");
							setTimeLeft(BREAK_TIME);
						}
						return nextCount;
					});
				} else {
					setMode("work");
					setTimeLeft(WORK_TIME);
				}
			});
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
			if (mode === "work") {
				setTotalFocusSeconds((prev) => prev + 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isTimerRunning, timeLeft, mode, targetPomodoros, activeTaskId]);

	/**
	 * 新しいタスクを生成して一覧に追加する
	 */
	const addTask = useCallback((newTask: NewTask) => {
		const task: Task = {
			...newTask,
			id: Date.now(),
			isRunning: false,
			completed: false,
		};
		setTasks((prev) => [...prev, task]);
	}, []);

	/**
	 * 指定したIDのタスクを開始し、それ以外を停止する
	 * タイマーも連動して開始する
	 */
	const startTask = useCallback((taskId: number) => {
		setTasks((prev) => {
			const task = prev.find(t => t.id === taskId);
			if (task) {
				setActiveTaskId(taskId);
				setTargetPomodoros(task.pomodoroCount);
				setIsTimerRunning(true);
				setShowEvaluation(false);
				return prev.map((t) => ({
					...t,
					isRunning: t.id === taskId,
				}));
			}
			return prev;
		});
	}, []);

	/**
	 * 指定したIDのタスクの実行状態を解除し、タイマーを停止する
	 */
	const stopTask = useCallback((taskId: number) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, isRunning: false } : task
			)
		);
		if (activeTaskId === taskId) {
			setIsTimerRunning(false);
		}
	}, [activeTaskId]);

	/**
	 * タイマーを現在のモードの初期時間にリセットし、停止する
	 */
	const resetTimer = useCallback(() => {
		setMode(currentMode => {
			if (currentMode === "work") {
				setTimeLeft(WORK_TIME);
			} else {
				setTimeLeft(BREAK_TIME);
			}
			return currentMode;
		});
		setIsTimerRunning(false);
	}, []);

	/**
	 * タスクの達成度を評価し、実績として保存する
	 */
	const handleRatingSelect = useCallback((rating: 1 | 2 | 3) => {
		if (!activeTaskId) return;

		const task = tasks.find(t => t.id === activeTaskId);
		if (task) {
			const achievement: Achievement = {
				taskName: task.title,
				plannedPomodoros: task.pomodoroCount,
				rating,
			};

			// 実績の保存（副作用を updater の外で実行）
			if (typeof window !== 'undefined') {
				const storedAchievements = localStorage.getItem("achievements");
				const currentAchievements: Achievement[] = storedAchievements ? JSON.parse(storedAchievements) : [];
				const newAchievements = [...currentAchievements, achievement];
				localStorage.setItem("achievements", JSON.stringify(newAchievements));
				setAchievements(newAchievements);
				if (DEBUG) console.log("Updated achievements:", newAchievements);
			}

			setTasks(prev => prev.filter(t => t.id !== activeTaskId));
			setPomodoroCount(0);
		}

		setShowEvaluation(false);
		resetTimer();
		setActiveTaskId(null);
	}, [activeTaskId, tasks, resetTimer, DEBUG]);

	/**
	 * 指定したIDのタスクを更新する
	 */
	const editTask = useCallback((id: number, updates: Partial<NewTask>) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, ...updates } : task
			)
		);
	}, []);

	/**
	 * 指定したIDのタスクを削除する
	 * 実行中であればタイマーも停止する
	 */
	const deleteTask = useCallback((id: number) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
		if (activeTaskId === id) {
			setIsTimerRunning(false);
			setActiveTaskId(null);
		}
	}, [activeTaskId]);

	/**
	 * achievementsを初期化する
	 */
	const clearAchievements = useCallback(() => {
		localStorage.removeItem("achievements");
		setAchievements([]);
	}, []);

	/**
	 * コンテキストに渡す値をメモ化
	 */
	const value = useMemo(
		() => ({
			tasks, addTask, startTask, stopTask, editTask, deleteTask,
			mode, setMode, timeLeft, setTimeLeft, isTimerRunning, setIsTimerRunning,
			pomodoroCount, setPomodoroCount, targetPomodoros, setTargetPomodoros,
			totalFocusSeconds, setTotalFocusSeconds, activeTaskId, resetTimer,
			handleRatingSelect, showEvaluation, setShowEvaluation, achievements, clearAchievements
		}),
		[
			tasks, addTask, startTask, stopTask, editTask, deleteTask,
			mode, timeLeft, isTimerRunning, pomodoroCount, targetPomodoros,
			totalFocusSeconds, activeTaskId, resetTimer, handleRatingSelect, showEvaluation, achievements, clearAchievements
		]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/**
 * 各コンポーネントからTaskContext利用するためのカスタムフック
 */
export function useTasks() {
	const ctx = useContext(TaskContext);
	if (!ctx) {
		throw new Error("useTasks must be used within TaskProvider");
	}
	return ctx;
}
