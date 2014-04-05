var loseCtx = context.gl.getExtension("WEBGL_lose_context");

//May not exist in some browsers, or if WebGLInspector is enabled
if (loseCtx) {
    //Attach a mouse click to the canvas...
    canvas.addEventListener("mousedown", function() {
        //Force the canvas to lose its WebGL context
        loseCtx.loseContext();

        //Here you may want to present the user with a progress indicator
        canvas.style.visibility = "hidden";

        //Delay re-initialization just a bit. 
        setTimeout(function() {
            canvas.style.visibility = "visible";

            //Force the canvas to restore its context
            loseCtx.restoreContext();
        }, 1000);
    }, false);
} else {
    console.warn("Cannot simulate context loss");
}