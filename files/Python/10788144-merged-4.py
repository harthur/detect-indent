# -*- coding: utf-8 -*-
import copy
from pprint import pprint

old = {'hw':
           {
               'b1': 'a'
           },
       't1': 1,
       'all boards':
           {
               'type': 'P3041DS',
               'hw_option': 'RR_HXAPNRP_0x33',
               'uboot': {
                   'img_path': 'b40869/sanity-image/p3041ds',
                   'img_uboot': 'b40869/sanity-image/p3041ds/u-boot-P3041DS.bin',
                   'img_rcw': 'b40869/sanity-image/p3041ds/rcw/RR_HXAPNRP_0x33/rcw_12g_1500mhz.bin',
                   'img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.1_106_1_9.bin',
                   '#1_img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.0_106_1_9.bin',
                   '#2_img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r2.0_106_1_9.bin',
                   'img_hw_dt': 'b40869/sanity-image/p3041ds/uImage-p3041ds.dtb',
                   'img_linux': 'b40869/sanity-image/p3041ds/uImage.ppce500mc-custom',
                   'img_rootfs': 'b40869/sanity-image/p3041ds/fsl-image-custom-ppce500mc.ext2.gz.u-boot',
                   'img_jf2': 'b40869/sanity-image/p3041ds/fsl-image-minimal-p3041ds.jffs2',
                   'img_rootfs_full': 'b40869/sanity-image/p3041ds/fsl-image-full-p3041ds.tar.gz',
                   'img_hv': 'b40869/sanity-image/p3041ds/hv/hv.uImage',
                   'img_hv_cfg': 'b40869/sanity-image/p3041ds/hv-cfg/NR_HXAPNSP_0x36/hv-2p-lnx-lnx.dtb'
               }
           }
}

new = {'hw':
           {
               'b1': 'b'
           },
       't2': 1,
       'all boards':
           {
               'type': 'P3041DS',
               'serdes': 'RR_HXAPNRP_0x33',
               'uboot': {
                   'img_path': 'b40869/sanity-image/p3041ds',
                   'img_uboot': 'b40869/sanity-image/p3041ds/u-boot-P3041DS.bin',
                   'img_rcw': 'b40869/sanity-image/p3041ds/rcw/RR_HXAPNRP_0x33/rcw_12g_1500mhz.bin',
                   'img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.1_106_1_8.bin',
                   '#1_img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.0_106_1_9.bin',
                   '#2_img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r2.0_106_1_9.bin',
                   'img_hw_dt': 'b40869/sanity-image/p3041ds/uImage-p3041ds.dtb',
                   'img_rootfs': 'b40869/sanity-image/p3041ds/fsl-image-custom-ppce500mc.ext2.gz.u-boot',
                   'img_rootfs_full': 'b40869/sanity-image/p3041ds/fsl-image-full-p3041ds.tar.gz',
                   'img_hv': 'b40869/sanity-image/p3041ds/hv/hv.uImage',
                   'img_hv_cfg': 'b40869/sanity-image/p3041ds/hv-cfg/NR_HXAPNSP_0x36/hv-2p-lnx-lnx.dtb'
               }
           }
}

third = {'hw':
             {
                 'b1': 'a'
             },
         'all boards':
             {
                 'type': 'P3041DS',
                 'hw_option': 'RR_HXAPNRP_0x33',
                 'uboot': {
                     'img_uboot': 'b40869/sanity-image/p3041ds/u-boot-P3041DS.bin',
                     'img_rcw': 'b40869/sanity-image/p3041ds/rcw/rcw_12g_1500mhz.bin',
                     'img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.1_106_1_9.bin',
                     '#1_img_fman_mc': 'b40869/sanity-image/p3041ds/fsl_fman_ucode_p3041_r1.0_106_1_9.bin',
                     'img_hw_dt': 'b40869/sanity-image/p3041ds/uImage-p3041ds.dtb',
                     'img_linux': 'b40869/sanity-image/p3041ds/uImage.ppce500mc-custom',
                     'img_rootfs': 'b40869/sanity-image/p3041ds/fsl-image-custom-ppce500mc.ext2.gz.u-boot',
                     'img_jf2': 'b40869/sanity-image/p3041ds/fsl-image-minimal-p3041ds.jffs2',
                     'img_rootfs_full': 'b40869/sanity-image/p3041ds/fsl-full-p3041ds.tar.gz',
                     'img_hv': 'b40869/sanity-image/p3041ds/hv/hv.uImage',
                     'img_hv_cfg': 'b40869/sanity-image/p3041ds/hv-cfg/NR_HXAPNSP_0x36/hv-2p-lnx-lnx.dtb'
                 }
             }
}


def get_v(dic, keys):
    return reduce(dict.__getitem__, keys, dic)


def del_k(dic, keys):
    if len(keys) == 1:
        del dic[keys[0]]
    else:
        p = get_v(dic, keys[:-1])
        del p[keys[-1]]


def update_k(dic, keys, value):
    for key in keys[:-1]:
        dic = dic.setdefault(key, {})
    dic[keys[-1]] = value


class Diff(object):
    def __init__(self, new, old):
        self.new = new
        self.old = old
        self._newc = copy.deepcopy(new)
        self._oldc = copy.deepcopy(old)

    @classmethod
    def c(cls, new, old):
        diff = cls(new, old)

        def _(self, d, path=[]):
            if isinstance(d, dict):
                for k in d:
                    path.append(k)
                    _(self, d[k], path)
                    del path[-1]
            else:
                try:
                    v = get_v(self.old, path)
                    del_k(self._oldc, path)
                    if v == d:
                        del_k(self._newc, path)
                except KeyError:
                    pass

        _(diff, diff.new)

        return diff._newc, diff._oldc


class Merge(object):
    def __init__(self, origin):
        self.origin = origin
        self._originc = copy.deepcopy(origin)

    def delete(self, d):
        def _(self, d, path=[]):
            if isinstance(d, dict):
                for k in d:
                    path.append(k)
                    _(self, d[k], path)
                    del path[-1]
            else:
                try:
                    del_k(self._originc, path)
                except KeyError:
                    pass

        _(self, d)
        return self._originc

    def update(self, d):
        def _(self, d, path=[]):
            if isinstance(d, dict):
                for k in d:
                    path.append(k)
                    _(self, d[k], path)
                    del path[-1]
            else:
                try:
                    update_k(self._originc, path, d)
                except KeyError:
                    pass

        _(self, d)
        return self._originc


newx, oldx = Diff.c(new, old)
pprint(oldx)
pprint(newx)

merge = Merge(third)
pprint(merge.delete(oldx))
pprint(merge.update(newx))
