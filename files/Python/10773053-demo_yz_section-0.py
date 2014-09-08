import netCDF4
import numpy
import matplotlib.pyplot as plt

rootDir = '/archive/bls/tikal_201403_mom6_2014.04.03/MOM6z_SIS_025_PPMh4/gfdl.ncrc2-intel-prod/'
# Read nominal longitudes (to find the section)
xh = netCDF4.Dataset(rootDir+'history/unpack/19300101.ocean_annual.nc').variables['xh'][:]
# Find the index of longitude=-30.0
iSect = numpy.abs(xh + 30.0).argmin()

# Nominal latitudes
y = netCDF4.Dataset(rootDir+'history/unpack/19300101.ocean_annual.nc').variables['yh'][:]
# Temperature data
T = netCDF4.Dataset(rootDir+'history/unpack/19300101.ocean_annual.nc').variables['temp'][0,:,:,iSect]
# Elevation data
z = netCDF4.Dataset(rootDir+'history/unpack/19300101.ocean_annual.nc').variables['e'][0,:,:,iSect]

plt.pcolormesh( y, z, T); plt.colorbar(); plt.show()