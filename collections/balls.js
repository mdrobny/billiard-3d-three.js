/* global define, dr, THREE, Physijs */
define([
    'models/ball'
],function (Ball){
    var balls = {
        models: [],

        amount: 15,
        colors: ['#ffffff','#000000','#E31010'],

        positions: null,
        positionWhite: null,

        get: function() {
            return this.models;
        },

        create: function() {
            var r = Ball.radius;
            this.positions = [
                    [0, 0],
                [2*r,-r],[2*r,r],
            [4*r,-2*r],[4*r,0],[4*r,2*r],
        [6*r,-3*r],[6*r,-r],[6*r,r],[6*r,3*r],
    [8*r,-4*r],[8*r,-2*r],[8*r,0],[8*r,2*r],[8*r,4*r]
            ];
            this.positionWhite = [-4*r,0];

            this._createAndAddBalls();
            return this.models;
        },

        _createAndAddBalls: function() {
            var i, ball;

            for(i = 0; i < this.amount; i++) {
                ball = Ball.create(i+1);
                ball.position.x = this.positions[i][0];
                ball.position.z = this.positions[i][1];
                this.models.push(ball);
            }
            ball = Ball.create(0);
            ball.position.x = this.positionWhite[0];
            ball.position.z = this.positionWhite[1];
            this.models.push(ball);

        },

        isMoving: function(obj) {
            var moving, interval, posXBefore, posZBefore;
            moving = true;
            posXBefore = posZBefore = 0;
            interval = setInterval(function () {
                if(obj.position.x === posXBefore && obj.position.z === posZBefore) {
                    moving = false;
                    clearInterval(interval);
                    obj.dispatchEvent('stoppedMoving');
                } else {
                    posXBefore = obj.position.x;
                    posZBefore = obj.position.z;
                }
            }.bind(this), 500);
        }

    };
    return balls;
});