MYLIB.initialize('renderCanvas', populateScene);


// funzione che crea un anello, con due perni
function createRing(scene, R, ringMaterial, pivotMaterial) {
    // anello
    let ring = BABYLON.MeshBuilder.CreateTorus('ring', {
        diameter: 2*R,
        thickness: 0.75,
        tessellation: 60,
    }, scene);
    ring.material = ringMaterial;

    // perno
    let pivot =  BABYLON.MeshBuilder.CreateCylinder('pivot', { diameter: 0.2, height:1 }, scene);
    pivot.material = pivotMaterial;
    pivot.rotation.x = Math.PI/2;
    pivot.position.z = R-0.5;
    // il perno è collegato all'anello
    pivot.parent = ring;

    // il secondo perno
    let otherPivot = pivot.createInstance('pivot2');
    otherPivot.rotation.x = Math.PI/2;
    otherPivot.position.z = -R+0.5;
    otherPivot.parent = ring;
    
    return ring;
}


function populateScene(scene) {

    MYLIB.createGrid(scene);
    MYLIB.camera.radius = 20;

    
    let pivotMaterial = new BABYLON.StandardMaterial('pivotMaterial', scene);
    pivotMaterial.diffuseColor.set(1,1,1);


    let rings = [];
    let m = 5;
    for(let i=0; i<m; i++) {

        let ringMaterial = new BABYLON.StandardMaterial("m",scene);
        let ringColorParameter = Math.PI*2*i/m;
        ringMaterial.diffuseColor.set(0.7,i/m,0.1);
    
        let ring = createRing(scene, (m-i+1), ringMaterial, pivotMaterial);

        // tutti gli anelli, salvo il primo, sono legati all'anello 
        // precedente
        if(i>0) {
            ring.rotation.y = Math.PI/2;
            ring.parent = rings[i-1];        
        }

        // aggiungo il ring
        rings.push(ring);
    }
 
    // sfera al centro
    let ball = BABYLON.MeshBuilder.CreateSphere('ball', {diameter:2}, scene);
    ball.material = new BABYLON.StandardMaterial('ballmat', scene);
    ball.material.diffuseColor.set(0.1,0.1,0.1);

  
    // animazione
    
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001*0.6;
        // ruoto ogni anello rispetto all'anello precedente
        // ogni anello ruota a velocità diversa
        rings.forEach((ring,i) => {
            ring.rotation.x = t*(i*0.1+1);
        });
    });
}