/* global define, THREE, Physijs, dr, _ */
define([
    'models/table',
    'collections/balls',
    'models/cue'
],function (Table, Balls, Cue) {
    var scene = {
        scene: null,

        init: function() {
            var scene, table, balls, whiteBall, cue, cueFrame, cuePointConstraint;

            scene = new Physijs.Scene();
            scene.setGravity(new THREE.Vector3(0,-10,0));
            scene.addEventListener('update', function() {
                scene.simulate(undefined, 2);
            });
            dr.scene = scene;

            this._setLights(scene);




            table = Table.create();
            scene.add(table);

            balls = Balls.create();

            whiteBall = _.last(balls);
            cue = Cue.create(whiteBall, Balls);
            scene.add(cue)

            _.forEach(balls, function (ball) {
                scene.add(ball);
                ball.setDamping(0.4, 0.5);
            });
//
//            dr.whiteBall = whiteBall;
//
//            dr.cue = cue;



            /** coordinates system */
//            var material = new THREE.MeshBasicMaterial({color: "#000"});
//            var geometry = new THREE.Geometry();
//            geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
//            geometry.vertices.push(new THREE.Vector3(100, 0, 0));
//            var xAxis = new THREE.Line(geometry, material);
//            scene.add(xAxis);
//
//            geometry = new THREE.Geometry();
//            geometry.vertices.push(new THREE.Vector3(0, -100, 0));
//            geometry.vertices.push(new THREE.Vector3(0, 100, 0));
//            var yAxis = new THREE.Line(geometry, material);
//            scene.add(yAxis);
//
//            geometry = new THREE.Geometry();
//            geometry.vertices.push(new THREE.Vector3(0, 0, -100));
//            geometry.vertices.push(new THREE.Vector3(0, 0, 100));
//            var zAxis = new THREE.Line(geometry, material);
//            scene.add(zAxis);

            this.scene = scene;
        },

        get: function() {
            return this.scene;
        },

        _setLights: function(scene) {
            var light, light2;
            light = new THREE.DirectionalLight("#ffffff", 1);
            light.position.set(0,50,50);
            light.castShadow = true;
            light.shadowDarkness = 0.5;
            light.shadowCameraNear = 2;
//            light.shadowCameraFar = 2;
            light.shadowCameraLeft = -30;
            light.shadowCameraRight = 30;
            light.shadowCameraTop = 20;
            light.shadowCameraBottom = -20;

//            light.shadowCameraVisible = true;
            scene.add(light);

            light2 = new THREE.DirectionalLight("#ffffff", 0.4);
            light2.position.set(0,50,-50);
            scene.add(light2);

        },



    };
    return scene;
});