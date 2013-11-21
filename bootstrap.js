/* global define, dr, THREE, Physijs, TWEEN */
define([
    'config/global',
    'scene',
    'camera'
], function (configGlobal, Scene, Camera) {

    var renderer, scene, camera, JSONLoader;

    Physijs.scripts.worker = dr.config.localResources + 'libs/physijs_worker.js';
    Physijs.scripts.ammo = dr.config.localResources + 'ammo.js';

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(dr.config.scene.width, dr.config.scene.height);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;

    dr.canvasElem.append(renderer.domElement);

    var init = function() {
        Scene.init();
        scene = Scene.get();

        Camera.init();
        camera = Camera.get();


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