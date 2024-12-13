import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { usePoliceCar } from "./models/usePoliceCar";

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const carRef = useRef<RapierRigidBody>(null);

  return (
    <RigidBody
      restitution={1}
      position={[0, 10, 0]}
      ref={carRef}
      colliders="hull"
    >
      <primitive object={chassis} />
      {wheels.map((wheel) => (
        <primitive object={wheel} />
      ))}
    </RigidBody>
  );
}
