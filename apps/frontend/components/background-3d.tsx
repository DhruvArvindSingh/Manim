"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Torus, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

function Shape({ type, ...props }: { type: 'torus' | 'sphere' | 'cone' } & any) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = ref.current.rotation.y += 0.01;
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() + props.random) * 2;
        }
    });

    const shapeProps = {
        ...props,
        args: type === 'torus' ? [1, 0.4, 16, 100] : [1, 32, 32],
    };

    switch (type) {
        case 'torus':
            return <Torus ref={ref} {...shapeProps} />;
        case 'sphere':
            return <Sphere ref={ref} {...shapeProps} />;
        case 'cone':
            return <Cone ref={ref} {...shapeProps} />;
        default:
            return null;
    }
}

export function Background3D() {
    const shapes = [
        { type: 'torus', position: [-5, 0, -10], random: Math.random() * 10 },
        { type: 'sphere', position: [5, 0, -10], random: Math.random() * 10 },
        { type: 'cone', position: [0, 5, -10], random: Math.random() * 10 },
    ] as const;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {shapes.map((shape, i) => (
                    <Shape key={i} {...shape}>
                        <meshStandardMaterial color={i % 2 === 0 ? 'lightblue' : 'hotpink'} />
                    </Shape>
                ))}
            </Canvas>
        </div>
    );
}
