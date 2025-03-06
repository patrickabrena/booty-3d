import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize the material
const material = new THREE.MeshStandardMaterial({
  color: 0xFFB6C1,
});

material.roughness = 0.22;     // Controls how rough the surface is (lower = shinier)
material.metalness = 0.69;     // Controls how metallic the surface is
material.transparent = true;
material.opacity = 0.99;


pane.addBinding(material, 'roughness', {
  min: 0.00,
  max: 0.9,
  step: 0.01
})

pane.addBinding(material, 'metalness', {
  min: 0.00,
  max: 0.96,
  step: 0.01
})

pane.addBinding(material, 'opacity', {
  min: 0.00,
  max: 1,
  step: 0.01
})

// Function to load STL model
const loader = new STLLoader();
loader.load("uploads_files_3414844_Slim+low+poly.stl", (geometry) => {
  const mesh = new THREE.Mesh(geometry, material);


  // Compute bounding box before scaling
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox.getCenter(center);

  // Apply scaling
  mesh.scale.set(0.5, 0.5, 0.5); // Example scale

  // Recompute bounding box after scaling
  geometry.computeBoundingBox();
  const newCenter = new THREE.Vector3();
  geometry.boundingBox.getCenter(newCenter);

  // Adjust position to recenter the model
  mesh.position.sub(newCenter);
 
  // Move the model 
  mesh.position.y += 70;
  mesh.position.x += 50;
  mesh.position.z += 100;


  mesh.rotation.x = THREE.MathUtils.degToRad(-90); // Converts degrees to radians

  const meshAxesHelper = new THREE.AxesHelper(5); // Adjust size as needed
  // Position the AxesHelper relative to the mesh's new position
  meshAxesHelper.position.set(0, 0, 0); // This should be at the mesh's originnow
  //mesh.add(meshAxesHelper); // Attach to mesh instead of scene

  // Add to scene
  scene.add(mesh);

});


//initialize the light
const light = new THREE.AmbientLight(0xffffff, 1) //jsut raising lumen values equally with ambient light
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 12000);
pointLight.position.set(0, 20, 5);
scene.add(pointLight)

// Create an object to hold the light position values
const lightPosition = {
  bootyLightX: pointLight.position.x,
  bootyLightY: pointLight.position.y,
  bootyLightZ: pointLight.position.z,
};

// Add bindings for the x, y, and z sliders
pane.addBinding(lightPosition, 'bootyLightX', { min: -30, max: 30, step: 0.1 }).on('change', (ev) => {
  pointLight.position.x = ev.value; // Update the x position of the point light
});
pane.addBinding(lightPosition, 'bootyLightY', { min: -5, max: 30, step: 0.1 }).on('change', (ev) => {
  pointLight.position.y = ev.value; // Update the y position of the point light
});
pane.addBinding(lightPosition, 'bootyLightZ', { min: -30, max: 30, step: 0.1 }).on('change', (ev) => {
  pointLight.position.z = ev.value; // Update the z position of the point light
});

//using the .on method//
//1. pane.addBinding(lightPosition, 'bootyLightX', { min: -30, max: 30, step: 0.1 })
//this is part is about binding the values of a property (lightPosition.x) to a slider in the Tweakpane UI
//2. .on('change', (ev) => {...})
//this method listens to changes to the bound value, and it triggers a function when the value of the slider changes
//change: This is the event type. When the value of the slider changes (eg, when the user moves the slider) this event is fired
//second arugment is the callback function (will run when the event is triggered)
//ev (event object) is passed to the callback function when the change event is fired
//it contains the updated value of the sldier and additional information about the event
//Specifically, ev.value gives us the new value that the slider has been adjusted to
//3. pointLight.position.x = ev.value;
//pointLight.position.x is the current x position of the light in the scene.
//ev.value is the new value from the slider that the user has adjusted
//Bu assigning the ev.value to the pointLight.position.x, we move the point light along the x axis to the new position set by the slider






// Add an AxesHelper to visualize the position of the light
const lightAxesHelper = new THREE.AxesHelper(1); // Adjust size as needed
pointLight.add(lightAxesHelper); // Attach it to the light

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.z = 75;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.enableZoom = false; // Disable zoom to prevent scaling
controls.enablePan = false;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const axesHelper = new THREE.AxesHelper(5); // 5 is the size of the axes
scene.add(axesHelper);


// render the scene
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
