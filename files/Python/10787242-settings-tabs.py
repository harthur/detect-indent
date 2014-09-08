import os
import imp
import time

# DEFAULTS

outputDataDir = os.path.join(os.path.normpath(os.path.expanduser("~/kauferdata")),
		"trial" + time.strftime("%y%m%d%H%M%S"))

config = {

		'audioActive' : True,
		'guiActive' : True,
		'stimulatorActive' : True,
		'trackerActive' : True,
		'csvOutFilepath' : os.path.join(outputDataDir, 'track.csv'),

		'audio': {
			'numChannels': 1, # Number of microphones to be used. Can be 0, 1, or 2
			'perChannelSampleThreshold': 1000,
			'ramBufferSize': 1000*1000, #  perChannelSampleThreshold * 1000
			'sampleRate' : 100000.0,
			'daqDeviceName' : "Dev2"
			},

		'video': {
			'videoOutFilepath': os.path.join(outputDataDir, 'track.avi'),
			'videoFrameRate': 25.0,
			'videoFrameSize': (640,480)
			},

		'stimulator': {
			'channel' : 1,
			'initialParadigm' : 'default',
			'paradigms' : {
				"default" : {
					"mode" : "TRAIN",
					"pulse_duration" : 20,
					"inter_pulse_interval" : 20,
					"number_of_pulses" : 20,
					"inter_train_interval" : 20,
					}
				}
			},

		'gui' : {
			'sidebarWidth' : 300,
			'sidebarTextFieldSize' : 20
			}
		}

# LOAD CONFIG FILE
# All defaults are be overwritten by anything defined in the config file
# TODO a deep merge wolud be useful here
configPath = os.path.normpath(os.path.expanduser("~/.kauferprosocialrc"))
if os.path.exists(configPath):
	localConfig = imp.load_source('localConfig', configPath)
	config['audio'].update(localConfig.config['audio'])
	config['video'].update(localConfig.config['video'])
	config['stimulator'].update(localConfig.config['stimulator'])
	config['gui'].update(localConfig.config['gui'])


# TODO necessary?
 # Determines the tolerance to be used in thresholding the roi image in
 # defs.py. Larger tolerance values lead to more white pixels
videoTimestep = 1/ videoFrameRate
timestep = 1 / sampleRate
tolerance = 30
recordingTime = 300
numberOfAudioSamples = sampleRate * recordingTime
channelNames = map(lambda x: DEVICE_NAME + '/' + x, ["ai0", "ai2"])

os.makedirs(os.path.join(outputDataDir, 'audio'))