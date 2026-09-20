import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RaindropProps {
  position: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
  size: number;
}

function Raindrop({ position, speed, color, opacity, size }: RaindropProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame(() => {
    if (!meshRef.current) return;
    
    meshRef.current.position.y -= speed * 0.15;
    
    if (meshRef.current.position.y < -10) {
      meshRef.current.position.y = initialY + Math.random() * 5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[size * 0.3, size * 0.3, size * 10, 4]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Raindrops() {
  const drops = useMemo(() => {
    // Faint colorful rain colors
    const colors = [
      "#A0C4E8", // Faint light blue
      "#B8D4F0", // Faint sky blue
      "#C8DCF0", // Faint pale blue
      "#D0E0F5", // Faint ice blue
      "#A8C8E8", // Faint aqua
      "#B0D0E8", // Faint cyan
      "#C0D8E8", // Faint steel blue
      "#D8E4F0", // Faint lavender blue
    ];
    
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 25,
        Math.random() * 20,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      speed: 0.8 + Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.4 + Math.random() * 0.3, // More visible
      size: 0.02 + Math.random() * 0.04, // Various sizes
    }));
  }, []);

  return (
    <>
      {drops.map((drop) => (
        <Raindrop key={drop.id} {...drop} />
      ))}
    </>
  );
}

export function FallingRain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <Raindrops />
      </Canvas>
    </div>
  );
}
