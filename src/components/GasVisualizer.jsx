import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GasVisualizer({ temperature, pressure }) {
  // Bound the inputs to reasonable ranges for visualization
  // Temp affects speed (K: 100 to 1000)
  // Pressure affects number of particles / density / glow (atm: 0.1 to 10)

  const safeTemp = Math.max(100, Math.min(temperature || 298, 1000));
  const safePress = Math.max(0.1, Math.min(pressure || 1, 10));

  const count = Math.floor(50 * Math.sqrt(safePress));
  const speedMultiplier = safeTemp / 298; // Normalized to room temp

  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed * speedMultiplier;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Keep particles inside a boundary box
      const x = (xFactor / 15) * a;
      const y = (yFactor / 15) * b;
      const z = (zFactor / 15) * s;

      dummy.position.set(x, y, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Calculate neon glow based on pressure/temp
  const color = new THREE.Color('#00ffff');
  if (safeTemp > 400) color.lerp(new THREE.Color('#ff003c'), (safeTemp - 400) / 600); // Hotter = redder

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={safePress * 0.5 + 0.5}
          toneMapped={false}
        />
      </instancedMesh>
      {/* Container Box */}
      <mesh>
        <boxGeometry args={[8, 8, 8]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
      </mesh>
    </>
  );
}
