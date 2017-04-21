var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {height: 1.8};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff9999, wireframe:true})
  );

  meshFloor = new THREE.Mesh(
     new THREE.PlaneGeometry(10, 10),
     new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true})
  );

  camera.position.set(0,player.height,-5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  meshFloor.rotation.x += Math.PI / 2;

  scene.add(mesh);
  scene.add(meshFloor);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(1280, 720);
  document.body.appendChild(renderer.domElement);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);

  if(keyboard[37]) { //left key
    camera.rotation.y -= Math.PI * 0.01;
  }
  if(keyboard[39]) { //right key
    camera.rotation.y += Math.PI * 0.01;
  }
  if(keyboard[38]) { //up key
    camera.rotation.x -= Math.PI * 0.01;
  }
  if(keyboard[40]) {
    camera.rotation.x += Math.PI * 0.01;
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
