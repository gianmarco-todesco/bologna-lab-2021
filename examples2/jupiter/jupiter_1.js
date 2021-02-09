MYLIB.initialize('renderCanvas', populateScene);

// Questo esempio mostra come applicare una texture su una superficie sferica
// la texture di giove è stata scaricata da https://www.solarsystemscope.com/textures/

// Attenzione: Come tutti gli altri esempi in examples2, anche questo richiede un web-server.
// Aprire direttamente il file .html con l'internet browser non funziona 
// per problemi legati alla CORS Policy (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
//
// Istruzioni:
//
// 1. (se non avete installato Python) scaricate e installate Python3 (https://www.python.org/downloads/)
// 2. Aprite una shell (su windows : tasto Windows + R; scrivere "cmd" e poi OK)
// 3. andate nel folder che contiene la vostra animazione (es. io dovrei fare
//    cd c:\Users\gmt\Documents\conferenze\bologna-lab-2021\examples2\jupiter
//    voi dovete indicare il path giusto sul vostro computer)
// 4. dare il comando 
//       python -m http.server
//    se tutto va bene la risposta dovrebbe essere qualcosa del genere:
//       Serving HTTP on :: port 8000 (http://[::]:8000/) ...
// 5. aprire l'internet browser (es. Google Chrome) e andare all'indirizzo http://localhost:8000
//    dovrebbe comparire un elenco di file
// 6. fate click sul file con l'estensione .html


function populateScene(scene) {
    MYLIB.createGrid(scene);
    
    let camera = scene.activeCamera;
    camera.radius = 3;
    camera.beta = 1.2;

    let jupiter = BABYLON.MeshBuilder.CreateSphere('jupiter', {diameter:2},scene);
    let material = jupiter.material = new BABYLON.StandardMaterial('jupiter-material', scene);
    material.diffuseColor.set(0.9,0.9,0.9);
    material.specularColor.set(0.01,0.01,0.01);
    material.diffuseTexture = new BABYLON.Texture("2k_jupiter.jpg", scene);



    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:100.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./skybox", scene, 
        ["_px.png","_py.png","_pz.png","_nx.png","_ny.png","_nz.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        jupiter.rotation.y = t*0.5;
    });
    



}