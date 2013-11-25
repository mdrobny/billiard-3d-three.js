/* global define, dr, THREE, TWEEN, Physijs */
define([
    'collections/Balls'
], function (Balls){
    var cue = {
        radius: 1,
        smallRadius: 0.4,
        length: 60,
        distanceFromWhiteBall: 3,

        mesh: null,
        materials: null,

        whiteBall: null,

        /** 0 - 100 **/
        shootPower: 50,
        /** makes shot stronger **/
        powerAmplification: 6,
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

            texture = dr.textures.brownLightWood;
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

            this.whiteBall.addEventListener('ballStoppedMoving', this._whiteBallStoppedMoving.bind(this));
            this.whiteBall.addEventListener('ballFalling', this._whiteBallFalling.bind(this));

            this._moveCue();
            this._initKeyboard();
        },

        /**
         * enter/space action
         * calculate cue animation (by TWEEN) and invoke applyingImpulse on the white ball
         */
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
                    dr.scene.remove(this.mesh);
                }.bind(this));

            tween.start();
        },

        /**
         * perform shoot by applying impulse to the white ball
         * @private
         */
        _applyImpulseOnWhiteBall: function() {
            var x, z;
            x = this.shootPower * Math.cos( this.shootAngle * Math.PI / 180 ) * this.powerAmplification;
            z = this.shootPower * Math.sin( this.shootAngle * Math.PI / 180 ) * this.powerAmplification;

            this.whiteBall.applyCentralImpulse(new THREE.Vector3(x,0,z));
            this.ballsObj.isMoving(this.whiteBall);
        },

        /**
         * left/right arrow action
         * move cue around the white ball by current angle
         * @private
         */
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

        /**
         * after white ball stopped moving add cue again to the scene
         * @param event
         * @private
         */
        _whiteBallStoppedMoving: function(event) {
            dr.scene.add(this.mesh);
            this._moveCue();
        },

        /**
         * if white ball is out of table (falling down) remove it from the scene,
         *      move to center and a little higher and add cue like in normal situation
         * @param event
         * @private
         */
        _whiteBallFalling: function(event) {
            dr.scene.remove(this.whiteBall);
            this.whiteBall.position.set(0, dr.models.table.height/2 + 3 * dr.models.ball.radius, 0);
            dr.scene.add(this.whiteBall);
            this.whiteBall.setDamping(Balls.dampingLinear, Balls.dampingAngular);
            dr.scene.add(this.mesh);
            this._moveCue();
        },

        /**
         * display current shot power in indicator div element
         * update it's color relatively to power value
         * @private
         */
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

        /**
         * keyboard steering
         * arrows
         * enter/space
         * @private
         */
        _initKeyboard: function() {
            document.addEventListener('keydown', function (event) {
                var key = event.keyCode || event.charCode || event.which;
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
                    case 32:    //space
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