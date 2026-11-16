"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { FrameDriver } from "@/components/pixel/FrameDriver";
import { DENJI, NOAH, type Sprite } from "@/components/pixel/sprites";
import { STATIONS } from "@/lib/rooms";
import type { Phase } from "@/lib/sky";
import { onTilt } from "@/lib/tilt";
import { titleActive } from "@/lib/titleScreen";

/*
 * One world, one camera.
 *
 * A floor of white grid lines runs off to a fogged horizon in the room's
 * colour. Along it, at every room, Noah or Denji stand as solid pixel
 * figures, each pixel of the sprite a cube, and a ring of light hangs in
 * the air. Clouds built the same way drift overhead. The camera sits at the
 * current room and glides to the next one when you change page, so the
 * site is one place you move through.
 *
 * The pointer nudges the camera a little, enough to show it is a space and
 * not a picture; on a phone, tilting does the same. Under reduced motion
 * nothing drifts and the camera cuts straight to each room.
 *
 * On the first visit your name is built out of cubes on the horizon at
 * home, flying in from all over the sky. After that it is simply there.
 * At dusk the first stars come out, and at night the sky is full of them.
 */

const CLOUD: Sprite = {
  art: [
    "....pppp......",
    "..ppppppp.pp..",
    ".pppppppppppp.",
    "ppppppppppppps",
    ".sssssssssss..",
  ],
  palette: { p: "#FFFFFF", s: "#FFE1E8" },
  label: "",
};

type Cell = { x: number; y: number; color: string };

function cellsOf(sprite: Sprite): Cell[] {
  const out: Cell[] = [];
  sprite.art.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = sprite.palette[ch];
      if (color) out.push({ x, y, color });
    });
  });
  return out;
}

/** A sprite as cubes. Feet on y = 0, centred on x. */
function Voxels({
  sprite,
  position,
  size,
  depth = 1,
  spin = 0,
  bob = 0,
  phase = 0,
  still,
}: {
  sprite: Sprite;
  position: [number, number, number];
  size: number;
  depth?: number;
  spin?: number;
  bob?: number;
  phase?: number;
  still: boolean;
}) {
  const mesh = React.useRef<THREE.InstancedMesh>(null);
  const group = React.useRef<THREE.Group>(null);
  const cells = React.useMemo(() => cellsOf(sprite), [sprite]);
  const w = sprite.art[0].length;
  const h = sprite.art.length;

  React.useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    cells.forEach((cell, i) => {
      o.position.set(cell.x - (w - 1) / 2, h - 1 - cell.y + 0.5, 0);
      o.scale.set(1, 1, depth);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.set(cell.color));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [cells, depth, w, h]);

  useFrame((state) => {
    const g = group.current;
    if (!g || still) return;
    const t = state.clock.elapsedTime + phase;
    if (spin) g.rotation.y = Math.sin(t * 0.35) * spin;
    if (bob) g.position.y = position[1] + Math.sin(t * 0.9) * bob;
  });

  return (
    <group ref={group} position={position} scale={size}>
      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial />
      </instancedMesh>
    </group>
  );
}

const GROUND_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const GROUND_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCam;
  varying vec3 vWorld;
  void main() {
    // One cell is 1.6 units; the grid slides slowly toward you.
    vec2 g = vec2(vWorld.x, vWorld.z + uTime * 0.5) / 1.6;
    vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
    float line = 1.0 - min(min(d.x, d.y), 1.0);
    float dist = length(vWorld.xz - uCam.xz);
    float fade = 1.0 - smoothstep(5.0, 40.0, dist);
    gl_FragColor = vec4(vec3(1.0), line * 0.6 * fade);
  }
