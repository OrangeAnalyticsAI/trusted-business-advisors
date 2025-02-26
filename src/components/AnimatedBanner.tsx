
import React from 'react';
import { Canvas } from '@react-three/fiber';

const SimpleRotatingSphere = () => {
  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0EA5E9" />
      </mesh>
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
          camera={{ position: [0, 0, 5] }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
          }}
        >
          <SimpleRotatingSphere />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
