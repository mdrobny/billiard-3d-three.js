/* global define, dr, THREE, THREEx, Physijs, TWEEN, requestAnimationFrame */
define([
    'config/global',
    'scene',
    'camera'
], function (configGlobal, Scene, Camera) {

    var renderer, scene, camera;

    Physijs.scripts.worker = 'js/libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

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
        var t;
        t = dr.textures;

        t.brownLightWood = THREE.ImageUtils.loadTexture("textures/brown-light-wood.jpg");
        t.brownDarkWood = THREE.ImageUtils.loadTexture("textures/brown-dark-wood.jpg");
        t.grayDarkWood = THREE.ImageUtils.loadTexture("textures/grey-dark-wood.jpg");
        t.greenLightBaize = THREE.ImageUtils.loadTexture("textures/green-light-baize.jpg");
        t.painting = THREE.ImageUtils.loadTexture("textures/painting.jpg");
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

    init();
    render();
    scene.simulate();
});