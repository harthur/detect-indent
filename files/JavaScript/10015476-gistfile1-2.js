define('lscs-document-filter', ['xml2json', 'hbars!templates/document/default', 'jquery.spin', 'domReady!'],
  function (xmlParser, defaultTemplate) {

  /**
   * LscsDocumentFilter
   *
   * @param template        The Handlebars.js template to render
   * @param pageIndex       The result's current page index
   * @param limit           The amount of results to fetch
   * @param loadMoreButton  'Load More' DOM element
   * @param loadAnimation   Loader animation DOM element
   * @param scrollSpeed     The speed at which to adjust the window's scroll position after rendering results
   * @param target          DOM element to use for rendering results
   * @param noResults       The text to display when there are no results to render
   * @param noMoreResults   The text to display when there are no more results to render (after having
   *                        previously rendered some)
   * @param ajaxUrl         The URL to query against
   * @param lscsQuery       The LSCS query to generate the results
   *
   * @param onInitialize
   * @param onLoadStart
   * @param onLoadEnd
   * @param onRender
   */
  var LscsDocumentFilter = function (params) {

    params = params || {};

    // Default configuration
    var defaults = {
      template:       defaultTemplate,
      pageIndex:      0,
      limit:          5,
      loadMoreButton: '#load-more',
      loadAnimation:  '#load-animation',
      scrollSpeed:    250,
      target:         '#results',
      noResults:      'No results',
      noMoreResults:  'No more results',
      ajaxUrl:        'http://example.url',
      lscsQuery:      '',

      onInitialize:   function () {},
      onLoadStart:    function () {},
      onLoadEnd:      function () {},
      onRender:       function () {}
    };

    // Object configuration
    this.config = {
      template:       params.template       || defaults.template,
      pageIndex:      params.pageIndex      || defaults.pageIndex,
      limit:          params.limit          || defaults.limit,
      loadMoreButton: params.loadMoreButton || defaults.loadMoreButton,
      loadAnimation:  params.spinner        || defaults.spinner,
      scrollSpeed:    params.scrollSpeed    || defaults.scrollSpeed,
      target:         params.target         || defaults.target,
      ajaxUrl:        params.ajaxUrl        || defaults.ajaxUrl,
      lscsQuery:      params.lscsQuery      || defaults.lscsQuery,

      onInitialize:   params.onInitialize   || defaults.onInitialize,
      onLoadStart:    params.onLoadStart    || defaults.onLoadStart,
      onLoadEnd:      params.onLoadEnd      || defaults.onLoadEnd,
      onRender:       params.onRender       || defaults.onRender
    };

    this.isLoading = true;

    this.validation = function () {};

    this.constraints = [];
    this.templateData = [];

    // Initialize
    this.initialize();

  };

  LscsDocumentFilter.prototype = {

    initialize: function () {
      this.createLoadAnimation();

      // Bind events
      $J(this.config.loadMoreButton).on('click', function (event) {
        event.preventDefault();
        this.filter();
      });

      // Callback
      this.config.onInitialize();
    },

    /**
     * Generates a URL with proper query string parameters to use when requesting data from the LSCS server.
     * The query string is generated from the object's constraints.
     */
    buildLscsUrl: function () {
      var query = $J.parseJSON(this.config.lscsQuery);

      for (var i = 0; i < this.constraints.length(); i++ ) {
        query['constraints'].push(this.constraints[i]);
      }

      var url = this.config.ajaxUrl +
                '?start=' + (this.config.pageIndex * this.config.limit) +
                '&query=' + JSON.stringify(query);

      return url;
    },

    /**
     * Add a validation rule to be called before rendering the template. This rule gets applied to every
     * template data item.
     *
     * @param func  A function with one parameter used for passing the object's template data.
     *
     *              e.g.
     *
     *              check(function (data) {
     *                if (data.someField === null) {
     *                  data.someField = 'Some value';
     *                }
     *              });
     */
    check: function (func) {
      this.validation = func;
    },

    /**
     * Validate each item inside the object's template data.
     */
    validate: function () {
      for (var i = 0; i < this.templateData.length; i++) {
        if (this.templateData[i] !== null) {
          this.validation(this.templateData[i]);
        }
      }
    },

    /**
     * Add a query constraint to be added to the generated LSCS request URL.
     *
     * @param field     e.g. "TeamSite/Metadata/publishedYear"
     * @param operator  e.g. "EQUALS"
     * @param value     e.g. "1991"
     */
    addConstraint: function (field, operator, value) {
      this.constraints.push({
        "name": field,
        "operator": operator,
        "value": value
      });
    },

    /**
     * Retrieve LSCS documents and render the appropriate elements on the target element.
     */
    execute: function () {
      this.onLoadStart();

      // GET Request to LSCS server
      $J.get(this.buildLscsUrl()).done(this.onLscsRequestDone);
    },

    /**
     * Callback function to be executed upon completing an LSCS request. Inserts the proper view into
     * the target element, depending on whether or not any results were retrieved.
     */
    onLscsRequestDone: function (data) {
      var json = JSON.parse(xmlParser.xml2json(data, ""));
      var result = model.Properties.Data.Result[this.config.xmlRoot];
      var totalItemCount = result["@totalItemCount"];

      if (result === null) {
        this.noResults();
      }

      else if (result !== null) {
        if(result.Item instanceof Array) {
          this.templateData = result.Item;
        }
        else {
          this.templateData.push(result.Item);
        }

        // Execute all rules before rendering
        this.validate();
        this.render();
      }

      else if ((this.config.pageIndex * this.config.limit) >= totalItemCount) {
        this.noMoreResults();
      }

      this.config.pageIndex++;
      this.onLoadEnd();
    },

    /**
     * Renders the retrieved documents into the target element.
     */
    render: function () {
      var target = $J(this.config.target);

      // Render the results
      target.append(this.config.template(model));

      // Scroll the page to the renedered results
      target.animate({ scrollTop: target[0].scrollHeight }, this.config.scrollSpeed);
      $J('html, body').animate({ scrollTop: $J(document).height() }, this.config.scrollSpeed);

      // Callback
      this.config.onRender();
    },

    /**
     * Render "no results" view, for when we couldn't retrieve any results from LSCS.
     */
    noResults: function () {
      $J(this.config.target).append('<div class="no-results">' + this.config.noResults + '</div>');
    },

    /**
     * Render "no more results" view, for when there are no more results to fetch.
     */
    noMoreResults: function () {
      $J(this.config.target).append('<div class="no-more-results">' + this.config.noMoreResults + '</div>');
    },

    /**
     * Gets called before any items are loaded.
     */
    onLoadStart: function () {
      this.isLoading = true;
      this.toggleLoadAnimation();

      // Callback
      this.config.onLoadStart();
    },

    /**
     * Gets called after loading all items.
     */
    onLoadEnd: function () {
      // Callback
      this.config.onLoadEnd();

      this.isLoading = false;
      this.toggleLoadAnimation();
    },

    /**
     * Empty all content inside the target element.
     */
    clearResults: function () {
      $J(this.config.target).empty();
      this.config.pageIndex = 0;
    },

    /**
     * Toggles the object's load state and shows/hides the load animation.
     */
    toggleLoadAnimation: function () {
      $J(this.config.loadMoreButton).css('display', this.isLoading ? 'none' : 'block');
      $J(this.config.loadAnimation).css('display', this.isLoading ? 'block' : 'none');
    },

    /**
     * Creates the load animation
     */
    createLoadAnimation: function () {
      $J(this.config.loadAnimation).spin({
        lines: 7,             // The number of lines to draw
        length: 0,            // The length of each line
        width: 7,             // The line thickness
        radius: 8,            // The radius of the inner circle
        corners: 1,           // Corner roundness (0..1)
        rotate: 0,            // The rotation offset
        direction: 1,         // 1: clockwise, -1: counterclockwise
        color: '#78C336',     // #rgb or #rrggbb or array of colors
        speed: 1.4,           // Rounds per second
        trail: 80,            // Afterglow percentage
        shadow: false,        // Whether to render a shadow
        hwaccel: false,       // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9           // The z-index (defaults to 2000000000)
      });
    }

  };

  return LscsDocumentFilter;

});