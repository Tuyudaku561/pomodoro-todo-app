"use client";

import { useState, useEffect } from "react";
import TimerDisplay from "../../components/TimerDisplay";
import ModeSwitcher from "../../components/ModeSwitcher";
import TimerControls from "../../components/TimerControls";

export default function TimerPage() {
  const [mode, setMode] = useState<"work" | "break">("work");// タイマーのモード（work か break）
  const [timeLeft, setTimeLeft] = useState(10);// 残り時間（秒）
  const [isRunning, setIsRunning] = useState(false);// タイマーが動いているかどうか
  const [pomodoroCount, setPomodoroCount] = useState(0);// 完了したポモドーロ回数
	const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);// 累計集中時間（秒）

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
        // Work 完了時だけポモドーロ回数を増やす
        setPomodoroCount((prev) => prev + 1);
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
  }, [isRunning, timeLeft, mode]);

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

        {/* 時計表示 */}
        <TimerDisplay
          mode={mode}
          timeLeft={timeLeft}
          isRunning={isRunning}
          pomodoroCount={pomodoroCount}
					totalFocusSeconds={totalFocusSeconds}
          formatTime={formatTime}
					formatFocusMinutes={formatFocusMinutes}
        />

        {/* Start / Pause / Reset */}
        <TimerControls
          onStart={() => setIsRunning(true)}
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