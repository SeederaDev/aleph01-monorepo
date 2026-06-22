import { useEffect, useRef } from "react";
import * as THREE from "three";

/* A 3D radar / perimeter scan: concentric rings, a rotating sweep and blips
   that light up as the sweep passes — echoing "from port to perimeter" and
   AI-enhanced cyber early-detection. White on the dark spotlight card. */
export default function SpotlightScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = mount.clientWidth || 1;
    let h = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
    camera.position.set(0, 5.6, 3.9);   // ~55° elevation so the disc reads open, not squashed
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
<<<<<<< HEAD
    group.position.x = 1.1;            // sit on the right half of the card
    group.position.y = 0.75;           // lift it higher / better centered in the card
=======
    group.position.x = 2.4;            // sit on the right side of the card
>>>>>>> e6395389c0fafcfe1893a2802755ce610beec96a
    group.rotation.x = 0;
    scene.add(group);

    const R = 2.6;
    const ringMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });

    // concentric rings (in the XZ plane)
    [0.9, 1.55, 2.2, R].forEach((r) => {
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
    });

    // cross-hairs
    const crossMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
    [[new THREE.Vector3(-R, 0, 0), new THREE.Vector3(R, 0, 0)],
     [new THREE.Vector3(0, 0, -R), new THREE.Vector3(0, 0, R)]].forEach((seg) => {
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(seg), crossMat));
    });

    // rotating sweep (trailing sector + bright leading edge)
    const sweep = new THREE.Group();
    const sector = new THREE.Mesh(
      new THREE.CircleGeometry(R, 48, -0.6, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })
    );
    sector.rotation.x = -Math.PI / 2; // lay flat into XZ
    sweep.add(sector);
    sweep.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(R, 0, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
    ));
    group.add(sweep);

    // blips that pulse as the sweep passes
    const blipData = [
      [1.4, 0.6], [2.1, 2.1], [0.8, 3.4], [2.3, 4.3], [1.7, 5.2], [2.45, 1.3],
    ];
    const blips = blipData.map(([r, a]) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
      );
      m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      m.userData.angle = a;
      group.add(m);
      return m;
    });

    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    mount.addEventListener("pointermove", onMove);

    const TAU = Math.PI * 2;
    let raf = 0;
    const frame = () => {
      sweep.rotation.y -= 0.012;
      const lead = ((-sweep.rotation.y) % TAU + TAU) % TAU;
      blips.forEach((b) => {
        let phase = (lead - b.userData.angle) % TAU;
        if (phase < 0) phase += TAU;
        b.material.opacity = 0.14 + 0.86 * Math.exp(-phase * 2.4);
        const s = 1 + b.material.opacity * 0.7;
        b.scale.setScalar(s);
      });
      group.rotation.z = mx * 0.1;
      group.rotation.x = my * 0.1;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);

    const onResize = () => {
      w = mount.clientWidth || 1;
      h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="spot3d" ref={mountRef} aria-hidden="true" />;
}
