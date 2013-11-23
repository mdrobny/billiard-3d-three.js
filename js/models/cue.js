/* global define, dr, THREE, TWEEN, Physijs */
define(function (){
    var cue = {
        radius: 1,
        smallRadius: 0.4,
        length: 60,
        distanceFromWhiteBall: 3,

        indicator: null,
        indicatorRadius: 1,
        indicatorLength: 15,


        mesh: null,
        materials: null,

        whiteBall: null,

        /** 0 - 100 **/
        shootPower: 50,
        /** 0 - 360**/
        shootAngle: 0,

        ballsObj: null,

        get: function() {
            return this.mesh;
        },

        create: function(whiteBall, BallsObj) {
            this.whiteBall = whiteBall;
            this.ballsObj = BallsObj;

            this._createCue();
            this._powerIndicatorUpdate();

            return this.mesh;
        },

        _createCue: function() {
            var geometry, material, texture, mesh;

            geometry = new THREE.CylinderGeometry(this.smallRadius, this.radius, this.length, 16, 16 );

            texture = THREE.ImageUtils.loadTexture("textures/light-wood-brown.jpg");
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown,
                map: texture
            });

            mesh = new THREE.Mesh(
                geometry,
                material
            );
            mesh.rotation.z = 110 * Math.PI/180;
            mesh.position.y = 0.28 * this.length;

            this.mesh = mesh;

            this.whiteBall.addEventListener('stoppedMoving', this._whiteBallStoppedMoving.bind(this));

            this._moveCue();
            this._initKeyboard();
        },

//        _createForceIndicator: function() {
//            var geometry, material, mesh;
//
//            geometry = new THREE.CylinderGeometry(this.indicatorRadius, this.indicatorRadius, this.indicatorLength, 16, 16 );
//
//            material = new THREE.MeshBasicMaterial({
////                color: dr.colors.blue
//            });
////            material.color.setRGB(dr.colors.blueRGB.r/255, dr.colors.blueRGB.g/255, dr.colors.blueRGB.b/255);
//            material.color.setRGB(dr.colors.redRGB.r/255, dr.colors.redRGB.g/255, dr.colors.redRGB.b/255);
//
//            mesh = new THREE.Mesh(
//                geometry,
//                material
//            );
//            mesh.position.x += 4 * this.radius;
//            mesh.position.y += this.length/4;
//
//            return mesh;
//        },

        shoot: function() {
            var start, end, tween, cuePos, x, z;
            cuePos = this.mesh.position;
            x = this.distanceFromWhiteBall * Math.cos( this.shootAngle * Math.PI / 180 );
            z = this.distanceFromWhiteBall * Math.sin( this.shootAngle * Math.PI / 180 );

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
            var x, z, cue, angle;
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

        _whiteBallStoppedMoving: function(event) {
            dr.scene.add(this.mesh);
            this._moveCue();
        },


        _powerIndicatorUpdate: function() {
            var p, color, currentColor, currentRedValue;
            if(this.shootPower === parseInt(dr.powerIndicatorValueElem.text(), 10)) {
                return;
            }
            currentColor = dr.powerIndicatorElem.css('background-color');
            currentRedValue = currentColor.slice(4,currentColor.indexOf(","));

            p =  this.shootPower / 100;
            color = "rgb("+ Math.round(p * dr.colors.redRGB.r) +","+ Math.round(0.5 * (255 - currentRedValue)) +",30)";

            dr.powerIndicatorElem.css('background-color',color);
            dr.powerIndicatorValueElem.text(this.shootPower);
        },

        _initKeyboard: function() {
            document.addEventListener('keydown', function (event) {
                var key = event.keyCode;
                switch (key) {
                    case 37:    //left
                        this.shootAngle--;
                        if(this.shootAngle <= 0) {
                            this.shootAngle = 359;
                        }
                        this._moveCue();
                        break;
                    case 38:    //up
                        if(this.shootPower >= 1 && this.shootPower < 100) {
                            this.shootPower++;
                        }
                        this._powerIndicatorUpdate();
                        break;
                    case 39:    //right
                        this.shootAngle++;
                        if(this.shootAngle === 360) {
                            this.shootAngle = 0;
                        }
                        this._moveCue();
                        break;
                    case 40:    //down
                        if(this.shootPower > 1 && this.shootPower <= 100) {
                            this.shootPower--;
                        }
                        this._powerIndicatorUpdate();
                        break;
                    case 13:    //enter
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