import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Fallback component when WebGL is not available
const WebGLFallback = () => (
  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
    <p className="text-gray-500">3D preview not available on this device</p>
  </div>
);

// Loading spinner
const Loader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// 3D Model component
const Model = ({ modelUrl, color, scale = 1, position = [0, 0, 0] }) => {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef();

  // Apply color to all materials in the model
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = new THREE.MeshStandardMaterial({
            ...child.material,
            color: new THREE.Color(color),
            roughness: 0.7,
            metalness: 0.3,
          });
        }
      });
    }
  }, [scene, color]);

  // Smooth rotation animation
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} position={position} />;
};

// Main 3D Viewer Component
const Product3DViewer = ({ modelUrl, color = '#E13025', autoRotate = true, ...props }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const controlsRef = useRef();

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  // Handle window resize
  const handleResize = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <div className="w-full aspect-square relative bg-white rounded-xl overflow-hidden shadow-sm" {...props}>
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} />
          
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            maxDistance={10}
            minDistance={3}
          />
          
          {modelUrl && (
            <Suspense fallback={null}>
              <Model modelUrl={modelUrl} color={color} scale={1} />
            </Suspense>
          )}
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<Loader />}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-pulse text-gray-400">Loading 3D model...</div>
        </div>
      </Suspense>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default Product3DViewer;
