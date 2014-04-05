// Use this to learn Test Driven Development
// Also read up on best practices for Oop Javascript. 

// private and public vars and methods: http://phrogz.net/JS/classes/OOPinJS.html

// how prefix it?  ss // serp scrape?  // mqc moz quake csv

function serpToCsv(options){
  
  // Private Properties
  var options = options; // current options var, user passes in
  
  var localOptions = {  
    cols:[], // this is cols to include and order they come in
  };
  
  
  
  var settings = {     // main settings
    
    // date:'', ?   // anything I want the user to be able to easily edit
    
    jqSelectors: {        // each selector is from element to selected element.  context should be obvious whether it's .parent(), .closest(), etc
      searchTermInput:'', // get keyword with .val()
      pageNumber:0,       // if on second page, change index to 11, or however many results are on a single page
      
      mozIframe:'iFrame',
      iFrameToResult: '', // single result, or website result container
      resultToTitle:'',
      resultToUrl:'',
      resultToDescriptionContainer:'',
      
      quakeCsvToggle:'',  // button to toggle and show csv textarea data
      quakeCsvTextarea:'' // csv data
    }
    
  }
  
  // private properties
  var serpJsonArray = []; // data from serps, title, url, description, html title
  
  // setup ways to filter and manipulate this data
  var mozJsonArray = [];
  
  var quakeJsonArray = [];
  
  var localJsonArray = []; // local results
  
  var combinedFilteredJsonArray = []; // all data after combined and options set with cols and order
  
  /*
  
    // should I have settingsVars or functions for each?  Date and format, filename, header, etc
    // all main variables calculated from options
    
    // Outline methods
    this.getSearchTerm = function(){}
    
    this.getFilename = function(){};
    
    // serp functions
    this.getSerpData();
    
    this.serpDataToJsonArray();
    
    // moz functions
    function getMozSerpData();
    
    function mozDataToJsonArray();
    
    this.getMozJsonArray(); // allows user to get publically
    
    // seo quake functions
    function getQuakeSerpData();
    
    function csvToJsonArray();
    
    this.getQuakeJsonArray(); // pulblic to get data if needed
    
    // manipulating all data
    function combineJsonArrays();
    
    this.orderJsonArray(); // based on col options
    
    this.filterJsonArray(); // any data filtering, remove unwanted cols?
    
    // Main functions, actions, processes,
    this.jsonArrayToCsv();  // public
    
    this.downloadCsv();     // public
    
  */
}

// use to append scripts, styles, and html? 
// make super flexible - really?  
function bookmarkletInterface(userOptions){
  
  
  // these are only used for default interface
  var html = '';
  var css = '';

  function buildCss(){
    css += '';

  }
  
  function buildHtml(){

    html += '';
    
  }
  
  // if public use, pass in custom css
  this.appendCss = function(css){
    if(typeof css === 'undefined'){
      // fail unit test
      return;
    }
  }
  
  this.appendHtml = function(html, parentSelector){
    if(typeof html === 'undefined'){
      // fail unit test
      return; 
    }
    if(typeof parent === 'undefined'){
      // unit test
      parentSelector = 'body';
    }
    
    // use jquery at all?
    $(parentSelector).append(html);
  }
  

  
}