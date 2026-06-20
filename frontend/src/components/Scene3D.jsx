import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Stars, useGLTF } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";

function AnimatedObject({ position, rotation, speed = 1, floatSpeed = 0.6, floatIntensity = 1.6, children }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.08 * speed;
    ref.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.12 * speed;
    ref.current.rotation.z = rotation[2] + state.clock.elapsedTime * 0.05 * speed;
  });
  return (
    <Float speed={floatSpeed} rotationIntensity={0.45} floatIntensity={floatIntensity}>
      <group ref={ref} position={position}>
        {children}
      </group>
    </Float>
  );
}

function enhance(obj, emissiveHex, targetSize) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) obj.scale.setScalar(targetSize / maxDim);

  const emissive = new THREE.Color(emissiveHex);
  obj.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((m) => {
      m.emissive = emissive;
      m.emissiveIntensity = 0.22;
      if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
        m.metalness = Math.max(m.metalness ?? 0, 0.6);
        m.roughness = Math.min(m.roughness ?? 1, 0.4);
      }
    });
  });
  return obj;
}

function DiceModel({ position, rotation }) {
  const { scene } = useGLTF("/models/Dice.glb");
  const model = useMemo(() => enhance(scene.clone(true), "#7c3aed", 2.2), [scene]);
  return (
    <AnimatedObject position={position} rotation={rotation} speed={0.7} floatSpeed={0.5} floatIntensity={1.8}>
      <primitive object={model} />
    </AnimatedObject>
  );
}

function BarbellModel({ position, rotation }) {
  const raw = useLoader(FBXLoader, "/models/Barbell.fbx");
  const model = useMemo(() => enhance(raw.clone(true), "#ef4444", 5.5), [raw]);
  return (
    <AnimatedObject position={position} rotation={rotation} speed={0.9} floatSpeed={0.55} floatIntensity={1.9}>
      <primitive object={model} />
    </AnimatedObject>
  );
}

function PingPongModel({ position, rotation }) {
  const raw = useLoader(FBXLoader, "/models/PingPong.fbx");
  const model = useMemo(() => enhance(raw.clone(true), "#3b82f6", 2.8), [raw]);
  return (
    <AnimatedObject position={position} rotation={rotation} speed={1.05} floatSpeed={0.65} floatIntensity={2.05}>
      <primitive object={model} />
    </AnimatedObject>
  );
}

function HealthBoxModel({ position, rotation }) {
  const raw = useLoader(FBXLoader, "/models/health_box.fbx");
  const model = useMemo(() => enhance(raw.clone(true), "#22c55e", 2.5), [raw]);
  return (
    <AnimatedObject position={position} rotation={rotation} speed={0.8} floatSpeed={0.5} floatIntensity={1.8}>
      <primitive object={model} />
    </AnimatedObject>
  );
}

function Particles({ count = 220 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      const rand = (offset) => {
        const v = Math.sin(seed * offset) * 10000;
        return v - Math.floor(v);
      };
      arr[i * 3]     = (rand(12.9898) - 0.5) * 55;
      arr[i * 3 + 1] = (rand(78.233)  - 0.5) * 55;
      arr[i * 3 + 2] = (rand(37.719)  - 0.5) * 35;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#c4b5fd" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

function SceneInner() {
  return (
    <>
      <color attach="background" args={["#04010f"]} />
      <fog attach="fog" args={["#04010f", 18, 55]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[12,  8,  6]} intensity={4}   color="#7c3aed" />
      <pointLight position={[-12,-6, -4]} intensity={3}   color="#06b6d4" />
      <pointLight position={[6, -12, 10]} intensity={2.5} color="#f59e0b" />
      <pointLight position={[-6, 12, -8]} intensity={2.5} color="#22c55e" />
      <pointLight position={[0,   0,  8]} intensity={1.2} color="#ffffff" />

      <Stars radius={90} depth={60} count={6000} factor={4} saturation={0.3} fade speed={0.4} />
      <Particles count={220} />

      <Suspense fallback={null}>
        <DiceModel position={[-6.8, 2.8, -2.0]} rotation={[0.15, -0.3, 0.12]} />
      </Suspense>
      <Suspense fallback={null}>
        <BarbellModel position={[7.0, 3.5, -2.5]} rotation={[0.08, -0.4, 0.18]} />
      </Suspense>
      <Suspense fallback={null}>
        <PingPongModel position={[-7.2, -3.2, -3.0]} rotation={[-0.12, 0.35, 0.2]} />
      </Suspense>
      <Suspense fallback={null}>
        <HealthBoxModel position={[6.5, -2.6, -3.2]} rotation={[0.12, 0.26, 0.06]} />
      </Suspense>
    </>
  );
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 55 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneInner />
    </Canvas>
  );
}

useGLTF.preload("/models/Dice.glb");
