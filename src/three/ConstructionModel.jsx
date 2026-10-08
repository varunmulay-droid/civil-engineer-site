import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useRef } from "react";
import { seg, isMobile } from "../motion/easings.js";

const AMBER = "#D78B3D";
const G = [-2, 0, 2];
const LV = [1.4, 2.8, 4.2, 5.6];
const out = (t) => 1 - Math.pow(1 - t, 3);

function Skin({ w, h, d, y, op = 0.9 }) {
  return (
    <mesh position={[0, y, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#26282b" roughness={0.9} metalness={0.1} transparent opacity={op} />
      <Edges color={AMBER} threshold={15} />
    </mesh>
  );
}

function Building({ progress }) {
  const slab = useRef(), roof = useRef(), glass = useRef(), cam = useRef();
  const cols = useRef([]), floors = useRef([]);
  useFrame(({ camera }) => {
    const p = progress.current;
    const s = out(seg(p, 0, 0.18)); slab.current.visible = s > 0.001; slab.current.scale.set(s, 1, s);
    cols.current.forEach((g, i) => { const e = out(seg(p, 0.16 + i * 0.012, 0.42 + i * 0.012)); g.visible = e > 0.001; g.scale.y = Math.max(e, 0.0001); });
    floors.current.forEach((f, i) => { const e = out(seg(p, 0.4 + i * 0.1, 0.54 + i * 0.1)); f.visible = e > 0.001; f.scale.set(e, 1, e); f.position.y = LV[i] - (1 - e) * 0.9; });
    const r = out(seg(p, 0.88, 0.97)); roof.current.visible = r > 0.001; roof.current.scale.set(r, 1, r);
    glass.current.material.opacity = seg(p, 0.9, 1) * 0.16;
    const a = -0.75 + p * 1.5, rad = isMobile() ? 17 : 13;
    camera.position.set(Math.sin(a) * rad, 4.2 + p * 1.6, Math.cos(a) * rad); camera.lookAt(0, 2.5, 0);
  });
  return (
    <>
      <group ref={slab}><Skin w={7.6} h={0.4} d={7.6} y={-0.2} /></group>
      {G.flatMap((x, i) => G.map((z, j) => (
        <group key={`${i}${j}`} position={[x, 0, z]} ref={(el) => (cols.current[i * 3 + j] = el)}><Skin w={0.34} h={5.6} d={0.34} y={2.8} /></group>
      )))}
      {LV.map((y, i) => (<group key={y} position={[0, y, 0]} ref={(el) => (floors.current[i] = el)}><Skin w={6.4} h={0.18} d={6.4} y={0} op={0.7} /></group>))}
      <group ref={roof} position={[0, 5.95, 0]}><Skin w={7.2} h={0.26} d={7.2} y={0} /></group>
      <mesh ref={glass} position={[0, 2.85, 0]}><boxGeometry args={[6.4, 5.7, 6.4]} /><meshBasicMaterial color="#9fc4d8" transparent opacity={0} depthWrite={false} /></mesh>
      <gridHelper args={[26, 26, "#4a4337", "#1d1f21"]} position={[0, -0.41, 0]} />
    </>
  );
}

export default function ConstructionModel({ progress, active }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, isMobile() ? 1.25 : 1.75]} camera={{ fov: 32, position: [8, 5, 13] }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <fog attach="fog" args={["#0B0C0D", 16, 34]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={1.5} />
      <pointLight position={[-6, 3, -4]} intensity={30} color={AMBER} />
      <Building progress={progress} />
    </Canvas>
  );
}
