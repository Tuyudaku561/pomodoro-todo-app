"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
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
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const TASKS_STORAGE_KEY = "pomodoro-tasks";
const TIMER_STORAGE_KEY = "pomodoro-timer";

export function TaskProvider({ children }: { children: React.ReactNode }) {
	const [tasks, setTasks] = useState<Task[]>([]);
	
	// タイマーの状態
	const [mode, setMode] = useState<TimerMode>("work");
	const [timeLeft, setTimeLeft] = useState(WORK_TIME);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [pomodoroCount, setPomodoroCount] = useState(0);
	const [targetPomodoros, setTargetPomodoros] = useState(4);
	const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
	const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
	const [showEvaluation, setShowEvaluation] = useState(false);

	// ローカルストレージからタスクを読み込む
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
			if (storedTasks) {
				try {
					setTasks(JSON.parse(storedTasks));
				} catch (error) {
					console.error("Failed to parse tasks:", error);
				}
			}

			const storedTimer = localStorage.getItem(TIMER_STORAGE_KEY);
			if (storedTimer) {
				try {
					const timerData = JSON.parse(storedTimer);
					setMode(timerData.mode || "work");
					setTimeLeft(timerData.timeLeft || WORK_TIME);
					setIsTimerRunning(timerData.isTimerRunning || false);
					setPomodoroCount(timerData.pomodoroCount || 0);
					setTargetPomodoros(timerData.targetPomodoros || 4);
					setTotalFocusSeconds(timerData.totalFocusSeconds || 0);
					setActiveTaskId(timerData.activeTaskId || null);
				} catch (error) {
					console.error("Failed to parse timer:", error);
				}
			}
		}
	}, []);

	// データの保存
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
		}
	}, [tasks]);

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
			if (mode === "work") {
				const nextCount = pomodoroCount + 1;
				setPomodoroCount(nextCount);

				if (nextCount >= targetPomodoros) {
					setIsTimerRunning(false);
					setShowEvaluation(true);
					// タスクの実行状態を解除
					if (activeTaskId) {
						setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, isRunning: false } : t));
					}
					return;
				}

				setMode("break");
				setTimeLeft(BREAK_TIME);
			} else {
				setMode("work");
				setTimeLeft(WORK_TIME);
			}
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
			if (mode === "work") {
				setTotalFocusSeconds((prev) => prev + 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isTimerRunning, timeLeft, mode, pomodoroCount, targetPomodoros, activeTaskId]);

	const addTask = (newTask: NewTask) => {
		const task: Task = {
			...newTask,
			id: Date.now(),
			isRunning: false,
			completed: false,
		};
		setTasks((prev) => [...prev, task]);
	};

	const startTask = (taskId: number) => {
		const task = tasks.find(t => t.id === taskId);
		if (task) {
			setTasks((prev) =>
				prev.map((t) => ({
					...t,
					isRunning: t.id === taskId,
				}))
			);
			setActiveTaskId(taskId);
			setTargetPomodoros(task.pomodoroCount);
			setIsTimerRunning(true);
			// 既に開始している場合はリセットしない仕様（継続）
		}
	};

	const stopTask = (taskId: number) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, isRunning: false } : task
			)
		);
		if (activeTaskId === taskId) {
			setIsTimerRunning(false);
		}
	};

	const resetTimer = () => {
		if (mode === "work") {
			setTimeLeft(WORK_TIME);
		} else {
			setTimeLeft(BREAK_TIME);
		}
		setIsTimerRunning(false);
	};

	const handleRatingSelect = (rating: 1 | 2 | 3) => {
		if (!activeTaskId) return;

		const task = tasks.find(t => t.id === activeTaskId);
		if (!task) return;

		const achievement: Achievement = {
			taskName: task.title,
			plannedPomodoros: task.pomodoroCount,
			actualPomodoros: pomodoroCount,
			rating,
		};

		const storedAchievements = localStorage.getItem("achievements");
		const achievements: Achievement[] = storedAchievements ? JSON.parse(storedAchievements) : [];
		achievements.push(achievement);
		localStorage.setItem("achievements", JSON.stringify(achievements));

		setShowEvaluation(false);
		// 必要に応じてリセット
		setPomodoroCount(0);
		setActiveTaskId(null);
	};

	const editTask = (id: number, updates: Partial<NewTask>) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, ...updates } : task
			)
		);
	};

	const deleteTask = (id: number) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
		if (activeTaskId === id) {
			setIsTimerRunning(false);
			setActiveTaskId(null);
		}
	};

	const value = useMemo(
		() => ({ 
			tasks, addTask, startTask, stopTask, editTask, deleteTask,
			mode, setMode, timeLeft, setTimeLeft, isTimerRunning, setIsTimerRunning,
			pomodoroCount, setPomodoroCount, targetPomodoros, setTargetPomodoros,
			totalFocusSeconds, setTotalFocusSeconds, activeTaskId, resetTimer,
			handleRatingSelect, showEvaluation, setShowEvaluation
		}),
		[tasks, mode, timeLeft, isTimerRunning, pomodoroCount, targetPomodoros, totalFocusSeconds, activeTaskId, showEvaluation]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
	const ctx = useContext(TaskContext);
	if (!ctx) {
		throw new Error("useTasks must be used within TaskProvider");
	}
	return ctx;
}
