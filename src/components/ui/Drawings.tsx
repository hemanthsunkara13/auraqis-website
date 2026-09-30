"use client";

import { motion } from "motion/react";
import type { ServiceVisual } from "@/content/services";
import type { JourneyStep } from "@/content/process";

/**
 * Architectural line drawings (SVG, currentColor) that draw themselves when they enter the viewport.
 * Used for services and the customer journey — conceptual illustrations, not project drawings.
 */

type DrawProps = { className?: string; delay?: number };

function useDraw(delay = 0) {
  return (i: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { pathLength: { duration: 1.6, delay: delay + i * 0.06, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.2, delay: delay + i * 0.06 } },
  });
}

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

const P = motion.path;
const R = motion.rect;
const C = motion.circle;
const L = motion.line;

export function WorkspaceDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  const desks = [0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => ({ x: 70 + c * 62, y: 70 + r * 64 })));
  return (
    <Svg className={className}>
      <R {...d(0)} x={40} y={40} width={320} height={220} />
      <L {...d(1)} x1={300} y1={40} x2={300} y2={260} />
      {desks.map((k, i) => (
        <g key={i}>
          <R {...d(2 + i * 0.3)} x={k.x} y={k.y} width={40} height={22} />
          <C {...d(2.5 + i * 0.3)} cx={k.x + 20} cy={k.y + 34} r={6} />
        </g>
      ))}
      <R {...d(6)} x={312} y={60} width={36} height={70} />
      <C {...d(7)} cx={330} cy={200} r={22} />
      <P {...d(8)} d="M300 150 A 30 30 0 0 1 330 180" />
    </Svg>
  );
}

export function InteriorsDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <L {...d(0)} x1={30} y1={250} x2={370} y2={250} />
      <R {...d(1)} x={50} y={160} width={180} height={90} />
      {[0, 1, 2, 3].map((i) => (
        <L key={i} {...d(2 + i * 0.2)} x1={50 + i * 45} y1={160} x2={50 + i * 45} y2={250} />
      ))}
      <L {...d(3)} x1={46} y1={156} x2={234} y2={156} />
      <R {...d(4)} x={50} y={50} width={180} height={60} />
      {[0, 1, 2].map((i) => (
        <L key={i} {...d(4.5 + i * 0.2)} x1={110 + i * 60} y1={50} x2={110 + i * 60} y2={110} />
      ))}
      <R {...d(5)} x={260} y={40} width={90} height={210} />
      <L {...d(6)} x1={305} y1={40} x2={305} y2={250} />
      <L {...d(7)} x1={298} y1={140} x2={298} y2={160} />
      <L {...d(7.2)} x1={312} y1={140} x2={312} y2={160} />
      <P {...d(8)} d="M120 120 q 20 -10 40 0" />
    </Svg>
  );
}

export function StructureDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  const xs = [60, 140, 220, 300];
  const ys = [250, 180, 110, 40];
  return (
    <Svg className={className}>
      <L {...d(0)} x1={20} y1={260} x2={380} y2={260} />
      {xs.map((x, i) => (
        <R key={x} {...d(1 + i * 0.2)} x={x - 16} y={250} width={32} height={10} />
      ))}
      {xs.map((x, i) => (
        <L key={`c${x}`} {...d(2 + i * 0.2)} x1={x} y1={250} x2={x} y2={40} />
      ))}
      {ys.slice(1).map((y, i) => (
        <R key={y} {...d(3 + i * 0.4)} x={44} y={y} width={272} height={8} />
      ))}
      <P {...d(6)} d="M60 180 L140 110 M140 180 L220 110 M220 180 L300 110" strokeDasharray="4 4" />
      <L {...d(7)} x1={330} y1={40} x2={330} y2={250} />
      <L {...d(7.2)} x1={324} y1={40} x2={336} y2={40} />
      <L {...d(7.2)} x1={324} y1={250} x2={336} y2={250} />
    </Svg>
  );
}

export function InstitutionDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <R {...d(0)} x={40} y={40} width={320} height={220} />
      <L {...d(1)} x1={200} y1={40} x2={200} y2={260} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => <R key={`${r}${c}`} {...d(2 + (r * 3 + c) * 0.15)} x={62 + c * 40} y={90 + r * 38} width={26} height={16} />),
      )}
      <R {...d(4)} x={70} y={56} width={90} height={10} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <C key={i} {...d(5 + i * 0.1)} cx={240 + (i % 3) * 45} cy={110 + Math.floor(i / 3) * 70} r={16} />
      ))}
      <P {...d(7)} d="M200 220 L230 220 L230 260" />
      <P {...d(8)} d="M320 260 L320 240 L350 240" />
    </Svg>
  );
}

