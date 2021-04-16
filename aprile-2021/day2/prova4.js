MYLIB.initialize('renderCanvas', populateScene);

let spheres = [];
let ball;

function populateScene(scene) {

    MYLIB.createGrid(scene);

    // crea la prima sferetta
    let sphere = BABYLON.MeshBuilder.CreateSphere('s', {diameter:0.25}, scene);
    sphere.material = new BABYLON.StandardMaterial('ballmat', scene);
    sphere.material.diffuseColor.set(0,1,1);
    spheres.push(sphere);

    // m x m sferette
    const m = 50;

    // distanza fra due sferette (lungo le righe o le colonne)
    let d = 10/m;

    // creo le copie
    for(let i=1; i<m*m; i++) {
        spheres.push(sphere.createInstance('b'+i));
    }

    // dispongo le sferette sul piano
    for(let i=0; i<m; i++) {
        for(let j=0; j<m; j++) {
            spheres[i*m+j].position.set(
                (i-(m-1)/2)*d,
                -0.25,
                (j-(m-1)/2)*d
            );
        }
    
    }

    // attivo il riconoscimento delle mesh sotto il cursore del mouse
    scene.constantlyUpdateMeshUnderPointer = true;

    // informazioni sull'ultimo click su una sferetta
    let tempoDelClick = 0;
    let px = 0;
    let pz = 0;

    // gestione eventi mouse
    scene.onPointerObservable.add(pointerInfo => {
        if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
            // sul click, verifico la mesh cliccata
            let mesh = scene.meshUnderPointer;
            if(mesh != null) {
                // se ho fatto click su un oggetto, registro tempo del click e posizione
                // dell'oggett cliccato
                tempoDelClick = performance.now() * 0.001;
                px = mesh.position.x;
                pz = mesh.position.z;
            }
        }
    });


    // animazione
    scene.registerBeforeRender(() => {

        // secondi dall'inizio
        let seconds = performance.now() * 0.001;

        // per ogni sferetta
        spheres.forEach(sphere => {

            // dt = tempo trascorso dall'ultimo click su sferetta
            let dt = seconds - tempoDelClick ;

            // r = distanza della sferetta corrente dalla posizione dell'ultimo click
            let x = sphere.position.x - px;
            let z = sphere.position.z - pz;
            let r = Math.sqrt(x*x+z*z);

            // let r = Math.abs(x) + Math.abs(z);

            // posizione rispetto al fronte d'onda
            let q = r-dt*10 ;

            sphere.position.y = -0.2*Math.exp(-q*q*0.2) * Math.cos(5*r);
        })


    });
}