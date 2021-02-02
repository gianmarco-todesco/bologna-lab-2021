MYLIB.initialize('renderCanvas', populateScene);

// uso una classe per raccogliere tutti i componenti di una singola gamba
// e i metodi per animarla
class Leg {

    // questo metodo viene chiamato quando "istanzio" la classe, creando un oggetto
    constructor(name, scene) {

        // spessore gamba
        const thickness = 0.2;

        // altezza coscia
        const tighHeight = 1; 

        // altezza stinco
        const calfHeight = 1.2; 

        // lunghezza piede
        const footLength = thickness*2;

        // radice
        let root = this.root = new BABYLON.Mesh(name, scene);

        // materiale 
        let material = new BABYLON.StandardMaterial(name+"-mat", scene);
        material.diffuseColor.set(0.63,0.75,0.8);
        material.specularColor.set(0.1,0.1,0.1);

        // coscia (n.b. l'altezza del box è un po' più piccola di tighHeight
        // per motivi estetici)
        let tigh = this.tigh = BABYLON.MeshBuilder.CreateBox(name+'-tigh', {
            width:thickness, 
            depth:thickness,
            height:tighHeight * 0.8
        }, scene);
        tigh.parent = root;
        tigh.material = material;
        // per comodità voglio che l'origine della coscia sia nel punto più alto (articolazione dell'anca)
        // così i movimenti sono più facili
        tigh.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0,-tighHeight/2,0));

        // parte bassa della gamba (n.b. anche in questo caso il box è un po'
        // più corto)
        let calf = this.calf = BABYLON.MeshBuilder.CreateBox(name+'-calf', {
            width:thickness, 
            depth:thickness,
            height:calfHeight * 0.8            
        }, scene);
        calf.material = material;

        // la parte bassa ha origine in corrispondenza dell'articolazione del ginocchio
        // è figlia della coscia
        calf.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0,-calfHeight/2,0));
        calf.position.y = -tighHeight;
        calf.parent = tigh;

        // piede
        let foot = this.foot = BABYLON.MeshBuilder.CreateBox(name+'-foot', {
            width:footLength, 
            height:0.1, 
            depth:thickness
        }, scene);
        foot.material = material;
        foot.bakeTransformIntoVertices(BABYLON.Matrix.Translation(footLength/2,-0.05,0));
        foot.position.y = -calfHeight;
        foot.parent = calf;

        // fine del costruttore
    }



    // questo metodo muove le articolazioni in modo che il piede si trovi
    // a coordinate x,y (nel sistema di riferimento di root, cioè dell'intera gamba)
    setFootPosition(x,y) {
        let theta = Math.atan2(x,-y);
        let d = (new BABYLON.Vector3(x,y,0)).length();
        let beta = Math.acos(d/2);
        this.tigh.rotation.z = theta + beta;
        this.calf.rotation.z = -(Math.PI - 2*(Math.PI/2 - beta));
        // voglio che il piede resti sostanzialmente orizzontale, 
        // quindi lo ruoto in modo
        // da contrastare la rotazione che arriva da calf e tigh
        let gamma = -(this.tigh.rotation.z + this.calf.rotation.z);

        // per motivi estetici altero la posizione del piede in funzione
        // dell'angolo beta
        gamma -= beta * 3 - 1.98;
        this.foot.rotation.z = +gamma;

    }
}


function populateScene(scene) {

    MYLIB.createGrid(scene);

    // avvicino la camera e alzo lo sguardo
    let camera = scene.activeCamera;
    camera.setTarget(new BABYLON.Vector3(0,1,0));
    camera.radius = 6;

    // creo le gambe
    let leftLeg = new Leg('left-leg', scene);
    let rightLeg = new Leg('right-leg', scene);

    // le posiziono
    leftLeg.root.position.set(0,2.1,-0.2);
    rightLeg.root.position.set(0,2.1, 0.2);
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        let phi = t * 3.0;
        let r = 0.25;
        let y0 = -1.3;
        // "pedalo"
        leftLeg.setFootPosition(Math.cos(phi)*r, y0 - Math.sin(phi)*r);        
        rightLeg.setFootPosition(Math.cos(phi+Math.PI)*r, y0 - Math.sin(phi+Math.PI)*r);
    });

}