export function HospitalityDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  const tables = [
    [90, 90],
    [170, 90],
    [90, 170],
    [170, 170],
    [250, 130],
  ];
  return (
    <Svg className={className}>
      <R {...d(0)} x={40} y={40} width={320} height={220} />
      <P {...d(1)} d="M300 40 L300 200 L360 200" />
      <R {...d(2)} x={306} y={60} width={48} height={120} />
      {tables.map(([x, y], i) => (
        <g key={i}>
          <C {...d(3 + i * 0.3)} cx={x} cy={y} r={18} />
          {[0, 1, 2, 3].map((k) => (
            <C key={k} {...d(3.2 + i * 0.3)} cx={x + Math.cos((k * Math.PI) / 2) * 30} cy={y + Math.sin((k * Math.PI) / 2) * 30} r={6} />
          ))}
        </g>
      ))}
      <P {...d(8)} d="M60 240 q 40 -20 80 0 q 40 20 80 0" />
    </Svg>
  );
}

export function HealthcareDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <R {...d(0)} x={40} y={40} width={320} height={220} />
      <L {...d(1)} x1={40} y1={150} x2={360} y2={150} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <L {...d(2 + i * 0.3)} x1={40 + (i + 1) * 106} y1={40} x2={40 + (i + 1) * 106} y2={150} />
          <R {...d(2.5 + i * 0.3)} x={62 + i * 106} y={60} width={34} height={60} />
          <P {...d(3 + i * 0.3)} d={`M${120 + i * 106} 150 a 26 26 0 0 0 -26 -26`} />
        </g>
      ))}
      <P {...d(6)} d="M190 200 h20 M200 190 v20" strokeWidth={1.6} />
      <R {...d(7)} x={60} y={180} width={90} height={50} />
      <R {...d(7.4)} x={250} y={180} width={90} height={50} />
    </Svg>
  );
}

export function ProductDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <L {...d(0)} x1={30} y1={250} x2={370} y2={250} />
      <P {...d(1)} d="M110 250 L120 170 L200 170 L210 250" />
      <P {...d(2)} d="M116 190 L204 190" />
      <P {...d(3)} d="M120 170 C 110 110, 120 80, 160 78 C 200 80, 210 110, 200 170" />
      <P {...d(4)} d="M260 250 L260 120 M240 120 L280 120 M232 120 L260 60 L288 120" />
      <C {...d(5)} cx={260} cy={100} r={4} />
      <P {...d(6)} d="M300 250 q 20 -60 40 0" />
      <P {...d(7)} d="M320 205 q -10 -30 0 -60 q 10 30 0 60" />
    </Svg>
  );
}

export function SmartDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <P {...d(0)} d="M60 260 L60 130 L200 50 L340 130 L340 260 Z" />
      <L {...d(1)} x1={60} y1={190} x2={340} y2={190} />
      <R {...d(2)} x={220} y={70} width={70} height={24} transform="rotate(30 255 82)" />
      <C {...d(3)} cx={200} cy={150} r={10} />
      {[20, 34, 48].map((r, i) => (
        <P key={r} {...d(4 + i * 0.3)} d={`M${200 - r} ${150 - r * 0.2} A ${r} ${r} 0 0 1 ${200 + r} ${150 - r * 0.2}`} />
      ))}
      <R {...d(6)} x={90} y={210} width={40} height={50} />
      <R {...d(6.5)} x={250} y={210} width={60} height={30} />
      <L {...d(7)} x1={260} y1={230} x2={300} y2={230} />
    </Svg>
  );
}

export const serviceDrawings: Record<ServiceVisual, (p: DrawProps) => React.ReactElement> = {
  workspace: WorkspaceDrawing,
  interiors: InteriorsDrawing,
  structure: StructureDrawing,
  institution: InstitutionDrawing,
  hospitality: HospitalityDrawing,
  healthcare: HealthcareDrawing,
  product: ProductDrawing,
  smart: SmartDrawing,
};

/* ——— Customer journey ——— */

