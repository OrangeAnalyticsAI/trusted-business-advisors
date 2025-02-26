
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function Scene() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#4338ca" />
    </mesh>
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
    <div className="h-[400px] w-full relative">
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5] }}
            gl={{ 
              antialias: true,
            }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
