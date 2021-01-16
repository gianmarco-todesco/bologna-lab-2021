
let canvas,engine,scene,camera;
let cube;

window.addEventListener('DOMContentLoaded', (event) => {
    canvas = document.getElementById('c');
    canvas.addEventListener('wheel', evt => evt.preventDefault());
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    camera = new BABYLON.ArcRotateCamera('cam', Math.PI/2,0.7,15, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13;            
    let light1 = new BABYLON.PointLight('light1',new BABYLON.Vector3(0,1,0), scene);
    light1.parent = camera;

    createGrid(scene);

    populateScene(scene);
    
    engine.runRenderLoop(()=>scene.render());
});


function populateScene(scene) {
    let mat = new BABYLON.StandardMaterial('m',scene);
    let m = 40;
    let r = 4;
    let boxes = [];
    for(let i=0; i<m; i++) {
        
        let box = BABYLON.MeshBuilder.CreateBox('b', {size:1}, scene);
        box.scaling.set(1,0.1,0.4);
        let phi = Math.PI*2*i/m;
        box.rotation.y = -phi;
        box.position.set(r*Math.cos(phi), 0, r*Math.sin(phi));
        boxes.push(box);
    }
    scene.registerBeforeRender(()=>{
        let theta = performance.now()*0.001;
        boxes.forEach(box=>{
            box.rotation.z = theta + box.rotation.y;
        });
    });

}

