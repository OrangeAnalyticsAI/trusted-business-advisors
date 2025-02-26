
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const [spheres] = useState<[number, number, number][]>([
    [-2, 0, 0],
    [0, 0, 0],
    [2, 0, 0],
  ]);

  return (
    <group>
      {spheres.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#4338ca" />
        </mesh>
      ))}
    </group>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
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
        <Suspense fallback={null}>
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true,
            }}
            dpr={window.devicePixelRatio}
            style={{ position: 'absolute' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Scene />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
