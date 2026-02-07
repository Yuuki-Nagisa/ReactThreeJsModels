import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
const Scene = () => {
  const model = useGLTF("/models/model.glb");
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.z = 8;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, []);

  const [cupAlbedo, cupNormal, cupRoughness, cupMetallic, cupAO] = useTexture([
    "/canTextures/m_cup_albedo.jpeg",
    "/canTextures/m_cup_normal.png",
    "/canTextures/m_cup_roughness.jpeg",
    "/canTextures/m_cup_metallic.jpeg",
    "/canTextures/m_cup_AO.jpeg",
  ]).map((texture) => {
    texture.flipY = false;
    return texture;
  });
  cupAlbedo.colorSpace = THREE.SRGBColorSpace;
  cupAO.needsUpdate = true;
  const [labelAlbedo, labelNormal, labelRoughness, labelMetallic, labelAO] =
    useTexture([
      "/canTextures/M_Label_albedo.jpeg",
      "/canTextures/M_Label_normal.png",
      "/canTextures/M_Label_roughness.jpeg",
      "/canTextures/M_Label_metallic.jpeg",
      "/canTextures/M_Label_AO.jpeg",
    ]).map((texture) => {
      texture.flipY = false;
      return texture;
    });
  labelAlbedo.colorSpace = THREE.SRGBColorSpace;

  model.scene.traverse((child) => {
    if (child.name.includes("Node4")) {
      child.material = new THREE.MeshStandardMaterial({
        map: cupAlbedo,
        normalMap: cupNormal,
        roughnessMap: cupRoughness,
        metalnessMap: cupMetallic,
        aoMap: cupAO,
      });
    }
    if (child.name.includes("Node2")) {
      child.material = new THREE.MeshStandardMaterial({
        map: labelAlbedo,
        normalMap: labelNormal,
        roughnessMap: labelRoughness,
        metalnessMap: labelMetallic,
        aoMap: labelAO,
      });
      if (!child.geometry.attributes.uv2) {
        child.geometry.setAttribute(
          "uv2",
          new THREE.BufferAttribute(child.geometry.attributes.uv.array, 2),
        );
      }
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
        position={[0, -2, 2]}
        rotation={[Math.PI / 7, 0, 0]}
      />
      <directionalLight position={[10, 10, 10]} intensity={5} />
      <directionalLight position={[-10, -10, 10]} intensity={5} />
      <ambientLight intensity={0.5} />
      <OrbitControls />
    </>
  );
};
const Can = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
};

export default Can;
