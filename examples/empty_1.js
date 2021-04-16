MYLIB.initialize('renderCanvas', crea_tutto_il_mondo);

function crea_tutto_il_mondo(scene) {

    MYLIB.createGrid(scene);
    
    let sphere = BABYLON.MeshBuilder.CreateSphere('a',{
        diameter:4
    },scene);
    sphere.material = new BABYLON.StandardMaterial('a', scene);
    sphere.material.diffuseColor.set(1,0,1);


    scene.registerBeforeRender(() => {


        let t = performance.now() * 0.001;
        sphere.position.y = 3 * Math.sin(t*4);

    });

}