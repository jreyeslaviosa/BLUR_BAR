import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
const $=id=>document.getElementById(id),scene=new THREE.Scene();scene.background=new THREE.Color('#e9edf0');
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));$('view').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(38,1,.1,2000),controls=new OrbitControls(camera,renderer.domElement);controls.target.set(65,43,10);controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xffffff,0x8b7e72,2.6));const light=new THREE.DirectionalLight(0xffffff,2.7);light.position.set(-80,180,-120);scene.add(light);
const materials={wood:new THREE.MeshStandardMaterial({color:0xc9ad83,roughness:.75}),top:new THREE.MeshStandardMaterial({color:0x9372b1,roughness:.6}),black:new THREE.MeshStandardMaterial({color:0x15151b,side:THREE.DoubleSide}),white:new THREE.MeshStandardMaterial({color:0xe9e1d5,roughness:.8})};
const root=new THREE.Group();root.scale.x=-1;root.position.x=131.5;scene.add(root);const parts=[],labels=[],groups=[];let selected=null;
function group(stage,delta=[0,0,0]){const g=new THREE.Group();g.userData={stage,delta};root.add(g);groups.push(g);return g}
const body=group(1),pickup=group(2,[0,9,4]),counter=group(3,[0,22,0]),header=group(4,[0,35,0]);
function mesh(geo,name,stock,parent,mat='wood'){const m=new THREE.Mesh(geo,materials[mat]);m.name=name;m.userData.stock=stock;parent.add(m);parts.push(m);const e=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x574f49,transparent:true,opacity:.7}));m.add(e);return m}
function box(name,x,y,z,w,h,d,parent=body,mat='wood'){const m=mesh(new THREE.BoxGeometry(w,h,d),name,`${w} × ${h} × ${d} in`,parent,mat);m.position.set(x+w/2,y+h/2,z+d/2);return m}
function panel(name,x,y,z,w,h,t,holes,parent,mat='white',horizontal=false){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(w,0);s.lineTo(w,h);s.lineTo(0,h);s.closePath();for(const [a,b,r] of holes){const p=new THREE.Path();p.absarc(a,b,r,0,Math.PI*2,true);s.holes.push(p)}const g=new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false,curveSegments:48});const m=mesh(g,name,`${w} × ${h} × ${t} in`,parent,mat);m.position.set(x,y,z);if(horizontal){m.rotation.x=Math.PI/2;m.position.y+=t}return m}
for(const x of [0,128.5]){box('P01 · post front',x,0,0,3,95.625,.75);box('P01 · post back',x,0,22.875,3,95.625,.75);for(const a of [x,x+2.25])box('P02 · post side',a,0,.75,.75,95.625,22.125);for(const y of [44,60,80,94.875])box('C01 · post block',x+.75,y,.75,1.5,.75,22.125)}
// Front skins split around the single pickup aperture, including their cutouts at the seam.
const skins=[];for(const [x,w] of [[3,9],[76,22.5]])skins.push(box('B01 · front skin',x,0,0,w,47,.75));skins.push(box('B01 · front below pickup',12,0,0,64,25,.75));skins.push(box('B01 · front above pickup',12,46,0,64,1,.75));
box('B02 · cabinet end',97.75,0,.75,.75,47,22.125);for(const x of [11.25,76])box('B03 · pickup side partition',x,.75,.75,.75,46.25,22.125);
for(const x of [3,51.125])box('B04 · floor',x,0,.75,47.375,.75,22.125);
for(const y of [.75,20])for(const x of [3,50.75])box('B05 · rear rail',x,y,22.875,47.75,6,.75);
box('B08 · shelf centre support',43.625,.75,.75,.75,24.25,18.75);
box('K05 · laminated pickup shelf',12,25,0,64,1,18.75,pickup,'top');
panel('B06 · rear liner / 3 ports',12,26,18.75,64,20.75,.75,[[12,10,4],[32,10,4],[52,10,4]],pickup);
panel('B07 · solid niche ceiling',12,46,.75,64,18,.75,[],pickup,'white',true);
// Sleeves are open cylinders; no fabric or closures.
function sleeve(x,y,z,len,axis,parent){const m=mesh(new THREE.CylinderGeometry(3.94,3.94,len,64,1,true),'Black port sleeve','7 7/8 in clear ID · length provisional',parent,'black');m.children[0].visible=false;m.position.set(x,y,z);if(axis==='z')m.rotation.x=Math.PI/2}
for(const x of [24,44,64])sleeve(x,36,21.125,4.75,'z',pickup);
panel('K01-K03 · solid laminated fixed counter',3,47,0,95.5,23.625,1,[],counter,'top',true);
const flapPivot=new THREE.Group();flapPivot.position.set(98.5,48,0);counter.add(flapPivot);box('K04 · lift flap',.125,-1,0,29.75,1,23.625,flapPivot,'top');
const gateGroup=group(3,[12,0,-12]),gatePivot=new THREE.Group();gatePivot.position.set(128.375,0,1.5);gateGroup.add(gatePivot);box('G01 · hinged gate',-29.75,.25,-1.5,29.75,46.5,.75,gatePivot);for(const x of [-29.75,-2])box('G02 · gate stiffener',x,.25,-.75,2,46.5,.75,gatePivot);for(const y of [.25,44.75])box('G03 · gate stiffener',-27.75,y,-.75,25.75,2,.75,gatePivot);
for(const [x,w] of [[3,41.75],[44.75,42],[86.75,41.75]]){box('H01/H02 · fascia face',x,83.375,0,w,12.25,.75,header);box('H03/H04 · fascia bottom',x,83.375,.75,w,.75,5.25,header)}for(const x of [3,127.75])box('H05 · fascia end',x,84.125,0,.75,11.5,6,header);
function label(text,x,y,z,stage){const c=document.createElement('canvas');c.width=512;c.height=80;const q=c.getContext('2d');q.fillStyle='#ffffff';q.fillRect(0,0,512,80);q.fillStyle='#283341';q.font='38px sans-serif';q.textAlign='center';q.fillText(text,256,54);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));sprite.scale.set(30,4.7,1);sprite.position.set(x,y,z);sprite.userData.stage=stage;root.add(sprite);labels.push(sprite)}
label('POST',0,101,0,1);label('PICKUP',44,36,-4,2);label('LIFT FLAP',113,53,0,3);label('GATE',114,19,-3,3);label('FASCIA',65,101,0,4);
const platform=new THREE.Group();root.add(platform);
const deckMat=new THREE.MeshStandardMaterial({color:0x8a938a,roughness:.9});
function deck(x,y,z,w,h,d,name){const m=box(name,x,y,z,w,h,d,platform);m.material=deckMat;return m}
deck(3,0,23.625,95.5,6,36,'Proposed platform · 36-inch depth');
deck(98.5,0,47.625,30,6,12,'Platform access landing');
deck(98.5,0,35.625,30,3,12,'Proposed intermediate step · 3-inch rise');
// 170 cm mannequin, measured from the soles to the top of the head.
const person=new THREE.Group();person.position.set(55,6,46);root.add(person);
const personMat=new THREE.MeshStandardMaterial({color:0x4f6476,roughness:.8});
function humanMesh(g,x,y,z){const m=new THREE.Mesh(g,personMat);m.position.set(x,y,z);person.add(m);return m}
function limb(a,b,r){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),v=end.clone().sub(start);const m=humanMesh(new THREE.CylinderGeometry(r,r,v.length(),16),...start.clone().add(end).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize())}
for(const x of [-3.7,3.7]){humanMesh(new THREE.BoxGeometry(3.7,2.5,8),x,1.25,-1.8);limb([x,2.5,0],[x,18,0],1.7);limb([x,18,0],[x,33.5,0],2.1)}
humanMesh(new THREE.CylinderGeometry(7.1,5.7,20,24),0,43.5,0);
humanMesh(new THREE.CylinderGeometry(2,2,3,16),0,55,0);
const headBottom=56.5,headTop=170/2.54;const head=humanMesh(new THREE.SphereGeometry(1,24,24),0,(headBottom+headTop)/2,0);head.scale.set(3.5,(headTop-headBottom)/2,3.7);
for(const x of [-7.2,7.2]){limb([x,51,0],[x,40,-4],1.6);limb([x,40,-4],[x,40,-15],1.3);humanMesh(new THREE.SphereGeometry(1.6,16,16),x,40,-15)}
label('170 cm / 5′7″',55,79,46,1);label('36″ DEEP',52,7,58,1);label('3″ STEP',113,5,38,1);
// Customer mannequins use standing stature; bent posture lowers their head.
const customers=new THREE.Group();root.add(customers);
function customer(cm,x,color){const g=new THREE.Group();g.position.set(x,0,-22);g.scale.setScalar(cm/170);customers.add(g);const mat=new THREE.MeshStandardMaterial({color,roughness:.85});
 function m(geo,p){const o=new THREE.Mesh(geo,mat);o.position.set(...p);g.add(o);return o}
 function link(a,b,r){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A);const o=m(new THREE.CylinderGeometry(r,r,v.length(),18),A.clone().add(B).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize())}
 for(const sx of [-3.7,3.7]){m(new THREE.BoxGeometry(3.7,2.5,8),[sx,1.25,2]);link([sx,2.5,0],[sx,17.5,-1],1.7);link([sx,17.5,-1],[sx,32,0],2.1)}
 const a=new THREE.Vector3(0,33,0),b=new THREE.Vector3(0,49,11);const torso=m(new THREE.CylinderGeometry(7.1,5.7,a.distanceTo(b),24),a.clone().add(b).multiplyScalar(.5).toArray());torso.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());link([0,49,11],[0,52,13],2);
 const head=m(new THREE.SphereGeometry(1,24,24),[0,57,14]);head.scale.set(3.5,5.2,3.7);
 // One arm reaches the pickup shelf; the other rests near the body.
 link([-7,47,10],[-7,35,15],1.6);link([-7,35,15],[-5,28,25],1.3);m(new THREE.SphereGeometry(1.6,16,16),[-5,28,25]);
 link([7,47,10],[9,35,7],1.6);link([9,35,7],[7,25,12],1.3);m(new THREE.SphereGeometry(1.6,16,16),[7,25,12]);
 return g}
