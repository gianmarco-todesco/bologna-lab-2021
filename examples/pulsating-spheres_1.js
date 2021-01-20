console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

function populateScene(scene) {
    MYLIB.createGrid(scene);

    const m = 37;
    const r = 4;
    const spheres = [];

    for(let i=0; i<m; i++) {
        let phi = 2*Math.PI*i/m;
		
        let sphere = BABYLON.MeshBuilder.CreateSphere("s",
              {diameter:0.5},
              scene);

        let mat = sphere.material = new BABYLON.StandardMaterial("m",scene);
        mat.diffuseColor = new BABYLON.Color3(
            0.5 + 0.5*Math.cos(phi),
            0.5 + 0.5*Math.sin(phi),
            0.5 + 0.5*Math.sin(2*phi)
        );
		
  		  sphere.position.set(r*Math.cos(phi), 0, r*Math.sin(phi) );
		
        spheres.push(sphere);    
    }
 

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        spheres.forEach((sphere,i) => {
          let v = 0.5 + 0.5*Math.sin(t*7 + i/m*Math.PI*2);
          let sc = 1.0 + 0.6 * v*v;
          sphere.scaling.set(sc,sc,sc);
        });
    });



}