`;

function Ground({ still }: { still: boolean }) {
  const uniforms = React.useMemo(
    () => ({ uTime: { value: 0 }, uCam: { value: new THREE.Vector3() } }),
    [],
  );
  useFrame((state) => {
    uniforms.uTime.value = still ? 0 : state.clock.elapsedTime;
    uniforms.uCam.value.copy(state.camera.position);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[80, 0, -40]}>
      <planeGeometry args={[340, 180]} />
      <shaderMaterial
        vertexShader={GROUND_VERT}
        fragmentShader={GROUND_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* A ring of light over each room, turning slowly. */
function Ring({ x, still }: { x: number; still: boolean }) {
  const ref = React.useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current || still) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.4) * 0.12;
  });
  return (
    <mesh ref={ref} position={[x + 7, 7.5, -26]} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[4, 0.035, 8, 96]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
    </mesh>
  );
}

/* Deterministic scatter, so the clouds are in the same places every visit. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const CLOUDS = Array.from({ length: 18 }, (_, i) => ({
  x: -20 + rand(i + 1) * 200,
  y: 8 + rand(i + 31) * 5,
  z: -26 - rand(i + 61) * 22,
  size: 0.45 + rand(i + 91) * 0.35,
  phase: rand(i + 7) * 10,
}));

function Clouds({ still }: { still: boolean }) {
  const group = React.useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current || still) return;
    group.current.position.x += dt * 0.25;
    if (group.current.position.x > 40) group.current.position.x = -40;
  });
  return (
    <group ref={group}>
      {CLOUDS.map((c, i) => (
        <Voxels
          key={i}
          sprite={CLOUD}
          position={[c.x, c.y, c.z]}
          size={c.size}
          depth={3}
          bob={0.3}
          phase={c.phase}
          still={still}
        />
      ))}
    </group>
  );
}

/* A small pixel face for the name, five wide and seven tall. */
const GLYPHS: Record<string, string[]> = {
  N: ["x...x", "xx..x", "x.x.x", "x.x.x", "x..xx", "x...x", "x...x"],
  O: [".xxx.", "x...x", "x...x", "x...x", "x...x", "x...x", ".xxx."],
  A: [".xxx.", "x...x", "x...x", "xxxxx", "x...x", "x...x", "x...x"],
  H: ["x...x", "x...x", "x...x", "xxxxx", "x...x", "x...x", "x...x"],
};

const NAME_CELLS = (() => {
  const cells: { x: number; y: number }[] = [];
  "NOAH".split("").forEach((letter, li) => {
    GLYPHS[letter].forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === "x") cells.push({ x: li * 6 + x, y });
      });
    });
  });
  return cells;
})();
const NAME_WIDTH = 23;

/* Your name in cubes, on the horizon over home. */
/* Where the name stands: big and central on the title screen, or settled
   over the horizon at home once the game has started. */
const NAME_HOME = new THREE.Vector3(10, 9.5, -22);
const NAME_TITLE = new THREE.Vector3(0, 6.6, -12);
const NAME_HOME_SCALE = 0.5;
/* The title camera sits at z 12, so the title name is 24 away. */
const TITLE_DISTANCE = 24;

function NameBlocks({
  build,
  still,
  building,
  pointer,
}: {
  build: boolean;
  still: boolean;
  building: React.MutableRefObject<boolean>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const mesh = React.useRef<THREE.InstancedMesh>(null);
  const group = React.useRef<THREE.Group>(null);
  const placed = React.useRef(false);

  // On the title screen: centred, as wide as the screen allows, turning
  // toward the pointer. Otherwise home, small, over the horizon.
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const title = titleActive();
    const cam = state.camera as THREE.PerspectiveCamera;
    const visibleH = 2 * TITLE_DISTANCE * Math.tan(((cam.fov * Math.PI) / 180) / 2);
    const fit = Math.min(1, (visibleH * cam.aspect * 0.84) / NAME_WIDTH);
    const target = title ? NAME_TITLE : NAME_HOME;
    const scale = title ? fit : NAME_HOME_SCALE;
    const k = still || !placed.current ? 1 : 1 - Math.exp(-dt * 2);
    placed.current = true;
    g.position.lerp(target, k);
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * k);
    const turn = title && !still ? pointer.current.x * 0.35 : 0;
    const tip = title && !still ? pointer.current.y * 0.12 : 0;
    g.rotation.y += (turn - g.rotation.y) * k;
    g.rotation.x += (tip - g.rotation.x) * k;
  });
  const done = React.useRef(false);
  const start = React.useRef<number | null>(null);
  // Where each cube flies in from: scattered across the sky behind.
  const from = React.useMemo(
    () =>
      NAME_CELLS.map((_, i) => ({
        x: (rand(i + 401) - 0.5) * 60,
        y: 4 + rand(i + 503) * 30,
        z: -10 - rand(i + 607) * 30,
      })),
    [],
  );

  const place = React.useCallback(
    (progress: (i: number) => number) => {
      const m = mesh.current;
      if (!m) return;
      const o = new THREE.Object3D();
      NAME_CELLS.forEach((cell, i) => {
        const p = progress(i);
        const tx = cell.x - (NAME_WIDTH - 1) / 2;
        const ty = 6 - cell.y;
        o.position.set(
          from[i].x + (tx - from[i].x) * p,
          from[i].y + (ty - from[i].y) * p,
          from[i].z * (1 - p),
        );
        o.rotation.set((1 - p) * 3, (1 - p) * 2, 0);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    },
    [from],
  );

  React.useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color("#ffffff");
    NAME_CELLS.forEach((_, i) => m.setColorAt(i, c));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (!build || still) {
      place(() => 1);
      done.current = true;
      building.current = false;
    } else {
      place(() => 0);
      building.current = true;
    }
  }, [build, still, place, building]);

  useFrame((state) => {
    if (done.current) return;
    const now = state.clock.elapsedTime;
    if (start.current === null) start.current = now + 0.4;
    const t = now - start.current;
    let all = true;
    place((i) => {
      // Left to right, each cube landing with a long settle.
      const local = (t - (NAME_CELLS[i].x / NAME_WIDTH) * 0.7) / 1.3;
      if (local < 1) all = false;
      const k = Math.min(1, Math.max(0, local));
      return 1 - Math.pow(2, -10 * k);
    });
    if (all) {
      place(() => 1);
      done.current = true;
      building.current = false;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, NAME_CELLS.length]}>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshLambertMaterial />
      </instancedMesh>
    </group>
  );
}

/* Stars, high and far, never fogged out. */
function Stars({ phase }: { phase: Phase }) {
  const geometry = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 320;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -50 + rand(i + 1001) * 260;
      pos[i * 3 + 1] = 12 + rand(i + 2003) * 34;
      pos[i * 3 + 2] = -55 - rand(i + 3007) * 40;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const opacity = phase === "natt" ? 0.95 : phase === "kveld" ? 0.45 : 0;
  if (!opacity) return null;
  return (
    <points geometry={geometry}>
      <pointsMaterial color="#ffffff" size={0.32} sizeAttenuation transparent opacity={opacity} fog={false} />
    </points>
  );
}

function World({
  station,
  sky,
  still,
  pointer,
  travelling,
  phase,
  build,
  building,
}: {
  station: number;
  sky: string;
  still: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  travelling: React.MutableRefObject<boolean>;
  phase: Phase;
  build: boolean;
  building: React.MutableRefObject<boolean>;
}) {
  const { camera, scene } = useThree();
  const fog = React.useMemo(() => new THREE.Fog(sky, 14, 52), []); // eslint-disable-line react-hooks/exhaustive-deps
  const skyColor = React.useRef(new THREE.Color(sky));
  const look = React.useRef(new THREE.Vector3(station, 2, -6));
  const first = React.useRef(true);

  React.useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  React.useEffect(() => {
    skyColor.current.set(sky);
  }, [sky]);

  useFrame((_, dt) => {
    // The first frame puts the camera in the room; after that it travels.
    const snap = still || first.current;
    first.current = false;
    const k = snap ? 1 : 1 - Math.exp(-dt * 1.7);
    const px = still ? 0 : pointer.current.x;
    const py = still ? 0 : pointer.current.y;

    /*
     * On the title screen the camera looks up at the name in the sky.
     * Starting the game brings it down to the ground: the dive is the
     * same glide it uses between rooms.
     */
    const title = titleActive();
    const goal = title
      ? { x: station, y: 8 - py * 0.4, z: 12, lx: station, ly: 8.6, lz: -12 }
      : { x: station + px * 1.1, y: 2.8 - py * 0.6, z: 11, lx: station, ly: 2.2, lz: -6 };

    camera.position.x += (goal.x - camera.position.x) * k;
    camera.position.y += (goal.y - camera.position.y) * k;
    camera.position.z += (goal.z - camera.position.z) * k;
    look.current.x += (goal.lx - look.current.x) * k;
    look.current.y += (goal.ly - look.current.y) * k;
    look.current.z += (goal.lz - look.current.z) * k;
    camera.lookAt(look.current);
    travelling.current =
      Math.abs(goal.lx - look.current.x) +
        Math.abs(goal.ly - look.current.y) +
        Math.abs(goal.lz - look.current.z) >
      0.03;

    fog.color.lerp(skyColor.current, snap ? 1 : 1 - Math.exp(-dt * 2.5));
  });

  return (
    <>
      <hemisphereLight args={["#ffffff", "#e8a6c8", 2.2]} />
      <directionalLight position={[6, 10, 8]} intensity={1.4} />
      <Ground still={still} />
      <Stars phase={phase} />
      <Clouds still={still} />
      <NameBlocks build={build} still={still} building={building} pointer={pointer} />
      {STATIONS.map((x, i) => (
        <React.Fragment key={x}>
          <Ring x={x} still={still} />
          <Voxels
            sprite={i % 2 === 0 ? NOAH : DENJI}
            // Deep in the fog and off to the right: a figure on the horizon,
            // never something standing behind text.
            position={[x + 14, 0, -32]}
            size={0.45}
            depth={1}
            spin={0.5}
            phase={i * 1.7}
            still={still}
          />
        </React.Fragment>
      ))}
    </>
  );
}

export function WorldCanvas({
  station,
  sky,
  phase,
}: {
  station: number;
  sky: string;
  phase: Phase;
}) {
  const pointer = React.useRef({ x: 0, y: 0 });
  const [still, setStill] = React.useState(false);
  const travelling = React.useRef(false);
  const building = React.useRef(false);
  const lastMove = React.useRef(0);
  // The name is built only on the first page of a visit (see PowerOn).
  const [build] = React.useState(() => document.documentElement.hasAttribute("data-boot"));
  const busy = React.useCallback(
    () =>
      travelling.current || building.current || performance.now() - lastMove.current < 400,
    [],
  );

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStill(reduce.matches);
    apply();
    reduce.addEventListener("change", apply);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", move, { passive: true });
    const offTilt = onTilt((t) => {
      pointer.current = { x: t.x, y: t.y };
      lastMove.current = performance.now();
    });
    return () => {
      reduce.removeEventListener("change", apply);
      window.removeEventListener("pointermove", move);
      offTilt();
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ fov: 42, position: [station, 2.8, 11], near: 0.1, far: 120 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Idle, the world ticks over at 20 frames a second; moving, at full rate. */}
      <FrameDriver busy={busy} idleFps={still ? 1 : 20} />
      <World
        station={station}
        sky={sky}
        still={still}
        pointer={pointer}
        travelling={travelling}
        phase={phase}
        build={build}
        building={building}
      />
    </Canvas>
  );
}
