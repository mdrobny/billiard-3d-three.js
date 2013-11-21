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
        textures: [],

        get: function() {
            return this.mesh;
        },

        create: function(ballNr) {
            var i;
            for(i = 1; i < 16; i++) {
                this.textures.push(THREE.ImageUtils.loadTexture("textures/ball-"+ i +".jpg"));
            }

            this._createCue(ballNr);
            return this.mesh;
        },

        _createCue: function(ballNr) {
            var geometry, material, texture, mesh;
            geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);

            if(ballNr === 0) {
                texture = this.textures[0];
                material = new THREE.MeshLambertMaterial({
                    color: "#ffffff"
                });
            } else {
                texture = this.textures[ballNr];
                material = new THREE.MeshLambertMaterial({
                    map: texture
                });
            }

            mesh = new Physijs.SphereMesh(
                geometry,
                Physijs.createMaterial(
                    material, this.friction, this.restitution
                ),
                this.mass
            );
            mesh.position.y += dr.models.table.height + this.radius;
            mesh.castShadow = true;

            this.mesh = mesh;
        }

    };
    return ball;
});