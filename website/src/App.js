import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';
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

    // Create a floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    // Rotate the floor to lie flat on the xz plane
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1; // Lower the floor so the cube is on top of it
    scene.add(floor);

    // Add the controls and an event listener
    const controls = new PointerLockControls(camera, currentMount);
    // Initial control lock when clicked
    currentMount.addEventListener('click', () => {
      controls.lock();
    });

    const minY = 0.1 // Minimum camera height for moving downwards

    // Movement key flags
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;

    // Keydown event handler
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = true;
          break;
        case 'Space':
          moveUp = true;
          break;
        case 'ShiftLeft':
          moveDown = true;
          break;
        default:
          // No action needed for other keys yet
          break;
      }
    };

    // Keyup event handler
    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = false;
          break;
          case 'Space':
            moveUp = false;
            break;
          case 'ShiftLeft':
            moveDown = false;
            break;
        default:
          // No action needed for other keys yet
          break;
      }
    };

    // Add event listeners for keydown and keyup
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Movement parameters
    const velocity = new THREE.Vector3(); // Track how fast user is moving in each direction
    const direction = new THREE.Vector3(); // Track the direction user wants to move in

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      // Calculate direction of movement
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); // Ensure uniform speed

      // Apply velocity based on movement direction
      if (moveForward || moveBackward) velocity.z -= direction.z * 0.05;
      if (moveLeft || moveRight) velocity.x -= direction.x * 0.05;

      // Move the camera by updating its position
      controls.moveForward(-velocity.z);
      controls.moveRight(-velocity.x);

      // Handle up and down movement
      if (moveUp) camera.position.y += 0.25;   // Move up (spacebar)
      if (moveDown && camera.position.y > minY) { // Prevent moving down below the floor
        camera.position.y -= 0.25;
      }

      // Dampen velocity (simulate friction)
      velocity.z *= 0.9;
      velocity.x *= 0.9;

      // Rotate cube
      cube.rotation.x += 0.05;
      cube.rotation.y += 0.05;

      // Render the scene
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
