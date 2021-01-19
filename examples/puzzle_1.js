console.log(window);
MYLIB.initialize('renderCanvas', populateScene);

const colors = [[0.8,0.4,0.1], [0.2,0.4,0.7]];

function populateScene(scene) {
    // MYLIB.createGrid(scene);

    
    const R = 2;

    let rings = [];
    let ringMaterial = new BABYLON.StandardMaterial('m', scene);
    ringMaterial.diffuseColor.set(0.6,0.6,0.6);
        
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


    
    let spheres = [];
    let ps = [[R,0,0],[-R,0,0],[0,R,0],[0,-R,0],[0,0,R],[0,0,-R]];
    ps.forEach((p,i) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere('s'+i,{
            diameter: 2
        }, scene);
        sphere.position.set(...p);
        sphere.material = new BABYLON.StandardMaterial('m'+i, scene);
        sphere.material.diffuseColor.set(...colors[0]);
    
        sphere.status = 0;
        sphere.links = [];
        spheres.push(sphere);        
    });

    [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]].forEach(ab => {
      let sa = spheres[ab[0]], sb = spheres[ab[1]];
      sa.links.push(sb);
      sb.links.push(sa);      
    });
    
    
    scene.constantlyUpdateMeshUnderPointer = true;

    scene.registerBeforeRender(() => {
        let mesh = scene.meshUnderPointer;
        spheres.forEach(sphere => {
          let highlighted = scene.meshUnderPointer == sphere;
          if(highlighted)
            sphere.material.emissiveColor.set(0.1,0.1,0.1);
          else
            sphere.material.emissiveColor.set(0,0,0);          
        });
    });

    

    scene.onPointerObservable.add(pointerInfo => {
      if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
        let mesh = scene.meshUnderPointer;
        if(mesh && mesh.name.startsWith('s')) {
          flipSphere(mesh);
          mesh.links.forEach(other => flipSphere(other));
        }
      }
    });

}


function flipSphere(sphere) {
  sphere.status = 1-sphere.status;
  sphere.material.diffuseColor.set(...colors[sphere.status]);
}