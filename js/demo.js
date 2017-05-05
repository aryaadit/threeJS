var scene, camera, renderer, mesh;
var crate, crateTexture, crateNormalMap, crateBumpMap;
var meshFloor;

var keyboard = {};
var player = {height: 1.8, speed: 0.1, turnSpeed: Math.PI * 0.0025};
var horizontal = true;
var vertical = true;
var depth = true;
var useWireframe = false;
var screenPos = 600;

// Loading screen
var loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
  box: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({color:0x4444ff})
  )
};

var resourcesLoaded = false
var loadingManager = null


function init() {

  // Initializing the scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

  loadingScreen.box.position.set(0, 0, 5);
  loadingScreen.camera.lookAt(loadingScreen.box.position);
  loadingScreen.scene.add(loadingScreen.box);

  loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total)
  };

  loadingManager.onLoad = function() {
    console.log("loaded all assetts");
    resourcesLoaded = true;
  };

  //Texture and material loading
  var textureLoader = new THREE.TextureLoader(loadingManager);
  crateTextureDiffuse = textureLoader.load('texture/crate1_diffuse.png');
  crateTextureNormal = textureLoader.load('texture/crate1_normal.png');
  crateTextureBump = textureLoader.load('texture/crate1_bump.png');

  //Material and object loading
  var mtlLoader1 = new THREE.MTLLoader(loadingManager);
  mtlLoader1.load('model/Tent_01.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader(loadingManager);
    objLoader.setMaterials(materials);
    objLoader.load('model/Tent_01.obj', function(mesh) {
      mesh.traverse(function(node) {
        if(node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      scene.add(mesh);
      mesh.position.set(-3, 0, 4);
      // mesh.rotation.set(Math.PI / 2);
    });
  });

  var mtlLoader2 = new THREE.MTLLoader();
  mtlLoader2.load('model/Campfire_01.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('model/Campfire_01.obj', function(mesh) {
      //scene.add(mesh);
      mesh.position.set(-3, 2, 4);
    });
  });

  //Creating the mesh objects for the scene
  meshCube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 10, 10, 10)
    // new THREE.MeshPhongMaterial({color:0xff9999, wireframe:false}),
  );

  meshCube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
    new THREE.MeshPhongMaterial({color:0xffff66, wireframe:useWireframe})
  );

  meshFloor = new THREE.Mesh(
     new THREE.PlaneGeometry(20, 20, 10, 10),
     new THREE.MeshPhongMaterial({color:0xffffff, wireframe:useWireframe})
  );

  crate = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshPhongMaterial({
      color:0xffffff,
      map:crateTextureDiffuse,
      normalMap:crateTextureNormal,
      bumpMap:crateTextureBump
    })
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
  //Crate attributes
  crate.position.set(2.5, 1.5, 2.5);
  crate.receiveShadow = true;
  crate.castsShadow = true;

  //Add objects to scene
  //scene.add(meshCube1);
  //scene.add(meshCube2);
  scene.add(meshFloor);
  scene.add(ambientLight);
  scene.add(light);
  scene.add(crate)

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

  if(!resourcesLoaded) {
    requestAnimationFrame(animate);
    loadingScreen.box.rotation.z += Math.PI * 0.01;
    renderer.render(loadingScreen.scene, loadingScreen.camera);
    return;
  }
  requestAnimationFrame(animate);

  //Changing the xyz attributes
  meshCube1.rotation.x += 0.01;
  meshCube1.rotation.y += 0.02;
  meshCube2.rotation.x += 0.01;
  meshCube2.rotation.y += 0.02;
  crate.rotation.y += 0.02;
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
  if(keyboard[37] || screenPos < 300) { //left key
    camera.rotation.y -= Math.PI * player.turnSpeed;
  }
  if(keyboard[39] || screenPos >= 900) { //right key
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
  event.preventDefault;
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  event.preventDefault;
  keyboard[event.keyCode] = false;
}

function mouseMove(event) {
  screenPos = event.x;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousemove', mouseMove);

window.onload = init;
