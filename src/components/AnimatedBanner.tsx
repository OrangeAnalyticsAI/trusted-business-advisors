
import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedLine = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Create a simple curve
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(2, 0, 0)
  ]);

  const points = curve.getPoints(30);

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      
      <Line 
        points={points.map(p => [p.x, p.y, p.z])} 
        color="white" 
        lineWidth={2}
      />
      
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#0EA5E9" />
      </mesh>

      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, x === 0 ? 2 : 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
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
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
