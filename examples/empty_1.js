MYLIB.initialize('renderCanvas', populateScene);


function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    scene.activeCamera.alpha = 2.5;

    
    

    //scene.registerBeforeRender(() => {
    //    let t = performance.now() * 0.001;
    //});

}