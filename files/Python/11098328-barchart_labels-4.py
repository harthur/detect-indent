# adapted from http://matplotlib.org/examples/api/barchart_demo.html
def autolabel(rects):
    max_height = max([rect.get_height() for rect in rects if hasattr(rect,'get_height') and not np.isnan(rect.get_height())])
    for rect in rects:
        if hasattr(rect,'get_height'):
            height = rect.get_height()
            if not np.isnan(height):
                ax.text(rect.get_x()+rect.get_width()/2., height-.1*max_height, '%d'%int(height),
                ha='center', va='bottom',color='w')