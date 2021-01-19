console.log(window);
MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    // MYLIB.createGrid(scene);

    
    const R = 2;

    let rings = [];
    let ringMaterial = new BABYLON.StandardMaterial('m', scene);
    ringMaterial.diffuseColor.set(0.3,0.4,0.5);
        
    for(let i=0;i<3;i++) {
        let ring = BABYLON.MeshBuilder.CreateTorus('t',{
            diameter:2*R,
            thickness:0.25,
            tessellation:80
        });
        ring.material = ringMaterial;
        rings.push(ring);
    }

    rings[1].rotation.x = Math.PI/2;
    rings[2].rotation.z = Math.PI/2;

    let mat1 = new BABYLON.StandardMaterial('m1', scene);
    mat1.diffuseColor.set(0.8,0.8,0.8);
    let mat2 = new BABYLON.StandardMaterial('m2', scene);
    mat2.diffuseColor.set(0.9,0.9,0.7);
    
    let spheres = [];
    let ps = [[R,0,0],[-R,0,0],[0,R,0],[0,-R,0],[0,0,R],[0,0,-R]];
    ps.forEach((p,i) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere('s'+i,{
            diameter: 2
        }, scene);
        sphere.position.set(...p);
        sphere.material = mat1;
        spheres.push(sphere);
    });
    
    scene.constantlyUpdateMeshUnderPointer = true;
    let oldMesh = null;

    scene.registerBeforeRender(() => {
        let mesh = scene.meshUnderPointer;
        if(oldMesh != mesh) {
            if(oldMesh) oldMesh.material = mat1;
            oldMesh = mesh;
            if(oldMesh) oldMesh.material = mat2;            
        }
       // console.log(scene.meshUnderCursor);
    });

}