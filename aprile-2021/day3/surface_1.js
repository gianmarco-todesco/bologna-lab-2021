MYLIB.initialize('renderCanvas', populateScene);

class Surface {
    constructor(f, nu, nv, scene) {
        this.nu = nu;
        this.nv = nv;
        let vd = new BABYLON.VertexData();
        vd.positions = [];
        vd.normals = [];
        vd.indices = [];
        vd.uvs = [];
        for(let i=0;i<nu;i++) {
            let u = i/(nu-1);
            for(let j=0;j<nv;j++) {
                let v = j/(nv-1);
                let p = f(u,v);
                let nrm = this.computeNormal(f,u,v);
                vd.positions.push(p.x,p.y,p.z);
                vd.normals.push(nrm.x,nrm.y,nrm.z);
                vd.uvs.push(u,v);
            }
        }
        for(let i=0;i+1<nu;i++) {
            for(let j=0;j+1<nv;j++) {
                let k = i*nv+j;
                vd.indices.push(k,k+1,k+1+nv, k,k+1+nv,k+nv);
            }
        }
        /*
            vd.normals = [];
            BABYLON.VertexData.ComputeNormals(
                vd.positions, 
                vd.indices, 
                vd.normals);
        */
        let mesh = this.mesh = new BABYLON.Mesh('surface', scene);
        vd.applyToMesh(mesh, true);
    }

    computeNormal(f,u,v) {
        const h = 0.0001;
        let dfdu=f(u+h,v).subtract(f(u-h,v));
        let dfdv=f(u,v+h).subtract(f(u,v-h));
        return BABYLON.Vector3.Cross(dfdu,dfdv).normalize();
    }

    update(f) {
        let positions = this.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let normals = this.mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        const nu = this.nu;
        const nv = this.nv;
        let k = 0;
        for(let i=0;i<nu;i++) {
            let u = i/(nu-1);
            for(let j=0;j<nv;j++) {
                let v = j/(nv-1);
                let p = f(u,v);
                let nrm = this.computeNormal(f,u,v);
                positions[k]=p.x; 
                positions[k+1]=p.y; 
                positions[k+2]=p.z; 
                normals[k]=nrm.x; 
                normals[k+1]=nrm.y; 
                normals[k+2]=nrm.z; 
                k += 3;
            }
        }
        this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        this.mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
        
    }
}


function makeCheckboardTexture(scene) {
    const w = 1024, h = 1024;
    let tx = new BABYLON.DynamicTexture('a', { width:w, height:h}, scene);
    let ctx = tx.getContext();
    ctx.fillStyle = 'magenta'; // 'transparent';
    ctx.fillRect(0,0,w,h);
    let dx = 128, dy = 64;
    ctx.fillStyle = 'cyan';
    for(let i=0; i*dy<h; i++) {
        for(let j=0;j*dx<w;j++) {
            if((i+j)&1) {
                ctx.fillRect(j*dx,i*dy,dx,dy);
            }
        }
    }
    ctx.fillStyle = 'black';
    for(let i=0; i*dy<h; i++) ctx.fillRect(0,i*dy-3,w,7);
    for(let j=0; j*dx<w; j++) ctx.fillRect(j*dx-3,0,7,h);


    tx.update();
    tx.hasAlpha = true;
    return tx;
}


function f1(u,v,t) {
    let phi = Math.PI*1.8*v;
    let theta = Math.PI*1.8*u;
    const R0 = 3, R1 = 1;
    let psi = phi*3 + theta*3 + t*3;
    let r1 = R1 * (1+ 0.2*Math.sin(psi));
    let r = R0 + r1*Math.cos(theta);
    return new BABYLON.Vector3(
        r*Math.cos(phi), 
        r1*Math.sin(theta),
        r*Math.sin(phi));
}

function populateScene(scene) {

    // MYLIB.createGrid(scene);

    let srf = new Surface((u,v)=>f1(u,v,0), 70,70, scene);

    let material = srf.mesh.material = new BABYLON.StandardMaterial('mat', scene);
    material.twoSidedLighting = true;
    material.backFaceCulling = false;
    material.diffuseColor.set(0.9,0.9,0.9);
    material.specularColor.set(0.3,0.3,0.3);

    material.diffuseTexture = makeCheckboardTexture(scene);


    // animazione
    scene.registerBeforeRender(() => {

        // tempo in secondi dopo l'inizio della visione della pagina
        let seconds = performance.now() * 0.001;

        srf.update((u,v) => f1(u,v,seconds));
    

    });
}