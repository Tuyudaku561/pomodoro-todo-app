type TimerControlsProps = {
  // 関数: Start ボタンの処理
  onStart: () => void;

  // 関数: Pause ボタンの処理
  onPause: () => void;

  // 関数: Reset ボタンの処理
  onReset: () => void;
};

export default function TimerControls({
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="mt-10 flex justify-center gap-4">
      {/* Start ボタン */}
      <button
        onClick={onStart}
        className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
      >
        Start
      </button>

      {/* Pause ボタン */}
      <button
        onClick={onPause}
        className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
      >
        Pause
      </button>

      {/* Reset ボタン */}
      <button
        onClick={onReset}
        className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
      >
        Reset
      </button>
    </div>
  );
}