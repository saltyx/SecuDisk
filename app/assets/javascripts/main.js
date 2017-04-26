// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


app.controller('mainCtrl',function ($scope, $http) {
    if (0 === localStorage.length) {
        window.location.href = '/login';
    } else {
        change(1);

        $scope.navFolders = [];
        $scope.navFolders.push({name: 'Root', id: 1});
        //create new folder
        $scope.createFolder = function () {
            $('#createFolderModel').modal({
                onApprove: function () {
                    createFolder($scope.newFolderName);
                }
            }).modal('show');

        };

        //upload file
        $scope.uploadFile = function () {

        };

        //delete folder
        $scope.deleteFolder = function (id) {
            $('#confirmDeleteAction').modal({
                onApprove: function () {
                    deleteFolder(id);
                }
            }).modal('show');

        };

        //edit folder
        $scope.editFolder = function (id) {
            getFolderDetail(id);
        };

        $scope.deleteFile = function (id) {
            $('#confirmDeleteFileAction').modal({
                onApprove: function () {
                    deleteFile(id);
                }
            }).modal('show');
        };

        //navigator for folder
        $scope.navFolder = function (id, index) {
            if (id === CurrentFolder) return;
            $scope.navFolders.splice(index+1);
            change(id);
        };

        //logout
        $scope.logout = function () {
            localStorage.clear();
            window.location.href = '/login';
        };

        $scope.changeFolder = function (id, fileName) {
            change(id);
            $scope.navFolders.push({name: fileName, id: id});
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
        }).then(function success(response) {
            if (200 === response.data.success) {
                change(CurrentFolder);
            } else {
                alert(response.data.info);
            }

        }, function error(response) {
            alert(response.status);
        })
    }

    function deleteFolder(id) {
        $http({
            method: 'delete',
            url: 'api/v1/folder/delete',
            data: {
                folder: {
                    folder_id: id
                }
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            if (200 === response.data.success) {
                change(CurrentFolder);
            } else {
                alert(response.data.info);
            }
        }, function error(response) {
            alert(response.status);
        })
    }

    function deleteFile(id) {
        $http({
            method: 'delete',
            url: 'api/v1/file/delete',
            data: {
                file: {
                    id : id
                }
            },
            headers : {
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            if (200 === response.data.success) {
                change(CurrentFolder);
            } else {
                alert(response.data.info);
            }
        }, function error(response) {
            alert(response.status);
        });
    }

    function getFolderDetail(id) {
        $http({
            method: 'get',
            url: 'api/v1/folder/info/' + id
        }).then(function success(response) {
            $scope.detailedInfo = angular.fromJson(response.data.info);
            $('#showDetailedInfo').modal({
                onApprove: function () {

                }
            }).modal('show');
        }, function error(response) {
            alert(response.status);
        })
    }
});