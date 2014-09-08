import csv

AM_PEAK_LEN=3.0 #hours, 6am-9am
PM_PEAK_LEN=3.0 #hours 3pm-6pm

ROUTE_ROW=0
CUR_TRIP_PEAK_AM=3
CUR_TRIP_PEAK_PM=4
PROP_TRIP_PEAK_AM=5
PROP_TRIP_PEAK_PM=6
CUR_FREQ_PEAK=7
CUR_FREQ_MIDDAY=8
CUR_FREQ_NIGHT=9
CUR_FREQ_SAT=10
CUR_FREQ_SUN=11
PROP_FREQ_PEAK=12
PROP_FREQ_MIDDAY=13
PROP_FREQ_NIGHT=14
PROP_FREQ_SAT=15
PROP_FREQ_SUN=16


def mean(ary):
	return sum(ary)/float(len(ary))

class ServiceReductionRow(object):
	def __init__(self, row):
		self.data = row

	@property
	def route(self):
		raw = self.data[ROUTE_ROW]
		if raw[-4:]=='DART':
			return raw[:-4]
		elif raw[-2:]=='EX':
			return raw[:-2]
		return raw

	def get_freq_prop(self,col):
		raw = self.data[col].strip()
		if raw=="" or raw=="-":
			return None
		return [int(x) for x in self.data[col].split("-")]

	def get_trip_prop(self,col):
		raw = self.data[col].strip()
		if raw=="" or raw=="-":
			return None
		return int(raw)


	@property
	def cur_freq_peak(self):
		return self.get_freq_prop(CUR_FREQ_PEAK)

	@property
	def cur_freq_midday(self):
		return self.get_freq_prop(CUR_FREQ_MIDDAY)

	@property
	def cur_freq_night(self):
		return self.get_freq_prop(CUR_FREQ_NIGHT)

	@property
	def cur_freq_sat(self):
		return self.get_freq_prop(CUR_FREQ_SAT)

	@property
	def cur_freq_sun(self):
		return self.get_freq_prop(CUR_FREQ_SUN)

	@property
	def cur_trip_peak_am(self):
		return self.get_trip_prop(CUR_TRIP_PEAK_AM)

	@property
	def cur_trip_peak_pm(self):
		return self.get_trip_prop(CUR_TRIP_PEAK_PM)

	@property
	def prop_trip_peak_am(self):
		return self.get_trip_prop(PROP_TRIP_PEAK_AM)

	@property
	def prop_trip_peak_pm(self):
		return self.get_trip_prop(PROP_TRIP_PEAK_PM)

	@property
	def prop_freq_peak(self):
		return self.get_freq_prop(PROP_FREQ_PEAK)

	@property
	def prop_freq_midday(self):
		return self.get_freq_prop(PROP_FREQ_MIDDAY)

	@property
	def prop_freq_night(self):
		return self.get_freq_prop(PROP_FREQ_NIGHT)

	@property
	def prop_freq_sat(self):
		return self.get_freq_prop(PROP_FREQ_SAT)

	@property
	def prop_freq_sun(self):
		return self.get_freq_prop(PROP_FREQ_SUN)

	@property
	def cur_freq_peak_am(self):
		trips = self.cur_trip_peak_am
		if trips is not None:
			return [int(AM_PEAK_LEN*60 / trips)]
		else:
			return self.cur_freq_peak

	@property
	def cur_freq_peak_pm(self):
		trips = self.cur_trip_peak_pm
		if trips is not None:
			return [int(PM_PEAK_LEN*60 / trips)]
		else:
			return self.cur_freq_peak

	@property
	def prop_freq_peak_am(self):
		trips = self.prop_trip_peak_am
		if trips is not None:
			return [int(AM_PEAK_LEN*60 / trips)]
		else:
			return self.prop_freq_peak

	@property
	def prop_freq_peak_pm(self):
		trips = self.prop_trip_peak_pm
		if trips is not None:
			return [int(PM_PEAK_LEN*60 / trips)]
		else:
			return self.prop_freq_peak

	@property
	def change_freq_peak(self):
		return self.get_prop_change(CUR_FREQ_PEAK,PROP_FREQ_PEAK)

	@property
	def change_freq_midday(self):
		return self.get_prop_change(CUR_FREQ_MIDDAY,PROP_FREQ_MIDDAY)

	@property
	def change_freq_night(self):
		return self.get_prop_change(CUR_FREQ_NIGHT,PROP_FREQ_NIGHT)

	@property
	def change_freq_sat(self):
		return self.get_prop_change(CUR_FREQ_SAT,PROP_FREQ_SAT)

	@property
	def change_freq_sun(self):
		return self.get_prop_change(CUR_FREQ_SUN,PROP_FREQ_SUN)

	@property
	def change_freq_peak_am(self):
		before_field = self.cur_freq_peak_am
		after_field = self.prop_freq_peak_am

		return get_perc_change(before_field, after_field)

	@property
	def change_freq_peak_pm(self):
		before_field = self.cur_freq_peak_pm
		after_field = self.prop_freq_peak_pm

		return get_perc_change(before_field, after_field)


	def get_prop_change(self, before_ix, after_ix):
		before_field = self.get_freq_prop(before_ix)
		after_field = self.get_freq_prop(after_ix)

		return get_perc_change(before_field, after_field)

def get_perc_change(before_field, after_field):
	if before_field == None:
		if after_field == None:
			return None
		else:
			return 0

	if after_field == None:
		return float("inf")

	before = mean(before_field)
	after = mean(after_field)

	return after/before

if __name__=='__main__':


	rd = csv.reader(open("service-reduction-summary.csv"))

	header1 = rd.next()
	header2 = rd.next()

	fpout = open("reduce.csv","w")
	fpout.write( "route,peak_am,midday,peak_pm,night,sat,sun\n")
	for row in rd:
		srr = ServiceReductionRow(row)

		fpout.write( "%s,%s,%s,%s,%s,%s,%s\n"%(srr.route, srr.change_freq_peak_am, srr.change_freq_midday, srr.change_freq_peak_pm, srr.change_freq_night, srr.change_freq_sat, srr.change_freq_sun))
