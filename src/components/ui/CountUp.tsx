"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/** Animates a number from its previous value to the new one */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const controls = animate(from.current, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setShown });
    from.current = value;
    return () => controls.stop();
  }, [value]);

  return <>{format(shown)}</>;
}
