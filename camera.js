/* global define, THREE, dr */
define([

],function () {
    var camera = {
        camera: null,
        radius: 80,
        theta: 45,
        onMouseDownTheta: 45,
        phi: 60,
        onMouseDownPhi: 60,
        onMouseDownPosition: new THREE.Vector2(),
        isMouseDown: false,

        init: function() {
            var viewAngle, aspect, near, far;

            viewAngle = 50;
            aspect = dr.config.scene.width / dr.config.scene.height;
            near = 0.1;
            far = 1000;

            this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

            this._setCameraPosition();


            /***
             * MOUSE events on scene
             ***/
            dr.canvasElem.on('mousedown', function (event) {
                event.preventDefault();

                this.isMouseDown = true;

                this.onMouseDownTheta = this.theta;
                this.onMouseDownPhi = this.phi;

                this.onMouseDownPosition.set( event.clientX, event.clientY);
            }.bind(this));

            dr.canvasElem.on('mousemove', function (event) {
                event.preventDefault();

                if(this.isMouseDown) {
                    this.theta = - ( ( event.clientX - this.onMouseDownPosition.x ) * 0.5 ) + this.onMouseDownTheta;
                    this.phi = ( ( event.clientY - this.onMouseDownPosition.y ) * 0.5 ) + this.onMouseDownPhi;

                    this.phi = Math.min( 180, Math.max( 0, this.phi ) );

                    this._setCameraPosition();

                    //dr.render();
                }
            }.bind(this));

            dr.canvasElem.on('mouseup', function (event) {
                event.preventDefault();

                this.isMouseDown = false;
                this.onMouseDownPosition.set(event.clientX - this.onMouseDownPosition.x, event.clientY - this.onMouseDownPosition.y);
            }.bind(this));

            dr.canvasElem.on('mousewheel', function (event, delta, deltaX, deltaY) {
                event.preventDefault();

                this.radius -= deltaY;
                this._setCameraPosition();
                //dr.render();
            }.bind(this));

        },

        _setCameraPosition: function() {
            this.camera.position.x = this.radius * Math.sin( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 );
            this.camera.position.y = this.radius * Math.sin( this.phi * Math.PI / 360 );
            this.camera.position.z = this.radius * Math.cos( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 );
            this.camera.lookAt(new THREE.Vector3(0,0,0));
            this.camera.updateMatrix();
        },

        get: function() {
            return this.camera;
        }
    };
    return camera;
});