/* global define, dr, THREE, Physijs */
define(function (){
    var sky = {
        radius: 500,

        mesh: null,

        get: function() {
            return this.mesh;
        },

        create: function() {
            this.mesh = this._createSkybox();
            return this.mesh;
        },

        _createSkybox: function() {
            var mesh;

            var imagePrefix = "textures/skybox/";
            var directions  = ["0004", "0002", "0006", "0005", "0001", "0003"];
            var imageSuffix = ".png";
            for (var i = 0; i < directions.length; i++) {
                directions[i] = imagePrefix + directions[i] + imageSuffix;
            }
            var cubemap = THREE.ImageUtils.loadTextureCube(directions);

            var shader = THREE.ShaderLib.cube;
            shader.uniforms.tCube.value = cubemap;

            var skyBoxMaterial = new THREE.ShaderMaterial( {
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            });

            mesh = new THREE.Mesh(
                new THREE.CubeGeometry(1000, 1000, 1000),
                skyBoxMaterial
            );
            return mesh;
        }
    };
    return sky;
});