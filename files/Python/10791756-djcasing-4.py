import string

from django.http import HttpResponseRedirect, HttpResponsePermanentRedirect


def case_insensitive(func, case='lower', code=301):
    """
    Django view function decorator which can enforce the case of a URL path by
    redirecting to the properly cased URL. This *allows* for case insensitive
    matches while ensuring that only a commonly cased-URL is used and seen.
    """
    def inner(request, *args, **kwargs):
        if case not in ['lower', 'upper']:
            raise ValueError("{0} is not a valid case function: use 'lower' or 'upper'".format(case))
        if code not in [301, 302]:
            raise ValueError("{0} is not a valid HTTP redirect code".format(code))
        redirect_klass = HttpResponseRedirect if code == 301 else HttpResponsePermanentRedirect
        cased_path = getattr(string, case)(request.path)
        if request.path != cased_path:
            url = cased_path
            if 'QUERY_STRING' in request.META:
                url = "{0}?{1}".format(url, request.META['QUERY_STRING'])
            return redirect_klass(url)
        return func(request, *args, **kwargs)
    return inner