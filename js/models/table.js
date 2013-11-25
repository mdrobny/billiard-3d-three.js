/* global define, dr, _, THREE, ThreeBSP, Physijs */
define(function (){
    var table = {
        length: dr.models.table.length,
        width: dr.models.table.width,
        height: dr.models.table.height,
        gamePlaneHeight: dr.models.table.baseHeight/2 + dr.models.table.baizeHeight + 0.045,

        baseHeight: dr.models.table.baseHeight,

        baizeHeight: dr.models.table.baizeHeight,
        baizeFriction: 0.95,
        baizeRestitution: 0.1,


        sideHoleLength: 2.5 * dr.models.ball.radius,
        sideWidth: 3,
        sideHeight: dr.models.ball.radius + 0.2,
        sideFriction: 0.8,
        sideRestitution: 0.8,

        mesh: null,
        baizeMesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function() {
            this.mesh = this._createTableBase();
            this.baizeMesh = this._createTableBaize();
            this._createTableSides();

            return this.mesh;
        },

        _createTableBase: function() {
            var geometry, material, texture, mesh, shape, path, tableBase, tableBaseBSP, i,
                cylinderHole, cylinderHoleBSP, holes;

            texture = dr.textures.brownDarkWood;
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



            mesh = new Physijs.BoxMesh(
                geometry,
//                mesh.geometry,
                Physijs.createMaterial(
                    material, 0.99,0
                ),
                0
            );
            mesh.rotation.x += Math.PI/2;
            mesh.castShadow = true;
            return mesh;
        },

        _createTableBaize: function() {
            var geometry, material, texture, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baizeHeight);

            texture = dr.textures.greenLightBaize;
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.green,
                map: texture
            });

//            var JSONLoader = new THREE.JSONLoader();
//            var createTable = function( geometry, materials )
//            {
//                material = new THREE.MeshFaceMaterial( materials );
//
//                mesh = new Physijs.Mesh(
//                    geometry,
//                    Physijs.createMaterial(
//                        material, 0.95, 0.3
//                    ), 1
//                );
//                mesh.position.y = this.height/2 + 15;
////                mesh.rotation.set(90 * Math.PI/180, 90 * Math.PI/180, 0);
//                mesh.rotation.set(0, 90 * Math.PI/180, 0);
//                var s = 30;
//                mesh.scale.set( s,1,s );
//                mesh.receiveShadow = true;
////                this.mesh.add(mesh)
//                dr.scene.add(mesh)
////                return mesh;
//            };
//            JSONLoader.load( "objects/baize.js", createTable.bind(this) );

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material,
                    this.baizeFriction,
                    this.baizeRestitution
                ), 0
            );
            mesh.rotation.x += Math.PI/2;
            mesh.position.y = this.gamePlaneHeight - this.baizeHeight/2;
            mesh.receiveShadow = true;

            dr.scene.add(mesh);
        },

        _createTableSides: function() {
            var geometry, material, color, texture, sideMesh, sideLength, sideParts, createSideElement;

            texture = dr.textures.greenLightBaize;
            color = dr.colors.green;
            material = new THREE.MeshLambertMaterial({
                color: color,
                map: texture
            });

            sideParts = [];
            sideLength = this.length/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(sideLength, this.sideHeight, this.sideWidth);

            createSideElement = function(geometry, material) {
                return new Physijs.BoxMesh(
                    geometry,
                    Physijs.createMaterial(
                        material,
                        this.sideFriction,
                        this.sideRestitution
                    ), 100000
                );
            }.bind(this);

            //length side 1
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2 - this.sideHoleLength/2, 0, this.width/2 - this.sideWidth/2);
            sideParts.push(sideMesh);

            //length side 2
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2  - this.sideHoleLength/2, 0, -this.width/2 + this.sideWidth/2);
            sideParts.push(sideMesh);
//
//            //length side 3
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2 + this.sideHoleLength/2, 0, this.width/2 - this.sideWidth/2);
            sideParts.push(sideMesh);
//
//            //length side 4
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2 + this.sideHoleLength/2, 0, -this.width/2 + this.sideWidth/2);
            sideParts.push(sideMesh);
//
            sideLength = this.width/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(this.width - 2 * this.sideHoleLength, this.sideHeight, this.sideWidth);
//
//            //width side 1
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(- this.length/2 + this.sideWidth/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.y = Math.PI/2;
            sideParts.push(sideMesh);
//
//            //width side 1
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(this.length/2 - this.sideWidth/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.y = Math.PI/2;
            sideParts.push(sideMesh);


            _.each(sideParts, function (sideMesh) {
                sideMesh.position.y = this.gamePlaneHeight + this.sideHeight/2;
                dr.scene.add(sideMesh);
            }.bind(this));
        }

    };
    return table;
});