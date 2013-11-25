/* global define, dr, THREE, Physijs */
define([
    'models/ball'
],function (Ball){
    var balls = {
        models: [],
        dampingLinear: 0.8,
        dampingAngular: 0.8,

        amount: 15,
        colors: ['#ffffff','#000000','#E31010'],

        positions: null,
        xPositionAddition: dr.models.table.length/8,
        yPosition: dr.models.table.height/2 + dr.models.ball.radius + 0.2,
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
            this.positionWhite = [-dr.models.table.length/4,0];

            this._createAndAddBalls();
            return this.models;
        },

        _createAndAddBalls: function() {
            var i, nr, ball;

            for(i = 0; i < this.amount; i++) {
                nr = i + 1;
                if(nr === 5) {   //swap 5 with 8
                    nr = 8;
                } else if(nr === 8) {
                    nr = 5;
                }
                ball = Ball.create(nr);
                ball.position.x = this.positions[i][0] + this.xPositionAddition;
                ball.position.z = this.positions[i][1];
                ball.position.y = this.yPosition;
                this.models.push(ball);
            }
            //white
            ball = Ball.create(0);
            ball.position.x = this.positionWhite[0];
            ball.position.z = this.positionWhite[1];
            ball.position.y = this.yPosition;
            this.models.push(ball);
        },

        isMoving: function(obj) {
            var moving, interval, posXBefore, posYBefore, posZBefore, accuracy;
            accuracy = 0.04;
            posXBefore = posZBefore = 0;
            interval = setInterval(function () {
                if(Math.abs(obj.position.x - posXBefore) < accuracy && Math.abs(obj.position.z - posZBefore) < accuracy) {
                    clearInterval(interval);
                    obj.dispatchEvent('ballStoppedMoving');
                } else {
                    posXBefore = obj.position.x;
                    posZBefore = obj.position.z;
                    if( dr.models.table.height/2 > (obj.position.y + 1)) {
                        clearInterval(interval);
                        obj.dispatchEvent('ballFalling');
                    }
                }
            }.bind(this), dr.models.ball.isMovingIntervalTime);
        }

    };
    return balls;
});