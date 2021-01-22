MYLIB.initialize('renderCanvas', pippo);


let sfera;


function pippo(scene) {

    // questa linea mi servirà in seguito
    MYLIB.createGrid(scene);
    
    sfera = BABYLON.MeshBuilder.CreateSphere('a', {
      diameter:3
    },scene)
    
    let sfera2 = BABYLON.MeshBuilder.CreateSphere('a', {
      diameter:3
    },scene)

    sfera2.position.x = 4

    //scene.registerBeforeRender(() => {
    //    let t = performance.now() * 0.001;
    //});

}