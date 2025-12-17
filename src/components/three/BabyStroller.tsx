'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type Group } from 'three';

interface BabyStrollerProps {
    color: string;
}

export default function BabyStroller({ color }: BabyStrollerProps) {
    const group = useRef<Group>(null);

    useFrame((state) => {
        if (group.current) {
            // Subtle floating animation
            group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            group.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={group} dispose={null} position={[0, -0.5, 0]}>
            {/* Seat Shell */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>

            {/* Inner Padding */}
            <mesh position={[0, 0.5, 0]} rotation={[0.2, 0, 0]}>
                <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>

            {/* Base/Stand */}
            <mesh position={[0, -0.8, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.8, 1.5, 32]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Details - Handle or decorative ring */}
            <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.05, 0.05, 16, 100]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}
