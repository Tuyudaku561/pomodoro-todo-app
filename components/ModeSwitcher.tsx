type ModeSwitcherProps = {
	// 関数: Work ボタンを押したときの処理
	onWorkClick: () => void;

	// 関数: Break ボタンを押したときの処理
	onBreakClick: () => void;
};

export default function ModeSwitcher({
	onWorkClick,
	onBreakClick,
}: ModeSwitcherProps) {
	return (
		<div className="mb-6 flex justify-center gap-4">
			{/* Work ボタン */}
			<button
				onClick={onWorkClick}
				className="rounded-full bg-red-500 px-5 py-2 font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
			>
				Work
			</button>

			{/* Break ボタン */}
			<button
				onClick={onBreakClick}
				className="rounded-full bg-green-500 px-5 py-2 font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
			>
				Break
			</button>
		</div>
	);
}