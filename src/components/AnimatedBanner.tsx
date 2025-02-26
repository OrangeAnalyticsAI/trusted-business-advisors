
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

const SimpleRotatingSphere = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#0EA5E9" />
      </Sphere>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={5} />
    </>
  );
};

export const AnimatedBanner = () => {
  return (
    <div className="h-[400px] w-full relative bg-background/80">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 2]}
      >
        <SimpleRotatingSphere />
      </Canvas>
    </div>
  );
};
