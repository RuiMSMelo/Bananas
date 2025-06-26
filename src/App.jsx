import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'

function Box({ z }) {
    const ref = useRef()
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(height),
    })

    useFrame(() => {
        ref.current.position.set(data.x * width, (data.y += 0.1), z)
        if (data.y > height / 1.5) {
            data.y = -height / 1.5
        }
    })

    return (
        <mesh ref={ref} onClick={() => setClicked(!clicked)}>
            <boxGeometry />
            <meshBasicMaterial color='orange' />
        </mesh>
    )
}

function Banana(props) {
    const { scene } = useGLTF('./banana-v1.glb')
    // scene.children[0].material.emissive.r = 1 //making model warmer with more red

    return <primitive object={scene} {...props} />
}

export default function App({ count = 50 }) {
    return (
        <Canvas>
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} intensity={2} />
            <Suspense fallback={null}>
                {/* {Array.from({ length: count }, (_, i) => (
                <Box key={i} z={-i} />
            ))} */}
                <Banana scale={0.5} />
                <Environment preset='sunset' />
            </Suspense>
        </Canvas>
    )
}
