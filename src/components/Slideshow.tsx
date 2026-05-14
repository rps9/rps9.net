import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
	src: string;
	caption?: string;
};

type Props = {
	slides: Slide[];
};

export default function Slideshow({ slides }: Props) {
    const autoIntervalMs = 5000; // Change slide automatically every 5 seconds
	const [idx, setIdx] = useState(0);
	const timerRef = useRef<number | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const go = useCallback((nextIndex: number) => {
		setIdx(() => (nextIndex + slides.length) % slides.length);
	}, [slides.length]);

	const next = useCallback(() => go(idx + 1), [go, idx]);
	const prev = useCallback(() => go(idx - 1), [go, idx]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);

	// Move to next slide after time
	useEffect(() => {
		if (!autoIntervalMs) return;
		if (timerRef.current) window.clearInterval(timerRef.current);
		timerRef.current = window.setInterval(next, autoIntervalMs);
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, [next, autoIntervalMs]);

	// Basic 
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		let startX = 0;
		let endX = 0;

		const down = (e: PointerEvent) => {
			startX = e.clientX;
		};
		const up = (e: PointerEvent) => {
			endX = e.clientX;
			const delta = endX - startX;
			if (Math.abs(delta) > 40) {
				if (delta < 0) {
					next();
				} else {
					prev();
				}
			}
		};

		el.addEventListener("pointerdown", down);
		el.addEventListener("pointerup", up);
		return () => {
			el.removeEventListener("pointerdown", down);
			el.removeEventListener("pointerup", up);
		};
	}, [next, prev]);

	if (!slides?.length) return null;

	return (
		<div
			ref={containerRef}
			className="relative mx-auto my-10 w-full max-w-4xl overflow-hidden border border-black bg-white"
			aria-roledescription="carousel"
		>
			{/* Image */}
			<div className="relative">
				<img
					src={slides[idx].src}
					className="w-full h-80 md:h-[32rem] object-cover"
					loading="lazy"
				/>
				{/* Caption */}
				{slides[idx].caption && (
					<div className="absolute bottom-0 left-0 border-r border-t border-black bg-white px-4 py-3">
						<p className="text-sm font-bold uppercase tracking-wide text-black md:text-base">{slides[idx].caption}</p>
					</div>
				)}
			</div>

			{/* Back and forth controls */}
			<button
				type="button"
				onClick={prev}
				aria-label="Previous slide"
				className="absolute left-3 top-1/2 -translate-y-1/2 border border-black bg-white p-2 transition hover:bg-black hover:text-white"
			>
				<ChevronLeft />
			</button>
			<button
				type="button"
				onClick={next}
				aria-label="Next slide"
				className="absolute right-3 top-1/2 -translate-y-1/2 border border-black bg-white p-2 transition hover:bg-black hover:text-white"
			>
				<ChevronRight />
			</button>

			{/* Navigation dots at the bottom */}
			<div className="flex items-center justify-center gap-2 border-t border-black bg-white py-3">
				{slides.map((_, i) => (
					<button
						key={i}
						onClick={() => go(i)}
						aria-label={`Go to slide ${i + 1}`}
						className={`h-2 border border-black transition ${
							i === idx ? "w-8 bg-[#b21f2d]" : "w-2 bg-white hover:bg-neutral-200"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
