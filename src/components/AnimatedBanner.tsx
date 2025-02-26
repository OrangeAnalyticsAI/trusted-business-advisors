
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedLine = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Create a curve that forms a more interesting path
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, -1, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(2, -1, 0)
  ]);

  const points = curve.getPoints(50);

  useFrame(() => {
    if (sphereRef.current) {
      // Update progress
      progressRef.current = (progressRef.current + 0.005) % 1;
      
      // Get the new position along the curve
      const newPosition = curve.getPoint(progressRef.current);
      sphereRef.current.position.copy(newPosition);
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Curved line */}
      <Line 
        points={points.map(p => [p.x, p.y, p.z])} 
        color="#0EA5E9"
        lineWidth={2}
      />
      
      {/* Moving sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#0EA5E9"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Static spheres */}
      {points
        .filter((_, i) => i % 12 === 0) // Place static spheres at intervals
        .map((point, i) => (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial 
              color="#0EA5E9"
              transparent
              opacity={0.7}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        ))}
    </>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
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
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Failed to load 3D animation
        </div>
      );
    }
    return this.props.children;
  }
}

export const AnimatedBanner = () => {
  return (
    <div className="h-[400px] w-full relative bg-background/80">
      <ErrorBoundary>
        <Canvas
          camera={{ 
            position: [0, 0, 8],
            fov: 45
          }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
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
