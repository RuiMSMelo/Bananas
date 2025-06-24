import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

function Box() {
    const ref = useRef()
    const { viewport } = useThree()

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(viewport.height),
        z: 0,
    })

    useFrame(() => {
        ref.current.position.set(data.x * viewport.width, (data.y += 0.1), 0)
        if (data.y > viewport.height / 1.5) {
            data.y = -viewport.height / 1.5
        }
    })

    return (
        <mesh ref={ref} onClick={() => setClicked(!clicked)}>
            <boxGeometry />
            <meshBasicMaterial color='orange' />
        </mesh>
    )
}

export default function App({ count = 50 }) {
    return (
        <Canvas>
            {Array.from({ length: count }, (_, i) => (
                <Box key={i} />
            ))}
        </Canvas>
    )
}
