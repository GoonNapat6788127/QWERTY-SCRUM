"use client";

import dynamic from "next/dynamic";

const RescueMap = dynamic(() => import("@/components/RescueMap"), {
  ssr: false,
  loading: () => <div className="rescue-map rounded-2xl border border-line bg-panel" />,
});

export function RescueMapFrame() {
  return <RescueMap />;
}
