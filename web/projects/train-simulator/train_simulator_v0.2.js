//Autori: Nitti; Parma
//Istituto: Liceo G. M. Colombini
//Progetto: Train Simulator
//Descrizione: Un simulatore di guida di treni, in cui si può scegliere
    //la velocità del treno potrà essere decisa e modificata in corsa,
    //la rotaia è infinita. 

const chunk_size = 32;

window.addEventListener('DOMContentLoaded', (event) => {
        const canvas = document.getElementById('renderCanvas');
        canvas.addEventListener('wheel', evt => evt.preventDefault());
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera('cam', 0,0,15, new BABYLON.Vector3(0,0,0), scene);
        camera.attachControl(canvas,true);
        //camera.wheelPrecision = 50;
        //camera.lowerRadiusLimit = 3;
        //camera.upperRadiusLimit = 13*2;
        let light1 = new BABYLON.PointLight('light1',new BABYLON.Vector3(0,1,0), scene);
        light1.parent = camera;
    
        populateScene(scene);
        
        scene.registerBeforeRender(() => {
            let t = performance.now() * 0.01;
            /*camera.setPosition(new BABYLON.Vector3(-8, 5, t));
            camera.setTarget(new BABYLON.Vector3(-8, 5, 10+t));*/
            //console.log(t);
        });
        
        engine.runRenderLoop(()=>scene.render());
        window.addEventListener("resize", () => engine.resize());
        
});

//Funzione per creare il terreno
function createTerrain(scene, z_offset) {
    //materiali dell'ambiente
    const metal = new BABYLON.StandardMaterial('metal', scene)
    metal.diffuseColor = new BABYLON.Color3(0.447, 0.474, 0.447);
    //metal.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    const wood = new BABYLON.StandardMaterial('wood', scene)
    wood.diffuseColor = new BABYLON.Color3(0.478, 0.356, 0.219);
    //wood.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    const gravel = new BABYLON.StandardMaterial('gravel', scene);
    gravel.diffuseColor = new BABYLON.Color3(0.560, 0.619, 0.572);
    
    //creazione binari
    for(let x_offset=-8; x_offset<=8; x_offset+=16) {   //il valore di x_offset varia la distanza fra i centri dei binari
        for(let j=-0.5; j<=0.5; j+=1) {
            for(let k=-2; k<=2; k+=4) {
                let rail_h = BABYLON.MeshBuilder.CreateBox('rail_h', {height:0.1, depth: chunk_size, width:1.0}, scene);   //h indica la parte verticale di una rotaia
                rail_h.material = metal;
                rail_h.position.y = j;
                rail_h.position.x = k + x_offset;
                rail_h.position.z = z_offset;
            }
        }
        for(let i=-2; i<=2; i+=4) {
            let rail_v = BABYLON.MeshBuilder.CreateBox('rail_v', {height:1.0, depth: chunk_size, width:0.1}, scene);   //v indica la parte verticale di una rotaia
            rail_v.material = metal;
            rail_v.position.y = 0;
            rail_v.position.x = i + x_offset;
            rail_v.position.z = z_offset;
        }
        for(let i=-(chunk_size/2);i<=(chunk_size/2); i+=4) {
            let traversa = BABYLON.MeshBuilder.CreateBox('traversa',{height:0.25, depth:1, width:6.5}, scene);
            traversa.material = wood;
            traversa.position.x = x_offset;
            traversa.position.y = -0.675;  //(-0.5-0.1/2-0.25/2)
            traversa.position.z = i+z_offset;
        }
    }
    
    //creazione terreno
    for(let s=-1; s<=1; s+=1) {
        let terreno = BABYLON.MeshBuilder.CreatePlane('terreno', {size: chunk_size}, scene);
        terreno.material = gravel;
        terreno.rotation.x = Math.PI/2;
        terreno.position.x = s*chunk_size;
        terreno.position.y = -0.8;
        terreno.position.z = z_offset;
    }
    
    //creazione pali
    if(z_offset%(2*chunk_size) == 0) {  //creo i pali a chunk alternati
        for(let x_offset=-24; x_offset<=24; x_offset+=48) {
            let cilindro1 = BABYLON.MeshBuilder.CreateCylinder('cilindro1', {height:15, diameter:2.0}, scene);  //sezione verticale
            let cilindro2 = BABYLON.MeshBuilder.CreateCylinder('cilindro2', {height:15, diameter:1.5}, scene);
            let troncodicono = BABYLON.MeshBuilder.CreateCylinder('troncodicono', {diameterTop: 1.5, diameterBottom: 2.0, height: 1.0}, scene);
            cilindro1.position.x = x_offset;
            cilindro2.position.x = x_offset;
            troncodicono.position.x = x_offset;
            cilindro1.position.y = 7.5 - 0.8;
            cilindro2.position.y = 22.5 - 0.8;
            troncodicono.position.y = 15 + 0.5 - 0.8;
            cilindro1.position.z = z_offset;
            cilindro2.position.z = z_offset;
            troncodicono.position.z = z_offset;
            
            let cilindro_orizz = BABYLON.MeshBuilder.CreateCylinder('cilindro_orizz', {height:20, diameter: 1.125}, scene); //creazione dei "pali orizzontali"
            cilindro_orizz.rotation.z = Math.PI/2;
            if (x_offset < 0) cilindro_orizz.position.x = x_offset + 10;   //controllo se la sezione orizzontale si trova a sinistra (tengo il segno concorde)
            else cilindro_orizz.position.x = x_offset - 10;                //oppure a destra rispetto all'origine (inverto la sua traslazione sulle ascisse)       metodo alternativo: cilindro_orizz.position.x = x_offset + (x_offset < 0 ? 10 : -10);
            cilindro_orizz.position.y = 22.5;
            cilindro_orizz.position.z = z_offset;
            
            let tirante = BABYLON.MeshBuilder.CreateCylinder('tirante', {height:15, diameter: 0.5}, scene);    //creazione dei tiranti che sostengono le sezioni orizzontali su quella verticale
            if (x_offset < 0) {
                tirante.position.x = x_offset + 7.0;   //in questo caso controllo la posizione per determinare l'angolo di rotazione del tirante
                tirante.rotation.z = Math.PI/2.5;
            }
            else {
                tirante.position.x = x_offset - 7.0;
                tirante.rotation.z = Math.PI - Math.PI/2.5;
            }
            tirante.position.y = 25;
            tirante.position.z = z_offset;
            
            let soffietto = BABYLON.MeshBuilder.CreateCylinder('soffietto', {height:3, diameter: 1}, scene); //creazione degli isolatori dei fili superiori
            if (x_offset < 0) soffietto.position.x = -8;
            else soffietto.position.x = +8; 
            soffietto.position.y = 22.5 + 1.125/2 + 1.5;
            soffietto.position.z = z_offset;
        }
    }
    
    //creazione fili
    for(let x_offset = -8; x_offset<=8; x_offset+=16) {
        let filo_sup = BABYLON.MeshBuilder.CreateCylinder('filo_sup', {height: chunk_size, diameter: 0.25}, scene);
        filo_sup.rotation.x = Math.PI/2;
        filo_sup.position.x = x_offset;
        filo_sup.position.y = 22.5 + 1.125/2 + 3.0 + 0.125;
        filo_sup.position.z = z_offset;
    }
}

