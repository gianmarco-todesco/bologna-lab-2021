console.log(window);
MYLIB.initialize('renderCanvas', populateScene);


function createMyObject(scene) {
    let obj = new BABYLON.Mesh('obj', scene);

    let sphere = BABYLON.MeshBuilder.CreateSphere('a', {
        diameter:0.5
    }, scene);
    sphere.material = new BABYLON.StandardMaterial('ma', scene);
    sphere.material.diffuseColor.set(0.2,0.3,0.5);
    sphere.parent = obj;

    let ring = BABYLON.MeshBuilder.CreateTorus('a', {
        diameter:2,
        thickness:0.5,
        tessellation:70
    }, scene);
    ring.material = new BABYLON.StandardMaterial('ma', scene);
    ring.material.diffuseColor.set(0.8,0.3,0.5);
    ring.parent = obj;

    for(let i=0; i<3; i++) {
        let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {
            diameter:0.2,
            height:2
        }, scene);
        cyl.rotation.z = Math.PI/2;
        cyl.rotation.y = Math.PI*2*i/3;
        cyl.material = new BABYLON.StandardMaterial('ma', scene);
        cyl.material.diffuseColor.set(0.2,0.1,0.4);
        cyl.parent = obj;
    
    }
    return obj;
}

function addSegment(p1, p2) {
    //let p1 = new BABYLON.Vector3(1,0,3);
    //let p2 = new BABYLON.Vector3(3,2,3);
    let a;
    a = BABYLON.MeshBuilder.CreateSphere('a',{diameter:0.2},scene);
    a.position.copyFrom(p1);
    a = BABYLON.MeshBuilder.CreateSphere('a',{diameter:0.2},scene);
    a.position.copyFrom(p2);

    let cy = BABYLON.MeshBuilder.CreateCylinder('a',{diameter:0.1,height:1},scene);
    MYLIB.align(cy, p1,p2);
    return cy;
}

function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    scene.activeCamera.alpha = 2.5;

    let obj1 = createMyObject(scene);
    obj1.position.x = 3;
    obj1.rotation.z = Math.PI/2;

    let obj2 = createMyObject(scene);
    obj2.position.x = -3;
    
    let obj3 = BABYLON.MeshBuilder.CreateBox('a', {
        width:1,
        height:0.5,
        depth:0.25
    }, scene);


    
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        obj1.rotation.x = t;
    });



}