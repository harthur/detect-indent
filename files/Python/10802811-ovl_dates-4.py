import re
from pprint import pprint

from overlays import mf, OverlayedText, Rng

def w(s):
    """
    Most of the time we just want words.
    """

    return r"\b%s\b" % s

def words(l):
    return [w(i) for i in l]

def starts_with(txt, pre):
    return txt[:len(pre)].lower() == pre.lower()

def rx_int(rxmatch):
    return int(rxmatch.group(0))

def rx_int_extra(rxmatch):
    """
    We didn't just match an int but the int is what we need.
    """

    rxmatch = re.search("\d+", rxmatch.group(0))
    return int(rxmatch.group(0))

def month_names(rxmatch):
    for i,m in enumerate(MONTH_NAMES_LONG):
        if starts_with(m, rxmatch.group(0)):
            return i+1

# XXX: should look into non-overlaping only
def date_tuple(ovls):
    """
    We should have a list of overlays from which to extract day month
    year.
    """

    day = month = year = 0
    for o in ovls:
        if 'day' in o.props:
            day = o.value

        if 'month' in o.props:
            month = o.value

        if 'year' in o.props:
            year = o.value

        if 'date' in o.props:
            day, month, year = [o or n for o, n in zip((day, month,
                                                        year), o.value)]

    return (day, month, year)

def longest_overlap(ovls):
    """
    From a list of overlays if any overlap keep the longest.
    """

    ovls = sorted(ovls, key=lambda x: x.end-x.start)

    # I know this could be better but ovls wont be more than 50 or so.
    for i, s in enumerate(ovls):
        passing = True

        for l in ovls[i+1:]:
            if s.start in Rng(l.start, l.end, rng=(True, True)) or \
               s.end in Rng(l.start, l.end, rng=(True, True)):
                passing = False
                break

        if passing:
            yield s

MONTH_NAMES_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

MONTH_NAMES_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

matchers = [
    # Regex
    ('day', mf(r"([012]?[1-9]|3[01])", {'day', 'num'}, rx_int)),

    ('day_numeric', mf(w(r"(11th|12th|13th|[012]?[4-9]th|[123]0th|[0-3]1st|[02]2nd|023rd)"),
                       {'day', 'num'}, rx_int_extra)),

    # Note that regexes are greedy. If there is '07' then '7' alone
    # will be ignored
    ('month', mf(r"(0?[1-9]|1[012])", {'month', 'num'}, rx_int)),

    ('year_4', mf(r"\d{4}", {'year', '4dig', 'num', "ad"}, rx_int)),

    ('year_num', mf(r"\d+\s*(A?\.D?\.)?", {'year', 'adbc', 'num', "ad"},
                    rx_int)),

    ('year_adbc', mf(w(r"\d+\s*(B?\.C?\.)"), {"year", "adbc", "bc"},
                     lambda rxmatch: -rx_int_extra(rxmatch))),

    ('month_name_short', mf(re.compile(r"(%s)" % "|".join(words(MONTH_NAMES_SHORT)), re.I),
                            {"month", "name", "short"}, month_names)),

    ('month_name_long', mf(re.compile(r"(%s)" % "|".join(words(MONTH_NAMES_LONG)), re.I),
                           {"month", "name", "long"}, month_names)),



    # Note that instead of rx or sets you can use a matcher, it will
    # be a dependency

    # Lists
    # July the 14th
    ('dayn_month_date', mf([{'month', 'name'}, r",?\s*(the)?\s+", {'day', 'num'}],
                           {"day_month", "numeric", "date"}, date_tuple)),

    # July the 14th 1991
    ('dayn_month_year_date', mf([{'numeric', 'day_month'}, r"\s+", {"year"}],
                                {"day_month_year", "numeric", "date", "full"},
                                date_tuple)),

    # 14 July 1991
    ('day_month_year_full', mf([{"day"}, r"\s+", {"month", "name"}, r"\s+", {"year"}],
                               { "day_month_year", "date"},
                               date_tuple)),
]

# Short dates
SEPARATORS = [r"", r"/", r"\.", r"\|", r"-"]

matchers += [('dmy_dates_%s' % s,
              mf([{'day', 'num'}, s, {'month', 'num'}, s, {'year', 'num'}],
                 {"date", 'short', 'dmy', "sep_%s"%s}, date_tuple))
             for s in SEPARATORS]

matchers += [("mdy_dates_%s" % s,
              mf([{'month', 'num'}, s, {'day', 'num'}, s, {'year', 'num'}],
                 {"date", 'short', 'mdy', "sep_%s"%s}, date_tuple))
             for s in SEPARATORS]

matchers += [('ymd_dates_%s' % s,
              mf([{'year', 'num'}, s, {'month', 'num'}, s, {'day', 'num'}],
                 {"date", 'short', 'ymd', "sep_%s"%s}, date_tuple))
             for s in SEPARATORS]


def just_dates(text):
    t = OverlayedText(text)
    t.overlay([m for n,m in matchers])

#    pprint([(o.string(), o) for o in t.overlays])
    return [i.value for i in
            longest_overlap(t.get_overlays(props={'date'}))]

if __name__ == "__main__":
    pprint(just_dates("Timestamp: 22071991, well\
    i said i was on July 22 1992 but I lied."))
