import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LeafProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  color: string;
  opacity: number;
}

function Leaf({ position, rotation, scale, speed, wobbleSpeed, wobbleAmount, color, opacity }: LeafProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialX = position[0];
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime + timeOffset;
    
    // Fall down
    meshRef.current.position.y -= speed * 0.01;
    
    // Wobble side to side
    meshRef.current.position.x = initialX + Math.sin(time * wobbleSpeed) * wobbleAmount;
    
    // Rotate while falling
    meshRef.current.rotation.x += 0.005 * speed;
    meshRef.current.rotation.y += 0.008 * speed;
    meshRef.current.rotation.z += 0.003 * speed;
    
    // Reset when fallen below view
    if (meshRef.current.position.y < -8) {
      meshRef.current.position.y = 8 + Math.random() * 4;
      meshRef.current.position.x = initialX;
    }
  });

  // Simple leaf shape geometry
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.3, 0.3, 0.15, 0.7);
    shape.quadraticCurveTo(0, 1, -0.15, 0.7);
    shape.quadraticCurveTo(-0.3, 0.3, 0, 0);
    return shape;
  }, []);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <shapeGeometry args={[leafShape]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Leaves() {
  const leaves = useMemo(() => {
    // Faint colorful autumn colors
    const colors = [
      "#E8A0A0", // Faint red
      "#F5C49C", // Faint orange
      "#F0D98D", // Faint gold
      "#C4A484", // Faint brown
      "#D4A574", // Faint sienna
      "#E8C4A0", // Faint peach
      "#C9B896", // Faint khaki
      "#DBA89A", // Faint coral
    ];
    
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 25 - 5,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.04 + Math.random() * 0.35, // Various sizes
      speed: 0.15 + Math.random() * 0.25,
      wobbleSpeed: 0.5 + Math.random() * 0.5,
      wobbleAmount: 0.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.15 + Math.random() * 0.25, // Very transparent
    }));
  }, []);

  return (
    <>
      {leaves.map((leaf) => (
        <Leaf key={leaf.id} {...leaf} />
      ))}
    </>
  );
}

export function FallingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Leaves />
      </Canvas>
    </div>
  );
}
