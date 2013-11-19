/* global define, dr, THREE, Physijs */
define(function (){
    var cue = {
        radius: 1,
        length: 40,
        distanceFromWhiteBall: 3,

        mesh: null,
        materials: null,

        whiteBall: null,

        /** 0 - 100 **/
        shootPower: 10,
        /** 0 - 360**/
        shootAngle: 0,
        shootAngleBefore: 0,

        ballsObj: null,

        get: function() {
            return this.mesh;
        },

        create: function(whiteBall, BallsObj) {
            this.whiteBall = whiteBall;
            this.ballsObj = BallsObj;

            this._createCue();

            return this.mesh;
        },

        _createCue: function() {
            var geometry, material, mesh;

            geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.length );

            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown
            });

            mesh = new THREE.Mesh(
                geometry,
                material
            );
            mesh.rotation.z = 110 * Math.PI/180;
            mesh.position.y = 13;


            this.mesh = mesh;

            this.whiteBall.addEventListener('stoppedMoving', this.whiteBallStoppedMoving.bind(this));

            this._moveCue();
            this._initKeyboard();
        },

        shoot: function() {
            var start, end, tween, tweenBack, cuePos, x, z;
            cuePos = this.mesh.position;
            x = 2.5 * Math.cos( this.shootAngle * Math.PI / 180 );
            z = 2.5 * Math.sin( this.shootAngle * Math.PI / 180 );

            start = { x : cuePos.x, y: cuePos.y, z: cuePos.z };
            end = { x : cuePos.x + x, y: cuePos.y, z: cuePos.z + z};
            tween = new TWEEN.Tween(start)
                .to(end, 200)
                .onUpdate(function(){
                    cuePos.x = this.x;
                    cuePos.z = this.z;
                })
                .onComplete(function (){
                    this._applyImpulseOnWhiteBall();

                }.bind(this));
//            tweenBack = new TWEEN.Tween(end)
//                .to(start, 400)
//                .onUpdate(function(){
//                    cuePos.x = this.x;
//                    cuePos.z = this.z;
//                });
//            tween.chain(tweenBack);

            tween.start();
        },

        _applyImpulseOnWhiteBall: function() {
            var x, z;
            x = this.shootPower * Math.cos( this.shootAngle * Math.PI / 180 );
            z = this.shootPower * Math.sin( this.shootAngle * Math.PI / 180 );

            dr.scene.remove(this.mesh);

            this.whiteBall.applyCentralImpulse(new THREE.Vector3(x,0,z));
            this.ballsObj.isMoving(this.whiteBall);
        },

        _moveCue: function() {
            var x, z, start, end, tween, cue, angle, matrix, sign = 1;
            angle = (this.shootAngle + 180 > 360) ? this.shootAngle - 180 : this.shootAngle + 180;

            cue = this.mesh;

            cue.position.x = this.whiteBall.position.x;
            cue.position.z = this.whiteBall.position.z;

            x = (this.length/2 + this.distanceFromWhiteBall) * Math.cos( angle * Math.PI / 180 );
            z = (this.length/2 + this.distanceFromWhiteBall) * Math.sin( angle * Math.PI / 180 );

            cue.position.x += x;
            cue.position.z += z;

            cue.rotation.y = -angle * Math.PI/180;
        },

        whiteBallStoppedMoving: function(event) {
            dr.scene.add(this.mesh);
            this._moveCue();
        },

        _initKeyboard: function() {
            document.addEventListener('keydown', function (event) {
                var key = event.keyCode;
                switch (key) {
                    case 37:    //left
                        this.shootAngleBefore = this.shootAngle;
                        this.shootAngle--;
                        if(this.shootAngle <= 0) {
                            this.shootAngle = 359;
                        }
                        this._moveCue();
                        console.log(this.shootAngle);
                        break;
                    case 38:    //up
                        if(this.shootPower >= 1 && this.shootPower < 100) {
                            this.shootPower++;
                        }
                        console.log(this.shootPower);
                        break;
                    case 39:    //right
                        this.shootAngleBefore = this.shootAngle;
                        this.shootAngle++;
                        if(this.shootAngle === 360) {
                            this.shootAngle = 0;
                        }
                        this._moveCue();
                        console.log(this.shootAngle);
                        break;
                    case 40:    //down
                        if(this.shootPower > 1 && this.shootPower <= 100) {
                            this.shootPower--;
                        }
                        console.log(this.shootPower);
                        break;
                    case 13:    //enter
                        console.log('enter');
                        this.shoot();
                        break;
                    default:
                        break;
                }
            }.bind(this));
        }

    };
    return cue;
});