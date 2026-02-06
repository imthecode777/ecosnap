import { useEffect, useState, useRef } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  shape: "circle" | "square" | "triangle";
  swayDirection: number;
}

interface ConfettiEffectProps {
  show: boolean;
  key?: number; // Allow re-triggering with key changes
}

const ConfettiEffect = ({ show }: ConfettiEffectProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const triggerRef = useRef(0);

  useEffect(() => {
    if (show) {
      triggerRef.current += 1;
      const currentTrigger = triggerRef.current;
      
      const colors = [
        "hsl(134, 61%, 41%)", // Primary green
        "hsl(134, 45%, 60%)", // Light green
        "#22c55e", // Emerald
        "#10b981", // Teal
        "#eab308", // Yellow
        "#f59e0b", // Amber
        "#3b82f6", // Blue
        "#a855f7", // Purple
        "#ec4899", // Pink
      ];
      
      const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
      
      // Create burst with more pieces
      const createBurst = (batchDelay: number): ConfettiPiece[] => {
        return Array.from({ length: 60 }, (_, i) => ({
          id: currentTrigger * 10000 + batchDelay * 1000 + i,
          x: Math.random() * 100,
          delay: batchDelay + Math.random() * 0.4,
          duration: 2.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          swayDirection: Math.random() > 0.5 ? 1 : -1,
        }));
      };
      
      // Triple wave burst for epic effect
      const wave1 = createBurst(0);
      const wave2 = createBurst(0.15);
      const wave3 = createBurst(0.3);
      
      setPieces([...wave1, ...wave2, ...wave3]);
      
      const timeout = setTimeout(() => {
        setPieces([]);
      }, 6000);
      
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: "-30px",
            width: piece.shape === "triangle" ? 0 : `${piece.size}px`,
            height: piece.shape === "triangle" ? 0 : `${piece.size}px`,
            backgroundColor: piece.shape !== "triangle" ? piece.color : "transparent",
            borderLeft: piece.shape === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
            borderRight: piece.shape === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
            borderBottom: piece.shape === "triangle" ? `${piece.size}px solid ${piece.color}` : undefined,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "square" ? "3px" : undefined,
            boxShadow: `0 0 ${piece.size}px ${piece.color}50`,
            ["--sway-direction" as any]: piece.swayDirection,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;