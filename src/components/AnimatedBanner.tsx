
import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedLine = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    // Ensure WebGL context is properly initialized
    if (!gl.getContext()) {
      console.error('WebGL context not available');
      return;
    }

    return () => {
      // Cleanup on unmount
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
        (sphereRef.current.material as THREE.Material).dispose();
      }
    };
  }, [gl]);

  // Create a simpler curve for the animation
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(2, 0, 0)
  ]);

  const points = curve.getPoints(30);

  useFrame(() => {
    if (!sphereRef.current) return;
    
    progress.current = (progress.current + 0.005) % 1;
    const point = curve.getPoint(progress.current);
    sphereRef.current.position.copy(point);
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Line 
        points={points.map(p => [p.x, p.y, p.z])} 
        color="white" 
        lineWidth={2}
      />
      
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#0EA5E9" metalness={0.5} roughness={0.2} />
      </mesh>

      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI) * 2,
            Math.sin(i * Math.PI) * 2,
            0
          ]}
        >
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#0EA5E9" 
            metalness={0.5} 
            roughness={0.2} 
            transparent 
            opacity={0.7} 
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
    <div className="h-[400px] w-full relative">
      <ErrorBoundary>
        <Canvas
          camera={{ 
            position: [0, 0, 8],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
          }}
          style={{ 
            background: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          dpr={window.devicePixelRatio}
        >
          <Suspense fallback={null}>
            <AnimatedLine />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
