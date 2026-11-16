"use client";

import * as React from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { FrameDriver } from "@/components/pixel/FrameDriver";
import { onTilt } from "@/lib/tilt";

/*
 * The portrait with depth.
 *
 * A depth map of the photo was estimated once, offline, with Depth Anything
 * V2 (scripts/portrait-depth.py) and shipped as an 8-bit PNG. Here a dense
 * plane is pushed toward the camera wherever the map is bright, so Noah's
 * face, shoulders and arms stand well proud of the blob behind him. The
 * whole thing turns to follow the pointer anywhere on the page and slides a
 * little with it, so the depth actually shows. On touch there is no pointer,
 * so it sways on its own. Under reduced motion it holds still.
 */
const VERT = /* glsl */ `
  uniform sampler2D depthMap;
  uniform float strength;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float d = texture2D(depthMap, uv).r;
    vec3 p = position;
    p.z += (d - 0.3) * strength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D colorMap;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(colorMap, vUv);
    if (c.a < 0.5) discard;
    gl_FragColor = vec4(c.rgb, 1.0);
  }
`;

/* The canvas is drawn this much larger than the picture so a turn never
   clips at the edges. HeroPortrait insets it by the same amount. */
export const BLEED = 1.22;

// How far it turns at the edge of the window, in radians.
const TURN_X = 0.15;
const TURN_Y = 0.28;

type Aim = { x: number; y: number; active: boolean };

function Scene({
  color,
  depth,
  aim,
  still,
  settling,
  onReady,
}: {
  color: string;
  depth: string;
  aim: React.MutableRefObject<Aim>;
  still: boolean;
  settling: React.MutableRefObject<boolean>;
  onReady: () => void;
}) {
  const [colorMap, depthMap] = useLoader(THREE.TextureLoader, [color, depth]);
  const { viewport } = useThree();
  const mesh = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    /*
     * Both textures stay as raw bytes. The shader writes the photo's pixels
     * straight out, so decoding it as sRGB first would darken it, which is
     * exactly what an earlier version did.
     */
    for (const t of [colorMap, depthMap]) {
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    }
    onReady();
  }, [colorMap, depthMap, onReady]);

  const w = viewport.width / BLEED;
  const h = viewport.height / BLEED;

  const uniforms = React.useMemo(
    () => ({
      colorMap: { value: colorMap },
      depthMap: { value: depthMap },
      strength: { value: h * 0.26 },
    }),
    [colorMap, depthMap, h],
  );

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    let nx = 0;
    let ny = 0;
    if (!still) {
      if (aim.current.active) {
        nx = aim.current.x;
        ny = aim.current.y;
      } else {
        nx = Math.sin(t * 0.5) * 0.5;
        ny = Math.sin(t * 0.33 + 1) * 0.3;
      }
    }
    // Quick to answer, but never a hard stop.
    const k = 1 - Math.exp(-dt * 5);
    m.rotation.y += (nx * TURN_Y - m.rotation.y) * k;
    m.rotation.x += (ny * TURN_X - m.rotation.x) * k;
    m.position.x += (nx * w * 0.025 - m.position.x) * k;
    m.position.y += (-ny * h * 0.015 - m.position.y) * k;
    // Still turning: keep drawing every frame until it settles.
    settling.current =
      Math.abs(nx * TURN_Y - m.rotation.y) > 0.002 || Math.abs(ny * TURN_X - m.rotation.x) > 0.002;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[w, h, 140, 140]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent />
    </mesh>
  );
}

export function DepthPortrait({
  color,
  depth,
  onReady,
}: {
  color: string;
  depth: string;
  onReady: () => void;
}) {
  const aim = React.useRef<Aim>({ x: 0, y: 0, active: false });
  const [still, setStill] = React.useState(false);
  const settling = React.useRef(true);
  const lastMove = React.useRef(0);
  const visible = React.useRef(true);
  const box = React.useRef<HTMLDivElement>(null);

  // Off screen, it does not draw at all.
  React.useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const busy = React.useCallback(
    () => settling.current || performance.now() - lastMove.current < 600,
    [],
  );

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStill(reduce.matches);
    apply();
    reduce.addEventListener("change", apply);

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      aim.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
        active: true,
      };
      lastMove.current = performance.now();
    };
    const leave = () => {
      aim.current = { ...aim.current, active: false };
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    // On a phone, the way it is held turns him instead.
    const offTilt = onTilt((t) => {
      aim.current = { x: t.x, y: t.y, active: t.x !== 0 || t.y !== 0 };
      lastMove.current = performance.now();
    });
    return () => {
      offTilt();
      reduce.removeEventListener("change", apply);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.25]}
        camera={{ fov: 26, position: [0, 0, 7] }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <FrameDriver busy={busy} idleFps={still ? 2 : 24} visible={visible} />
        <React.Suspense fallback={null}>
          <Scene
            color={color}
            depth={depth}
            aim={aim}
            still={still}
            settling={settling}
            onReady={onReady}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
