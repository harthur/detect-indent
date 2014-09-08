# -*- coding: utf-8 -*-
"""
Created on Sun Mar 23 21:13:10 2014

@author: fandeb
"""

import os,sys    
# Importar modulo Qt
from PyQt4 import QtCore,QtGui
# Importar el código del modulo compilado UI
from ledUi import Ui_Form
#importamos los iconos
import iconos_rc

# Crear una clase para nuestra ventana principal
class Principal(QtGui.QFrame):
    def __init__(self):
        QtGui.QFrame.__init__(self)
        
        # Esto es siempre igual.
        self.ui=Ui_Form()
        self.ui.setupUi(self)

def main():
    # Nuevamente, esto es estándar, será igual en cada 
    # aplicación que escribas
    app = QtGui.QApplication(sys.argv)
    ventana=Principal()
    ventana.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()