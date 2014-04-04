    /**
     * This is a hook to make the URL library work without duplicating private Y.Router code. If you pass it a URL
     * string it will return a request object ala the route handler, if one exists.
     *
     * @method getRequestForUrl
     * @param {String} u
     * @return {YUI Request} The first request object matching that string.
     */
    getRequestForUrl: function(u) {
        var end = (u.indexOf('?') !== -1) ? u.indexOf('?') : (u.indexOf('#') !== -1) ? u.indexOf('#') : u.length,
            path = this.removeRoot(u.substr(0, end)),
            req = this._getRequest(path, u), // get basic req object
            route = this.match(path)[0], // only grab first match
            defaultUrl = this.get('defaultUrl'); // if we hit the root url (/), we use this url instead

        if (!route) {
            return null;
        }

        Y.log("Mapping route segments onto parameters.", "info", Main.NAME);
        // map the keys of the route onto the matches in the url string
        req.params = Y.Array.hash(route.keys, route.regex.exec(path).slice(1));

        if(!req.params.controller || !req.params.action) {
            Y.log("Passed in root url, use defaultUrl's controller/action instead.", "info", Main.NAME);
            req.params = Y.merge(defaultUrl.params, req.params);
        }

        // We have to manually parse the query, since router's _getRequest method uses _getQuery, which uses
        // Y.getLocation rather than taking the url as an argument. So instead, we parse the query segment manually
        if (u.indexOf('?') !== -1) {
            req.query = this._parseQuery(u.substr(u.indexOf('?') + 1));
        } else {
            req.query = {};
        }

        return req;
    },