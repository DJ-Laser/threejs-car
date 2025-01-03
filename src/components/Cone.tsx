import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useCone } from "./models/useCone";

export function Cone(props: RigidBodyProps) {
  const cone = useCone(1.5);
  console.log(cone);

  return (
    <RigidBody colliders="hull" {...props}>
      <primitive object={cone} />
    </RigidBody>
  );
}
