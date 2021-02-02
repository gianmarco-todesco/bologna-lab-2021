MYLIB.initialize('renderCanvas', populateScene);


//
// questa funzione descrive la traiettoria
// che segue il percorso
function curve(t) {    
    t = (t-Math.floor(t))*2;
    let phi = Math.PI * 2 * t;
    if(t<1)
        return new BABYLON.Vector3(
            -2+2*Math.cos(phi),
            Math.cos(phi/2),
            -2*Math.sin(phi)
        );
    else
        return new BABYLON.Vector3(
            2-2*Math.cos(phi),
            Math.cos(phi/2),
            -2*Math.sin(phi)
        );
}

function createSegment(p0,p1,scene) {
    let cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {diameter:0.07, height:1}, scene);
    MYLIB.align(cyl, p0, p1);
    return cyl;
}


function populateScene(scene) {
    MYLIB.createGrid(scene);
    

    let sphereMat = new BABYLON.StandardMaterial('sphereMat', scene);
    sphereMat.diffuseColor.set(0.9,0.5,0.2);
    let tubeMat = new BABYLON.StandardMaterial('tubeMat', scene);
    tubeMat.diffuseColor.set(0.9,0.7,0.2);

    const m = 100;
    let pts = [];
    for(let i=0; i<m; i++) {
        let p = curve(i/m);
        pts.push(p);
    }
    pts.push(pts[0]);
    

    let refs = [];
    for(let i=0;i<pts.length;i++) {
        let t = i/m;
        const epsilon = 0.001;
        let e0 = curve(t+epsilon)
            .subtract(curve(t-epsilon))
            .normalize();
        let e1 = new BABYLON.Vector3(e0.z,0,-e0.x);
        let e2 = BABYLON.Vector3.Cross(e0,e1);
        refs.push({e0,e1,e2});
    }

    let pts1=[];
    let pts2=[];
    
    const dx = 0.2, dy = 0.1;

    for(let i=0;i<pts.length;i++) {
        const p0 = pts[i];
        const {e0,e1,e2} = refs[i];
        let p1 = p0.add(e1.scale(dx)).add(e2.scale(dy));
        let p2 = p0.add(e1.scale(-dx)).add(e2.scale(dy));
        createSegment(p0,p1,scene);
        createSegment(p0,p2,scene);              
        pts1.push(p1);
        pts2.push(p2);        
    }
    
    let tube1 = BABYLON.MeshBuilder.CreateTube('a',{
        path:pts1, 
        radius:0.05
    },scene);
    tube1.material = tubeMat;

    let tube2 = BABYLON.MeshBuilder.CreateTube('a',{
        path:pts2, 
        radius:0.05
    },scene);
    tube2.material = tubeMat;


    /*

    let E0 = [], E1 = [];
    for(let i=0;i+1<pts.length;i++) {
        let dir = pts[i+1].subtract(pts[i]).normalize();
        E0.push(dir);
        E1.push(new BABYLON.Vector3(dir.z,0,-dir.x));
        let cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {diameter:0.07, height:1}, scene);
        MYLIB.align(cyl, pts[i], pts[i].add(E1[i]));
    }
    */

    
    let sphere = BABYLON.MeshBuilder.CreateSphere('a',{ diameter:0.6}, scene);
    sphere.material = new BABYLON.StandardMaterial('mat', scene);
    sphere.material.diffuseColor.set(1,0,0);

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        t *= 0.1;
        t -= Math.floor(t);
        sphere.position.copyFrom(curve(t));
        sphere.position.y += 0.4;
    });
    



}