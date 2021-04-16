MYLIB.initialize('renderCanvas', crea_tutto_il_mondo);

function crea_tutto_il_mondo(scene) {

    MYLIB.createGrid(scene);
    
    let sphere = BABYLON.MeshBuilder.CreateSphere('a',{
        diameter:2
    },scene);
    sphere.material = new BABYLON.StandardMaterial('a', scene);
    sphere.material.diffuseColor.set(105/255,138/255,181/255);
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        sphere.position.y = 3 * Math.sin(t*4);
        let s = 2 + 0.2*Math.sin(t*20);
        sphere.scaling.set(s,3-s,s); 
    });



}