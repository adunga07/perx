import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'

function BenefitShape({ position, color, geometryType, speed = 1, distort = 0.35, wobble = false, scale = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.35 * speed
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1 * speed
  })

  const geom = {
    icosa: <icosahedronGeometry args={[1 * scale, 0]} />,
    dodeca: <dodecahedronGeometry args={[1 * scale, 0]} />,
    torusKnot: <torusKnotGeometry args={[0.7 * scale, 0.25 * scale, 80, 16]} />,
    sphere: <sphereGeometry args={[1 * scale, 32, 32]} />,
    box: <boxGeometry args={[1.4 * scale, 1.4 * scale, 1.4 * scale]} />,
    octa: <octahedronGeometry args={[1.1 * scale, 0]} />,
  }

  return (
    <Float speed={speed * 0.7} rotationIntensity={0.6} floatIntensity={2.2}>
      <mesh ref={meshRef} position={position}>
        {geom[geometryType]}
        {wobble ? (
          <MeshWobbleMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            factor={0.45}
            speed={2}
            roughness={0.08}
            metalness={0.75}
            transparent
            opacity={0.88}
          />
        ) : (
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            distort={distort}
            speed={2}
            roughness={0.06}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        )}
      </mesh>
    </Float>
  )
}

function Ring({ position, color, rotOffset = [0, 0, 0], speed = 0.5 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = rotOffset[0] + state.clock.elapsedTime * 0.12 * speed
    ref.current.rotation.y = rotOffset[1] + state.clock.elapsedTime * 0.18 * speed
    ref.current.rotation.z = rotOffset[2] + state.clock.elapsedTime * 0.08 * speed
  })

  return (
    <Float speed={speed * 0.5} floatIntensity={1.4}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[2.0, 0.04, 16, 120]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.65}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </Float>
  )
}

function Particles({ count = 220 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 55
      arr[i * 3 + 1] = (Math.random() - 0.5) * 55
      arr[i * 3 + 2] = (Math.random() - 0.5) * 35
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#c4b5fd" transparent opacity={0.45} sizeAttenuation />
    </points>
  )
}

function SceneInner() {
  return (
    <>
      <color attach="background" args={['#04010f']} />
      <fog attach="fog" args={['#04010f', 18, 55]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[12, 8, 6]} intensity={3} color="#7c3aed" />
      <pointLight position={[-12, -6, -4]} intensity={2} color="#06b6d4" />
      <pointLight position={[6, -12, 10]} intensity={1.5} color="#f59e0b" />
      <pointLight position={[-6, 12, -8]} intensity={1.5} color="#22c55e" />
      <pointLight position={[0, 0, 8]} intensity={0.5} color="#ffffff" />

      <Stars radius={90} depth={60} count={6000} factor={4} saturation={0.3} fade speed={0.4} />
      <Particles count={220} />

      {/* Fitness — red icosahedron */}
      <BenefitShape position={[-7.5, 3.8, -2]} color="#ef4444" geometryType="icosa" speed={1.0} distort={0.28} />

      {/* Travel — blue dodecahedron */}
      <BenefitShape position={[7.2, 3.2, -3]} color="#3b82f6" geometryType="dodeca" speed={0.85} distort={0.22} />

      {/* Dining — orange torus knot */}
      <BenefitShape position={[-5.8, -3.2, -1.5]} color="#f97316" geometryType="torusKnot" speed={1.15} distort={0.12} />

      {/* Health — green wobble sphere */}
      <BenefitShape position={[6.8, -2.8, -3]} color="#22c55e" geometryType="sphere" speed={0.95} wobble />

      {/* Education — purple box */}
      <BenefitShape position={[1.2, 5.8, -5]} color="#a855f7" geometryType="box" speed={0.72} distort={0.18} />

      {/* Telecom — cyan octahedron */}
      <BenefitShape position={[-2.5, -5.8, -3]} color="#06b6d4" geometryType="octa" speed={1.25} distort={0.32} />

      {/* Finance/Extras — gold sphere */}
      <BenefitShape position={[3.8, -5.2, -4]} color="#f59e0b" geometryType="sphere" speed={1.05} distort={0.42} scale={0.82} />

      {/* Floating rings */}
      <Ring position={[-9, 0.5, -6]} color="#7c3aed" rotOffset={[0.6, 0, 0.3]} speed={0.6} />
      <Ring position={[9, 0.5, -7]} color="#06b6d4" rotOffset={[0, 0.5, 0.4]} speed={0.75} />
      <Ring position={[0, -8, -5]} color="#f59e0b" rotOffset={[0.9, 0.3, 0]} speed={0.65} />
      <Ring position={[4.5, 7, -8]} color="#22c55e" rotOffset={[0.3, 0.7, 0.5]} speed={0.5} />
    </>
  )
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 55 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneInner />
    </Canvas>
  )
}
