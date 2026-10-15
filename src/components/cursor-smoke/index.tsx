"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./cursor-smoke.module.scss";

type SmokeParticle = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

const particleCount = 100;
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D map;
  uniform float opacity;
  varying vec2 vUv;

  void main() {
    float distanceFromCenter = length(vUv - 0.5);
    float mask = 1.0 - smoothstep(0.05, 0.5, distanceFromCenter);
    float smoke = texture2D(map, vUv).r * mask;
    gl_FragColor = vec4(vec3(0.08, 0.1, 0.11), smoke * opacity);
  }
`;

export default function CursorSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!canvas || !finePointer.matches || reducedMotion.matches) {
      return;
    }

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch (error) {
      console.error("Could not initialize the cursor smoke effect.", error);
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -100,
      100,
    );
    const geometry = new THREE.PlaneGeometry(55, 57);
    const texture = new THREE.TextureLoader().load(
      "/assets/images/cursor-noise.jpeg",
      undefined,
      undefined,
      (error) => console.error("Could not load the cursor smoke texture.", error),
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const particles: SmokeParticle[] = Array.from(
      { length: particleCount },
      () => {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            opacity: { value: 0.5 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.visible = false;
        scene.add(particle);
        return particle;
      },
    );

    const mouse = new THREE.Vector2();
    const previousMouse = new THREE.Vector2();
    let currentParticle = 0;
    let animationFrame = 0;

    const render = () => {
      animationFrame = 0;

      if (
        Math.abs(mouse.x - previousMouse.x) > 0.5 ||
        Math.abs(mouse.y - previousMouse.y) > 0.5
      ) {
        const particle = particles[currentParticle];
        currentParticle = (currentParticle + 1) % particleCount;
        particle.visible = true;
        particle.scale.setScalar(3.5);
        particle.rotation.z = Math.random() * Math.PI * 2;
        particle.position.set(mouse.x - 0.9, mouse.y, 0);
        particle.material.uniforms.opacity.value = 0.5;
      }
      previousMouse.copy(mouse);

      let hasActiveParticles = false;
      for (const particle of particles) {
        if (!particle.visible) continue;

        const opacity = particle.material.uniforms.opacity.value * 0.96;
        particle.material.uniforms.opacity.value = opacity;

        if (opacity < 0.002) {
          particle.visible = false;
          continue;
        }

        particle.scale.x = 0.98 * particle.scale.x + 0.45;
        particle.scale.y = particle.scale.x;
        hasActiveParticles = true;
      }

      renderer.render(scene, camera);

      if (hasActiveParticles) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      mouse.set(event.clientX - width / 2, height / 2 - event.clientY);

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      texture.dispose();
      particles.forEach((particle) => particle.material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
