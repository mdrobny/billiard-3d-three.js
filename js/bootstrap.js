/* global define, dr, THREE, THREEx, Physijs, TWEEN */
define([
    'config/global',
    'scene',
    'camera'
], function (configGlobal, Scene, Camera) {

    var renderer, scene, camera, JSONLoader;

    Physijs.scripts.worker = dr.config.localResources + 'js/libs/physijs_worker.js';
    Physijs.scripts.ammo = dr.config.localResources + 'ammo.js';

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(dr.config.scene.width, dr.config.scene.height);
    dr.canvasElem.append(renderer.domElement);

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;

    /**
     * loading textures
     */
    var loadTextures = function() {
        var t, texture, texturesLoader;
        t = dr.textures;
//        texturesLoader = new THREE.TextureLoader();
//        texturesLoader.load("textures/green-light-baize.jpg", function () { console.log('loaded');}, null, function () { console.log('error');} );

        t.brownLightWood = THREE.ImageUtils.loadTexture("textures/brown-light-wood.jpg");
        t.brownDarkWood = THREE.ImageUtils.loadTexture("textures/brown-dark-wood.jpg");
        t.grayDarkWood = THREE.ImageUtils.loadTexture("textures/grey-dark-wood.jpg");
        t.greenLightBaize = THREE.ImageUtils.loadTexture("textures/green-light-baize.jpg");
    };

    var init = function() {
        Camera.init();
        camera = Camera.get();

        THREEx.WindowResize(renderer, camera);

        loadTextures();

        Scene.init();
        scene = Scene.get();
    };

    var render = function () {
        renderer.render(scene, camera);

        requestAnimationFrame(render);

        TWEEN.update();
    };

//    dr.render = render;
    init();
    render();
    scene.simulate();


});