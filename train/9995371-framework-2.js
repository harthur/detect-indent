  init: function () {
    //BT.util.log("init in BT.Framework for " + this.get('ref'));
    this.files = BT.FrameworkFilesController.create({ framework: this });
    this._scripts = BT.FrameworkScriptsController.create({ framework: this });
    this._scripts.contentBinding = this._scripts.bind('content', this.files, 'scripts');
    this._stylesheets = BT.FrameworkStylesheetsController.create({ framework: this });
    this._stylesheets.contentBinding = this._stylesheets.bind('content', this.files, 'stylesheets');

    var fwname = this.get('fullname');
    var pathlib = require('path');
    var combinedName, combineStylesheets;
    if (this.combineScripts) {
      combinedName = pathlib.join(fwname, "combined.js");
      this.scripts = BT.CombinedFilesController.create({
        relpath: combinedName
      });
      this.scripts.filesToCombineBinding = this.scripts.bind('filesToCombine', this._scripts, 'arrangedObjects');
      this.scripts.filesDidChangeBinding = this.scripts.bind('filesDidChange', this._scripts, 'filesHaveChanged');
      //this.scripts = combineScripts;
    }
    else {
      this.scripts = this._scripts;
    }