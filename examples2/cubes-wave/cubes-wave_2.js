MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    MYLIB.createGrid(scene);
    

    let material = new BABYLON.StandardMaterial('mat', scene);
    material.diffuseColor.set(1,1,1);
    material.diffuseTexture = new BABYLON.Texture("ground.jpg", scene);
    let cubes = [];
    const n = 20;
    for(let i=0; i<n; i++) {
        for(let j=0; j<n; j++) {
            let obj = BABYLON.MeshBuilder.CreateBox('a',{ size:0.3}, scene);
            obj.material = material;
            obj.position.x = 4*(-1+2*j/(n-1));
            obj.position.z = 4*(-1+2*i/(n-1));
            cubes.push(obj);
        }
    }

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        cubes.forEach(cube => {
            cube.rotation.x = t - cube.position.length()*0.3;
        });

    });
    



}