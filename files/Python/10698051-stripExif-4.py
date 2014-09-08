# Modifed code from https://dpk.net/2013/02/21/simple-python-script-to-strip-exif-data-from-a-jpeg/
# to support python 3 and add some usability

import os
import struct
import sys

def stripExif(image):
    # http://www.media.mit.edu/pia/Research/deepview/exif.html
    # Read the jpeg blocks, remove APP1 (FFE1..)
 
    begin_exif = image.find(b'\xff\xe1')
    if begin_exif >= 0:
        # JPEG header (FFD8) and anything between FFD8 and FFE1
        # needs to be preserved.
        ret = image[0:begin_exif]
 
        # Two bytes after FFE1 is the size of APP1.
        exif_size = struct.unpack('>H', image[begin_exif+2:begin_exif+4])[0]
 
        # Skip exif_size bytes plus 2 bytes (for the size itself).
        ret += image[begin_exif+exif_size+2:]
 
        # All done.
        return ret
 
    # No EXIF. Just return it.
    return image

def main(jpgs):
    for jpg in jpgs:
        if jpg.endswith('.jpg') and os.path.isfile(jpg):
            with open(jpg, 'rb') as f:
                image = f.read()
                with open(jpg + '.noexif.jpg', 'wb') as output:
                    output.write(stripExif(image))

if __name__ == '__main__':
    main(sys.argv[1:])
