
import React from 'react';
import { Canvas } from '@react-three/fiber';

function Scene() {
  return (
    <>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="blue" />
      </mesh>
    </>
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
    console.error('Three.js Error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Error:', error);
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
  return (
    <div className="h-[400px] w-full relative bg-background">
      <ErrorBoundary>
        <Canvas>
          <Scene />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
