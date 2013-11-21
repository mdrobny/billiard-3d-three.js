/* global define, dr */
define(function () {
    dr = window.dr || {};

    dr.canvasElem = $('.content');

    dr.config = {};

    dr.config.localResources = "";//"http://localhost/billiard3d_local_res/";

    dr.config.scene = {};

    dr.config.scene.width = 1024;
    dr.config.scene.height = 800;

    /** objects **/
    dr.models = {};

    dr.models.table = {};
    dr.models.table.length = 80;
    dr.models.table.width = 40;
    dr.models.table.baseHeight = 5.5;
    dr.models.table.baizeHeight = 0.5;
    dr.models.table.height = dr.models.table.baseHeight + dr.models.table.baizeHeight;

    dr.models.ball = {};
    dr.models.ball.radius = 2;

    dr.colors = {};
    dr.colors.brown = "#A85511";
    dr.colors.green = "#387D25";

});