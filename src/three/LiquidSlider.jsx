import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { gsap, isMobile } from "../motion/easings.js";

const vert = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const frag = `varying vec2 vUv;uniform sampler2D uTex0,uTex1;uniform float uProg,uTime,uPA,uIA;
vec2 cover(vec2 uv){vec2 s=uPA>uIA?vec2(1.,uIA/uPA):vec2(uPA/uIA,1.);return (uv-.5)*s+.5;}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=cover(vUv);
  float nz=n(vUv*vec2(3.,2.)+uTime*.05);
  float wave=sin(uProg*3.14159);
  vec2 d=vec2(nz-.5,n(vUv*3.+7.)-.5)*.4*wave;
  float e=uProg*1.8-.2;
  float front=smoothstep(e-.4,e,vUv.x+(nz-.5)*.35);
  vec4 c=mix(texture2D(uTex1,uv-d),texture2D(uTex0,uv+d),front);
  c.rgb*=.74;
  gl_FragColor=c;
}`;
const LiquidMat = shaderMaterial({ uTex0: null, uTex1: null, uProg: 0, uTime: 0, uPA: 1.6, uIA: 1.5 }, vert, frag);
extend({ LiquidMat });

function Plane({ urls, index }) {
  const { viewport } = useThree();
  const tex = useTexture(urls);
  const mat = useRef(), cur = useRef(index);
  useEffect(() => {
    const m = mat.current;
    m.uTex0 = tex[cur.current]; m.uTex1 = tex[index]; m.uProg = 0;
    const tw = gsap.to(m, { uProg: 1, duration: 1.5, ease: "power3.inOut", onComplete: () => { cur.current = index; m.uTex0 = tex[index]; m.uProg = 0; } });
    return () => tw.kill();
  }, [index, tex]);
  useFrame(({ clock }) => {
    const m = mat.current, im = tex[0].image;
    m.uTime = clock.elapsedTime; m.uPA = viewport.width / viewport.height; if (im?.width) m.uIA = im.width / im.height;
  });
  return (<mesh scale={[viewport.width, viewport.height, 1]}><planeGeometry args={[1, 1]} /><liquidMat ref={mat} toneMapped={false} /></mesh>);
}

export default function LiquidSlider({ urls, index, active }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, isMobile() ? 1.25 : 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 1] }} orthographic>
      <Suspense fallback={null}><Plane urls={urls} index={index} /></Suspense>
    </Canvas>
  );
}
