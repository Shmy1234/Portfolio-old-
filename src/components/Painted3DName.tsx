import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

function PaintedText() {
  const textRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Gentle floating animation
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Center>
      <group ref={textRef}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Sahil
          <meshStandardMaterial
            ref={materialRef}
            color="#8B4513"
            metalness={0.3}
            roughness={0.7}
            emissive="#D2691E"
            emissiveIntensity={0.1}
          />
        </Text3D>
      </group>
    </Center>
  );
}

export function Painted3DName() {
  return (
    <div className="w-72 h-32 md:w-96 md:h-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FFD700" />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#D2691E" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#DAA520" />
        <PaintedText />
      </Canvas>
    </div>
  );
}
