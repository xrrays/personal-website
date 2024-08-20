import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './App.css';

function App() {
  const mountRef = useRef(null);    // Initialize a reference object
  // useRef is used to store values inside an object, can be fetched and changed, .current

  useEffect(() => {
    // Store the current value of the reference object, which is the <div> element
    const currentMount = mountRef.current;

    // To display anything with three.js you need a scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);  // Adding the scene/renderer to the <div> element

    // Create a test cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00205b });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup, remove the scene from the <div> component
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    // Use the reference object
    <div className="App">
      <div ref={mountRef} />
    </div>
  );
}

export default App;
