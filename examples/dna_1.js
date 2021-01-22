MYLIB.initialize('renderCanvas', populateScene);

function populateScene(scene) {
    MYLIB.createGrid(scene);

    // modifico la posizione iniziale della telecamera
    scene.activeCamera.beta = 1.3;

    // materiale sfere (due materiali diversi)
    const sphereMat1 = new BABYLON.StandardMaterial("m",scene);
    sphereMat1.diffuseColor.set(0.2,0.8,0.5);
    const sphereMat2 = new BABYLON.StandardMaterial("m",scene);
    sphereMat2.diffuseColor.set(0.2,0.2,0.9);

    // materiale cilindro
    const cylinderMat = new BABYLON.StandardMaterial("m",scene);
    cylinderMat.diffuseColor.set(0.6,0.6,0.6);

    // parametri modello
    const sphereRadius = 0.15;
    const cylinderRadius = 0.025;
    const cylinderHeight = 1;
    const cylinderDistance = 0.15;
    const m = 100;

    let cylinders = [];

    // creo il modello
    for(let i=0; i<m; i++) {

        // cilindro
        let cylinder = BABYLON.MeshBuilder.CreateCylinder("c", {
            diameter: cylinderRadius*2, 
            height: cylinderHeight
        }, scene);
        cylinder.material = cylinderMat;
        cylinder.rotation.z = Math.PI/2;
        cylinders.push(cylinder);

        // prima sfera
        let sphere;
        sphere = BABYLON.MeshBuilder.CreateSphere("t", {
            diameter:sphereRadius*2
        }, scene);
        sphere.material = sphereMat1;
        sphere.parent = cylinder;
        sphere.position.y = -cylinderHeight/2;

        // seconda sfera
        sphere = BABYLON.MeshBuilder.CreateSphere("t", {
            diameter:sphereRadius*2
        }, scene);
        sphere.material = sphereMat2;
        sphere.parent = cylinder;
        sphere.position.y = cylinderHeight/2;

        // posiziono il cilindro i-esimo lungo l'asse verticale
        cylinder.position.y = (i - (m-1)/2) * cylinderDistance;
    }


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
         // angolo di rotazione del cilindro più in alto
        let psi = 5*Math.PI * Math.cos(t);

        // ruoto i cilindri
        cylinders.forEach((cylinder,i) => {
            let t = i/(cylinders.length-1);
            cylinder.rotation.y = (2*t-1) * psi;
        });
    });

}