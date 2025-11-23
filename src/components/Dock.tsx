import { type JSX, useRef } from "react";
import type { DockApp } from "#types";
import { dockApps } from "#constants";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Dock(): JSX.Element {
  const dockref = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const dock = dockref.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 + intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const resetIcons = () =>
      icons.forEach((icon) =>
        gsap.to(icon, { scale: 1, y: 0, duration: 0.3, ease: "power1.out" })
      );

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);
    () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = ({ id, canOpen }: { id: string; canOpen: boolean }) => {};

  return (
    <section id="dock">
      <div ref={dockref} className="dock-container">
        {dockApps.map(
          ({ id, name, icon, canOpen }: DockApp): JSX.Element => (
            <div className="relative flex justify-center" key={id}>
              <button
                type="button"
                className="dock-icon"
                aria-label={name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={name}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={() => toggleApp({ id, canOpen })}
              >
                <img
                  src={`/images/${icon}`}
                  loading="lazy"
                  alt={`${name}-icon`}
                  className={canOpen ? "" : "opacity-60"}
                />
              </button>
            </div>
          )
        )}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
}
