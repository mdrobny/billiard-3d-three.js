/* global define, THREE, Physijs, dr, _ */
define([
    'models/sky',
    'models/room',
    'models/table',
    'collections/balls',
    'models/cue'
],function (Sky, Room, Table, Balls, Cue) {
    var scene = {
        scene: null,

        init: function() {
            var scene, sky, room, table, balls, whiteBall, cue;

            scene = new Physijs.Scene();
            scene.setGravity(new THREE.Vector3(0,-10,0));
            scene.addEventListener('update', function() {
                scene.simulate(undefined, 2);
            });
            dr.scene = scene;

            this._setLights(scene);

            sky = Sky.create();
            scene.add(sky);

            room = Room.create();
            scene.add(room);

            table = Table.create();
            scene.add(table);

            balls = Balls.create();

            whiteBall = _.last(balls);
            cue = Cue.create(whiteBall, Balls);
            scene.add(cue);

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
            var light, light2, light3;
            light = new THREE.DirectionalLight("#ffffff", 1.2);
            light.position.set(0,50,50);
            light.castShadow = true;
            light.shadowDarkness = 0.5;
            light.shadowCameraNear = 2;
//            light.shadowCameraFar = 2;
            light.shadowCameraLeft = -40;
            light.shadowCameraRight = 40;
            light.shadowCameraTop = 20;
            light.shadowCameraBottom = -20;

//            light.shadowCameraVisible = true;
            scene.add(light);

            light2 = new THREE.DirectionalLight("#ffffff", 1.4);
            light2.position.set(0,50,-50);
            scene.add(light2);

            light3 = new THREE.DirectionalLight( 0xffffff );
            light3.position.set( -100, 150, 0 );
            light3.target.position.set(100,-100,100);
            scene.add( light3 );

        }



    };
    return scene;
});