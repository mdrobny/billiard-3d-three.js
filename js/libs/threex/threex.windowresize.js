// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = new THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: stop updating renderer and camera
//
// ```windowResize.destroy()```
// # Code

//

/** @namespace */
var THREEx	= THREEx || {}

/**
 * Update renderer and camera when the window is resized
 *
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 */
THREEx.WindowResize	= function(renderer, camera){
    /** hack **/
    var widthOffset = 21, heightOffset = 21;
    var callback	= function(){
        // notify the renderer of the size change
        renderer.setSize( window.innerWidth - widthOffset, window.innerHeight - heightOffset );
        // update the camera
        camera.aspect	= (window.innerWidth - widthOffset) / (window.innerHeight - heightOffset);
        camera.updateProjectionMatrix();
    };
    // bind the resize event
    window.addEventListener('resize', callback, false)
    // return .stop() the function to stop watching window resize
    return {
        trigger	: function(){
            callback();
        },
        /**
         * Stop watching window resize
         */
        destroy	: function(){
            window.removeEventListener('resize', callback);
        }
    }
}