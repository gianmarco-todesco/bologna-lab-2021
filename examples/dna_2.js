console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

function populateScene(scene) {
    // MYLIB.createGrid(scene);

    scene.activeCamera.beta = 1.3;


    let pieces = [];

    const W = 1;
    const R1 = 0.05;
    const R2 = 0.15;
    

    for(let i=0;i<2;i++) {
        let sgn = -1+2*i;
        let cyl = BABYLON.MeshBuilder.CreateCylinder('c',{
            diameter: 2*R1,
            height:W * 0.8
        }, scene);
        cyl.rotation.z = Math.PI/2;
        cyl.position.x = -sgn * W / 2;
        cyl.material = new BABYLON.StandardMaterial('m',scene);
        cyl.material.diffuseColor.set(0.5,0.5,0.5);
    
        let sphere = BABYLON.MeshBuilder.CreateSphere('c',{
            diameter: 2*R2,
        }, scene);
        sphere.position.x = -sgn*W;
        sphere.material = new BABYLON.StandardMaterial('m',scene);
        if(i==0)
            sphere.material.diffuseColor.set(0.9,0.4,0.03);
        else
            sphere.material.diffuseColor.set(0.2,0.4,0.9);
    
        let piece = BABYLON.Mesh.MergeMeshes([cyl,sphere], 
            true, true, undefined, false, true);
        pieces.push(piece);
    }

    let dnaLeft = [pieces[0]], dnaRight = [pieces[1]];
    const m = 100;
    for(let i=1; i<m; i++) {
        dnaLeft.push(pieces[0].createInstance('i'));
        dnaRight.push(pieces[1].createInstance('i'));        
    }

    const H = 12;
    const y0 = -H/2;
    const dy = H/m;

    for(let i=0;i<m;i++) {
        let y = y0 + i*dy;
        dnaLeft[i].position.y = dnaRight[i].position.y = y;        
    }
    


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.1;
        t = t-Math.floor(t);

        let K = 3;

        let psi = t * (Math.PI*2) * K * 2;
        

    
        for(let i=0;i<m;i++) {
            let s = i/m;

            let phi = s * K * (Math.PI*2) + psi;
            dnaLeft[i].rotation.y = dnaRight[i].rotation.y = phi;

            let d = 0.1;
            let dx = 1.2*(
                split(s-(1-t)*2,-1-d,-1+d)-
                split(s-(1-t)*2,-d,d));
                
            dnaLeft[i].position.x = dx;
            dnaRight[i].position.x = -dx;
            
        }
    });



}

function split(t, t0,t1) {
    if(t<=t0) return 0;
    else if(t>=t1) return 1;
    s = (t-t0)/(t1-t0);
    return 0.5*(1-Math.cos(Math.PI*s));
}