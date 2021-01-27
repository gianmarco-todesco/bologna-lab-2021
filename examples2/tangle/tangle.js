let canvas, engine, camera, obj;

window.addEventListener('DOMContentLoaded', (event) => {
	
    canvas = document.getElementById("renderCanvas"); // Get the canvas element
    engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
	camera;

		
	const createScene = function () {
		let texture, light1, light2;
		
        let scene = new BABYLON.Scene(engine);
		camera = new BABYLON.ArcRotateCamera("Camera", 
			Math.PI / 2, 
			Math.PI / 2, 
			10, new BABYLON.Vector3(0,0,0), scene);
		camera.wheelPrecision = 40;
		camera.lowerRadiusLimit = 5;
		camera.attachControl(canvas, true);

		light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
		light1.intensity = 0.5;
		light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, -4), scene);   
		light2.intensity = 0.5;
		light2.parent = camera;
			
			
		BABYLON.SceneLoader.Append("./data/", "tangle.obj", scene, function (scene) {
			obj = scene.meshes[0];
		});
            
		return scene;
	};

    scene = createScene(); 
	engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", function () { engine.resize();});
});

