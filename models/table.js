/* global define, dr, THREE, Physijs */
define(function (){
    var table = {
        length: 60,
        width: 40,
        baseHeight: 5,
        baizeHeight: 0.5,

        sideHeight: 2.5,
        sideFriction: 0.9,
        sideRestitution: 0.6,

        height: 2.75,   //:baseHeight/2 + baizeHeight/2

        mesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function() {
            dr.objects.table.height = this.height;

            this._createTableBase();
            this.mesh.add(this._createTableBaize());
            this.mesh.add(this._createTableSides());

            return this.mesh;
        },

        _createTableBase: function() {
            var geometry, material, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baseHeight);

            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown
            });

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material,
                    0.4,
                    0.8
                ),
                0
            );
            mesh.rotation.x += 90 * Math.PI/180;
            this.mesh = mesh;
        },

        _createTableBaize: function() {
            var geometry, material, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baizeHeight);

            material = new THREE.MeshLambertMaterial({
                color: "#387D25"    //green
            });

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material,
                    0.95,
                    0.3
                ),
                0
            );
//            mesh.receiveShadow = true;
            mesh.rotation.x = - 180 * Math.PI/180;
            mesh.position.z = - this.height;
            mesh.receiveShadow = true;

            return mesh;
        },

        _createTableSides: function() {
            var geometry, material, sideMesh, mesh;
            geometry = new THREE.CubeGeometry(this.length - 10, 3, this.sideHeight);

            material = new THREE.MeshLambertMaterial({
                color: "#387D25"    //green
            });

            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(0,  -this.width/2, -this.height - this.sideHeight/2);

            mesh = this._createSideElement(geometry, material);
            mesh.position.set(0,  this.width, 0);
            sideMesh.add(mesh);

            geometry = new THREE.CubeGeometry(this.width - 10, 3, this.sideHeight);
            mesh = this._createSideElement(geometry, material);
            mesh.position.set(this.length/2, this.width/2 ,0);
            mesh.rotation.z = 90 * Math.PI/180;
            sideMesh.add(mesh);

            mesh = this._createSideElement(geometry, material);
            mesh.position.set(-this.length/2, this.width/2 ,0);
            mesh.rotation.z = 90 * Math.PI/180;
            sideMesh.add(mesh);

            return sideMesh;
        },

        _createSideElement: function(geometry, material) {
            return new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material, this.sideFriction, this.sideRestitution
                ), 0
            );
        }
    };
    return table;
});