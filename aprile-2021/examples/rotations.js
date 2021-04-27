MYLIB.initialize('renderCanvas', populateScene);

let box;

function populateScene(scene) {

    MYLIB.createGrid(scene);

    box = BABYLON.MeshBuilder.CreateBox('box', { width:4, height:1, depth:2}, scene);
    box.material = new BABYLON.StandardMaterial('boxmat', scene);
    box.material.diffuseColor.set(0.2,0.3,0.9);

    
    let box1 = BABYLON.MeshBuilder.CreateBox('box1', { width:4, height:0.1, depth:2}, scene);
    box1.material = new BABYLON.StandardMaterial('box1mat', scene);
    box1.material.diffuseColor.set(0.9,0.2,0.1);
    box1.position.set(-4.1,1,-4);

    let box2 = BABYLON.MeshBuilder.CreateBox('box2', { width:4, height:0.1, depth:2}, scene);
    box2.material = new BABYLON.StandardMaterial('box2mat', scene);
    box2.material.diffuseColor.set(0.9,0.2,0.1);
    box2.position.set(4.1,1,-4);
    

    // q1 = prima ruoto di 60° attorno a Y, poi 90° attorno a Z (notate l'ordine invertito)
    let q1 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI/3)
        .multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, Math.PI/3));
    box1.rotationQuaternion = q1;

    // q2 = ruoto di -60° attorno a Z
    let q2 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, -Math.PI/3);
    box2.rotationQuaternion = q2;

    let whiteBox = BABYLON.MeshBuilder.CreateBox('whiteBox', { width:4, height:0.1, depth:2}, scene);
    whiteBox.material = new BABYLON.StandardMaterial('whiteboxmat', scene);
    whiteBox.material.diffuseColor.set(0.9,0.9,0.9);
    whiteBox.position.set(0,1,-4);

    const r90 = Math.PI/2;

    // animazione
    scene.registerBeforeRender(() => {

        // tempo in secondi dopo l'inizio della visione della pagina
        let t = performance.now() * 0.001;

        // u cresce periodicamente in [0,5[ 
        let u = ((t/5)%1)*5;

        // reset position and rotation
        box.rotationQuaternion = null;
        box.position.set(0,0.5,0);

        box.rotateAround(new BABYLON.Vector3(2,0,0), BABYLON.Axis.Z, -MYLIB.step(u,0,1)*r90);
        box.rotateAround(new BABYLON.Vector3(2,0,1), BABYLON.Axis.X,  MYLIB.step(u,1,2)*r90);
        box.rotateAround(new BABYLON.Vector3(2,0,1), BABYLON.Axis.Z,  MYLIB.step(u,2,3)*r90);

        // l'ultimo momento è più aggraziato
        let u2 = MYLIB.smooth(MYLIB.step(u,3,4));
        box.rotateAround(new BABYLON.Vector3(2,0,1), BABYLON.Axis.Y,  -u2*r90);


        // v oscilla fra 0 e 1
        let v = Math.sin(t)*0.5+0.5;
        whiteBox.position.x = 4*(-1+2*v);

        whiteBox.rotationQuaternion = BABYLON.Quaternion.Slerp(q1,q2,v);

    });
}