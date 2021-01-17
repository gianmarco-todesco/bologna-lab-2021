console.log(window);
MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    const m = 55;
    const R = 2;
    const cylinders = [];

    let material = new BABYLON.StandardMaterial('mat', scene);
    material.diffuseColor.set(0.2,0.4,0.7);
    for(let i=0; i<m; i++) {
        let cyl;
        if(i==0) {
            cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {
                diameter : 0.2,
                height : 10
            }, scene);
            cyl.material = material;    
        } else {
            cyl = cylinders[0].createInstance('cyl-inst');
        }
        let phi = Math.PI*2*i/m;
        cyl.position.set(R*Math.cos(phi),0,-R*Math.sin(phi));
        cyl.rotation.y = phi;
        cylinders.push(cyl);
    }

    scene.activeCamera.beta = 1.3;

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        let psi = 0.7 * Math.sin(t);
        
        cylinders.forEach(cyl => {
            cyl.rotation.x = psi;
        });
        
    });



}