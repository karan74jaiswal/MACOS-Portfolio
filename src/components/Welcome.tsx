import { type JSX, useRef } from "react";
import type { FontWeight } from "#types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FontWeights {
  [key: string]: FontWeight;
}

const FONT_WEIGHTS: FontWeights = {
  subTitle: {
    min: 100,
    max: 400,
    default: 100,
  },
  title: {
    min: 400,
    max: 900,
    default: 400,
  },
};

const renderText = (
  text: string,
  className: string,
  baseWeight: number = 400
): JSX.Element[] =>
  [...text].map(
    (ch: string, i): JSX.Element => (
      <span
        key={i}
        className={className}
        style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    )
  );

const setupTextHover = (
  container: HTMLElement | null,
  type: keyof typeof FONT_WEIGHTS
): void | (() => void) => {
  if (!container) return;
  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (
    letter: HTMLSpanElement,
    weight: number,
    duration = 0.25
  ) =>
    gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });

  const handleMouseMove = (e: MouseEvent) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;
    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 20000);
      animateLetter(letter, min + (max - min) * intensity);
    });
  };
  const handleMouseLeave = () =>
    letters.forEach((letter) => animateLetter(letter, base, 0.3));

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

export default function Welcome(): JSX.Element {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subTitleRef.current, "subTitle");

    return () => {
      titleCleanup && titleCleanup();
      subtitleCleanup && subtitleCleanup();
    };
  }, []);
  return (
    <section id="welcome">
      <p ref={subTitleRef}>
        {renderText(
          "Hey, I'm Kartikey! Welcome to my",
          "text-3xl font-georama",
          100
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText("portfolio", "text-9xl italic font-georama")}
      </h1>
      <div className="small-screen">
        <p>This portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
}
