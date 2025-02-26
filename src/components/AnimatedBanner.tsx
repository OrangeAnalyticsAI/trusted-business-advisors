
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedLine = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  // Create curve path
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-1, 2, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(3, 1, 0),
  ]);

  useFrame(() => {
    progress.current += 0.005;
    if (progress.current > 1) progress.current = 0;
    
    const point = curve.getPoint(progress.current);
    if (sphereRef.current) {
      sphereRef.current.position.x = point.x;
      sphereRef.current.position.y = point.y;
    }
  });

  return (
    <>
      <Line
        points={curve.getPoints(50)}
        color="white"
        lineWidth={1}
        opacity={0.5}
      />
      <Sphere ref={sphereRef} args={[0.1, 32, 32]}>
        <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.5} />
      </Sphere>
      {[...Array(5)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            Math.cos(i * Math.PI * 0.4) * 2,
            Math.sin(i * Math.PI * 0.4) * 2,
            0
          ]}
          args={[0.2, 32, 32]}
        >
          <meshStandardMaterial color="#0EA5E9" opacity={0.7} transparent />
        </Sphere>
      ))}
    </>
  );
};

export const AnimatedBanner = () => {
  return (
    <div className="h-[400px] w-full relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="bg-transparent"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedLine />
      </Canvas>
    </div>
  );
};
