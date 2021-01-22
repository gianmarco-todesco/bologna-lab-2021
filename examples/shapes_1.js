MYLIB.initialize('renderCanvas', pippo);

// references:
//   https://doc.babylonjs.com/typedoc/classes/babylon.meshbuilder



function pippo(scene) {

    MYLIB.createGrid(scene);
    
    // per risparmiare fatica :-)
    const MB = BABYLON.MeshBuilder;
    let mesh;

    //------------------------------------------
    // sfera
    //------------------------------------------
    mesh = MB.CreateSphere('sphere',{
        diameter:1.5
    },scene);
    mesh.position.set(4,1,4);

    //------------------------------------------
    // cubo
    //------------------------------------------
    mesh = MB.CreateBox('cube',{
        size:1.2
    },scene);
    mesh.position.set(2,1,4);

    //------------------------------------------
    // parallelepipedo
    //------------------------------------------
    mesh = MB.CreateBox('box',{
        width:0.6, height:1.2, depth:0.2
    },scene);
    mesh.position.set(0,1,4);

    //------------------------------------------
    // cilindro
    //------------------------------------------
    mesh = MB.CreateCylinder('cylinder',{
        diameter:1.0, height:1.2
    },scene);
    mesh.position.set(-2,1,4);

    //------------------------------------------
    // cilindro 2
    //------------------------------------------
    mesh = MB.CreateCylinder('cylinder2',{
        diameter:1.2, height:0.2
    },scene);
    mesh.position.set(-4,1,4);

    //------------------------------------------
    // cono 
    //------------------------------------------
    mesh = MB.CreateCylinder('cone',{
        diameterTop:0, 
        diameterBottom:1.2, 
        height:1.2
    },scene);
    mesh.position.set(4,1,2);

    //------------------------------------------
    // tronco di cono 
    //------------------------------------------
    mesh = MB.CreateCylinder('cone',{
        diameterTop:0.6, 
        diameterBottom:1.2, 
        height:1.2
    },scene);
    mesh.position.set(2,1,2);

    //------------------------------------------
    // ciambella
    //------------------------------------------
    mesh = MB.CreateTorus('torus',{
        diameter:1.5, 
        tickness:0.5, 
        tessellation:40
    },scene);
    mesh.position.set(0,1,2);

    //------------------------------------------
    // dodecaedro (ci sono quindici poliedri
    // predefiniti : vedi https://doc.babylonjs.com/divingDeeper/mesh/creation/polyhedra/polyhedra_by_numbers)
    //------------------------------------------
    mesh = MB.CreatePolyhedron('dod',{
        type: 2,
        size: 0.8
    },scene);
    mesh.position.set(-2,1,2);

    //------------------------------------------
    // questo è un altro poliedro predefinito
    //------------------------------------------
    mesh = MB.CreatePolyhedron('rhombicuboctahedron',{
        type: 4,
        size: 0.8
    },scene);
    mesh.position.set(-4,1,2);

    //------------------------------------------
    // un poliedro "custom"
    //------------------------------------------
    mesh = MB.CreatePolyhedron('tronco-piramide',{
        custom: {
            "vertex" : [
                [-1,-1,-1],[ 1,-1,-1],[-1,-1, 1],[ 1,-1, 1],
                [-0.5,1,-0.5],[ 0.5,1,-0.5],[-0.5,1, 0.5],[ 0.5,1, 0.5]
            ],
            "face" : [
                [0,1,3,2],[4,6,7,5],[1,0,4,5],
                [3,1,5,7],[2,3,7,6],[0,2,6,4]
            ]
        },
        size: 0.6
    },scene);
    mesh.position.set(4,1,0);

    //------------------------------------------
    // un secondo poliedro "custom"
    //------------------------------------------
    mesh = MB.CreatePolyhedron('cuneo',{
        custom: {
            "vertex" : [
                [-1,-1,-1],[-1,-1, 1],[ 1,-1,-1],[ 1,-1, 1],
                [-1, 1,-1],[-1, 1, 1],
            ],
            "face" : [
                [1,0,2,3],[3,2,4,5],[5,4,0,1],
                [0,4,2],[1,3,5]
            ]
        },
        size: 0.6
    },scene);
    mesh.position.set(2,1,0);

    //------------------------------------------
    // un tubo
    // see: https://doc.babylonjs.com/divingDeeper/mesh/creation/param/tube
    //------------------------------------------
    function makeSpringPath(n,k,r,h) {
        let pts = [];
        for(let i=0;i<n;i++) {
            let t = i/(n-1); // t va da 0 a 1
            let phi = k*Math.PI*2*t; // phi va da 0 a 2kPI
            pts.push(new BABYLON.Vector3(
                r*Math.cos(phi), 
                h*(-0.5+t), 
                r*Math.sin(phi)
            ));
        }
        return pts;
    }
    mesh = MB.CreateTube('molla',{
        path: makeSpringPath(200,5,0.5,1.5),
        radius: 0.1,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene);
    mesh.position.set(0,1,0);

    //------------------------------------------
    // un altro tubo
    //------------------------------------------
    function makeSpiralPath(n,k,r0,a) {
        let pts = [];
        for(let i=0;i<n;i++) {
            let t = i/(n-1); // t va da 0 a 1
            let phi = k*Math.PI*2*t; // phi va da 0 a 2kPI
            let r = r0 * Math.exp(-a*phi);
            pts.push(new BABYLON.Vector3(
                r*Math.cos(phi), 
                r*Math.sin(phi),
                0
            ));
        }
        return pts;
    }
    mesh = MB.CreateTube('molla',{
        path: makeSpiralPath(200,5,1,0.1),
        radiusFunction: (i,dist) => 0.2/(1.0+0.5*dist),
        cap: BABYLON.Mesh.CAP_ALL
    }, scene);
    mesh.position.set(-2,1,0);



    // assegno colori diversi a tutti gli oggetti
    // nella scena
    let meshes = scene.meshes.filter(mesh => mesh.name != "lines");
    meshes.forEach((mesh,i) => {
        let phi = Math.PI*2*i/meshes.length;
        let mat = mesh.material = new BABYLON.StandardMaterial(
            mesh.name + "_mat", scene);
        mat.diffuseColor.set(
            0.5 + 0.4 * Math.cos(phi),
            0.5 + 0.4 * Math.sin(phi),
            0.5 + 0.4 * Math.sin(2*phi)
        );
        
    });
    
    //scene.registerBeforeRender(() => {
    //    let t = performance.now() * 0.001;
    //});

}