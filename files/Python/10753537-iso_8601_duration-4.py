

class PeriodicInterval(object):
    """
    :see: http://en.wikipedia.org/wiki/Iso8601#Durations
    """
    def __init__(self, second=None, minute=None, hour=None, day=None, week=None, month=None, year=None):
        """
        :param second:
        :param minute:
        :param hour:
        :param day:
        :param week:
        :param month:
        :param year:
        :return:
        """
        self.second = second
        self.minute = minute
        self.hour = hour
        self.day = day
        self.week = week
        self.month = month
        self.year = year

    def __repr__(self):
        return unicode(self.__str__())

    def __str__(self):
        result = "P"
        if self.year is not None:
            result = "%s%sY" % (result, self.year)
        if self.month is not None:
            result = "%s%sM" % (result, self.month)
        if self.day is not None:
            result = "%s%sD" % (result, self.day)
        if self.second or self.hour or self.minute is not None:
            result = "%sT" % result
            if self.hour is not None:
                result = "%s%sH" % (result, self.hour)
            if self.minute is not None:
                result = "%s%sM" % (result, self.minute)
            if self.second is not None:
                result = "%s%sS" % (result, self.second)
        return result
