console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

function curve(t) {
    const R = 4;
    let phi = Math.PI*2 * 7 * t;
    let theta = Math.PI * t;
    let rxz = R*Math.sin(theta);

    return new BABYLON.Vector3(
        rxz * Math.cos(phi),
        R*Math.cos(theta),
        -rxz * Math.sin(phi)    
    );
}

function populateScene(scene) {
    MYLIB.createGrid(scene);

    const m = 500;
    pts = [...Array(m).keys()].map(i=>i/(m-1)).map(curve);


    let material = new BABYLON.StandardMaterial('m', scene);
    material.diffuseColor.set(0.9,0.5,0.1);
    
    const tube = BABYLON.MeshBuilder.CreateTube("tube", {
        path: pts, 
        radius: 0.05, 
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    tube.material = material;




    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.3;
        
    });



}