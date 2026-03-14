type TimerDisplayProps = {
  mode: "work" | "break";
  timeLeft: number;
  isRunning: boolean;
  pomodoroCount: number;
  totalFocusSeconds: number;
  formatTime: (seconds: number) => string;
  formatFocusMinutes: (seconds: number) => number;
};

export default function TimerDisplay({
  mode,
  timeLeft,
  isRunning,
  pomodoroCount,
  totalFocusSeconds,
  formatTime,
  formatFocusMinutes,
}: TimerDisplayProps) {
  return (
    <>
      <p className="mb-4 text-center text-lg font-medium text-gray-700">
        {mode === "work" ? "Work Time" : "Break Time"}
      </p>

      <div className="flex justify-center">
        <div
          className={`flex h-64 w-64 items-center justify-center rounded-full border-8 text-5xl font-bold text-gray-800 shadow-inner ${
            mode === "work"
              ? "border-red-400 bg-red-50"
              : "border-green-400 bg-green-50"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      <p className="mt-6 text-center text-gray-600">
        {timeLeft <= 0 ? "Time's up!" : isRunning ? "Running..." : "Paused"}
      </p>

      <p className="mt-4 text-center text-gray-700">
        Pomodoros completed: {pomodoroCount}
      </p>

      <p className="mt-2 text-center text-gray-700">
        Total focus time today: {formatFocusMinutes(totalFocusSeconds)} min
      </p>
    </>
  );
}