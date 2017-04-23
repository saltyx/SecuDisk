// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


app.controller('mainCtrl',function ($scope, $http) {
    if (0 === localStorage.length) {
        window.location.href = '/login';
    } else {
        change(1);

        $scope.navFolders = [];
        $scope.navFolders.push({name: 'Root'});

        //create new folder
        $scope.createFolder = function () {
            $('.ui.modal').modal({
                onApprove: function () {
                    createFolder($scope.newFolderName);
                }
            }).modal('show');

        };

        //upload file
        $scope.uploadFile = function () {

        };

        //logout
        $scope.logout = function () {
            localStorage.clear();
            window.location.href = '/login';
        }

        $scope.changeFolder = function (id, fileName) {
            change(id);
            $scope.navFolders.push({name: fileName});
        }

    }

    function refresh(data) {
        var allData = angular.fromJson(data);
        var folders = [];
        var files = [];
        angular.forEach(allData, function (value, key) {
            if (true === value.is_folder) {
                folders.push(value);
            } else {
                files.push(value);
            }
        });
        $scope.folders = folders;
        $scope.files = files;
    }

    function change(id) {
        $http({
            method: 'get',
            url: 'api/v1/folder/'+id
        }).then(function success(response) {
            refresh(response.data.info);
            CurrentFolder = id;
        }, function error(response) {
            window.location.href = '/main'
        });
    }

    function createFolder(name) {
        $http({
            method: 'post',
            url: 'api/v1/folder/create',
            data: {
                folder: {
                    folder_name: name,
                    from_folder: CurrentFolder
                }
            }
        }).then(function success() {
            console.log(CurrentFolder);
            change(CurrentFolder);
        }, function error(response) {
            alert(response.status);
        })
    }
});