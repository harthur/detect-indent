function retryUntilTrue(callback) {
    if (!callback()) {
        var stop = $interval(function () {
            if (callback()) {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }
        }, 200);
    }
}
