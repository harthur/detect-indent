//click event for layers
//using dojo for the event and class toggling
//but could just as easily be jQuery or vanilla javascript
on(dojo.byId("trail"), "click", function() {
  trailsLayer.visible ? trailsLayer.hide() :  trailsLayer.show();
  dojo.toggleClass(this, "visible");
  dojo.query("#trail .visibility-icon")
    .toggleClass("fa-picture-o")
    .toggleClass("fa-ban");
});