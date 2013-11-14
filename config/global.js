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
    dr.objects = {};

    dr.objects.table = {};
    dr.objects.table.height = 0;

    dr.colors = {};
    dr.colors.brown = "#A85511";

});