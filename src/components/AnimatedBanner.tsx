
import React, { useRef, Suspense } from 'react';
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Line
        points={curve.getPoints(50)}
        color="white"
        lineWidth={1}
      />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.5}
        />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI * 0.4) * 2,
            Math.sin(i * Math.PI * 0.4) * 2,
            0
          ]}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#0EA5E9"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ThreeJS Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="w-full h-full flex items-center justify-center">Failed to load 3D animation</div>;
    }
    return this.props.children;
  }
}

export const AnimatedBanner = () => {
  return (
    <div className="h-[400px] w-full relative bg-transparent">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance"
          }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
        >
          <Suspense fallback={null}>
            <AnimatedLine />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

