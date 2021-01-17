console.log(window);
MYLIB.initialize('renderCanvas', populateScene);
let rings;
function populateScene(scene) {
    MYLIB.createGrid(scene);

    const R = 4;
    const H = 1.2;

    // creo l'anello grande 
    let bigRing = BABYLON.MeshBuilder.CreateTorus("big-ring", {
        diameter:2*R,
        thickness:0.3,
        tessellation : 70,
    }, scene);
    bigRing.material = new BABYLON.StandardMaterial("big-ring-mat",scene);
    bigRing.material.diffuseColor.set(0.7,0.7,0.7);
    bigRing.scaling.set(1,0.1,1);

    // creo le "porte"
    const m = 7;

    rings = [];
    for(let i=0;i<m;i++) {
        let phi = Math.PI*2*i/m;
        
        // la porta
        let pivot = new BABYLON.Mesh('port'+i, scene);
        pivot.position.set(R*Math.cos(phi), H, -R*Math.sin(phi));
        pivot.rotation.set(0,phi + Math.PI/2,Math.PI/2);
        

		// materiale
        var mat = new BABYLON.StandardMaterial("m"+i,scene);
        mat.diffuseColor.copyFromFloats(
            0.5+0.5*Math.cos(phi),
            0.5,
            0.5+0.5*Math.sin(phi)            
        );
		
		// primo anello
        ring = BABYLON.MeshBuilder.CreateTorus("ta"+i, {
            diameter:2.0,
            thickness:0.3,
            tessellation : 70,
        }, scene);
        ring.material = mat;
        ring.parent = pivot;
        rings.push(ring);    

		// secondo anello
        ring = BABYLON.MeshBuilder.CreateTorus("tb"+i, {
            diameter:1.4,
            thickness:0.3,
            tessellation : 70,
        }, scene);
        ring.material = mat;
        ring.parent = pivot;
        rings.push(ring);    
    }

	// creo la sfera
    sphere = BABYLON.MeshBuilder.CreateSphere('s', {diameter:1.0}, scene);
    sphere.material = new BABYLON.StandardMaterial('ms', scene);
    sphere.material.diffuseColor.set(0.6,0.6,0.6);
    
    //let myCamera = new BABYLON.FreeCamera('mycam', new BABYLON.Vector3(0,0,0), scene);
    //myCamera.rotation.y = Math.PI;
    //scene.activeCamera = myCamera;
    //myCamera.attachControl(MYLIB.canvas,true);
    
    let cameraPivot = new BABYLON.Mesh('cam-pivot', scene);

    let camera = scene.activeCamera;
    camera.parent = cameraPivot;
    camera.setTarget(new BABYLON.Vector3(-5,0,0));
    camera.beta = 1.2;


    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.2;
        let phi = Math.PI*2*t;

        sphere.position.set(R*Math.cos(phi),H,-R*Math.sin(phi))
        for(let i=0;i<m;i++) {
            rings[2*i].rotation.x = -1*(phi - Math.PI*2*i/m);
            rings[2*i+1].rotation.x = 4*(phi - Math.PI*2*i/m);
        }

        cameraPivot.position.set(R*Math.cos(phi),H,-R*Math.sin(phi));
        cameraPivot.rotation.y = phi;

    });



}