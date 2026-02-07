import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const Scene = () => {
  const model = useGLTF("/models/dog.drc.glb");
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.z = 0.5;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, []);

  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: sampleMatCap,
      });
    }
  });
  const ref = useRef(null);
  const rotationSpeed = Math.PI / 3; // 45° per second

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <>
      <primitive
        ref={ref}
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
