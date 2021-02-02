MYLIB.initialize('renderCanvas', populateScene);

let sphere, sphere2;
let spheres = [];


function populateScene(scene) {

    MYLIB.createGrid(scene);

    let m = 15;

    for(let i=0; i<m; i++) {
        sphere = BABYLON.MeshBuilder.CreateSphere('a', {
            diameter:2
        }, scene);
        sphere.material = new BABYLON.StandardMaterial('a', scene);
        sphere.material.diffuseColor.set(0.2,0.5,0.7);
        spheres.push(sphere);
        sphere.position.z = -20 * i/(m-1) + 4;
    }




    scene.registerBeforeRender(() => {

        let t = performance.now() * 0.001;

        let period = 5;

        let w = t / period;
        w = (w-Math.floor(w)) * period;

        spheres.forEach((sphere,i) => {
            let t0 = 5 - i*0.1;
            let s = 
                MYLIB.step(w,t0,t0+1) 
              - MYLIB.step(w,t0+1,t0+2);

            sphere.position.x = 4 - s*8;
            sphere.position.y = 1 + s*(1-s)*4 * 3;
    
        })




            
        /*
        sphere.position.x = 
              MYLIB.step(t,1,2) * 4 
            - MYLIB.step(t,10,11) * 4;
        sphere.position.z = 
              MYLIB.step(t,5,6) * 4
            - MYLIB.step(t,10,11) * 4;
        

        if(t>11) {
            sphere.position.y = Math.sin((t-11)*2);            
        }

        */

        /*
        sphere.position.x = 
            Math.min(4,Math.max(0, t - 10));

        sphere.position.z = 
            Math.min(4,Math.max(0, t - 14));
        */


        //let phi = Math.PI*2*t * 0.7;
        //sphere.position.x = 4*Math.cos(phi);
        // sphere.position.z = 4*Math.sin(phi);
        

        //sphere.material.diffuseColor.g = 
        //    0.5 + 0.5*Math.sin(phi); 

    });

}