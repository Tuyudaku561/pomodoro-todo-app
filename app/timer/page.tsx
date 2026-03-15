"use client";

import TimerDisplay from "../../components/TimerDisplay";
import ModeSwitcher from "../../components/ModeSwitcher";
import TimerControls from "../../components/TimerControls";
import { useTasks } from "../task/TaskContext";
import {useRouter} from "next/navigation";

const WORK_TIME = 10;
const BREAK_TIME = 10;

export default function TimerPage() {
  const router = useRouter();
  const {tasks, activeTaskId} = useTasks();
  const activeTask = tasks.find((t) => t.id=== activeTaskId);
	const {
		mode, setMode,
		timeLeft, setTimeLeft,
		isTimerRunning, setIsTimerRunning,
		pomodoroCount,
		targetPomodoros, setTargetPomodoros,
		totalFocusSeconds,
		resetTimer,
		handleRatingSelect,
		showEvaluation,
	} = useTasks();

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

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
        {/* タイトル */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          {activeTask?.title}
        </h1>

        {/* Work / Break 切り替え */}
        <ModeSwitcher
          onWorkClick={() => {
            setMode("work");
            setTimeLeft(WORK_TIME);
            setIsTimerRunning(false);
          }}
          onBreakClick={() => {
            setMode("break");
            setTimeLeft(BREAK_TIME);
            setIsTimerRunning(false);
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
          isRunning={isTimerRunning}
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
            setIsTimerRunning(true);
          }}
          onPause={() => setIsTimerRunning(false)}
          onReset={resetTimer}
        />
        
        {/* 達成度評価 */}
        {showEvaluation && (
          <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">タスクの達成度を評価してください</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleRatingSelect(1);
                  router.push("/task");
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
              >
                1: 期待を下回る
              </button>
              <button
                onClick={() => {
                  handleRatingSelect(2);
                  router.push("/task");
                }}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition-colors"
              >
                2: 期待通り
              </button>
              <button
                onClick={() => {
                  handleRatingSelect(3);
                  router.push("/task");
                }}
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition-colors"
              >
                3: 期待を上回る
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
