/**
 * タスクの型定義
 * - id: タスクの一意な識別子
 * - title: タスクのタイトル
 * - completed: タスクが完了しているかどうか
 * - pomodoroCount: タスクに割り当てられたポモドーロの数
 */
export type Task = {
	id: number;
	title: string;
	completed: boolean;
	pomodoroCount: number;
}