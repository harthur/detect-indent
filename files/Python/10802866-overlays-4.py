"""
Regular Expression Hierarchical Parsing.
"""

import re


class Rng(object):
    """
    Open-closed range of numbers that supports `in'
    """

    def __init__(self, s, e, rng=(True, False)):
        self.s = s
        self.e = e
        self.sclosed, self.eclosed = rng

    def __contains__(self, num):
        return ((not self.eclosed and num < self.e) or \
                (self.eclosed and num <= self.e)) and \
            ((self.sclosed and num >= self.s) or \
             (not self.sclosed and num < self.s))

class Overlay(object):
    def __init__(self, text, (start, end), props=None, value=None):
        """
        :param text: The text this overlay refers to.
        :param start: The starting index of the overlay.
        :param end: The end index of the overlay.
        :param props: A list of strings that are the properties of the
        overlay.
        :param value: The value that this text represents.
        """

        self.text = text
        self.start = start
        self.end = end
        self.value = value

        self.set_props(props)

    def set_props(self, props=None):
        """
        Set props of this overlay or clear them.
        """

        self.props = props or set()

    def copy(self, props=None, value=None):
        """
        Copy the Overlay possibly overriding props.
        """

        return Overlay(self.text,
                       (self.start, self.end),
                       props=props or self.props,
                       value=value or self.value
        )

    def __str__(self):
        """
        The text tha this overlay matches.
        """

        return str(self.string())

    def __len__(self):
        return  self.end - self.start

    def before(self):
        """
        The text before the overlay.
        """

        return self.text[:self.start]

    def after(self):
        """
        The entire text after the overlay.
        """

        return self.text[self.end:]

    def until(self, ovl):
        """
        The text separating overlays.
        """

        return self.text[self.end:ovl.start]

    def string(self):
        return self.text[self.start:self.end]

    def merge(self, ovl):
        if not ovl:
            return self

        if self.text != ovl.text:
            raise ValueError("Overlays refer to different texts.")

        s = min(self.start, ovl.start)
        e = max(self.end, ovl.end)

        return Overlay(self.text, (s, e), self.props.union(ovl.props))

    def __eq__(self, ov):
        return self.start == ov.start and \
            self.end == ov.end and \
            str(self.text) == str(ov.text)

    def __repr__(self):
        return "<Overlay object at [%d, %d), props: %s, text: '%s'>" % (self.start, self.end, self.props, str(self))

    def match(self, props=None, rng=None, offset=None):
        """
        Provide any of the args and match or dont.

        :param props: Should be a subset of my props.
        :param rng: Exactly match my range.
        :param offset: I start after this offset.
        :returns: True if all the provided predicates match or are None
        """

        if rng:
            s, e = rng
        else:
            e = s = None

        return ((e is None or self.end == e) and \
                (s is None or self.start == s)) and \
            (props is None or props.issubset(self.props)) and \
            (offset is None or self.start >= offset)

class BaseMatcher(object):
    """
    An interface for Matcher objects.
    """

    def offset_overlays(self, text, offset=0, **kw):
        raise NotImplementedError("Class %s has not implemented \
        offset_overlays" % type(self))

    def fit_overlays(self, text, start=None, end=None, **kw):
        raise NotImplementedError("Class %s has not implemented \
        fit_overlays" % type(self))

    def value(self, **kw):
        if hasattr(self, 'value_fn') and self.value_fn:
            return self.value_fn(**kw)

    def __repr__(self):
        return "<%s with props %s>" % (type(self).__name__, self.id)


class RegexMatcher(BaseMatcher):
    """
    Regex matching for matching.
    """

    def __init__(self, regex, props, value_fn=None):
        """
        Provide the regex to be matched.
        """

        if isinstance(regex, str):
            self.regex = re.compile(regex)
        else:
            self.regex = regex

        self.value_fn = value_fn
        self.props = props

        self.id = str(regex)

    def offset_overlays(self, text, offset=0, **kw):
        """
        Generate overlays after offset.
        :param text: The text to be searched.
        :param offset: Match starting that index. If none just search.
        :returns: An overlay or None
        """

        for m in self.regex.finditer(str(text)[offset:]):
            yield Overlay(text, (offset + m.start(), offset+m.end()),
                          props=self.props,
                          value=self.value(rxmatch=m))

    def fit_overlays(self, text, start=None, end=None, **kw):
        """
        Get an overlay thet fits the range [start, end).
        """

        _text = text[start or 0:]
        if end:
            _text = _text[:end]

        m = self.regex.match(str(_text))

        if m:
            yield Overlay(text, (start + m.start(), start+m.end()),
                          props=self.props,
                          value=self.value(rxmatch=m))

