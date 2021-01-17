"use strict"
const MYLIB = {}


//
// MYLIB.createGrid()
//
// aggiunge alla scena i tre assi cartesiani e una griglia che rappresenta il piano XZ
//

MYLIB.createGrid = function(scene) {
    
    let Color4 = BABYLON.Color4;
    let Vector3 = BABYLON.Vector3;
     
    let m = 50;
    let r = 5;
    let pts = [];
    let colors = [];
    let c1 = new Color4(0.7,0.7,0.7,0.5);
    let c2 = new Color4(0.5,0.5,0.5,0.25);
    let cRed   = new Color4(0.8,0.1,0.1);
    let cGreen = new Color4(0.1,0.8,0.1);
    let cBlue  = new Color4(0.1,0.1,0.8);
    
    let color = c1;
    function line(x0,y0,z0, x1,y1,z1) { 
        pts.push([new Vector3(x0,y0,z0), new Vector3(x1,y1,z1)]); 
        colors.push([color,color]); 
    }
    
    for(let i=0;i<=m;i++) {
        if(i*2==m) continue;
        color = (i%5)==0 ? c1 : c2;
        let x = -r+2*r*i/m;        
        line(x,0,-r, x,0,r);
        line(-r,0,x, r,0,x);
    }
    
    let r1 = r + 1;
    let a1 = 0.2;
    let a2 = 0.5;
    
    // x axis
    color = cRed;
    line(-r1,0,0, r1,0,0); 
    line(r1,0,0, r1-a2,0,a1);
    line(r1,0,0, r1-a2,0,-a1);
        
    // z axis
    color = cBlue;
    line(0,0,-r1, 0,0,r1); 
    line(0,0,r1, a1,0,r1-a2);
    line(0,0,r1,-a1,0,r1-a2);
    
    // y axis
    color = cGreen;
    line(0,-r1,0, 0,r1,0); 
    line(0,r1,0, a1,r1-a2,0);
    line(0,r1,0,-a1,r1-a2,0);
    line(0,r1,0, 0,r1-a2,a1);
    line(0,r1,0, 0,r1-a2,-a1);
    
    const lines = BABYLON.MeshBuilder.CreateLineSystem(
        "lines", {
                lines: pts,
                colors: colors,
                
        }, 
        scene);
    return lines;    
};

// MYLIB.initialize(populateScene)
// 
// una funzione di comodo che aspetta che la pagina web sia stata completamente caricata,
// poi crea il graphics engine, una camera, delle luci, 
// e usa populateScene() per aggiungere gli altri oggetti. 
// Infine fa partire il render loop

MYLIB.initialize = function (canvasId, populateScene) {
    window.addEventListener('DOMContentLoaded', (event) => {
        const canvas = MYLIB.canvas = document.getElementById(canvasId);
        canvas.addEventListener('wheel', evt => evt.preventDefault());
        const engine = MYLIB.engine = new BABYLON.Engine(canvas, true);
        const scene = MYLIB.scene = new BABYLON.Scene(engine);
        const camera = MYLIB.camera = new BABYLON.ArcRotateCamera('cam', 
            Math.PI/2,0.7,
            15, 
            new BABYLON.Vector3(0,0,0), 
            scene);
        camera.attachControl(canvas,true);
        camera.wheelPrecision = 50;
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 13;            
        let light1 = new BABYLON.PointLight('light1',new BABYLON.Vector3(0,1,0), scene);
        light1.parent = camera;
    
        populateScene(scene);
        
        engine.runRenderLoop(()=>scene.render());
        window.addEventListener("resize", () => engine.resize());
    });
    
}