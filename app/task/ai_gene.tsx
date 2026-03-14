"use client";

import { useEffect, useState } from "react";

/**
 * AIによるタスク助言を生成するコンポーネント
 */
interface AiGeneProps {
  taskInput: string;
}

export default function AiGene({ taskInput }: AiGeneProps) {
  const [suggestion, setSuggestion] = useState("AIによる助言");

  useEffect(() => {
    // 将来的にAI SDKをここで呼び出して助言を生成
    // 例: const response = await aiSDK.generateSuggestion(taskInput);
    // setSuggestion(response.suggestion);

    // 今はプレースホルダー
    if (taskInput.trim()) {
      setSuggestion(`「${taskInput}」のタスクについて、AIが助言を生成中...`);
    } else {
      setSuggestion("AIによる助言");
    }
  }, [taskInput]);

  return (
    <div className="ai-suggestion">
      {suggestion}
    </div>
  );
}