class OverlayMatcher(BaseMatcher):
    """
    Match a matcher. A matcher matches in 3 ways:
    - Freely with an offset
    - Fitting in a range.

    The value_fn should accept the `overlay' keyword.
    """

    def __init__(self, props_match, props=None, value_fn=None):
        """
        :param props: Set of props to be matched.
        """

        self.props_match = props_match
        self.props = props or set()

        self.id = str(self.props_match)

    def offset_overlays(self, text, offset=0, **kw):
        """
        Get overlays for the text.
        :param text: The text to be searched. This is an overlay
        object.
        :param offset: Match starting that index. If none just search.
        :returns: A generator for overlays.
        """

        for ovl in text.overlays:
            if ovl.match(offset=offset, props=self.props_match):
                yield ovl.copy(props=self.props,
                               value=self.value(overlay=ovl))

    def fit_overlays(self, text, start=None, end=None, **kw):
        """
        Get an overlay thet fits the range [start, end).
        """

        for ovl in text.overlays:
            if ovl.match(props=self.props_match, rng=(start, end)):
                yield ovl

class ListMatcher(BaseMatcher):
    """
    Match as a concatenated series of other matchers. It is greedy in
    the snse that it just matches everything.

    value_fn should accept the `ovls' keyword which is a list of the
    overlays that compose the result.
    """

    def __init__(self, matchers, props=None, value_fn=None, dependencies=None):
        self.matchers = matchers
        self.props = props or set()
        self.value_fn = value_fn
        self.dependencies = dependencies or []

    def _merge_ovls(self, ovls):
        """
        Merge ovls and also setup the value and props.
        """

        ret = reduce(lambda x,y: x.merge(y), ovls)
        ret.value = self.value(ovls=ovls)
        ret.set_props(self.props)
        return ret

    def _fit_overlay_lists(self, text, start, matchers, **kw):
        """
        Return a list of overlays that start at start.
        """

        if matchers:
            for o in matchers[0].fit_overlays(text, start):
                for rest in self._fit_overlay_lists(text, o.end, matchers[1:]):
                    yield [o] + rest

        else:
            yield []


    def offset_overlays(self, text, offset=0, run_deps=True, **kw):
        """
        The heavy lifting is done by fit_overlays. Override just that for
        alternatie implementation.
        """

        if run_deps and self.dependencies:
            text.overlay(self.dependencies)

        value_ovls = []
        for ovlf in self.matchers[0].offset_overlays(text,
                                                     goffset=offset,
                                                     **kw):
            for ovll in self._fit_overlay_lists(text, ovlf.end,
                                                self.matchers[1:]):
                yield self._merge_ovls([ovlf] + ovll)

    def fit_overlays(self, text, start=None, _matchers=None,
                     run_deps=True, ovls=None, **kw):
        # Each matcher will create generate a series of overlays with
        # it's fit overlay. Ignore end for now.

        if run_deps and self.dependencies:
            text.overlay(self.dependencies)

        ovls = ovls or []

        if _matchers is None:
            _matchers = self.matchers

        for ret in self._fit_overlay_lists(text, start=start,
                                           matchers=_matchers, **kw):

            yield self._merge_ovls(ret)

