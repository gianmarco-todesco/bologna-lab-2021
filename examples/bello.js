MYLIB.initialize('renderCanvas', crea_tutto_il_mondo);

let sphere;


function crea_tutto_il_mondo(scene) {

    MYLIB.createGrid(scene);
    
    sphere = BABYLON.MeshBuilder.CreateSphere('a',{
        diameter:4
    },scene);
    sphere.material = new BABYLON.StandardMaterial('a', scene);
    sphere.material.diffuseColor.set(1,0,1);

    let sphere2 = BABYLON.MeshBuilder.CreateSphere('a',{
      diameter:4
    },scene);
    sphere2.material = new BABYLON.StandardMaterial('a', scene);
    sphere2.material.diffuseColor.set(0,1,1);

    sphere2.position.z =  3;
    sphere.position.z = -3;

    scene.registerBeforeRender(() => {



        let t = performance.now() * 0.001;
        sphere.position.x = Math.sin(7*t);
        sphere2.position.x = Math.sin(5*t);
        
        /*
        sphere.position.y = 3 * Math.sin(t*4);
        sphere.scaling.x = 2 + Math.sin(t*7);
        sphere.material.diffuseColor.r = 0.5 + 0.5*Math.sin(t);

        if(t<4) {
          sphere2.scaling.y = 2 + Math.cos(t*Math.PI);
        } else {
          sphere2.scaling.y = 3;

        }
        */

    });

}
