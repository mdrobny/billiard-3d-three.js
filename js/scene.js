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
            scene.setGravity(new THREE.Vector3(0,dr.config.scene.gravityY,0));
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
            table.setDamping(Balls.dampingLinear, Balls.dampingAngular);

            balls = Balls.create();

            whiteBall = _.last(balls);
            cue = Cue.create(whiteBall, Balls);
            scene.add(cue);

            _.forEach(balls, function (ball) {
                scene.add(ball);
                ball.setDamping(Balls.dampingLinear, Balls.dampingAngular);
            });
//
//            dr.whiteBall = whiteBall;
//            dr.cue = cue;

            this.scene = scene;
        },

        get: function() {
            return this.scene;
        },

        _setLights: function(scene) {
            var light, light2;
            light = new THREE.DirectionalLight("#ffffff", 2.8);
            light.position.set(100,180,150);
            light.castShadow = true;
            light.shadowDarkness = 0.5;
            light.shadowCameraNear = 20;
            light.shadowCameraFar = 2;
            light.shadowCameraLeft = - dr.models.table.length/2;
            light.shadowCameraRight = dr.models.table.length/2;
            light.shadowCameraTop = dr.models.table.width/2;
            light.shadowCameraBottom = -dr.models.table.width/2;
//            light.shadowCameraVisible = true;
            scene.add(light);

            light2 = new THREE.DirectionalLight("#ffffff", 1.0);
            light2.position.set(-30,30,150);
            scene.add(light2);

        }



    };
    return scene;
});