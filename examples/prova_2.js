MYLIB.initialize('renderCanvas', populateScene);

function curve1(t) {
    let phi = Math.PI * 2 * t;
    return new BABYLON.Vector3(
        2*Math.cos(phi),
        0,
        -2*Math.sin(phi)
    );
}

function curve2(t) {
    let phi = Math.PI * 2 * t;
    return new BABYLON.Vector3(
        4*Math.cos(phi),
        0,
        -2*Math.sin(2*phi)
    );
}

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

function populateScene(scene) {
    MYLIB.createGrid(scene);
    

    let material = new BABYLON.StandardMaterial('mat', scene);
    material.diffuseColor.set(0.9,0.5,0.2);

    const m = 100;
    let pts = [];
    for(let i=0; i<m; i++) {
        let obj = BABYLON.MeshBuilder.CreateSphere('a',{ diameter:0.1}, scene);
        obj.material = material;
        let p = curve(i/m);
        obj.position.copyFrom(p);
        pts.push(p);
    }
    pts.push(pts[0]);
    let tube = BABYLON.MeshBuilder.CreateTube('a',{path:pts, radius:0.02},scene);

    let E0 = [], E1 = [];
    for(let i=0;i+1<pts.length;i++) {
        let dir = pts[i+1].subtract(pts[i]).normalize();
        E0.push(dir);
        E1.push(new BABYLON.Vector3(dir.z,0,-dir.x));
        let cyl = BABYLON.MeshBuilder.CreateCylinder('cyl', {diameter:0.07, height:1}, scene);
        MYLIB.align(cyl, pts[i], pts[i].add(E1[i]));
    }
    
    let sphere = BABYLON.MeshBuilder.CreateSphere('a',{ diameter:0.6}, scene);
    sphere.material = new BABYLON.StandardMaterial('mat', scene);
    sphere.material.diffuseColor.set(1,0,0);

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        t *= 0.1;
        t -= Math.floor(t);
        sphere.position.copyFrom(curve(t));

    });
    



}