class MatcherMatcher(BaseMatcher):
    """
    """

    def __init__(self, matchers, props=None, value_fn=None):
        self.matchers = matchers
        self.props = props
        self.value_fn = value_fn

        self._list_match = ListMatcher([OverlayMatcher(m.props) for m in matchers], props=self.props)
        self._overlayed_already = []

    def _maybe_run_matchers(self, text, run_matchers):
        """
        OverlayedText should be smart enough to not run twice the same
        matchers but this is an extra handle of control over that.
        """

        if run_matchers is True or \
           (run_matchers is not False and text not in self._overlayed_already):
            text.overlay(self.matchers)
            self._overlayed_already.append(text)


    def fit_overlays(self, text, run_matchers=None, **kw):
        """
        First all matchers will run and then I will try to combine
        them. Use run_matchers to force running(True) or not
        running(False) the matchers.

        See ListMatcher for arguments.
        """
        self._maybe_run_matchers(text, run_matchers)
        for i in self._list_match.fit_overlay(text, **kw):
            yield i

    def offset_overlays(self, text, run_matchers=None, **kw):
        """
        First all matchers will run and then I will try to combine
        them. Use run_matchers to force running(True) or not
        running(False) the matchers.

        See ListMatcher for arguments.
        """

        self._maybe_run_matchers(text, run_matchers)
        for i in self._list_match.offset_overlays(text, **kw):
            yield i


def mf(pred, props=None, value_fn=None, props_on_match=False):
    """
    Matcher factory.
    """

    if isinstance(pred, BaseMatcher):
        return pred if props_on_match else pred.props

    if isinstance(pred, str) or \
       type(pred).__name__ == 'SRE_Pattern':
        return RegexMatcher(pred, props=props, value_fn=value_fn)

    if isinstance(pred, set):
        return OverlayMatcher(pred, props=props, value_fn=value_fn)

    if isinstance(pred, list):
        deps = [p for p in pred if isinstance(p, BaseMatcher)]
        return ListMatcher([mf(p, props_on_match=True) for p in pred],
                           props=props, value_fn=value_fn,
                           dependencies=deps)


class OverlayedText(object):
    """
    Both the text and it's overlays.
    """

    def __init__(self, text, overlays=None):
        self.text = text
        self.overlays = overlays or []
        self._ran_matchers = []

    def copy(self):
        t = OverlayedText(self.text, [o.copy() for o in self.overlays])
        t._ran_matchers = [i for i in self._ran_matchers]
        return t

    def __str__(self):
        return str(self.text)

    def __repr__(self):
        return str(self.text)

    def __getitem__(self, key):
        return OverlayedText(self.text.__getitem__(key),
                             overlays=self.overlays_at(key))

    def overlays_at(self, key):
        """
        Key may be a slice or a point.
        """

        if isinstance(key, slice):
            s, e, _ = key.indices(len(self.text))
        else:
            s = e = key

        return [o for o in self.overlays if o.start in Rng(s,e)]

    def overlay(self, matchers, force=False):
        """
        Given a list of matchers create overlays based on them. Normally I
        will remember what overlays were run this way and will avoid
        re-running them but you can `force` me to. This is the
        recommended way of running overlays.c
        """

        for m in matchers:
            if m in self._ran_matchers:
                continue

            self._ran_matchers.append(m)

            self.overlays += list(m.offset_overlays(self))

        self.overlays.sort(key=lambda o: o.start)

    def get_overlays(self, **kw):
        """
        See Overlay.match() for arguments.
        """

        return [o for o in self.overlays if o.match(**kw)]


def _main():
    """
    Sort of like a test, this is what you should be seing.

    >>> a,b = _main(); print [i==j for i,j  in zip(a.overlays, b.overlays)]
    [True, True, True, True, True]
    >>> len(a.overlays)
    5
    >>> len(b.overlays)
    5
    >>> a.overlays
    [<Overlay object at [0, 4), props: set(['1', 'hello'])>, <Overlay object at [0, 6), props: set(['full', 'hello'])>, <Overlay object at [4, 5), props: set(['2', 'hello'])>, <Overlay object at [5, 6), props: set(['space'])>, <Overlay object at [7, 8), props: set(['2', 'hello'])>]
    """
    t = OverlayedText("Hello World")
    o = mf("o", {'hello','2'})
    hell = mf("[hH]ell", {'hello','1'})
    space = mf(" ", {'space'})
    hello = mf([{'hello','1'}, {'hello','2'}, {'space'}], {'hello', 'full'})
    hello_cool = MatcherMatcher([hell, o, space], {"hello", "smart"})

    t2 = t.copy()
    t.overlay([hell, o, space, hello])
    print t.get_overlays(props={'full'})
    t2.overlay([hello_cool])

    return t, t2

if __name__ == "__main__":
    _main()
