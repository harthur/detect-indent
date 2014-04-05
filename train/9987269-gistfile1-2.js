// Here is the curl representation of the request and with this it's throwing on line 120
// It's with enough data to get to there
curl -i -H "Authorization: Basic YWRtaW46c2VjcmV0MTIzIQ==" -X POST -d "user%5Bextra%5D%5Braw_info%5D%5Bpositions%5D%5B_total%5D=2&user%5Bextra%5D%5Braw_info%5D%5Bpositions%5D%5Bvalues%5D%5B0%5D%5Btitle%5D=First&user%5Bextra%5D%5Braw_info%5D%5Bpositions%5D%5Bvalues%5D%5B0%5D%5Bcompany%5D%5Bname%5D=Company1&user%5Bextra%5D%5Braw_info%5D%5Bpositions%5D%5Bvalues%5D%5B1%5D%5Btitle%5D=Second&user%5Bextra%5D%5Braw_info%5D%5Bpositions%5D%5Bvalues%5D%5B1%5D%5Bcompany%5D%5Bname%5D=Company2" http://www.absorbfinance.com/linkedin

// The data I passed in the curl example is the following in JSON:
var data = {
  user: {
    extra: {
      raw_info: {
        positions: {
          _total: 2,
          values: [
            {title: "First", company: {name: "Company1"}},
            {title: "Second", company: {name: "Company2"}}
          ]
        }
      }
    }
  }
}

// And the ajax request I am making with it:
$.ajax({
  type: "POST",
  url: "http://absorbfinance.com/linkedin",
  data: data,
  headers: {
    "Authorization": "Basic ".concat(btoa("admin:secret123!"))
  },
});