/* global define, dr, THREE, Physijs */
define(function (){
    var cue = {
        radius: 1,
        height: 40,

        mesh: null,
        materials: null,

        whiteBall: null,

        /** 0 - 100 **/
        shootPower: 50,
        /** 0 - 360**/
        shootAngle: 0,

        get: function() {
            return this.mesh;
        },

        create: function(whiteBall) {
            this.whiteBall = whiteBall;

            this._createCue();

            return this.mesh;
        },

        _createCue: function(pos) {
            var geometry, material, mesh;

            geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height );

            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown
            });

            mesh = new THREE.Mesh(
                geometry,
                material
            );
            mesh.rotation.z = 80 * Math.PI/180;

            this.mesh = mesh;

            this._setCuePosition();
            this._initKeyboard();
        },

        /**
         * set cue position based on white ball position
         * just slightly near white ball
         * @private
         */
        _setCuePosition: function() {
            var position = this.whiteBall.position;
            this.mesh.position.x = position.x - 2 - this.height/2 - 0.5;
            this.mesh.position.y = 1 + 8;
            this.mesh.position.z = position.z;
        },

        shoot: function() {
            var start, end, tween, cue;
            cue = this.mesh;
            start = { x : cue.position.x, y: cue.position.y };
            end = { x : cue.position.x, y: cue.position.y };
            tween = new TWEEN.Tween(start).to(end, 1000);

            tween.onUpdate(function(){
                cue.position.x = this.x;
                cue.position.y = this.y;
            });

//            tween.start();

            this._applyImpulseOnWhiteBall();
        },

        _applyImpulseOnWhiteBall: function() {
            var x, z;
            x = this.shootPower * Math.cos( this.shootAngle * Math.PI / 180 );
            z = this.shootPower * Math.sin( this.shootAngle * Math.PI / 180 );

            this.whiteBall.applyCentralImpulse(new THREE.Vector3(x,0,z));
        },

        _initKeyboard: function() {
            document.addEventListener('keydown', function (event) {
                var key = event.keyCode;
                switch (key) {
                    case 37:    //left
                        if(this.shootAngle > 0 && this.shootAngle <= 360) {
                            this.shootAngle--;
                        }
                        console.log(this.shootAngle);
                        break;
                    case 38:    //up
                        if(this.shootPower >= 1 && this.shootPower < 100) {
                            this.shootPower++;
                        }
                        console.log(this.shootPower);
                        break;
                    case 39:    //right
                        if(this.shootAngle >= 0 && this.shootAngle < 360) {
                            this.shootAngle++;
                        }
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