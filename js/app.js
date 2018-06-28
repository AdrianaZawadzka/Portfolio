var camera, scene, renderer, composer;
var object, light;


var glitchPass;
init();
animate();
function updateOptions() {
    var wildGlitch = document.getElementById('wildGlitch');
    glitchPass.goWild=wildGlitch.checked;
}

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
    object = new THREE.Object3D();

    var loader = new THREE.TextureLoader();

// load a resource
    loader.load(
        // resource URL
        'textures/5.png',


        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
                map: texture
            } );

            var geometry = new THREE.BoxGeometry(200, 200, 200);
            for (var i = 0; i < 200; i++) {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = Math.random() * 4000 - 1000;
                mesh.position.y = Math.random() * 4000 - 1000;
                mesh.position.z = Math.random() * 4000 - 1000;
                mesh.rotation.x = Math.random() * 2 * Math.PI;
                mesh.rotation.y = Math.random() * 2 * Math.PI;
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                object.add(mesh);
            }
            scene.add(object);
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
        }
    );

    scene.add( new THREE.AmbientLight( 0x222222 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );
    glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass( glitchPass );

    //
    window.addEventListener( 'resize', onWindowResize, false );
    updateOptions();
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    var time = Date.now();
    object.rotation.x += 0.005;
    object.rotation.y += 0.01;
    composer.render();
    //renderer.render(scene, camera);
}

