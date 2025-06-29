import { useEffect, useRef } from "react";
import * as THREE from "three";

type WebGLCanvasProps = {
  depth?: boolean;
  stencil?: boolean;
  antialias?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: WebGLPowerPreference;
  failIfMajorPerformanceCaveat?: boolean;
};

export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  depth = true,
  stencil = false,
  antialias = true,
  premultipliedAlpha = true,
  preserveDrawingBuffer = false,
  powerPreference = "high-performance",
  failIfMajorPerformanceCaveat = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("webgl2", {
      alpha: true,
      depth,
      stencil,
      antialias,
      premultipliedAlpha,
      preserveDrawingBuffer,
      powerPreference,
      failIfMajorPerformanceCaveat,
    });

    if (!context) {
      console.error("WebGL2 not supported or context creation failed.");
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: context as WebGL2RenderingContext,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    depth,
    stencil,
    antialias,
    premultipliedAlpha,
    preserveDrawingBuffer,
    powerPreference,
    failIfMajorPerformanceCaveat,
  ]);

  return <canvas ref={canvasRef} className="w-full h-screen block" />;
};
