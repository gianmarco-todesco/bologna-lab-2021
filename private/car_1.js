console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

function setMaterial(mesh, r, g, b, scene) {
  let mat = new BABYLON.StandardMaterial('ma', scene);
  mesh.material = mat;
  mat.diffuseColor.set(r,g,b);
}

const wheelRadius = 0.5;

function createWheel(scene) {
    let obj = new BABYLON.Mesh('obj', scene);

    const R = wheelRadius;
    const ringThickness = R * 0.2;
    const ringDiameter = 2*R-ringThickness;

    let ring = BABYLON.MeshBuilder.CreateTorus('a', {
      diameter:ringDiameter,
      thickness:ringThickness,
      tessellation:70
    }, scene);
    setMaterial(ring, 0.8,0.2,0.5, scene);
    ring.rotation.x = Math.PI/2;
    ring.parent = obj;

    let hub = BABYLON.MeshBuilder.CreateCylinder('a', {
      diameter:ringDiameter*0.25,
      height:0.2
    }, scene);
    setMaterial(hub, 0.2,0.3,0.5, scene);
    hub.rotation.x = Math.PI/2;
    hub.parent = obj;

    let spokeMat = new BABYLON.StandardMaterial('ma', scene);
    spokeMat.diffuseColor.set(0.2,0.2,0.2);
    
    for(let i=0; i<3; i++) {
        let spoke = BABYLON.MeshBuilder.CreateCylinder('a', {
            diameter:0.07,
            height:ringDiameter
        }, scene);
        spoke.rotation.z = Math.PI*2*i/3;

        spoke.material = spokeMat;
        spoke.parent = obj;    
    }
    return obj;
}

function createCarBody(scene) {
  let obj = new BABYLON.Mesh('obj', scene);
  let mat = new BABYLON.StandardMaterial('ma', scene);
  mat.diffuseColor.set(0.2,0.4,0.6);
  let box;
  box = BABYLON.MeshBuilder.CreateBox('a', {
    width:4, height:1, depth:2
  }, scene);
  box.position.y = 1;
  box.parent = obj;
  box.material = mat;
  box = BABYLON.MeshBuilder.CreateBox('a', {
    width:2, height:1, depth:1.95
  }, scene);
  box.position.y = 2;
  box.parent = obj;
  box.material = mat;
  return obj;
}

function createCar(scene) {
  let obj = new BABYLON.Mesh('obj', scene);
  let body = createCarBody(scene);
  body.parent = obj;
  let wheel;
  let y = 0.5;
  
  obj.wheels = [];
  
  const pts = [[1,-1],[-1,-1],[1,1],[-1,1]];
  for(let i=0; i<4; i++) {
    wheel = createWheel(scene);
    wheel.position.set(pts[i][0],y,pts[i][1]);
    wheel.parent = obj;
    obj.wheels.push(wheel);  
  }
  
  
  return obj;
}
 

function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    scene.activeCamera.alpha = 2.5;

    let car1 = createCar(scene);


    
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.2;
        let x = -4 + 8 * (t - Math.floor(t));
        car1.wheels.forEach(wheel => wheel.rotation.z = -x/wheelRadius);
        car1.position.x = x;
    });



}