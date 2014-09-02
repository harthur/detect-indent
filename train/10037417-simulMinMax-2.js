  function defaultMaxFunc(a, b) { return a > b; }
  function simulMinMax(arr, maxFunc) {
    // Comparator should return
    maxFunc = maxFunc || defaultMaxFunc;

    var min, max;
    // if odd number of elements
    if (arr.length & 1) {
      min = max = arr.pop();
    } else {
      min = max = arr[0];
    }

    for (var i = 0; i < arr.length; i += 2) {
      var first = arr[i];
      var second = arr[i+1];

      var firstIsMax = maxFunc(first, second);
      if (firstIsMax) {
        if (maxFunc(first, max)) max = first;
        if (maxFunc(min, second)) min = second;
      } else {
        if (maxFunc(second, max)) max = second;
        if (maxFunc(min, first)) min = first;
      }
    }

    return [min, max];
  }

  console.log(simulMinMax([11,3,9,1,2]));
  console.log(simulMinMax([2,3,5,7]));