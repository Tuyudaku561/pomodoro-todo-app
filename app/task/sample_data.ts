import { Achievement } from "./types";

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
	{
		taskName: "資料作成",
		plannedPomodoros: 4,
		actualPomodoros: 6,
		rating: 1, // 期待を下回った (時間がかかりすぎた)
	},
	{
		taskName: "メール返信",
		plannedPomodoros: 1,
		actualPomodoros: 1,
		rating: 3, // 期待を上回った (効率的だった)
	},
	{
		taskName: "コードレビュー",
		plannedPomodoros: 2,
		actualPomodoros: 2,
		rating: 2, // 期待通り
	},
	{
		taskName: "リファクタリング",
		plannedPomodoros: 4,
		actualPomodoros: 8,
		rating: 1, // 大幅に遅れた
	},
	{
		taskName: "ミーティング準備",
		plannedPomodoros: 1,
		actualPomodoros: 1,
		rating: 2,
	},
    {
        taskName: "ブログ執筆",
        plannedPomodoros: 4,
        actualPomodoros: 5,
        rating: 2,
    }
];
