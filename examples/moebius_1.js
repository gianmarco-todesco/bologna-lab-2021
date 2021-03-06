MYLIB.initialize('renderCanvas', populateScene);

function populateScene(scene) {
    // MYLIB.createGrid(scene);
    
    // parametri del modello
    const m = 40;
    const R = 3;

    // creo i materiali per i segmenti bianchi e neri
    let black = new BABYLON.StandardMaterial('black', scene);
    black.diffuseColor.set(0,0,0);
    black.specularColor.set(0.2,0.2,0.2);
    let white = new BABYLON.StandardMaterial('white', scene);
    white.diffuseColor.set(1,1,1);
    white.specularColor.set(0.2,0.2,0.2);
    
    // creo i segmenti
    for(let i=0;i<m;i++) {
        const phi = Math.PI*2*i/m;
        let box = BABYLON.MeshBuilder.CreateBox('b'+i,{
            width:1.5, height: 0.1, depth:0.3
        },scene);
        box.rotation.z = phi/2;
        box.rotation.y = phi;
        box.position.x =  R * Math.cos(phi);
        box.position.z = -R * Math.sin(phi);
        box.material = (i%2==0) ? black : white;
    }

    // la sfera e il suo materiale
    let sphere = BABYLON.MeshBuilder.CreateSphere('sph', { diameter:1 }, scene);
    sphere.material = new BABYLON.StandardMaterial('sph-mat', scene);
    sphere.material.diffuseColor.set(0.2,0.6,0.9);

    // per controllare il movimento della sfera
    // utilizzo un perno (pivot) che si muove lungo
    // il centro del nastro di moebius. 
    // la palla è spostata rispetto a questo perno
    // in modo da apparire da una parte del nastro 
    // (e a contatto con il nastro)
    let pivot = new BABYLON.Mesh('a',scene);
    sphere.position.y = 0.5;
    sphere.parent = pivot;
    // scene.activeCamera.parent = pivot;

    // muovo la palla
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.3;
        let phi = Math.PI*2*t;
        pivot.position.x = R*Math.cos(phi);
        pivot.position.z = -R*Math.sin(phi);
        pivot.rotation.z = phi/2;
        pivot.rotation.y = phi;        
    });



}