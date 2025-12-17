'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

interface ProductSceneProps {
    children: React.ReactNode;
}

export default function ProductScene({ children }: ProductSceneProps) {
    return (
        <div className="w-full h-[500px] md:h-[600px] bg-transparent cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                <fog attach="fog" args={['#FDFBF7', 5, 20]} />

                <ambientLight intensity={0.7} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />

                <Suspense fallback={null}>
                    {children}
                    <Environment preset="city" />
                    {/* <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    /> */}
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={3}
                    maxDistance={8}
                />
            </Canvas>
        </div>
    );
}
