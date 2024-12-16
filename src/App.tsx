import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import { Car } from "./components/Car";

function AppInternal() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }} shadows>
      <Physics debug>
        <ambientLight intensity={0.2} />
        <directionalLight position={[-5, 5, 0]} castShadow />
        <Car />
        <RigidBody type="fixed" position={[0, -2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[100, 2, 100]} />
            <meshStandardMaterial />
          </mesh>
          <mesh castShadow position={[0, 3, -3]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}

function App() {
  return (
    <div id="canvas-container" className="w-full h-full">
      <Suspense fallback="Loading... ._.">
        <AppInternal />
      </Suspense>
    </div>
  );
}

export default App;
