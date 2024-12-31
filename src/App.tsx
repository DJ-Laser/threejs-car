import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { PropsWithChildren, Suspense, useRef } from "react";
import { Car } from "./components/Car";

function AppWrapper({ children }: PropsWithChildren) {
  return (
    <div id="canvas-container" className="w-full h-full">
      <Suspense fallback="Loading... ._.">
        <Canvas shadows="soft">
          <Physics debug>{children}</Physics>
        </Canvas>
      </Suspense>
    </div>
  );
}

function App() {
  const lightRef = useRef(null);
  const shadow_size = 10;
  const shadow_map_size = 2048;

  return (
    <AppWrapper>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-5, 5, 0]}
        shadow-camera-top={shadow_size}
        shadow-camera-right={shadow_size}
        shadow-camera-bottom={-shadow_size}
        shadow-camera-left={-shadow_size}
        shadow-mapSize-height={shadow_map_size}
        shadow-mapSize-width={shadow_map_size}
        castShadow
        ref={lightRef}
      />
      <Car lightRef={lightRef} />
      <RigidBody type="fixed" position={[0, -2, 0]}>
        <mesh position={[75, 0, 0]} receiveShadow>
          <boxGeometry args={[300, 2, 150]} />
          <meshStandardMaterial />
        </mesh>
        <mesh
          position={[20, 1, 0]}
          rotation={[0, 0, 0.35]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[10, 2, 20]} />
          <meshStandardMaterial />
        </mesh>
        <mesh
          position={[37, 1, 0]}
          rotation={[0, 0, -0.35]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[10, 2, 20]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </AppWrapper>
  );
}

export default App;
