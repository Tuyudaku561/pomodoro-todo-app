/**
 * タスクの型定義
 * - id: タスクの一意な識別子
 * - title: タスクのタイトル
 * - completed: タスクが完了しているかどうか
 * - pomodoroCount: タスクに割り当てられたポモドーロの数
 * - isRunning: タイマーが起動中かどうか (現在はフラグのみ)
 */
export type Task = {
	id: number;
	title: string;
	completed: boolean;
	pomodoroCount: number;
	isRunning: boolean;
}

/**
 * 達成度データ（JSON）の型
 * - taskName: 過去のタスク名
 * - plannedPomodoros: 計画されたポモドーロ数
 * - actualPomodoros: 実際に費やしたポモドーロ数
 * - rating: 3段階評価 (1: 期待を下回る, 2: 期待通り, 3: 期待を上回る)
 */
export type Achievement = {
	taskName: string;
	plannedPomodoros: number;
	actualPomodoros: number;
	rating: 1 | 2 | 3;
}