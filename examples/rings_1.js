console.log(window);
MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    MYLIB.createGrid(scene);

    const m = 13;
    let rings = [];

    for(let i=0; i<m; i++) {
        let phi = Math.PI*2*i/m;

        let ring = BABYLON.MeshBuilder.CreateTorus('t',{
            diameter:5,
            thickness:0.25,
            tessellation:80
        });
        let material = new BABYLON.StandardMaterial('m', scene);
        material.diffuseColor.set(
            0.5 + 0.5*Math.cos(phi),
            0.5,
            0.5+0.5*Math.sin(phi));
        ring.material = material;

        ring.position.set(
            Math.cos(phi),0,-Math.sin(phi)
        );
        ring.rotation.y = phi;
        ring.rotation.x = 0.8;
        rings.push(ring);
    }



}