MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    MYLIB.createGrid(scene);

    // definisco i vari materiali
    let innerFaceMaterial = new BABYLON.StandardMaterial('ifmat', scene);
    innerFaceMaterial.diffuseColor.set(0.1,0.4,0.8);
    let outerFaceMaterial = new BABYLON.StandardMaterial('ofmat', scene);
    outerFaceMaterial.diffuseColor.set(0.3,0.4,0.7);
    let hingeMaterial = new BABYLON.StandardMaterial('hmat', scene);
    hingeMaterial.diffuseColor.set(0.3,0.7,0.8);

    
    // Questa funzione aggiunge una faccia 
    // attaccandola a 'parentFace' sul lato 'edge'
    // La stessa funzione viene anche usata per la
    // prima faccia (in questo caso parentFace == null)
    function addFace(parentFace, edge) {
        // creo una mesh (pivot) che rappresenti tutta
        // la faccia
        let pivot = new BABYLON.Mesh('f',scene);

        // la faccia "interna"
        let box = BABYLON.MeshBuilder.CreateBox('f', {
            width:1.9, height:0.05, depth:1.9
        }, scene);
        box.material = innerFaceMaterial;
        box.position.x = 1;
        box.parent = pivot;

        // quella esterna
        box = BABYLON.MeshBuilder.CreateBox('f', {
            width:1.7, height:0.05, depth:1.7
        }, scene);
        box.material = outerFaceMaterial;
        box.position.x = 1;
        box.position.y = 0.1;
        box.parent = pivot;

        // c'è una faccia a cui attaccarsi?
        if(parentFace != null)
        {
            // creo la "cerniera"
            let hinge = BABYLON.MeshBuilder.CreateCylinder('hinge',{
                height : 1.49,
                diameter : 0.2
            },scene);
            hinge.rotation.x = Math.PI/2;
            hinge.parent = pivot;
            hinge.material = hingeMaterial;

            // attacco la nuova faccia 
            pivot.parent = parentFace;

            // la posiziono sull'edge-esimo spigolo
            let phi = edge * Math.PI/2;
            pivot.rotation.y = phi;
            pivot.position.set(Math.cos(phi)+1,0,-Math.sin(phi));    
        }
        return pivot;
    }
    
    // prima faccia
    let firstFace = addFace(null);
    firstFace.position.set(-1,0,0); 

    // le altre
    faces = [];
    faces.push(addFace(firstFace, 1));
    faces.push(addFace(faces[0], -1));

    faces.push(addFace(firstFace, 2));
    faces.push(addFace(faces[2], 1));
    faces.push(addFace(faces[3], -1));
    
    
    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        // l'angolo 'aperture' varia periodicamente
        // fra 0 e PI/2
        let aperture = (Math.sin(t)+1)*0.5 * Math.PI/2;

        // ruoto ogni faccia rispetto alla faccia "madre"
        for(let i=0;i<faces.length;i++) {
            let face = faces[i];
            face.rotation.z = aperture;
        }
    });


}