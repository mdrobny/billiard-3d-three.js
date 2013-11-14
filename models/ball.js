/* global define, dr, THREE, Physijs */
define(function (){
    var ball = {
        radius: 2,
        mass: 2,
        friction: 0.2,
        restitution: 0.3,
        widthSegments: 32,
        heightSegments: 32,

        mesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function(color) {
            this._createCue(color);
            return this.mesh;
        },

        _createCue: function(color) {
            var geometry, material, mesh;
            color = color || "#eeeeee";
            geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);

            material = new THREE.MeshLambertMaterial({
                color: color
            });

            mesh = new Physijs.SphereMesh(
                geometry,
                Physijs.createMaterial(
                    material, this.friction, this.restitution
                ),
                this.mass
            );
            mesh.position.y += dr.objects.table.height + this.radius;
            mesh.castShadow = true;

            this.mesh = mesh;
        }

    };
    return ball;
});