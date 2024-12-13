import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import { Car } from "./components/Car";

function AppInternal() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <Physics debug>
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 5, -5]} />
        <Car />
        <RigidBody type="fixed" position={[0, -2, 0]}>
          <mesh>
            <boxGeometry args={[100, 2, 100]} />
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
