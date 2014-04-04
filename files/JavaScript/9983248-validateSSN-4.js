myapp.directive('validateSsn', function () {
    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            $ngModel.$parsers.unshift(function (value) {

                if (!$ngModel.$isEmpty(value) && value.length === 10) {
                    var checkNr = [3, 2, 7, 6, 5, 4, 3, 2];
                    var kt = value.split('').map(function (num) {
                        return parseInt(num,10);
                    });
                    var num = 0;
                    for (var i = 0; i < 8; ++i) {
                        num += kt[i] * checkNr[i];
                    }
                    var checkNum = 11 - (num % 11);

                    if (kt[8] === checkNum) {
                        $ngModel.$setValidity('ssn', true);
                        return value;
                    }
                    else {
                        $ngModel.$setValidity('ssn', false);
                        return undefined;
                    }
                }
            });

        }
    };
});