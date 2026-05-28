import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Nodes() {
  const ref = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const lines: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 2.2) {
          lines.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          lines.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }
    return { positions, linePositions: new Float32Array(lines) };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.08;
    if (ref.current) ref.current.rotation.y = t;
    if (lineRef.current) lineRef.current.rotation.y = t;
  });

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#b388ff" transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

export default function NeuralNetwork() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-40 -z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <Nodes />
      </Canvas>
    </div>
  );
}
