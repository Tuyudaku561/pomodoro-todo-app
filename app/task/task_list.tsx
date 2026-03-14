import type { Task } from "./types";

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
	return (
		<div>
			<h2>タスク一覧</h2>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						{task.title} - ポモドーロ数: {task.pomodoroCount}
					</li>
				))}
			</ul>
		</div>
	);
}