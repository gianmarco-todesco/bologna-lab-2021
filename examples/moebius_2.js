MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    //MYLIB.createGrid(scene);

    // creo il materiale per tutti gli elementi
    let mat = new BABYLON.StandardMaterial("mat",scene);
    mat.diffuseColor.set(0.8,0.4,0.1);
    mat.specularColor.set(0.2,0.2,0.2);

    // parametri del modello
    const n = 25;
    const R = 5;
    const sx = 2, sy = 0.5, sz = 2;

    // creo le coppie di elementi
    const pairs = [];
    for(let i=0; i<n; i++) {

        // la i-esima coppia
        let pair = new BABYLON.Mesh("b",scene);
        pairs.push(pair);
        
        let element;		
        // first element
        element = BABYLON.MeshBuilder.CreateSphere("a", {diameter : 1 }, scene);
        element.scaling.set(sx,sy,sz);		
        element.material = mat;
        
        element.parent = pair;
        element.position.y = 0.5;
        pair.firstElement = element;
        
        // second element
        element = BABYLON.MeshBuilder.CreateSphere("b", {diameter : 1 }, scene);
        element.scaling.set(sx,sy,sz);		
        element.material = mat;
        element.parent = pair;
        element.position.y = -0.5;		
        pair.secondElement = element;
      
    }
  
    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        var psi = t*0.1;
        var gamma = psi * 20;

        pairs.forEach((pair,i) => {
          let phi = Math.PI*2*i/n;

          pair.position.set(R*Math.cos(phi), 0, -R*Math.sin(phi));
          pair.rotation.y = phi;
          pair.rotation.z = phi/2 + psi;

          var x = Math.sin(gamma)*1.1;
          var y = Math.cos(gamma)*0.3;
          
          pair.firstElement.position.set(x,y,0); 
          pair.secondElement.position.set(-x,-y,0); 
      
        });
      
    });
}