console.log(window);
MYLIB.initialize('renderCanvas', populateScene);


function ruote(scene) {
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

function asseruote(scene) {

    let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:0.2,
        height:6.7
    }, scene);

    cyl.position.z = -4
    cyl.rotation.z = Math.PI/2;
    cyl.material = new BABYLON.StandardMaterial('ma', scene);
    cyl.material.diffuseColor.set(0.7,0.5, 0.6);
	return cyl;
}

/*ho dovuto creare una seconda funzione qui come vede per mettere un altro asse
con posizione diversa, non riuscivo a cambiare la posizione come con le ruote sotto*/

function asseruote2(scene) {

    let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:0.2,
        height:6.7
    }, scene);

    cyl.position.z = 4
    cyl.rotation.z = Math.PI/2;
    cyl.material = new BABYLON.StandardMaterial('ma', scene);
    cyl.material.diffuseColor.set(0.7,0.5, 0.6);
}

function piano(scene) {
    let obj1 = BABYLON.MeshBuilder.CreateBox('a', {
        width:5.5,
        height:0.2,
        depth:11
    }, scene)
    obj1.material = new BABYLON.StandardMaterial('ma', scene);
    obj1.material.diffuseColor.set(0.4, 0.5, 0.5);
}

function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    scene.activeCamera.alpha = 2.5;

    let obj1 = ruote(scene);
    obj1.position.x = 3;
    obj1.position.z = 4;
    obj1.rotation.z = Math.PI/2;

    let obj2 = ruote(scene);
    obj2.position.x = -3;
    obj2.position.z = 4;
    obj2.rotation.z = Math.PI/2;

    let obj3 = ruote(scene);
    obj3.position.x = 3;
    obj3.position.z = -4;
    obj3.rotation.z = Math.PI/2;

    let obj4 = ruote(scene);
    obj4.position.x = -3;
    obj4.position.z = -4;
    obj4.rotation.z = Math.PI/2;

    let obj5 = asseruote(scene);
    obj5.position.z = -4;
    //vede, questa linea qui se l'attivo mi manda tutto in palla, non me lo sposta
    //e non riesco a capire perchè. per questo ho aggiunto una seconda funzione uguale
    //ma con le coordinate di z diverse (obj7)

    let obj6 = asseruote2(scene);

    let obj7 = piano(scene);

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        obj1.rotation.x = t;
        obj2.rotation.x = t;
        obj3.rotation.x = t;
        obj4.rotation.x = t;
    });


}