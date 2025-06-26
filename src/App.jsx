import * as THREE from 'three'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { depth } from 'three/tsl'

function Banana({ z }) {
    const ref = useRef()

    const { nodes, materials } = useGLTF('/banana-v1-transformed.glb')
    const bananaMaterial = useMemo(() => materials.skin.clone(), [])

    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(height),
        rX: Math.random() * Math.PI * 2,
        rY: Math.random() * Math.PI * 2,
        rZ: Math.random() * Math.PI * 2,
    })

    useFrame((state, delta) => {
        if (!ref.current) return

        // Fade in opacity
        const mat = ref.current.material
        if (mat.opacity < 1) {
            mat.transparent = true
            mat.opacity = Math.min(mat.opacity + delta * 0.5, 1) // slower fade
        }

        // Animate position
        ref.current.position.set(
            data.x * width,
            (data.y += 0.0025 * delta * 60),
            z
        )

        // Animate rotation
        ref.current.rotation.set(
            (data.rX += 0.001 * delta * 60),
            (data.rY += 0.001 * delta * 60),
            (data.rZ += 0.001 * delta * 60)
        )

        // Reset if off-screen
        if (data.y > height) {
            data.y = -height
            mat.opacity = 0 // restart fade after looping
        }
    })

    return (
        <mesh
            ref={ref}
            geometry={nodes.banana.geometry}
            material={bananaMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            material-emissive='orange'
            material-transparent={true}
            material-opacity={0}
        />
    )
}

export default function App({ count = 80, depth = 75 }) {
    return (
        <>
            <div className='text'>
                <h1>
                    LANDING <br />
                    PAGE —
                </h1>
                <h2>with React and Threejs —</h2>
            </div>
            <img src='./WarholBanana-removebg-preview.png' />

            <Canvas
                gl={{ alpha: false }}
                camera={{ near: 0.01, far: 110, fov: 30 }}
            >
                <color attach='background' args={['#ffbf40']} />
                {/* <ambientLight intensity={0.2} /> */}
                <spotLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                    {Array.from({ length: count }, (_, i) => (
                        <Banana key={i} z={-(i / count) * depth - 20} />
                    ))}
                    <Environment preset='sunset' />
                    <EffectComposer>
                        <DepthOfField
                            target={[0, 0, depth]}
                            focalLength={0.5}
                            bokehScale={11}
                            height={700}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </>
    )
}
