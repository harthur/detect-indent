# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'led.ui'
#
# Created: Thu Mar 27 16:58:45 2014
#      by: PyQt4 UI code generator 4.9.3
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

try:
    _fromUtf8 = QtCore.QString.fromUtf8
except AttributeError:
    _fromUtf8 = lambda s: s

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName(_fromUtf8("Form"))
        Form.resize(254, 126)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(_fromUtf8(":/led.svg")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        Form.setWindowIcon(icon)
        self.layoutWidget = QtGui.QWidget(Form)
        self.layoutWidget.setGeometry(QtCore.QRect(0, 0, 251, 122))
        self.layoutWidget.setObjectName(_fromUtf8("layoutWidget"))
        self.gridLayout = QtGui.QGridLayout(self.layoutWidget)
        self.gridLayout.setMargin(0)
        self.gridLayout.setObjectName(_fromUtf8("gridLayout"))
        self.verticalLayout_3 = QtGui.QVBoxLayout()
        self.verticalLayout_3.setObjectName(_fromUtf8("verticalLayout_3"))
        self.kled_1 = KLed(self.layoutWidget)
        self.kled_1.setState(KLed.Off)
        self.kled_1.setObjectName(_fromUtf8("kled_1"))
        self.verticalLayout_3.addWidget(self.kled_1)
        self.kled_2 = KLed(self.layoutWidget)
        self.kled_2.setState(KLed.Off)
        self.kled_2.setObjectName(_fromUtf8("kled_2"))
        self.verticalLayout_3.addWidget(self.kled_2)
        self.kled_3 = KLed(self.layoutWidget)
        self.kled_3.setState(KLed.Off)
        self.kled_3.setObjectName(_fromUtf8("kled_3"))
        self.verticalLayout_3.addWidget(self.kled_3)
        self.gridLayout.addLayout(self.verticalLayout_3, 0, 2, 1, 1)
        self.verticalLayout_4 = QtGui.QVBoxLayout()
        self.verticalLayout_4.setObjectName(_fromUtf8("verticalLayout_4"))
        self.label = QtGui.QLabel(self.layoutWidget)
        self.label.setObjectName(_fromUtf8("label"))
        self.verticalLayout_4.addWidget(self.label)
        self.label_2 = QtGui.QLabel(self.layoutWidget)
        self.label_2.setObjectName(_fromUtf8("label_2"))
        self.verticalLayout_4.addWidget(self.label_2)
        self.label_3 = QtGui.QLabel(self.layoutWidget)
        self.label_3.setObjectName(_fromUtf8("label_3"))
        self.verticalLayout_4.addWidget(self.label_3)
        self.gridLayout.addLayout(self.verticalLayout_4, 0, 1, 1, 1)
        self.verticalLayout_2 = QtGui.QVBoxLayout()
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.boton_led1 = QtGui.QPushButton(self.layoutWidget)
        self.boton_led1.setEnabled(False)
        icon1 = QtGui.QIcon()
        icon1.addPixmap(QtGui.QPixmap(_fromUtf8(":/ok.svg")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.boton_led1.setIcon(icon1)
        self.boton_led1.setObjectName(_fromUtf8("boton_led1"))
        self.verticalLayout_2.addWidget(self.boton_led1)
        self.boton_led2 = QtGui.QPushButton(self.layoutWidget)
        self.boton_led2.setEnabled(False)
        self.boton_led2.setIcon(icon1)
        self.boton_led2.setObjectName(_fromUtf8("boton_led2"))
        self.verticalLayout_2.addWidget(self.boton_led2)
        self.boton_led3 = QtGui.QPushButton(self.layoutWidget)
        self.boton_led3.setEnabled(False)
        self.boton_led3.setIcon(icon1)
        self.boton_led3.setObjectName(_fromUtf8("boton_led3"))
        self.verticalLayout_2.addWidget(self.boton_led3)
        self.gridLayout.addLayout(self.verticalLayout_2, 0, 0, 1, 1)
        spacerItem = QtGui.QSpacerItem(20, 40, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Expanding)
        self.gridLayout.addItem(spacerItem, 1, 0, 1, 1)
        self.horizontalLayout = QtGui.QHBoxLayout()
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.boton_salir = QtGui.QPushButton(self.layoutWidget)
        icon2 = QtGui.QIcon()
        icon2.addPixmap(QtGui.QPixmap(_fromUtf8(":/exit.svg")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.boton_salir.setIcon(icon2)
        self.boton_salir.setObjectName(_fromUtf8("boton_salir"))
        self.horizontalLayout.addWidget(self.boton_salir)
        self.boton_iniciar = QtGui.QPushButton(self.layoutWidget)
        icon3 = QtGui.QIcon()
        icon3.addPixmap(QtGui.QPixmap(_fromUtf8(":/conectar.svg")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.boton_iniciar.setIcon(icon3)
        self.boton_iniciar.setObjectName(_fromUtf8("boton_iniciar"))
        self.horizontalLayout.addWidget(self.boton_iniciar)
        self.gridLayout.addLayout(self.horizontalLayout, 2, 0, 1, 3)

        self.retranslateUi(Form)
        QtCore.QObject.connect(self.boton_salir, QtCore.SIGNAL(_fromUtf8("clicked()")), Form.close)
        QtCore.QMetaObject.connectSlotsByName(Form)
        Form.setTabOrder(self.boton_led1, self.boton_led2)
        Form.setTabOrder(self.boton_led2, self.boton_led3)
        Form.setTabOrder(self.boton_led3, self.boton_iniciar)
        Form.setTabOrder(self.boton_iniciar, self.boton_salir)

    def retranslateUi(self, Form):
        Form.setWindowTitle(QtGui.QApplication.translate("Form", "Conexión pinguino ", None, QtGui.QApplication.UnicodeUTF8))
        self.label.setText(QtGui.QApplication.translate("Form", "Led 1:", None, QtGui.QApplication.UnicodeUTF8))
        self.label_2.setText(QtGui.QApplication.translate("Form", "Led 2:", None, QtGui.QApplication.UnicodeUTF8))
        self.label_3.setText(QtGui.QApplication.translate("Form", "Led 3:", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led1.setToolTip(QtGui.QApplication.translate("Form", "<html><head/><body><p>Cambia el estado de el <span style=\" font-weight:600;\">led 1</span><span style=\" font-style:italic;\">[Off/On]</span>, en la placa pinguino y en la aplicacion.</p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led1.setText(QtGui.QApplication.translate("Form", "On", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led2.setToolTip(QtGui.QApplication.translate("Form", "<html><head/><body><p>Cambia el estado de el <span style=\" font-weight:600;\">led 2</span><span style=\" font-style:italic;\">[Off/On]</span>, en la placa pinguino y en la aplicacion.</p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led2.setText(QtGui.QApplication.translate("Form", "On", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led3.setToolTip(QtGui.QApplication.translate("Form", "<html><head/><body><p>Cambia el estado de el <span style=\" font-weight:600;\">led 3</span><span style=\" font-style:italic;\">[Off/On]</span>, en la placa pinguino y en la aplicacion.</p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_led3.setText(QtGui.QApplication.translate("Form", "On", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_salir.setToolTip(QtGui.QApplication.translate("Form", "<html><head/><body><p>Cierra correctamente la conexión con el pinguino y termina la aplicacion.</p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_salir.setText(QtGui.QApplication.translate("Form", "Salir", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_iniciar.setToolTip(QtGui.QApplication.translate("Form", "<html><head/><body><p>Da inicio a la <span style=\" font-weight:600;\">conexión</span> con el pinguino.</p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.boton_iniciar.setText(QtGui.QApplication.translate("Form", "&Iniciar", None, QtGui.QApplication.UnicodeUTF8))

from PyKDE4.kdeui import KLed
import iconos_rc
