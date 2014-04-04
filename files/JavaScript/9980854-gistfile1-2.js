  query: function (req) {
    var q = req.query;
    return hadronService.query(q.offset, q.limit, q.sort, q.ascending);
  }