
import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

function Scene() {
  const meshRef = useRef(null);

  useEffect(() => {
    console.log('Scene mounted', meshRef.current);
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Three.js Error in getDerivedStateFromError:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Error in componentDidCatch:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-muted-foreground">
          <div>Failed to load 3D animation</div>
          <div className="text-sm opacity-50">
            {this.state.error?.message || 'Unknown error'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AnimatedBanner = () => {
  console.log('AnimatedBanner rendering');

  return (
    <div className="h-[400px] w-full relative">
      <ErrorBoundary>
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D scene...</div>}>
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'default',
            }}
            camera={{
              position: [0, 0, 5],
              fov: 75,
            }}
            dpr={window.devicePixelRatio}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Scene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
