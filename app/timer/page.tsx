"use client";

import TimerDisplay from "../../components/TimerDisplay";
import ModeSwitcher from "../../components/ModeSwitcher";
import TimerControls from "../../components/TimerControls";
import { useTasks } from "../task/TaskContext";
import { useRouter } from "next/navigation";

export default function TimerPage() {
  const router = useRouter();
  const { tasks, activeTaskId } = useTasks();
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const {
    mode,
    timeLeft,
    isTimerRunning, setIsTimerRunning,
    pomodoroCount,
    targetPomodoros,
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
    <main className="min-h-screen bg-[#f5f5f5] px-8 py-8 flex items-center justify-center">
      <div className="mx-auto w-full max-w-[850px] rounded-[8px] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* 左側: 時計表示 */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <TimerDisplay
              mode={mode}
              timeLeft={timeLeft}
              isRunning={isTimerRunning}
              pomodoroCount={pomodoroCount}
              targetPomodoros={targetPomodoros}
              totalFocusSeconds={totalFocusSeconds}
              formatTime={formatTime}
              formatFocusMinutes={formatFocusMinutes}
              variant="clock"
            />
          </div>

          {/* 右側: 情報とコントロール */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4">
              {activeTask?.title || "タイマー"}
            </h1>

            {/* 達成度評価 */}
            {showEvaluation && (
              <div className="mt-8 rounded-[8px] bg-[#f0faff] border-[1px] border-dashed border-[#4a90e2] px-1 py-6 text-center animate-fadeIn">
                <h2 className="mb-4 text-[1.1rem] font-semibold text-[#333]">タスクの達成度を評価してください</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => {
                      handleRatingSelect(1);
                      router.push("/task");
                    }}
                    className="w-24 rounded-[4px] bg-[#dc3545] py-2.5 text-white hover:opacity-90 transition-opacity font-bold text-sm"
                  >
                    未達成
                  </button>
                  <button
                    onClick={() => {
                      handleRatingSelect(2);
                      router.push("/task");
                    }}
                    className="w-24 rounded-[4px] bg-[#ffc107] py-2.5 text-black hover:opacity-90 transition-opacity font-bold text-sm"
                  >
                    概ね達成
                  </button>
                  <button
                    onClick={() => {
                      handleRatingSelect(3);
                      router.push("/task");
                    }}
                    className="w-24 rounded-[4px] bg-[#28a745] py-2.5 text-white hover:opacity-90 transition-opacity font-bold text-sm"
                  >
                    完全達成
                  </button>
                </div>
              </div>
            )}

            <TimerDisplay
              mode={mode}
              timeLeft={timeLeft}
              isRunning={isTimerRunning}
              pomodoroCount={pomodoroCount}
              targetPomodoros={targetPomodoros}
              totalFocusSeconds={totalFocusSeconds}
              formatTime={formatTime}
              formatFocusMinutes={formatFocusMinutes}
              variant="stats"
            />

            <div>
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
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
