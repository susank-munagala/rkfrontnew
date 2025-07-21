// hooks/useZoomOnScroll.js
import { useRef } from "react";
import { useInView, useScroll, useTransform } from "framer-motion";

export default function useZoomOnScroll(start = 1, end = 1.1) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" }); // triggers when section is 60% visible
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [start, end]);

  return { ref, inView, scale: inView ? scale : start };
}
