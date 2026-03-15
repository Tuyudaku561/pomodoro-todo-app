type TimerDisplayProps = {
  mode: "work" | "break";
  timeLeft: number;
  isRunning: boolean;
  pomodoroCount: number;
  targetPomodoros: number;
  totalFocusSeconds: number;
  formatTime: (seconds: number) => string;
  formatFocusMinutes: (seconds: number) => number;
  variant?: "clock" | "stats" | "all";
};

export default function TimerDisplay({
  mode,
  timeLeft,
  isRunning,
  pomodoroCount,
  targetPomodoros,
  totalFocusSeconds,
  formatTime,
  formatFocusMinutes,
  variant = "all",
}: TimerDisplayProps) {
  const showClock = variant === "all" || variant === "clock";
  const showStats = variant === "all" || variant === "stats";

  return (
    <div className="flex flex-col items-center w-full">
      {showClock && (
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
        </>
      )}

      {showStats && (
        <div className={variant === "stats" ? "w-full text-left space-y-2" : "mt-4 text-center"}>
          <p className="text-gray-700 font-medium">
            Pomodoros completed: <span className="text-gray-900">{pomodoroCount} / {targetPomodoros}</span>
          </p>

          {pomodoroCount >= targetPomodoros && (
            <p className="text-green-600 font-semibold">
              Goal reached! Timer is stopped.
            </p>
          )}

          <p className="text-gray-700 font-medium">
            Total focus time today: <span className="text-gray-900">{formatFocusMinutes(totalFocusSeconds)} min</span>
          </p>
        </div>
      )}
    </div>
  );
}