customer(180,29,0x8c6654);customer(170,65,0x566f79);
// Two tumblers on the pickup shelf, aligned with the reaching hands.
const glassMat=new THREE.MeshStandardMaterial({color:0xc79242,transparent:true,opacity:.7,roughness:.25});
for(const x of [23.7,60]){const glass=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.15,3.5,32),glassMat);glass.position.set(x,27.75,4.5);root.add(glass)}
label('180 cm / 5′11″',29,76,-22,1);const customerLabel1=labels[labels.length-1];
label('170 cm / 5′7″',65,72,-22,1);const customerLabel2=labels[labels.length-1];
// The customer floor is the zero datum; all bar panels start here.
const ground=new THREE.Mesh(new THREE.PlaneGeometry(360,300),new THREE.MeshStandardMaterial({color:0xf1f0eb,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.set(65,-.12,20);scene.add(ground);
const floor=new THREE.GridHelper(360,30,0x75818b,0xaeb7be);floor.position.set(65,-.04,20);scene.add(floor);
// Clear front baseline at the feet of the facade.
const baseline=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.02,0),new THREE.Vector3(131.5,.02,0)]),new THREE.LineBasicMaterial({color:0x526777}));root.add(baseline);
label('FLOOR 0″ · 12″ GRID',65,.2,-46,1);const floorLabel=labels[labels.length-1];
function view(v){const pos={front:[65,54,-230],rear:[180,125,210],top:[65,350,45],iso:[210,150,-200]}[v];camera.position.set(...pos);controls.target.set(65,v==='top'?0:43,v==='top'?48:10);controls.update();$('caption').textContent={front:'Customer side',rear:'Staff side',top:'Top view',iso:'3D view'}[v]}
for(const v of ['front','rear','top','iso'])$(v).onclick=()=>view(v);view('iso');
function update(){let f=+$('flap').value,g=+$('gate').value,e=+$('explode').value;if(e>0){f=0;g=0;$('flap').value=0;$('gate').value=0}if(g>0&&f<85){g=0;$('gate').value=0}flapPivot.rotation.z=f*Math.PI/180;gatePivot.rotation.y=g*Math.PI/180;const st=+$('stage').value;for(const q of groups){q.visible=q.userData.stage<=st;q.position.set(...q.userData.delta.map(a=>a*e))}for(const p of skins)p.visible=!$('cutaway').checked;for(const p of labels)p.visible=$('labels').checked&&p.userData.stage<=st&&e===0;floorLabel.visible=true;customerLabel1.visible=customerLabel2.visible=$('customers').checked&&e===0;$('flapValue').value=f+'°';$('gateValue').value=g+'°';$('stageValue').value=st+' / '+['','Body','Pickup','Access','Complete'][st];$('motion').textContent=e>0?'Separated view — motion paused.':g>0?'Access open. Close gate before lowering flap.':f>=85?'Gate can now open.':'Lift flap to 85° before opening gate.';window.barState={flap:f,gate:g,stage:st,explode:e,parts:parts.length,counterHeight:48,pickupHeight:20,shelfHeight:26,platformHeight:6,platformDepth:36,customerHeights:[180,170],personHeight:170/2.54}}
$('customers').onchange=()=>{customers.visible=$('customers').checked;update()};
$('person').onchange=()=>person.visible=$('person').checked;$('platform').onchange=()=>platform.visible=$('platform').checked;
for(const id of ['flap','gate','stage','cutaway','labels','explode'])$(id).oninput=()=>{if(id==='flap'&&+$('gate').value>0&&+$('flap').value<85)$('flap').value=85;update()};$('access').onclick=()=>{$('explode').value=0;$('stage').value=4;$('flap').value=90;$('gate').value=90;update()};$('close').onclick=()=>{$('gate').value=0;$('flap').value=0;update()};update();
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down;renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(parts).find(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent}return true});if(selected)selected.material=selected.userData.original;if(hit){selected=hit.object;selected.userData.original=selected.material;selected.material=selected.material.clone();selected.material.emissive.set(0x49305c);$('selected').textContent=selected.name+' · '+selected.userData.stock}});
new ResizeObserver(()=>{const w=$('view').clientWidth,h=$('view').clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}).observe($('view'));
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();window.barReady=true;
