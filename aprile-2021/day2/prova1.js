MYLIB.initialize('renderCanvas', populateScene);

let spheres = [];
let ball;

function populateScene(scene) {

    // MYLIB.createGrid(scene);

    // creo la palla viola che rimbalza
    ball = BABYLON.MeshBuilder.CreateSphere('ball', {diameter:2}, scene);
    ball.material = new BABYLON.StandardMaterial('ballmat', scene);
    ball.material.diffuseColor.set(1,0,1);
    

    // creo la prima pallina azzurra che forma il pavimento
    let sphere = BABYLON.MeshBuilder.CreateSphere('s', {diameter:0.5}, scene);
    sphere.material = new BABYLON.StandardMaterial('ballmat', scene);
    sphere.material.diffuseColor.set(0,1,1);

    // la aggiungo all'array che conterrà tutte le palline
    spheres.push(sphere);

    // Il numero totale di palline è m * m
    const m = 50;

    // la distanza fra due palline consecutive (lungo le righe o le colonne)
    // è uguale alla larghezza del pavimento diviso il mumero di palline
    let d = 10/m;

    // creo le copie 
    for(let i=1; i<m*m; i++) {
        spheres.push(sphere.createInstance('b'+i));
    }

    // posiziono le palline sul piano x,z
    for(let i=0; i<m; i++) {
        for(let j=0; j<m; j++) {
            spheres[i*m+j].position.set(
                (i-(m-1)/2)*d,
                -0.25,
                (j-(m-1)/2)*d
            );
        }    
    }

    // animazione
    scene.registerBeforeRender(() => {

        // tempo in secondi dopo l'inizio della visione della pagina
        let seconds = performance.now() * 0.001;

        // se voglio che la palla rimbalzante rimpicciolisca
        // devo scommentare le due righe seguenti
        //   let sc = Math.exp(-seconds*0.1);
        //   ball.scaling.set(sc,sc,sc);

        // il parametro che controlla il rimbalzo è t
        // t varia da 0 a 1 periodicamente
        let t = seconds;
        t = t%1;

        // la palla viola rimbalza con y da 1 a 6,
        // con moto parabolico
        ball.position.y = 1 + 5 * 4 * (1-t)*t;

        // raggio dell'onda che si espande attorno al punto
        // di impatto
        let r0 = t * 20 ;

        // muovo (verticalmente) le sferette sul pavimento
        spheres.forEach(sphere => {

            // parto dalla posizione (x,z) di ogni pallina
            let x = sphere.position.x;
            let z = sphere.position.z;

            // r è la distanza orizzontale dal centro
            let r = Math.sqrt(x*x+z*z);

            // q è la posizione rispetto al fronte dell'onda
            let q = r-r0;

            // muovo la y usando una funzione opportuna
            // (funzioni diverse producono risultati diversi)
            sphere.position.y = -Math.sin(q)/q;
            // sphere.position.y = 0.4*Math.exp(-q*q*2.0);
            
        })


    });
}