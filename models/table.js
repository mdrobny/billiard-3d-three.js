/* global define, dr, _, THREE, ThreeBSP, Physijs */
define(function (){
    var table = {
        length: dr.models.table.length,
        width: dr.models.table.width,
        baseHeight: dr.models.table.baseHeight,
        baizeHeight: dr.models.table.baizeHeight,
        height: dr.models.table.height,


        sideHoleLength: 2.5 * dr.models.ball.radius,
        sideWidth: 3,
        sideHeight: dr.models.ball.radius + 0.5,
        sideFriction: 0.9,
        sideRestitution: 0.6,

        mesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function() {
            this.mesh = this._createTableBase();
            this.mesh.add(this._createTableBaize());
//            this._createTableBaize();
            this._createTableSides();

            return this.mesh;
        },

        _createTableBase: function() {
            var geometry, material, texture, mesh, shape, path, tableBase, tableBaseBSP, i,
                cylinderHole, cylinderHoleBSP, holes;

            texture = THREE.ImageUtils.loadTexture("textures/light-wood-brown.jpg");
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown,
                map: texture
            });
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baseHeight);

//            shape = new THREE.Shape();
//            var r = 5;
//            shape.moveTo( 0, 0 )
//            shape.lineTo(0,2*r);
//            shape.lineTo(2*r,2*r);
//            shape.lineTo(2*r,0);
//            shape.lineTo(0,0);
//
//            path = new THREE.Path();
//            path.moveTo(0,0);
//            path.arc(0,0, r, 0 * Math.PI/180, 90 * Math.PI/180, true);
//
//            shape.holes.push(path)
//
//            var extrudeSettings = { amount: 3, bevelEnabled: false }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
////            extrudeSettings.bevelSegments = 20;
////            extrudeSettings.steps = 10;
//
//            geometry =  new THREE.ExtrudeGeometry(shape, extrudeSettings);
//
//            tableBase = new THREE.Mesh(new THREE.CubeGeometry(this.length, this.width, this.baseHeight));
//            tableBase.rotation.x = 90 * Math.PI/180;
//            tableBaseBSP = new ThreeBSP(tableBase);
//
//            var meshBSP;// = tableBaseBSP;
//
//            var holesPositions = [
//                [-this.length/2,-this.width/2],[0,-this.width/2],[this.length/2,-this.width/2],
//                [-this.length/2,this.width/2],[0,this.width/2],[this.length/2,this.width/2]
//            ];
//
////            for(i = 0; i < 6; i++) {
////                cylinderHole = new THREE.Mesh(new THREE.CylinderGeometry( 3, 3, this.baseHeight, 32, 32 ));
////                cylinderHole.position.set(holesPositions[i][0], 0, holesPositions[i][1]);
////                cylinderHoleBSP = new ThreeBSP(cylinderHole);
////                meshBSP = meshBSP.subtract(cylinderHoleBSP);
////            }
//            cylinderHole = new THREE.Mesh(new THREE.CylinderGeometry( 3, 3, this.baseHeight, 32, 32 ));
//            cylinderHole.position.set(10, 0, 0);
//            cylinderHoleBSP = new ThreeBSP(cylinderHole);
//            meshBSP = tableBaseBSP.subtract(cylinderHoleBSP);
//
//            mesh = meshBSP.toMesh( material );
//            mesh.geometry.computeVertexNormals();



            var mesh2 = new Physijs.ConvexMesh(
                geometry,
//                mesh.geometry,
                Physijs.createMaterial(
                    material,
                    0.4,
                    0.8
                ),
                0
            );
            mesh2.rotation.x += 90 * Math.PI/180;
            return mesh2;
        },

        _createTableBaize: function() {
            var geometry, material, texture, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baizeHeight);

            texture = THREE.ImageUtils.loadTexture("textures/baize-light-green.jpg");
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.green,
                map: texture
            });

            var JSONLoader = new THREE.JSONLoader();
            var createTable = function( geometry, materials )
            {
//                var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
//                zmesh.position.set( 0, 0, 0 );
//                zmesh.scale.set( 30, 30, 30 );
//                scene.add( zmesh );
                material = new THREE.MeshFaceMaterial( materials );

                mesh = new Physijs.Mesh(
                    geometry,
                    Physijs.createMaterial(
                        material, 0.95, 0.3
                    ), 0
                );
                mesh.position.y = this.height/2 - 0.2;
//                mesh.rotation.set(90 * Math.PI/180, 90 * Math.PI/180, 0);
                mesh.rotation.set(0, 90 * Math.PI/180, 0);
                var s = 30;
                mesh.scale.set( s,1,s );
                mesh.receiveShadow = true;
//                this.mesh.add(mesh)
                dr.scene.add(mesh)
//                return mesh;
            };
//            JSONLoader.load( "objects/baize.js", createTable.bind(this) );

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material, 0.95, 0.3
                ), 1
            );
            mesh.position.z = -this.height/2;
            mesh.receiveShadow = true;

            return mesh;
        },

        _createTableSides: function() {
            var geometry, material, texture, sideMesh, mesh, sideLength, sideParts;
            texture = THREE.ImageUtils.loadTexture("textures/baize-light-green.jpg");
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.green,
                map: texture
            });

            mesh = this.mesh;
            sideParts = [];
            sideLength = this.length/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(sideLength, this.sideWidth, this.sideHeight);

            //length side 1
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2 - this.sideHoleLength/2, -this.width/2, 0);
//            sideMesh.position.z = - this.height/2 + this.sideHeight/2 + 5;
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);

            //length side 2
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2  + this.sideHoleLength/2, -this.width/2, 0);
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);

            //length side 3
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2 - this.sideHoleLength/2, this.width/2, 0);
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);

            //length side 4
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2  + this.sideHoleLength/2, this.width/2, 0);
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);

            sideLength = this.width/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(this.width - 2 * this.sideHoleLength, this.sideWidth, this.sideHeight);

            //width side 1
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(- this.length/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.z = 90 * Math.PI/180;
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);

            //width side 1
            sideMesh = this._createSideElement(geometry, material);
            sideMesh.position.set(this.length/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.z = 90 * Math.PI/180;
//            mesh.add(sideMesh);
            sideParts.push(sideMesh);


            _.each(sideParts, function (sideMesh) {
                sideMesh.position.z = -this.height/2 - this.sideHeight/2;
                mesh.add(sideMesh);
            }.bind(this));

//            return mesh;
        },

        _createSideElement: function(geometry, material) {
            return new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material, this.sideFriction, this.sideRestitution
                ), 1
            );
        }
    };
    return table;
});