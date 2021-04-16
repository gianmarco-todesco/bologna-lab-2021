MYLIB.initialize('renderCanvas', populateScene);

function populateScene(scene) {

    MYLIB.createGrid(scene);

    // creo una pallina
    let ball = BABYLON.MeshBuilder.CreateSphere('ball', {diameter:2}, scene);
    ball.material = new BABYLON.StandardMaterial('ballmat', scene);
    ball.material.diffuseColor.set(1,1,1);
    ball.position.y = 1;

    // creo la texture
    let tx = new BABYLON.DynamicTexture('dt', { width:1024, height:1024}, scene);
    let ctx = tx.getContext();

    // disegno una scacchiera
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,1024,1024);
    ctx.fillStyle = 'orange';
    ctx.fillRect(0,0,256,512);
    ctx.fillRect(512,0,256,512);
    ctx.fillRect(256,512,256,512);
    ctx.fillRect(768,512,256,512);
    tx.update();
    ball.material.diffuseTexture = tx;
    
    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001*0.1;


        // t va da 0 a 1 e poi di nuovo a 0, periodicamente
        t = Math.abs(-1+(t%1)*2);

        // la pallina si muove lungo l'asse x, per tutta l'estensione della griglia
        ball.position.x = -5 + 10*t;

        // la rotazione (espressa in radianti) è uguale alla distanza percorsa
        // (il raggio della sfera vale 1)
        ball.rotation.z = -ball.position.x;

    });
}
