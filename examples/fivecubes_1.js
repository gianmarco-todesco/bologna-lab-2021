MYLIB.initialize('renderCanvas', populateScene);


// il rapporto aureo
const goldenRatio = (1+Math.sqrt(5))/2;

// l'inclinazione dei cubi è l'arcotangente dell'inverso
// del rapporto aureo
const theta = Math.atan(1/goldenRatio);


function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    let cubes = [];

    // i colori dei cinque cubi
    const colors = [
        [0.8,0.2,0.1],
        [0.8,0.4,0.1],
        [0.8,0.8,0.1],
        [0.4,0.8,0.1],
        [0.8,0.4,0.8]];

    // creo i cubi
    for(let i=0; i<5; i++) {
        let cube = BABYLON.MeshBuilder.CreateBox('box'+i,{size:3},scene);
        // assegno un materiale con il colore i-esimo
        let mat = new BABYLON.StandardMaterial('m'+i, scene);
        mat.diffuseColor.set(...colors[i]);
        mat.specularColor.set(0.3,0.3,0.3);
        cube.material = mat;

        // ruoto il cubo i-esimo
        cube.rotation.y = 2*Math.PI*i/5;
        cube.rotation.x = theta;

        // e aggiungo il cubo alla lista
        cubes.push(cube);
    }


    scene.registerBeforeRender(() => {
        // t è proporzionale al numero di secondi
        // trascorsi dall'inizio
        let t = performance.now() * 0.001 * 0.1;
        
        // R è la massima distanza dei cubi dal centro
        // quando sono staccati 
        let R = 4;
        cubes.forEach((cube,i) => {

            // voglio (per bellezza) che il movimento
            // dei cubi sia sfalsato. Quindi uso t1
            // invece che t
            let t1 = t + 0.04 * i;

            // t2 è la parte frazionaria di t1
            // quindi va periodicamente da 0 a 1
            let t2 = t1 - Math.floor(t1);

            // param controlla la posizione dell'i-esimo
            // cubo : vale 0 quando il cubo è ai margini
            // e 1 quando è al centro
            let param = MYLIB.smooth(
                MYLIB.step(t2,0.22,0.28) - 
                MYLIB.step(t2,0.72,0.78));        
    
            // prendo come riferimento la rotazione
            // azimutale di ogni cubo ...
            let phi = cube.rotation.y;

            // ... e calcolo la posizione del cubo "a riposo" 
            let p0 = new BABYLON.Vector3(Math.sin(phi)*R,0,Math.cos(phi)*R);

            // p1 è l'origine: il cubo combinato con gli altri
            let p1 = new BABYLON.Vector3(0,0,0);

            // sposto il cubo lungo il segmento p0,p1
            cube.position.copyFrom(BABYLON.Vector3.Lerp(p0,p1,param));

            // cambio l'inclinazione del cubo
            cube.rotation.x = (1-param)*0 + param*theta;
        });

    });
}