// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

app.controller('loginCtrl', function ($scope,$http) {
    $scope.wrongCredit = false;
    if (0 === localStorage.length) {
        $scope.submit = function () {
            $http({
                method: 'post',
                url: '/api/v1/login',
                data: {
                    user: {
                        name: $scope.email,
                        password: $scope.password
                    }
                }
            }).then(function successCallback(response) {
                $scope.wrongCredit = false;
                localStorage.setItem('token', response.data);
                window.location.href = '/main';
            }, function errorCallback(response) {
                if (401 === response.status) {
                    $scope.wrongCredit = true;
                }
            })
        }
    } else {
        var token = localStorage.getItem('token');
        //verify token
        $http({
            method: 'get',
            url: 'api/v1/folder/0',
            headers: {
                'Authorization': 'Token token='+token
            }
        }).then(function success (response) {
            //token valid
            window.location.href = '/main';
        }, function error(response) {
            localStorage.clear();
        })
    }
});