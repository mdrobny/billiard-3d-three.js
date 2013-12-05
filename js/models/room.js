/* global define, dr, THREE, Physijs */
define(function (){
    var room = {
        length: 200,
        width: 200,
        height: 200,

        mesh: null,
        materials: null,
        textures: [],

        get: function() {
            return this.mesh;
        },

        create: function() {
            this.mesh = this._createFloor();
            this._createRoom();
            this._createPainting();
            return this.mesh;
        },

        _createFloor: function() {
            var geometry, material, texture, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, 1);
            texture = dr.textures.grayDarkWood;
            material = new THREE.MeshLambertMaterial({
                color: "#eeeeee",
                map: texture
            });
            mesh = new Physijs.BoxMesh(
                geometry,
                new Physijs.createMaterial(material, 0.1, 0.9),
                0
            );
            mesh.rotation.x = Math.PI/2;
            mesh.position.y = - this.height/8;
            mesh.receiveShadow = true;
            return mesh;
        },

        _createRoom: function() {
            var geometry, material, texture, mesh;

            var JSONLoader = new THREE.JSONLoader();
            var create = function( geometry, materials )
            {
                var s = 20;
                material = new THREE.MeshFaceMaterial( materials );
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set( s,s,s );
                mesh.rotation.y = Math.PI;
                mesh.position.z = - 50;
                this.mesh.add(mesh);

            };
            JSONLoader.load( "objects/walls2.js", create.bind(this) );
        },

        _createPainting: function() {
            var geometry, material, texture, mesh;

            geometry = new THREE.CubeGeometry(this.length/3, this.length/5, 0.1);

            texture = dr.textures.painting;
            material = new THREE.MeshLambertMaterial({
                color: "#eeeeee",
                map: texture
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI/2;
            mesh.position.set(-25,-this.length/2 + 1,-55);
            this.mesh.add(mesh);
        }

    };
    return room;
});