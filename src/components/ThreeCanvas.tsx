import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Project3DState } from "../types";

interface ThreeCanvasProps {
  projectState: Project3DState;
  viewMode: "exterior" | "interior" | "topdown";
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  projectState,
  viewMode,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      projectState.lighting.preset === "dia"
        ? "#e0f2fe"
        : projectState.lighting.preset === "por_do_sol"
        ? "#ffedd5"
        : projectState.lighting.preset === "festa_gourmet"
        ? "#111827"
        : "#090d16"
    );

    // Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Orbit Controls
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Camera positioning according to viewMode
    const tWidth = projectState.terrain.width || 10;
    const tLength = projectState.terrain.length || 20;

    if (viewMode === "topdown") {
      camera.position.set(0, Math.max(tWidth, tLength) * 1.8, 0.01);
      controls.target.set(0, 0, 0);
    } else if (viewMode === "interior") {
      camera.position.set(0, projectState.wallHeight * 0.5, tLength * 0.1);
      controls.target.set(0, projectState.wallHeight * 0.5, 0);
    } else {
      camera.position.set(tWidth * 1.5, Math.max(tWidth, tLength) * 0.9, tLength * 1.4);
      controls.target.set(0, projectState.wallHeight * 0.5, 0);
    }
    controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      projectState.lighting.preset === "dia" ? 0.8 : 0.3
    );
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(
      projectState.lighting.preset === "por_do_sol" ? 0xfba518 : 0xffffff,
      projectState.lighting.preset === "dia" ? 1.2 : 0.5
    );
    mainSun.position.set(tWidth, tWidth * 2, tLength);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    // Night Spotlights
    if (
      projectState.lighting.preset === "noite_spots" ||
      projectState.lighting.preset === "festa_gourmet"
    ) {
      const spotLight1 = new THREE.SpotLight(0xfacc15, 2, 20, Math.PI / 4);
      spotLight1.position.set(-tWidth * 0.2, projectState.wallHeight + 1, -tLength * 0.2);
      scene.add(spotLight1);

      const spotLight2 = new THREE.SpotLight(0x38bdf8, 2, 20, Math.PI / 4);
      spotLight2.position.set(tWidth * 0.3, projectState.wallHeight + 1, tLength * 0.2);
      scene.add(spotLight2);
    }

    // --- 1. TERRENO (LAND) ---
    const terrainGeo = new THREE.PlaneGeometry(tWidth, tLength);
    let terrainColor = "#15803d"; // Grama
    if (projectState.landscaping.grass === false) terrainColor = "#78350f"; // Terra

    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(terrainColor),
      roughness: 0.9,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Terrain Border Outline
    const edgesGeo = new THREE.EdgesGeometry(terrainGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
    const lineMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    lineMesh.rotation.x = -Math.PI / 2;
    scene.add(lineMesh);

    // --- 2. FUNDAÇÃO (FOUNDATION) ---
    const houseWidth = tWidth * 0.6;
    const houseLength = tLength * 0.5;
    const foundationHeight = 0.3;

    if (
      projectState.hasFoundation ||
      projectState.step === "fundacao" ||
      projectState.step === "paredes" ||
      projectState.step === "esquadrias" ||
      projectState.step === "telhado" ||
      projectState.step === "decoracao"
    ) {
      const foundGeo = new THREE.BoxGeometry(houseWidth, foundationHeight, houseLength);
      const foundMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      const foundMesh = new THREE.Mesh(foundGeo, foundMat);
      foundMesh.position.set(0, foundationHeight / 2, -tLength * 0.1);
      foundMesh.receiveShadow = true;
      foundMesh.castShadow = true;
      scene.add(foundMesh);
    }

    // --- 3. PAREDES (WALLS) ---
    if (
      projectState.step === "paredes" ||
      projectState.step === "esquadrias" ||
      projectState.step === "telhado" ||
      projectState.step === "decoracao"
    ) {
      const wHeight = projectState.wallHeight || 3;
      const wallMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(projectState.wallColor || "#f8fafc"),
        roughness: 0.5,
      });

      const wallThickness = 0.2;
      const hCenterZ = -tLength * 0.1;

      // Back Wall
      const backWallGeo = new THREE.BoxGeometry(houseWidth, wHeight, wallThickness);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(0, foundationHeight + wHeight / 2, hCenterZ - houseLength / 2);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      scene.add(backWall);

      // Left Wall
      const sideWallGeo = new THREE.BoxGeometry(wallThickness, wHeight, houseLength);
      const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
      leftWall.position.set(-houseWidth / 2, foundationHeight + wHeight / 2, hCenterZ);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      // Right Wall
      const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
      rightWall.position.set(houseWidth / 2, foundationHeight + wHeight / 2, hCenterZ);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      // Front Wall
      const frontWallGeo = new THREE.BoxGeometry(houseWidth, wHeight, wallThickness);
      const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
      frontWall.position.set(0, foundationHeight + wHeight / 2, hCenterZ + houseLength / 2);
      frontWall.castShadow = true;
      frontWall.receiveShadow = true;
      scene.add(frontWall);

      // --- 4. ESQUADRIAS (DOORS / WINDOWS) ---
      if (
        projectState.step === "esquadrias" ||
        projectState.step === "telhado" ||
        projectState.step === "decoracao"
      ) {
        // Front Main Door
        const doorGeo = new THREE.BoxGeometry(1.2, 2.2, 0.25);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 }); // Madeira GDM
        const doorMesh = new THREE.Mesh(doorGeo, doorMat);
        doorMesh.position.set(0, foundationHeight + 1.1, hCenterZ + houseLength / 2 + 0.05);
        scene.add(doorMesh);

        // Glass Windows
        const winGeo = new THREE.BoxGeometry(1.5, 1.2, 0.25);
        const winMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
        });

        const windowMesh1 = new THREE.Mesh(winGeo, winMat);
        windowMesh1.position.set(-houseWidth / 4, foundationHeight + 1.8, hCenterZ + houseLength / 2 + 0.05);
        scene.add(windowMesh1);

        const windowMesh2 = new THREE.Mesh(winGeo, winMat);
        windowMesh2.position.set(houseWidth / 4, foundationHeight + 1.8, hCenterZ + houseLength / 2 + 0.05);
        scene.add(windowMesh2);
      }

      // --- 5. TELHADO (ROOF) ---
      if (
        (projectState.step === "telhado" || projectState.step === "decoracao") &&
        projectState.roofType !== "sem"
      ) {
        const roofY = foundationHeight + wHeight;

        if (projectState.roofType === "colonial") {
          const roofGeo = new THREE.ConeGeometry(Math.max(houseWidth, houseLength) * 0.7, 2, 4);
          const roofMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(projectState.roofColor || "#991b1b"),
            roughness: 0.6,
          });
          const roofMesh = new THREE.Mesh(roofGeo, roofMat);
          roofMesh.position.set(0, roofY + 1, hCenterZ);
          roofMesh.rotation.y = Math.PI / 4;
          roofMesh.castShadow = true;
          scene.add(roofMesh);
        } else if (projectState.roofType === "flat") {
          const roofGeo = new THREE.BoxGeometry(houseWidth + 0.4, 0.3, houseLength + 0.4);
          const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
          const roofMesh = new THREE.Mesh(roofGeo, roofMat);
          roofMesh.position.set(0, roofY + 0.15, hCenterZ);
          roofMesh.castShadow = true;
          scene.add(roofMesh);
        }
      }

      // --- 6. PISCINA COM BORDA INFINITA ---
      if (projectState.pool.hasPool) {
        const poolW = projectState.pool.width || 3;
        const poolL = projectState.pool.length || 6;
        const poolX = houseWidth / 2 + poolW / 2 + 0.8;
        const poolZ = -tLength * 0.1;

        // Water Pool Box
        const poolBoxGeo = new THREE.BoxGeometry(poolW, 0.8, poolL);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.1,
          metalness: 0.3,
          transparent: true,
          opacity: 0.8,
        });
        const poolMesh = new THREE.Mesh(poolBoxGeo, waterMat);
        poolMesh.position.set(poolX, 0.4, poolZ);
        scene.add(poolMesh);

        // Borda Infinita Glass Wall
        if (projectState.pool.type === "borda_infinita") {
          const glassBorderGeo = new THREE.BoxGeometry(0.1, 0.9, poolL);
          const glassBorderMat = new THREE.MeshStandardMaterial({
            color: 0xe0f2fe,
            transparent: true,
            opacity: 0.4,
            roughness: 0.05,
          });
          const glassMesh = new THREE.Mesh(glassBorderGeo, glassBorderMat);
          glassMesh.position.set(poolX + poolW / 2 + 0.05, 0.45, poolZ);
          scene.add(glassMesh);
        }
      }

      // --- 7. ÁREA GOURMET (CHURRASQUEIRA & MESA DE SINUCA) ---
      if (projectState.gourmet.hasGourmet) {
        const gourmetX = -houseWidth / 2 - 2;
        const gourmetZ = 0;

        // Cover Canopy
        const gCanopyGeo = new THREE.BoxGeometry(3.5, 0.2, 4);
        const gCanopyMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const gCanopy = new THREE.Mesh(gCanopyGeo, gCanopyMat);
        gCanopy.position.set(gourmetX, 2.8, gourmetZ);
        scene.add(gCanopy);

        // Columns
        for (const [dx, dz] of [
          [-1.5, -1.8],
          [1.5, -1.8],
          [-1.5, 1.8],
          [1.5, 1.8],
        ]) {
          const colGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8);
          const colMat = new THREE.MeshStandardMaterial({ color: 0x27272a });
          const col = new THREE.Mesh(colGeo, colMat);
          col.position.set(gourmetX + dx, 1.4, gourmetZ + dz);
          scene.add(col);
        }

        // Churrasqueira
        if (projectState.gourmet.churrasqueira) {
          const churrasGeo = new THREE.BoxGeometry(0.9, 2.2, 0.9);
          const churrasMat = new THREE.MeshStandardMaterial({ color: 0x991b1b }); // Tijolo
          const churras = new THREE.Mesh(churrasGeo, churrasMat);
          churras.position.set(gourmetX - 1, 1.1, gourmetZ - 1.2);
          scene.add(churras);
        }

        // Mesa de Sinuca
        if (projectState.gourmet.mesaSinuca) {
          const sinucaGeo = new THREE.BoxGeometry(1.8, 0.8, 1.0);
          const sinucaMat = new THREE.MeshStandardMaterial({ color: 0x15803d }); // Pano verde
          const sinuca = new THREE.Mesh(sinucaGeo, sinucaMat);
          sinuca.position.set(gourmetX + 0.2, 0.4, gourmetZ + 0.2);
          scene.add(sinuca);
        }
      }

      // --- 8. MÓVEIS PLANEJADOS GDM (DENTRO DA CASA) ---
      if (projectState.furniture.cozinha) {
        // Cozinha Planejada MDF
        const cabinetGeo = new THREE.BoxGeometry(2.2, 0.9, 0.6);
        const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 }); // MDF Preto Fosco
        const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
        cabinet.position.set(-houseWidth / 4, foundationHeight + 0.45, hCenterZ - houseLength / 3);
        scene.add(cabinet);
      }

      // Mesa de Jantar / Mesa
      if (projectState.furniture.mesaJantar || projectState.furniture.cozinha) {
        const tableTopGeo = new THREE.BoxGeometry(1.6, 0.08, 1.0);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 }); // Madeira GDM
        const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
        tableTop.position.set(0, foundationHeight + 0.75, hCenterZ - houseLength / 6);
        tableTop.castShadow = true;
        scene.add(tableTop);

        // Pés da Mesa
        for (const [dx, dz] of [
          [-0.7, -0.4],
          [0.7, -0.4],
          [-0.7, 0.4],
          [0.7, 0.4],
        ]) {
          const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75);
          const legMat = new THREE.MeshStandardMaterial({ color: 0x27272a });
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(dx, foundationHeight + 0.375, hCenterZ - houseLength / 6 + dz);
          scene.add(leg);
        }
      }

      // Poltrona / Sofá com movimentação dinâmica por voz
      if (
        projectState.furniture.salaTV ||
        projectState.furniture.sofaPoltrona
      ) {
        // Offset de posição vindo dos comandos de voz ("mover poltrona")
        const offset = projectState.furniture.poltronaOffset || 0;
        const customPos = projectState.furniture.poltronaPosicao;
        const posX = customPos ? customPos.x : (offset % 2 === 0 ? houseWidth / 4 : houseWidth / 5);
        const posZ = customPos ? customPos.z : hCenterZ + houseLength / 4 + (offset * 0.4) % 1.5;

        // Base do Sofá/Poltrona
        const sofaGeo = new THREE.BoxGeometry(1.8, 0.5, 0.9);
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.8 }); // Estofado Grafite
        const sofa = new THREE.Mesh(sofaGeo, sofaMat);
        sofa.position.set(posX, foundationHeight + 0.25, posZ);
        sofa.castShadow = true;
        scene.add(sofa);

        // Encosto do Sofá/Poltrona
        const backrestGeo = new THREE.BoxGeometry(1.8, 0.6, 0.25);
        const backrest = new THREE.Mesh(backrestGeo, sofaMat);
        backrest.position.set(posX, foundationHeight + 0.55, posZ - 0.32);
        backrest.castShadow = true;
        scene.add(backrest);

        // Poltrona de Destaque
        const armchairGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
        const armchairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }); // Couro Mostarda GDM
        const armchair = new THREE.Mesh(armchairGeo, armchairMat);
        armchair.position.set(posX - 1.3, foundationHeight + 0.25, posZ + 0.3);
        armchair.rotation.y = Math.PI / 4;
        armchair.castShadow = true;
        scene.add(armchair);
      }

      // Quarto Casal
      if (projectState.furniture.quartoCasal) {
        const bedGeo = new THREE.BoxGeometry(1.6, 0.45, 2.0);
        const bedMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
        const bed = new THREE.Mesh(bedGeo, bedMat);
        bed.position.set(houseWidth / 4, foundationHeight + 0.225, hCenterZ - houseLength / 3);
        bed.castShadow = true;
        scene.add(bed);
      }

      // --- 9. SERRALHERIA (PORTÃO METÁLICO) ---
      if (projectState.locksmith.metalGate) {
        const gateGeo = new THREE.BoxGeometry(tWidth * 0.4, 2.2, 0.1);
        const gateMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 });
        const gate = new THREE.Mesh(gateGeo, gateMat);
        gate.position.set(0, 1.1, tLength / 2 - 0.2);
        scene.add(gate);
      }
    }

    // Render Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [projectState, viewMode]);

  return (
    <div className="relative w-full h-[500px] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Renderizador 3D em Tempo Real • UNIVERSO ADAS</span>
      </div>
    </div>
  );
};
