function deprecate(msg){
    var err = new Error(),
        stack = err.stack,
        lines = stack.split('\n').slice(3)
    console.log("Deprecated method "+msg+"\n"+ lines.join('\n'))
}