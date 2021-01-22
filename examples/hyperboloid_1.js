MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {

    // cambio la posizione iniziale della telecamera
    scene.activeCamera.beta = 1.3;


    MYLIB.createGrid(scene);


    // parametri del modello
    const m = 155;
    const R = 2.5;


    
    // creo il materiale di cui sono fatti i cilindri
    let material = new BABYLON.StandardMaterial('mat', scene);
    material.diffuseColor.set(0.2,0.4,0.7);

    // creo i cilindri
    const cylinders = [];
    for(let i=0; i<m; i++) {
        let cyl;
        if(i==0) {
            // il primo è un cilindro
            cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {
                diameter : 0.15,
                height : 10
            }, scene);
            cyl.material = material;    
        } else {
            // tutti gli altri sono copie
            // (marginalmente più efficiente; è una
            // tecnica utile con moltissimi oggetti)
            cyl = cylinders[0].createInstance('cyl-inst');
        }

        // posiziono il cilindro i-esimo
        let phi = Math.PI*2*i/m;
        cyl.position.set(R*Math.cos(phi),0,-R*Math.sin(phi));

        // e lo ruoto
        cyl.rotation.y = phi;

        // aggiungo il cilindro alla lista
        cylinders.push(cyl);
    }

    // animazione
    scene.registerBeforeRender(() => {
        // t è il numero di secondi passati dalla
        // partenza del programma
        let t = performance.now() * 0.001;

        // l'angolo psi oscilla periodicamente
        let psi = 0.9 * Math.sin(t);
        
        // oriento ogni cilindro
        cylinders.forEach(cyl => {
            cyl.rotation.x = psi;
        });
        
    });

}