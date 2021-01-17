console.log(window);
MYLIB.initialize('renderCanvas', populateScene);



function populateScene(scene) {
    MYLIB.createGrid(scene);

    let r = 0.5;

    let m1 = 6, m2 = 14;
    let R1 = m1/4, R2 = m2/4;
    

    let cubeMat = new BABYLON.StandardMaterial('cube-mat', scene);
    cubeMat.diffuseColor.set(0.3,0.6,0.8);

    let cube = BABYLON.MeshBuilder.CreateBox('cube', {size:2*r}, scene);
    cube.material = cubeMat;

    let cubes = [cube];
    for(let i=1;i<m1+m2; i++) cubes.push(cube.createInstance('c'+i));
    cubes.forEach(cube => cube.position.y = r);
    
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