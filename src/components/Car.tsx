import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { usePoliceCar } from "./models/usePoliceCar";

export function Car() {
  const { chasis, wheels } = usePoliceCar();
  const carRef = useRef<RapierRigidBody>(null);

  return (
    <RigidBody
      ref={carRef}
      onContactForce={({ target }) => {
        //target.rigidBody?.applyImpulse({ x: 0, y: 5, z: 0 }, true);
      }}
    >
      <primitive object={chasis} />
    </RigidBody>
  );
}
