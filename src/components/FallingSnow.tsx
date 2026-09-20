import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SnowflakeProps {
  position: [number, number, number];
  speed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  size: number;
  color: string;
  opacity: number;
}

function Snowflake({ position, speed, wobbleSpeed, wobbleAmount, size, color, opacity }: SnowflakeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const initialX = position[0];
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime + timeOffset;
    
    // Slow fall
    groupRef.current.position.y -= speed * 0.012;
    
    // Gentle wobble
    groupRef.current.position.x = initialX + Math.sin(time * wobbleSpeed) * wobbleAmount;
    
    // Slight rotation
    groupRef.current.rotation.z += 0.005;
    
    if (groupRef.current.position.y < -10) {
      groupRef.current.position.y = 12 + Math.random() * 5;
      groupRef.current.position.x = initialX;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main snowflake */}
      <mesh>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[size * 2, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.3} />
      </mesh>
    </group>
  );
}

function Snowflakes() {
  const flakes = useMemo(() => {
    // Faint colorful snow colors
    const colors = [
      "#E8E8F0", // Faint white-blue
      "#F0F0F8", // Faint white
      "#E0E8F0", // Faint ice
      "#D8E0F0", // Faint pale blue
      "#F0E8F0", // Faint lavender
      "#E8F0F0", // Faint mint
      "#F5F5FF", // Faint pearl
      "#E0E0E8", // Faint silver
    ];
    
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 25 - 5,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.4,
      wobbleSpeed: 0.3 + Math.random() * 0.5,
      wobbleAmount: 0.3 + Math.random() * 0.8,
      size: 0.02 + Math.random() * 0.1, // Various sizes
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.5 + Math.random() * 0.4, // More visible
    }));
  }, []);

  return (
    <>
      {flakes.map((flake) => (
        <Snowflake key={flake.id} {...flake} />
      ))}
    </>
  );
}

export function FallingSnow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <Snowflakes />
      </Canvas>
    </div>
  );
}
