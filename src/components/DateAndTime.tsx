import dayjs from "dayjs";
import { type JSX, useState, useEffect } from "react";
export default function DateAndTime(): JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(
    dayjs().format("ddd D MMM h:mm A")
  );

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(dayjs().format("ddd D MMM h:mm A")),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return <time>{currentTime}</time>;
}
