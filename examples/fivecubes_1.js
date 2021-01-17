console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

let cubes = [];

function step(t, t0,t1) {
    return t<=t0 ? 0 : t>=t1 ? 1 : (t-t0)/(t1-t0);
}

function smooth(t) {
    return t<0 ? 0 : t>1 ? 1 : (1-Math.cos(Math.PI*t))/2;
}

function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    const colors = [
        [0.8,0.2,0.1],
        [0.8,0.4,0.1],
        [0.8,0.8,0.1],
        [0.4,0.8,0.1],
        [0.8,0.4,0.8]];
    const materials = colors.map(c => {
        let mat = new BABYLON.StandardMaterial('m', scene);
        mat.diffuseColor.set(...c);
        mat.specularColor.set(0.3,0.3,0.3);
        return mat;
    })
    
    const goldenRatio = (1+Math.sqrt(5))/2;
    const theta = Math.atan(1/goldenRatio);

    for(let i=0; i<5; i++) {
        let cube = BABYLON.MeshBuilder.CreateBox('box'+i,{size:3},scene);
        let mat = new BABYLON.StandardMaterial('m'+i, scene);
        mat.diffuseColor.set(...colors[i]);
        mat.specularColor.set(0.3,0.3,0.3);
        cube.material = mat;
        cube.rotation.y = 2*Math.PI*i/5;
        cube.rotation.x = theta;
        cubes.push(cube);
    }


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.3;
        
        
        let R = 4;
        cubes.forEach((cube,i) => {

            let t1 = t + 0.05 * i;
            let t2 = t1 - Math.floor(t1);
            let param = smooth(step(t2,0.2,0.3) - step(t2,0.7,0.8));        
    
            let phi = cube.rotation.y;
            let p0 = new BABYLON.Vector3(Math.sin(phi)*R,0,Math.cos(phi)*R);
            let p1 = new BABYLON.Vector3(0,0,0);
            cube.position.copyFrom(BABYLON.Vector3.Lerp(p0,p1,param));
            cube.rotation.x = (1-param)*0 + param*theta;
        });

    });



}