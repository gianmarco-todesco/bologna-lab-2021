console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

function createPendulum(color, scene) {
}


function populateScene(scene) {
    MYLIB.createGrid(scene);

    const m = 37;
    const r1 = 4;
    const r2 = 3;
    const width = 10;

    const y0 = r1 + 0.3;

    const pendulums = [];

    scene.activeCamera.alpha = 2.1;
    scene.activeCamera.beta = 1.37;
    
    let cylMat = new BABYLON.StandardMaterial('cylMat', scene);
    cylMat.diffuseColor.set(0.8,0.8,0.8);

    let mainCyl = BABYLON.MeshBuilder.CreateCylinder('mainCyl', {
        diameter:0.1,
        height:width
    }, scene);
    mainCyl.rotation.x = Math.PI/2;
    mainCyl.material = cylMat;
    mainCyl.position.y = y0;


    for(let i=0; i<m; i++) {
    
        let pendulum = new BABYLON.Mesh('p', scene);
        let t = i/(m-1);
        let r = 1/((1-t)*(1/r1) + t*(1/r2));
        pendulum.r = r;

        let cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {
            diameter:0.025,
            height:r
        }, scene);
        cyl.position.y = -r/2;
        cyl.parent = pendulum;
        cyl.material = cylMat;

        let weight = BABYLON.MeshBuilder.CreateCylinder("s",
            {diameter:0.5, height:0.2},
            scene);
        weight.rotation.x = Math.PI/2;
        weight.position.set(0,-r,0);
        weight.parent = pendulum;
        weight.material = new BABYLON.StandardMaterial("m",scene);
        let phi = 2*Math.PI*i/m;
        weight.material.diffuseColor = new BABYLON.Color3(
            0.5 + 0.5*Math.cos(phi),
            0.5 + 0.5*Math.sin(phi),
            0.5 + 0.5*Math.sin(2*phi)
        );

        pendulum.position.set(0,y0,(0.5-i/(m-1))*width);
        pendulums.push(pendulum);
		
    }
 

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        pendulums.forEach((pendulum,i) => {
            let theta = 0.4 * Math.sin(20*t/pendulum.r);
            pendulum.rotation.z = theta;
        });
        

    });



}