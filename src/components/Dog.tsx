import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";

const Scene = () => {
  const model = useGLTF("/models/dog.drc.glb");
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 0.5;
  }, []);

  const textures = useTexture({
    normalMap: "/dog_normals.jpg",
    matcap: "/matcap/sample.png",
  });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = new THREE.MeshMatcapMaterial({
        normalMap: textures.normalMap,
        matcap: textures.matcap,
      });
    }
  });

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.55, 0]}
        rotation={[0, Math.PI / 4.6, 0]}
      />
      <directionalLight position={[0, 5, 5]} intensity={2} />
      <ambientLight intensity={0.5} />
      <OrbitControls />
    </>
  );
};

const Dog = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
};

export default Dog;
