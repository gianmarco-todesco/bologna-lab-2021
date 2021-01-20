console.log(window);
MYLIB.initialize('renderCanvas', populateScene);



function populateScene(scene) {
    // MYLIB.createGrid(scene);

    let floor = BABYLON.MeshBuilder.CreateGround('floor', {width:10, height:10}, scene);
    floor.material = new BABYLON.StandardMaterial('floor-mat', scene);
    floor.material.diffuseColor.set(0.2,0.4,0.5);
    floor.material.specularColor.set(0,0,0);
    floor.receiveShadows = true;

    light = new BABYLON.PointLight('light1', new BABYLON.Vector3(1,20,-10), scene);
    
	// ombre
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.setDarkness(0.5);
    shadowGenerator.usePoissonSampling = true;
    

    // scene.activeCamera.

    let r = 0.5;

    let m1 = 6, m2 = 14;
    let R1 = m1/4, R2 = m2/4;
    
    let cubeTexture = new BABYLON.DynamicTexture('a', { width:1024, height:1024}, scene);
    let ctx = cubeTexture.getContext();
    ctx.fillStyle="yellow";
    ctx.strokeStyle="black";
    ctx.lineWidth=80;
    ctx.beginPath();
    ctx.rect(0,0,1024,1024);
    ctx.fill();
    ctx.stroke();
    cubeTexture.update();

    let cubeMat = new BABYLON.StandardMaterial('cube-mat', scene);
    cubeMat.diffuseColor.set(0.9,0.9,0.9);
    cubeMat.diffuseTexture = cubeTexture;

    let cube = BABYLON.MeshBuilder.CreateBox('cube', {size:2*r}, scene);
    cube.material = cubeMat;

    let cubes = [cube];
    for(let i=1;i<m1+m2; i++) cubes.push(cube.createInstance('c'+i));
    cubes.forEach(cube => {
      cube.position.y = r;
      shadowGenerator.addShadowCaster(cube);
    });
    
    function roll(cube, x0,z0, dx,dz, dist) {
        let delta = Math.floor(dist);
        let theta = (Math.PI/2) * (dist - delta);
        cube.setPivotPoint(new BABYLON.Vector3(r*dx,-r,r*dz));
        cube.position.x = x0 + dx*delta;
        cube.position.z = z0 + dz*delta;
        cube.rotation.x = dz * theta;
        cube.rotation.z = -dx * theta;        
    }

    function roll4(cube, r, t) {
        t=4*(t-Math.floor(t));
        let side = Math.floor(t);
        let s = 2*r*(t-side);
        if(side == 0) roll(cube, -r,-r, 1,0, s);
        else if(side == 1) roll(cube, r,-r, 0,1, s);
        else if(side == 2) roll(cube, r,r, -1,0, s);
        else roll(cube, -r,r, 0,-1, s);
    }

    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        for(let i=0; i<m1; i++) 
            roll4(cubes[i], R1, t/m1 + i/m1);

        for(let i=0; i<m2; i++) 
            roll4(cubes[m1+i], R2, -t/m2 + i/m2);

        



    });



}