var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.01};
var horizontal = true;
var vertical = true;
var depth = true;


function init() {

  // Initializing the scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

  //Texture and material loading
  texture = THREE.ImageUtils.loadTexture('texture/crate.jpg');
  material = new THREE.MeshBasicMaterial({map: texture});

  //Creating the mesh objects for the scene
  meshCube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
    // new THREE.MeshPhongMaterial({color:0xff9999, wireframe:false}),
    material
  );

  meshCube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
    new THREE.MeshPhongMaterial({color:0xffff66, wireframe:false})
  );

  meshFloor = new THREE.Mesh(
     new THREE.PlaneGeometry(20, 20, 10, 10),
     new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
  );

  //Setting up ambient and point lights for lighting in scene
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  light = new THREE.PointLight(0xffffff, 1.0, 18);
  light.position.set(-3, 6, -3);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;

  //Updating and setting attributes of scene objects/elements
  camera.position.set(0,player.height,-5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));
  //Cube1 attributes
  meshCube1.position.x = 0;
  meshCube1.position.y = 5;
  meshCube1.receiveShadow = true;
  meshCube1.castShadow = true;
  // meshCube1.material = material;
  //Cube2 attributes
  meshCube2.position.x = 0;
  meshCube2.position.y = 5;
  meshCube2.receiveShadow = true;
  meshCube2.castShadow = true;
  //Floor attributes
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;

  //Add objects to scene
  scene.add(meshCube1);
  scene.add(meshCube2);
  scene.add(meshFloor);
  scene.add(ambientLight);
  scene.add(light);

  //Creating the renderer to visualize the scene
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(1280, 720);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  document.body.appendChild(renderer.domElement);

  //Calls animate
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  //Changing the xyz attributes
  meshCube1.rotation.x += 0.01;
  meshCube1.rotation.y += 0.02;
  meshCube2.rotation.x += 0.01;
  meshCube2.rotation.y += 0.02;
  if(meshCube1.position.x >= 10) {
    horizontal = true;
  }
  if(meshCube1.position.x <= -10) {
    horizontal = false;
  }
  if(meshCube1.position.y >= 10) {
    vertical = true;
  }
  if(meshCube1.position.y <= 1) {
    vertical = false;
  }
  if(meshCube1.position.z >= 10) {
    depth = true;
  }
  if(meshCube1.position.z <= -10) {
    depth = false;
  }
  if(horizontal) {
    meshCube1.position.x -= 0.05;
    //meshCube2.position.x += 0.05;
  } else {
    meshCube1.position.x += 0.05;
    //meshCube2.position.x -= 0.05;
  }
  if(vertical) {
    meshCube1.position.y -= 0.05;
    //meshCube2.position.y -= 0.05;
  } else {
    meshCube1.position.y += 0.05;
    //meshCube2.position.y += 0.05;
  }
  if(depth) {
    meshCube1.position.z -= 0.05;
    //meshCube2.position.z -= 0.05;
  } else {
    meshCube1.position.z += 0.05;
    //meshCube2.position.z += 0.05;
  }

  renderer.render(scene, camera);

  //Keyboard commands
  if(keyboard[37]) { //left key
    camera.rotation.y -= Math.PI * player.turnSpeed;
  }
  if(keyboard[39]) { //right key
    camera.rotation.y += Math.PI * player.turnSpeed;
  }
  // if(keyboard[38]) { //up key
  //   camera.rotation.z -= Math.PI * 0.01;
  // }
  // if(keyboard[40]) { //down key
  //   camera.rotation.z += Math.PI * 0.01;
  // }
  if(keyboard[87]) { //w key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[83]) { //s key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[65]) { //a key
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if(keyboard[68]) { //d key
    camera.position.x -= Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown',keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
