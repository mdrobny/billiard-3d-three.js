/* global define, dr, THREE, Physijs */
define(function (){
    var cue = {
        radius: 1,
        mass: 0,
        friction: 0.2,
        restitution: 0.3,
        height: 40,
        widthSegments: 32,
        heightSegments: 32,

        mesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function(whiteBallPosition) {
            this._createCue(whiteBallPosition);
            return this.mesh;
        },

        _createCue: function(pos) {
            var geometry, material, mesh;
            geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height );

            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown
            });

            mesh = new Physijs.SphereMesh(
                geometry,
                Physijs.createMaterial(
                    material, this.friction, this.restitution
                ),
                this.mass
            );
            mesh.position.x = pos.x - 2 - this.height/2 - 0.5;
            mesh.position.y = 1 + 8 + 10;
            mesh.position.z = pos.z;
            mesh.rotation.z = 80 * Math.PI/180;

            this.mesh = mesh;
        }

    };
    return cue;
});