//Funzione per creare l'ambiente
/*function createEnvironment(scene, tipologia, percentuale) {
    randomnum = Math.round(Math.random()*100);
    var tipperc = [tipologia, percentuale];
    //tip è per capire se il blocco prima era foresta o città
    //perc è per capire con quale percentuale si deve 
    //generare il blocco prima
    if (tipperc[0] == 1) {
        //città, le percentuali saranno 100% (solo il primo blocco)
        //80% (2), 60% (3), 40% (4), 20% (da 5 in poi)
        if (tipperc[1] == 100) {
            createCity();
            tipperc = [1, 80];
            return tipperc;

        } else if (tipperc[1] == 80) {
            if (randomnum < 80) {
                createCity();
                tipperc = [1, 60];
                return tipperc;
            } else {
                createForest();
                tipperc = [0,90]
                return tipperc;
            }

        } else if (tipperc[1] == 60) {
            if (randomnum < 60) {
                createCity();
                tipperc = [1, 40];
                return tipperc;
            } else {
                createForest();
                tipperc = [0,90]
                return tipperc;
            }

        } else if (tipperc[1] == 40) {
            if (randomnum < 40) {
                createCity();
                tipperc = [1, 20];
                return tipperc;
            } else {
                createForest();
                tipperc = [0,90]
                return tipperc;
            }

        } else {
            if (randomnum < 20) {
                createCity();
                tipperc = [1, 20];
                return tipperc;
            } else {
                createForest();
                tipperc = [0,90]
                return tipperc;
            }
        } 

    } else {
        //foresta, le percentuali saranno 100% (solo il primo blocco)
        //90% (2), 80% (3), 70% (4), 60% (5), 50% (6), 40% (7),
        //30% (8), 20% (9), 10% (da 10 in poi)
        if (tipperc[1] == 90) {
            if (randomnum < 90) {
                createForest();
                tipperc = [1, 80];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 80) {
            if (randomnum < 80) {
                createForest();
                tipperc = [1, 70];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 70) {
            if (randomnum < 70) {
                createForest();
                tipperc = [1, 60];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 60) {
            if (randomnum < 60) {
                createForest();
                tipperc = [1, 50];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 50) {
            if (randomnum < 50) {
                createForest();
                tipperc = [1, 40];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 40) {
            if (randomnum < 40) {
                createForest();
                tipperc = [1, 30];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 30) {
            if (randomnum < 30) {
                createForest();
                tipperc = [1, 20];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else if (tipperc[1] == 20) {
            if (randomnum < 20) {
                createForest();
                tipperc = [1, 10];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }

        } else {
            if (randomnum < 10) {
                createForest();
                tipperc = [1, 10];
                return tipperc;
            } else {
                createCity();
                tipperc = [0,80]
                return tipperc;
            }
        }

    }
}

//Funzione per creare la stazione
function createStation(scene) {

} */

//Funzione per generare procedualmente la scena
function populateScene(scene) {

    //var box = BABYLON.Mesh.CreateBox("Box", 1.0, scene);
    //scene.clearColor = new BABYLON.Color3(0.639, 0.878, 0.921);   //colore cielo
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    /*var skybox = BABYLON.Mesh.CreateBox("skyBox", 24.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infinteDistance = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;*/
    
    for(let i=0; i<10; i++) createTerrain(scene, i*chunk_size);
}

//Funzione per creare il blocco di città
/*function createCity(scene) {

}

//Funzione per creare il blocco di foresta
function createForest(scene) {

} */
