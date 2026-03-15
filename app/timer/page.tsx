"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TimerDisplay from "../../components/TimerDisplay";
import ModeSwitcher from "../../components/ModeSwitcher";
import TimerControls from "../../components/TimerControls";
import type { Task } from "../task/types";

export default function TimerPage() {
	const searchParams = useSearchParams();
	const taskId = searchParams.get('taskId');

	const TIMER_STORAGE_KEY = "pomodoro-timer";

	const [mode, setMode] = useState<"work" | "break">("work");// タイマーのモード（work か break）
	const [timeLeft, setTimeLeft] = useState(25 * 60);// 残り時間（秒）
	const [isRunning, setIsRunning] = useState(false);// タイマーが動いているかどうか
	const [pomodoroCount, setPomodoroCount] = useState(0);// 完了したポモドーロ回数
	const [targetPomodoros, setTargetPomodoros] = useState(4);// 目標ポモドーロ数
	const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);// 累計集中時間（秒）

	// ローカルストレージからタイマーの状態を読み込む
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedTimer = localStorage.getItem(TIMER_STORAGE_KEY);
			if (storedTimer) {
				try {
					const timerData = JSON.parse(storedTimer);
					setMode(timerData.mode || "work");
					setTimeLeft(timerData.timeLeft || 25 * 60);
					setIsRunning(timerData.isRunning || false);
					setPomodoroCount(timerData.pomodoroCount || 0);
					setTargetPomodoros(timerData.targetPomodoros || 4);
					setTotalFocusSeconds(timerData.totalFocusSeconds || 0);
				} catch (error) {
					console.error("Failed to parse timer from localStorage:", error);
				}
			}
		}
	}, []);

	// タイマーの状態が変更されたらローカルストレージに保存
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const timerData = {
				mode,
				timeLeft,
				isRunning,
				pomodoroCount,
				targetPomodoros,
				totalFocusSeconds,
			};
			localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerData));
		}
	}, [mode, timeLeft, isRunning, pomodoroCount, targetPomodoros, totalFocusSeconds]);

	// taskIdがある場合、タスクを取得して設定
	useEffect(() => {
		if (taskId && typeof window !== 'undefined') {
			const storedTasks = localStorage.getItem("pomodoro-tasks");
			if (storedTasks) {
				try {
					const tasks: Task[] = JSON.parse(storedTasks);
					const task = tasks.find(t => t.id === Number(taskId));
					if (task) {
						setTargetPomodoros(task.pomodoroCount);
						setIsRunning(true);
					}
				} catch (error) {
					console.error("Failed to parse tasks:", error);
				}
			}
		}
	}, [taskId]);

  // 関数: 秒を mm:ss に変換する
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;

    const mm = String(minutes).padStart(2, "0");
    const ss = String(remainSeconds).padStart(2, "0");

    return `${mm}:${ss}`;
  };
	// 関数: 累計集中時間を分に変換する
	const formatFocusMinutes = (seconds: number) => {
		return Math.floor(seconds / 60);
	};

  // React の機能:
  // isRunning, timeLeft, mode の変化に応じてタイマーを動かす
  useEffect(() => {
    // タイマーが止まっているなら何もしない
    if (!isRunning) return;

    // 0秒以下になったらモード切り替え
    if (timeLeft <= 0) {
      if (mode === "work") {
        const nextCount = pomodoroCount + 1;
        setPomodoroCount(nextCount);

        if (nextCount >= targetPomodoros) {
          // 目標到達で一旦停止
          setIsRunning(false);
          return;
        }

        // Break に切り替え
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        // Work に戻す
        setMode("work");
        setTimeLeft(25 * 60);
      }
      return;
    }

    // 1秒ごとに timeLeft を 1 減らす
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
			// Work モードのときだけ集中時間を増やす
			if (mode === "work"){
				setTotalFocusSeconds((prev) => prev + 1);
			}
    }, 1000);

    // 前の interval を消す
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, pomodoroCount, targetPomodoros]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
        {/* タイトル */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Pomodoro Timer
        </h1>

        {/* Work / Break 切り替え */}
        <ModeSwitcher
          onWorkClick={() => {
            setMode("work");
            setTimeLeft(25 * 60);
            setIsRunning(false);
          }}
          onBreakClick={() => {
            setMode("break");
            setTimeLeft(5 * 60);
            setIsRunning(false);
          }}
        />

        {/* 目標ポモドーロ数設定 */}
        <div className="mb-4 flex justify-center gap-2 text-sm">
          <label className="flex items-center gap-2 text-gray-700">
            Goal Pomodoros:
            <input
              type="number"
              min={1}
              value={targetPomodoros}
              onChange={(e) => {
                const parsed = Math.max(1, Number(e.target.value) || 1);
                setTargetPomodoros(parsed);
              }}
              className="w-16 rounded border px-2 py-1 text-center"
            />
          </label>
        </div>

        {/* 時計表示 */}
        <TimerDisplay
          mode={mode}
          timeLeft={timeLeft}
          isRunning={isRunning}
          pomodoroCount={pomodoroCount}
          targetPomodoros={targetPomodoros}
          totalFocusSeconds={totalFocusSeconds}
          formatTime={formatTime}
          formatFocusMinutes={formatFocusMinutes}
        />

        {/* Start / Pause / Reset */}
        <TimerControls
          onStart={() => {
            if (pomodoroCount >= targetPomodoros) {
              return;
            }
            setIsRunning(true);
          }}
          onPause={() => setIsRunning(false)}
          onReset={() => {
            // 今のモードに応じた時間に戻す
            if (mode === "work") {
              setTimeLeft(25 * 60);
            } else {
              setTimeLeft(5 * 60);
            }

            setIsRunning(false);
          }}
        />
      </div>
    </main>
  );
}