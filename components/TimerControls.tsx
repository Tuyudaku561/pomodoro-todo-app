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
        className="rounded-[4px] bg-[#4a90e2] px-6 py-3 font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Start
      </button>

      {/* Pause ボタン */}
      <button
        onClick={onPause}
        className="rounded-[4px] bg-[#ffc107] px-6 py-3 font-semibold text-black shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Pause
      </button>

      {/* Reset ボタン */}
      <button
        onClick={onReset}
        className="rounded-[4px] bg-[#dc3545] px-6 py-3 font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Reset
      </button>
    </div>
  );
}