console.log(window);
MYLIB.initialize('renderCanvas', populateScene);
let firstFace;
let faces;


function populateScene(scene) {
    MYLIB.createGrid(scene);

    let innerFaceMaterial = new BABYLON.StandardMaterial('ifmat', scene);
    innerFaceMaterial.diffuseColor.set(0.1,0.4,0.8);
    let outerFaceMaterial = new BABYLON.StandardMaterial('ofmat', scene);
    outerFaceMaterial.diffuseColor.set(0.3,0.4,0.7);
    let hingeMaterial = new BABYLON.StandardMaterial('hmat', scene);
    hingeMaterial.diffuseColor.set(0.3,0.7,0.8);

    

    function addFace(parentFace, edge) {
        let pivot = new BABYLON.Mesh('f',scene);
        let box;
        box = BABYLON.MeshBuilder.CreateBox('f', {
            width:1.9, height:0.05, depth:1.9
        }, scene);
        box.material = innerFaceMaterial;
        box.position.x = 1;
        box.parent = pivot;

        box = BABYLON.MeshBuilder.CreateBox('f', {
            width:1.7, height:0.05, depth:1.7
        }, scene);
        box.material = outerFaceMaterial;
        box.position.x = 1;
        box.position.y = 0.1;
        box.parent = pivot;

        if(parentFace != null)
        {
            let hinge = BABYLON.MeshBuilder.CreateCylinder('hinge',{
                height : 1.49,
                diameter : 0.2
            },scene);
            hinge.rotation.x = Math.PI/2;
            hinge.parent = pivot;
            hinge.material = hingeMaterial;

            pivot.parent = parentFace;

            let phi = edge * Math.PI/2;
            pivot.rotation.y = phi;
            pivot.position.set(Math.cos(phi)+1,0,-Math.sin(phi));    
        }
        return pivot;
    }
    
    firstFace = addFace(null);
    firstFace.position.set(-1,0,0); 

    faces = [];
    faces.push(addFace(firstFace, 1));
    faces.push(addFace(faces[0], -1));

    faces.push(addFace(firstFace, 2));
    faces.push(addFace(faces[2], 1));
    faces.push(addFace(faces[3], -1));
    
    
    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        let aperture = (Math.sin(t)+1)*0.5 * Math.PI/2;
        for(let i=0;i<faces.length;i++) {
            let face = faces[i];
            face.rotation.z = aperture;

        }
    });



}