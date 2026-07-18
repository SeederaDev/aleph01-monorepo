import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

/* A floating tesseract (4D hypercube projected to 3D), rotating in 4D + 3D.
   Thick dark edges (fat lines) + small shaded spheres at each intersection, on a
   transparent canvas so it reads as floating in the page. Mouse-reactive; renders
   a single static frame under prefers-reduced-motion. Vertices can be grabbed and
   dragged — the structure stretches like a mass-spring network and springs back
   on release. */
export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = mount.clientWidth || 1;
    let h = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    // Wider FOV than the visual footprint needs — gives the drag interaction room to
    // stretch a vertex over the navbar above and past the copy, logos bar and whatever
    // sits below, before it would ever leave the frustum and disappear. 135.8° isn't
    // arbitrary: the original .hero3d top+bottom insets in styles.css (0.15 + 0.55, a
    // combined 1.7x the card height) grew to 2.65 + 3.05 (6.7x, a 3.941x factor) to make
    // room for that reach, and this FOV is widened by the exact same factor — tan(135.8°/2)
    // = tan(64°/2)*3.941 — off the ORIGINAL 64° baseline. Growing the CSS insets and this
    // FOV in lockstep off that same baseline is what keeps the tesseract's resting size
    // pixel-identical; change one without the other and the resting shape will rescale.
    const camera = new THREE.PerspectiveCamera(135.8, w / h, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);
    // The canvas footprint is deliberately bigger than the visual card (see .hero3d in
    // styles.css) so a dragged vertex can travel past the card's edges. It stays
    // pointer-events:none (CSS) so that overflow never blocks clicks on real page
    // content underneath — all hit-testing below is done with raycasting against
    // window-level pointer events instead of relying on DOM hit-testing.

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
    // adjacency list, used to propagate stress between connected vertices
    const neighbors = Array.from({ length: 16 }, () => []);
    edges.forEach(([i, j]) => { neighbors[i].push(j); neighbors[j].push(i); });

    const COLOR = 0x2d2f33; // ink — visible on the light page
    const HILITE = 0x9a9a9a; // grey — grabbed vertex
    const group = new THREE.Group();

    // Fat lines (linewidth honoured in pixels, unlike LineBasicMaterial)
    const positions = new Float32Array(edges.length * 2 * 3);
    const lineGeo = new LineSegmentsGeometry();
    const lineMat = new LineMaterial({ color: 0xababab, linewidth: 2, transparent: true, opacity: 0.8 });
    lineMat.resolution.set(w, h);
    const lines = new LineSegments2(lineGeo, lineMat);
    lines.frustumCulled = false;
    group.add(lines);

    // a small sphere at every intersection — separate material per vertex so the
    // grabbed one can be highlighted without affecting the rest
    const sphereGeo = new THREE.SphereGeometry(0.04, 18, 18);
    const spheres = [];
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: COLOR, roughness: 1, metalness: 0.0 });
      const m = new THREE.Mesh(sphereGeo, mat);
      spheres.push(m);
      group.add(m);
    }
    scene.add(group);

    const proj = Array.from({ length: 16 }, () => new THREE.Vector3());
    const depthScale = new Array(16).fill(1);
    const offsets = Array.from({ length: 16 }, () => new THREE.Vector3());
    const velocities = Array.from({ length: 16 }, () => new THREE.Vector3());
    const D = 2.6, S = 2.0; // 4D viewer distance & scale

    /* Recompute each vertex's "rest" position (and 4D-closeness scale) from the 4D rotation. */
    function updateBase(a, b) {
      const ca = Math.cos(a), sa = Math.sin(a);
      const cb = Math.cos(b), sb = Math.sin(b);
      for (let i = 0; i < 16; i++) {
        const [x, y, z, wv] = verts4[i];
        const x1 = x * ca - wv * sa;       // rotate in XW plane
        const w1 = x * sa + wv * ca;
        const y1 = y * cb - w1 * sb;       // rotate in YW plane
        const w2 = y * sb + w1 * cb;
        const k = 1 / (D - w2);            // perspective project 4D -> 3D
        proj[i].set(x1 * k * S, y1 * k * S, z * k * S);
        depthScale[i] = 0.8 + k * 0.9;     // closer-in-4D vertices read slightly larger
      }
    }

    /* Mass-spring relaxation of the drag offsets: each vertex is pulled back
       toward rest (0 offset) and coupled to its edge-neighbors, so grabbing one
       vertex visibly stresses the whole lattice. */
    const SPRING_HOME = 34;
    const SPRING_EDGE = 16;
    const DAMPING = 7;
    // How far (in world units, from the origin) a vertex may be dragged before it
    // would leave the camera frustum — recomputed on resize so it always tracks the
    // actual visible area instead of an arbitrary fixed cap.
    let safeRadius = 3;
    function updateSafeRadius() {
      const halfH = camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      const halfW = halfH * camera.aspect;
      safeRadius = Math.min(halfH, halfW) * 0.9;
    }
    function stepPhysics(dt) {
      for (let i = 0; i < 16; i++) {
        if (i === draggedIndex) continue; // kinematic while held
        const o = offsets[i], v = velocities[i];
        const f = o.clone().multiplyScalar(-SPRING_HOME);
        for (const j of neighbors[i]) f.add(offsets[j].clone().sub(o).multiplyScalar(SPRING_EDGE));
        v.addScaledVector(f, dt);
        v.multiplyScalar(Math.max(0, 1 - DAMPING * dt));
        o.addScaledVector(v, dt);
      }
    }

    /* Push the (base + offset) positions into the spheres and the fat-line buffer. */
    function render3D() {
      let o = 0;
      for (let i = 0; i < 16; i++) {
        const X = proj[i].x + offsets[i].x, Y = proj[i].y + offsets[i].y, Z = proj[i].z + offsets[i].z;
        spheres[i].position.set(X, Y, Z);
        const stretch = 1 + offsets[i].length() * 0.12; // vertices under tension read slightly larger
        const s = depthScale[i] * stretch * (i === draggedIndex ? 1.3 : 1);
        spheres[i].scale.setScalar(s);
      }
      for (const [i, j] of edges) {
        const a = spheres[i].position, b = spheres[j].position;
        positions[o++] = a.x; positions[o++] = a.y; positions[o++] = a.z;
        positions[o++] = b.x; positions[o++] = b.y; positions[o++] = b.z;
      }
      lineGeo.setPositions(positions);
    }

    // Subtle tilt-toward-mouse, tracked globally since the canvas itself is
    // pointer-events:none (see .hero3d in styles.css).
    let mx = 0, my = 0;
    const updateTilt = (e) => {
      const r = mount.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };

    // ---- Drag-to-stress interaction ----
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const planeHit = new THREE.Vector3();
    let draggedIndex = -1;
    let hoveredIndex = -1;

    // Hit-testing is done purely by raycasting math against `window`-level pointer
    // events (not DOM hit-testing), because the canvas is pointer-events:none — its
    // footprint overlaps real page content (see .hero3d in styles.css) and must never
    // block clicks on it.
    function setPointerFromEvent(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }

    function hitTestVertex(e) {
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(spheres, false);
      return hits.length ? spheres.indexOf(hits[0].object) : -1;
    }

    function onPointerDown(e) {
      const idx = hitTestVertex(e);
      if (idx === -1) return;
      draggedIndex = idx;
      velocities[idx].set(0, 0, 0);
      spheres[idx].material.color.setHex(HILITE);
      // ignore depth while held so the grabbed vertex never gets hidden behind
      // an edge as it's stretched across the lattice
      spheres[idx].material.depthTest = false;
      spheres[idx].renderOrder = 999;
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      dragPlane.setFromNormalAndCoplanarPoint(camDir, spheres[idx].getWorldPosition(new THREE.Vector3()));
      document.body.style.cursor = "grabbing";
      kickFrame();
      e.preventDefault();
    }

    function onPointerDrag(e) {
      updateTilt(e);
      if (draggedIndex === -1) {
        // hover feedback when not dragging
        const idx = hitTestVertex(e);
        if (idx !== hoveredIndex) {
          hoveredIndex = idx;
          document.body.style.cursor = idx === -1 ? "" : "grab";
        }
        return;
      }
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointerNDC, camera);
      if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
        const local = group.worldToLocal(planeHit.clone());
        // clamp the *final* position (not just the offset) to a safe radius around
        // the origin, so a vertex that's already far from center on its own can't be
        // dragged past the edge of the frustum and vanish
        if (local.length() > safeRadius) local.setLength(safeRadius);
        offsets[draggedIndex].copy(local.clone().sub(proj[draggedIndex]));
      }
      e.preventDefault();
    }

    function onPointerUp() {
      if (draggedIndex === -1) return;
      spheres[draggedIndex].material.color.setHex(COLOR);
      spheres[draggedIndex].material.depthTest = true;
      spheres[draggedIndex].renderOrder = 0;
      draggedIndex = -1;
      document.body.style.cursor = "";
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerDrag);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    let raf = 0, t = 0, prev = performance.now();
    const isSettled = () => draggedIndex === -1 && offsets.every((o) => o.lengthSq() < 1e-6);
    const frame = (now) => {
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;

      if (!reduce) {
        t += 0.006;
        group.rotation.y += 0.0035;
        group.rotation.x += (my * 0.6 - group.rotation.x) * 0.05;
        group.rotation.z += (mx * 0.4 - group.rotation.z) * 0.05;
      }
      updateBase(t * 0.7, t * 0.45);
      stepPhysics(dt);
      render3D();
      renderer.render(scene, camera);
      // reduced motion: only keep animating while the user is actively stressing the lattice
      if (!reduce || !isSettled()) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const kickFrame = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(frame); } };

    updateSafeRadius();
    updateBase(0.4, 0.2);
    render3D();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      w = mount.clientWidth || 1;
      h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      lineMat.resolution.set(w, h);
      updateSafeRadius();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerDrag);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (document.body.style.cursor === "grab" || document.body.style.cursor === "grabbing") {
        document.body.style.cursor = "";
      }
      lineGeo.dispose();
      lineMat.dispose();
      sphereGeo.dispose();
      spheres.forEach((m) => m.material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero3d" ref={mountRef} aria-hidden="true" />;
}
