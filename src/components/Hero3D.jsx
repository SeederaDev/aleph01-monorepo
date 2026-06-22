import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

/* A floating tesseract (4D hypercube projected to 3D), rotating in 4D + 3D.
   Thick dark edges (fat lines) + small shaded spheres at each intersection, on a
   transparent canvas so it reads as floating in the page. Mouse-reactive; renders
   a single static frame under prefers-reduced-motion. */
export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = mount.clientWidth || 1;
    let h = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    // lights so the spheres read as 3D volumes
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    scene.add(key);

    // 16 vertices of a 4D hypercube (±1)^4
    const verts4 = [];
    for (let i = 0; i < 16; i++) {
      verts4.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
    }
    // 32 edges: vertex pairs differing in exactly one coordinate (one bit)
    const edges = [];
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        const x = i ^ j;
        if ((x & (x - 1)) === 0) edges.push([i, j]);
      }

    const COLOR = 0x2d2f33; // ink — visible on the light page
    const group = new THREE.Group();

    // Fat lines (linewidth honoured in pixels, unlike LineBasicMaterial)
    const positions = new Float32Array(edges.length * 2 * 3);
    const lineGeo = new LineSegmentsGeometry();
    const lineMat = new LineMaterial({ color: 0xababab, linewidth: 2, transparent: true, opacity: 0.8 });
    lineMat.resolution.set(w, h);
    const lines = new LineSegments2(lineGeo, lineMat);
    lines.frustumCulled = false;
    group.add(lines);

    // a small sphere at every intersection
    const sphereGeo = new THREE.SphereGeometry(0.04, 18, 18);
    const sphereMat = new THREE.MeshStandardMaterial({ color: COLOR, roughness: 1, metalness: 0.0 });
    const spheres = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(sphereGeo, sphereMat);
      spheres.push(m);
      group.add(m);
    }
    scene.add(group);

    const proj = new Array(16);
    const D = 2.6, S = 2.0; // 4D viewer distance & scale

    function update(a, b) {
      const ca = Math.cos(a), sa = Math.sin(a);
      const cb = Math.cos(b), sb = Math.sin(b);
      for (let i = 0; i < 16; i++) {
        const [x, y, z, wv] = verts4[i];
        const x1 = x * ca - wv * sa;       // rotate in XW plane
        const w1 = x * sa + wv * ca;
        const y1 = y * cb - w1 * sb;       // rotate in YW plane
        const w2 = y * sb + w1 * cb;
        const k = 1 / (D - w2);            // perspective project 4D -> 3D
        const X = x1 * k * S, Y = y1 * k * S, Z = z * k * S;
        proj[i] = [X, Y, Z];
        spheres[i].position.set(X, Y, Z);
        // closer-in-4D vertices read slightly larger
        const s = 0.8 + k * 0.9;
        spheres[i].scale.setScalar(s);
      }
      let o = 0;
      for (const [i, j] of edges) {
        positions[o++] = proj[i][0]; positions[o++] = proj[i][1]; positions[o++] = proj[i][2];
        positions[o++] = proj[j][0]; positions[o++] = proj[j][1]; positions[o++] = proj[j][2];
      }
      lineGeo.setPositions(positions);
    }

    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    mount.addEventListener("pointermove", onMove);

    let raf = 0, t = 0;
    const frame = () => {
      t += 0.006;
      update(t * 0.7, t * 0.45);
      group.rotation.y += 0.0035;
      group.rotation.x += (my * 0.6 - group.rotation.x) * 0.05;
      group.rotation.z += (mx * 0.4 - group.rotation.z) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    update(0.4, 0.2);
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);

    const onResize = () => {
      w = mount.clientWidth || 1;
      h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      lineMat.resolution.set(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onMove);
      lineGeo.dispose();
      lineMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero3d" ref={mountRef} aria-hidden="true" />;
}