export function ConsultDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <C {...d(0)} cx={130} cy={120} r={26} />
      <P {...d(1)} d="M80 230 q 50 -70 100 0" />
      <C {...d(2)} cx={270} cy={120} r={26} />
      <P {...d(3)} d="M220 230 q 50 -70 100 0" />
      <R {...d(4)} x={160} y={200} width={80} height={40} />
      <P {...d(5)} d="M150 60 h60 a10 10 0 0 1 10 10 v20 a10 10 0 0 1 -10 10 h-40 l-14 12 v-12 h-6 a10 10 0 0 1 -10 -10 v-20 a10 10 0 0 1 10 -10 z" />
      <P {...d(6)} d="M170 78 h40 M170 88 h26" />
    </Svg>
  );
}

export function QuoteDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <R {...d(0)} x={120} y={30} width={160} height={230} />
      <P {...d(1)} d="M140 60 h80 M140 80 h120" />
      {[0, 1, 2, 3, 4].map((i) => (
        <P key={i} {...d(2 + i * 0.3)} d={`M140 ${110 + i * 22} h80 M240 ${110 + i * 22} h20`} />
      ))}
      <L {...d(4)} x1={140} y1={225} x2={260} y2={225} />
      <P {...d(5)} d="M220 240 h40" strokeWidth={2} />
      <C {...d(6)} cx={300} cy={220} r={20} />
      <P {...d(7)} d="M291 220 l6 6 l12 -12" />
    </Svg>
  );
}

export function BlueprintDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <R {...d(0)} x={50} y={40} width={300} height={200} />
      <P {...d(1)} d="M50 130 H170 V40 M170 130 V240 M250 40 V170 H350 M170 190 H250 V240" />
      <P {...d(2)} d="M170 100 a 26 26 0 0 1 26 26" />
      <P {...d(3)} d="M250 150 a 20 20 0 0 0 -20 20" />
      <L {...d(4)} x1={50} y1={262} x2={350} y2={262} />
      <L {...d(4.5)} x1={50} y1={256} x2={50} y2={268} />
      <L {...d(4.5)} x1={350} y1={256} x2={350} y2={268} />
      {[0, 1, 2, 3].map((i) => (
        <R key={i} {...d(5 + i * 0.2)} x={70 + i * 22} y={160} width={16} height={16} />
      ))}
      <C {...d(6)} cx={300} cy={100} r={22} />
    </Svg>
  );
}

export function ManufactureDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <L {...d(0)} x1={30} y1={250} x2={370} y2={250} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <R {...d(1 + i * 0.5)} x={60 + i * 100} y={120} width={70} height={130} />
          <L {...d(1.5 + i * 0.5)} x1={60 + i * 100} y1={170} x2={130 + i * 100} y2={170} />
          <L {...d(1.7 + i * 0.5)} x1={95 + i * 100} y1={120} x2={95 + i * 100} y2={250} />
        </g>
      ))}
      <P {...d(5)} d="M40 90 H360" strokeDasharray="6 6" />
      <P {...d(6)} d="M200 40 v30 M188 58 l12 12 l12 -12" />
      <C {...d(7)} cx={330} cy={60} r={18} />
      <P {...d(7.5)} d="M330 48 v12 l8 6" />
    </Svg>
  );
}

export function InstallDrawing({ className, delay }: DrawProps) {
  const d = useDraw(delay);
  return (
    <Svg className={className}>
      <L {...d(0)} x1={30} y1={250} x2={370} y2={250} />
      <R {...d(1)} x={120} y={60} width={160} height={190} />
      <P {...d(2)} d="M120 60 L200 90 L200 250 L120 250 Z" />
      <C {...d(3)} cx={188} cy={170} r={4} />
      <P {...d(4)} d="M280 100 q 40 -30 70 0" />
      <P {...d(5)} d="M60 120 l8 -16 l8 16 l16 8 l-16 8 l-8 16 l-8 -16 l-16 -8 z" />
      <P {...d(6)} d="M320 180 l5 -10 l5 10 l10 5 l-10 5 l-5 10 l-5 -10 l-10 -5 z" />
    </Svg>
  );
}

export const journeyDrawings: Record<JourneyStep["visual"], (p: DrawProps) => React.ReactElement> = {
  consult: ConsultDrawing,
  quote: QuoteDrawing,
  blueprint: BlueprintDrawing,
  manufacture: ManufactureDrawing,
  install: InstallDrawing,
};
