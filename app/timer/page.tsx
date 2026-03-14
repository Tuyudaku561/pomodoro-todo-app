"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTasks } from "../task/TaskContext";

export default function TimerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tasks, stopTask } = useTasks();

  const taskId = Number(searchParams.get("taskId"));
  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    // taskId が無効な場合やタスクが見つからない場合は一覧に戻す
    if (!taskId || !task) {
      router.replace("/task");
    }
  }, [task, taskId, router]);

  if (!task) {
    return null;
  }

  const handleStop = () => {
    stopTask(task.id);
    router.push("/task");
  };

  return (
    <div>
      <h2>ポモドーロタイマー</h2>
      <p>タスク: {task.title}</p>
      <p>ポモドーロ数: {task.pomodoroCount}</p>
      <button onClick={handleStop}>タイマー終了</button>
    </div>
  );
}
