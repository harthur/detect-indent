'''
Created on Apr 6, 2014

@author: Ivan
'''
import numpy as np;
#from pylab import *
import cv2
from matplotlib import pylab

def svd_fit(x,y,n,d=1,debug=False):
    
    
    # choose appropriate approximation
    if (d==1):
        A=np.asarray([np.ones(n), x]).T;
        g=lambda x: np.asarray([ 1, x ]);
    elif(d==2):
        A=np.asarray([np.ones(n), x, x**2]).T;
        g=lambda x: np.asarray([ 1, x , x**2]);
    elif(d==3):
        A=np.asarray([np.ones(n), x, x**2,x**3]).T;
        g=lambda x: np.asarray([ 1, x , x**2, x**3]);
    elif(d==4):
        A=np.asarray([np.ones(n), x, x**2,x**3 , x**4]).T;
        g=lambda x: np.asarray([ 1, x , x**2, x**3,x**4]);
    elif(d==5):
        A=np.asarray([np.ones(n), x, x**2,x**3,x**4,x**5]).T;
        g=lambda x: np.asarray([ 1, x , x**2, x**3,x**4,x**5]);
    
    (U,s,V)=np.linalg.svd(A,full_matrices=True);

    a_hat=np.zeros(d+1);
    V=V.T;
    for i in range(0,d+1):
        a_hat=a_hat+(np.dot(U[:,i],y)/s[i])*V[:,i];

    return (a_hat,g);


def example_function_fit(d=5):
    # dimension of the data to be generated
    n=1000;
    
    # degree of the polynomial used to fit
    np.set_printoptions(suppress=True);
   
    x=np.linspace(-5,5, n);

    # noise level
    noiseMagnitue_y=1;
    # add noise
    
    # function to use for fitting
    f=lambda x: np.sin(x);
    y_real=f(x);
    y=y_real+(np.random.random(n)-0.5)*noiseMagnitue_y;
    
    # plot
    pylab.plot();
    pylab.scatter(x,y);
    p_gt,=pylab.plot(x,y_real,color='gray',lw=3);

    n_test=1000;
    x_test=np.linspace(-5, 5, n_test);    
    
    # calculate svd fit and use it for prediction
    (a_hat,g)=svd_fit(x,y,n,d);
    print "Coefficients: ",a_hat;
    f_predict=lambda z: np.dot(g(z),a_hat);
    y_test=np.zeros(n_test);
    for i in range (0,n_test): 
        y_test[i]=f_predict(x_test[i]);

    p_fit,=pylab.plot(x_test,y_test,color='red',lw=3);
    
    legend_str="Fit d="+str(d);
    pylab.legend([p_gt, p_fit], ["Ground truth",legend_str])
    pylab.show()
    
    
if __name__ == '__main__':
    example_function_fit(5)
    
    