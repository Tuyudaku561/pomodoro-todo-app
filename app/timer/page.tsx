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
    <main className="min-h-screen bg-[#f5f5f5] px-8 py-8">
      <div className="mx-auto max-w-[800px] rounded-[8px] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        {/* タイトル */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          {activeTask?.title || "タイマー"}
        </h1>

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
          <div className="mt-8 rounded-[8px] bg-[#f0faff] border-[1px] border-dashed border-[#4a90e2] p-6 text-center animate-fadeIn">
            <h2 className="mb-4 text-[1.1rem] font-semibold text-[#333]">タスクの達成度を評価してください</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleRatingSelect(1);
                  router.push("/task");
                }}
                className="rounded-[4px] bg-[#dc3545] px-4 py-2 text-white hover:opacity-90 transition-opacity font-bold"
              >
                1: 期待を下回る
              </button>
              <button
                onClick={() => {
                  handleRatingSelect(2);
                  router.push("/task");
                }}
                className="rounded-[4px] bg-[#ffc107] px-4 py-2 text-black hover:opacity-90 transition-opacity font-bold"
              >
                2: 期待通り
              </button>
              <button
                onClick={() => {
                  handleRatingSelect(3);
                  router.push("/task");
                }}
                className="rounded-[4px] bg-[#28a745] px-4 py-2 text-white hover:opacity-90 transition-opacity font-bold"
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
