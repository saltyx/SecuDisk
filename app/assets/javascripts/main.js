// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


app.controller('mainCtrl',function ($scope, $http, Upload) {
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
            $('#uploadFile').modal({
                onApprove: function () {
                    uploadUncheckedFile();
                }
            }).modal('show');
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
        $scope.renameFolder = function (id) {
            renameFolder(id);
        };

        $scope.editFolder = function (id) {
            getFolderDetail(id);
            $('#chooseFolderSetting').modal('show');
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

        //rename file
        $scope.renameFile = function (id) {
            renameFile(id);
        };

        //edit file
        $scope.editFile = function (id) {
            console.log("[edit file]"+id);
            getFileDetail(id);
            $('#chooseFileSetting').modal('show');
        };

        $scope.download = function (id) {
            downloadFile(id);
        };

        //logout
        $scope.logout = function () {
            localStorage.clear();
            window.location.href = '/login';
        };

        $scope.changeFolder = function (id, fileName) {
            change(id);
            $scope.navFolders.push({name: fileName, id: id});
        };

        $scope.showUploadTasks = function () {
            $('.sidebar').sidebar('setting', 'transition', 'overlay')
                .sidebar('toggle');
        };
        
        $scope.search = function () {
            if (undefined != $scope.queryText && '' !== $scope.queryText) {
                query($scope.queryText);
            } else {
                change(CurrentFolder);
            }
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
            $scope.folder = angular.fromJson(response.data.info);

        }, function error(response) {
            alert(response.status);
        })
    }

    function getFileDetail(id) {
        $http({
            method: 'get',
            url: 'api/v1/file/info/' + id
        }).then(function success(response) {
            if (200 == response.data.success) {
                $scope.file = angular.fromJson(response.data.info);
            }
        }, function error(response) {
            alert(response.status);
        })
    }

    function renameFolder(id) {
        rename(id, 'api/v1/folder/update',true);
    }

    function renameFile(id) {
        rename(id, 'api/v1/file/update',false);
    }

    function rename(id, url, isFolder) {
        $scope.operation = {
            name: '重命名',
            placeholder: '输入新名称......'
        }
        $('#showDetailedInfo').modal({
            onApprove: function () {
                if (isFolder) {
                    $http({
                        method: 'put',
                        url: url,
                        data: {
                            folder: {
                                new_name: $scope.operation.text,
                                folder_id: id
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
                } else {
                    $http({
                        method: 'put',
                        url: url,
                        data: {
                            file: {
                                new_name: $scope.operation.text,
                                id: id
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
            }
        }).modal('show');
    }

    function downloadFile(id) {
        $http({
            method: 'get',
            url: 'api/v1/file/' + id
        }).then(function success(response) {
            var blob = new Blob([response]);
            var objectUrl = URL.createObjectURL(blob);
            saveAs(blob, $scope.file.file_name);
        }, function error(response) {
            alert(response.status);
        })
    }

    function uploadUncheckedFile() {
       Upload.upload({
           url: 'api/v1/upload/'+CurrentFolder,
           method: 'post',
           data: {
               filename: $scope.uncheckedFile.name,
               filesize: $scope.uncheckedFile.size
           },
           file: $scope.uncheckedFile
       }).then(function (response) {
           if (200 === response.data.success) {
               change(CurrentFolder);
           } else {
               alert(response.data.info);
           }
       }, function (response) {
           alert(response.status);
       }, function (evt) {
           console.log('[progress]'+evt.loaded);
       })
    }

    function query(queryText) {
        $http({
            method: 'get',
            url: 'api/v1/search/'+queryText
        }).then(function (response) {
            if (200 === response.data.success) {
                refresh(response.data.info);
            } else {
                alert(response.data.info);
            }
        }, function (response) {
            alert(response.status);
        });
    }
});