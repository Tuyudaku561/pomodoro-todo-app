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
    <div className="flex justify-center gap-4">
      {/* Start ボタン */}
      <button
        onClick={onStart}
        className="w-26 rounded-[4px] bg-[#4a90e2] py-2.5 font-bold text-white shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Start
      </button>

      {/* Pause ボタン */}
      <button
        onClick={onPause}
        className="w-26 rounded-[4px] bg-[#64748b] py-2.5 font-bold text-white shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Pause
      </button>

      {/* Reset ボタン */}
      <button
        onClick={onReset}
        className="w-26 rounded-[4px] bg-[#94a3b8] py-2.5 font-bold text-white shadow-sm transition-opacity duration-150 hover:opacity-90"
      >
        Reset
      </button>
    </div>
  );
}