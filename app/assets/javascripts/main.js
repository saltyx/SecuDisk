// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


app.controller('mainCtrl',function ($scope, $http, Upload) {

    var dstFolderId = -1;
    var dstFolderStack = [];
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

        $scope.encrypt = function (id, isFolder) {
            encrypt(id, isFolder);
        };

        $scope.decrypt = function (id, isFolder) {
            decrypt(id, isFolder);
        };

        $scope.download = function (id) {
            downloadFile(id);
        };

        $scope.share = function (id) {
            share(id);
        };

        $scope.move = function (id) {
            //current file's id
            $http.get('/api/v1/folder/1').then(function (response) {
                if (200 == response.data.success) {
                    dstFolderStack.push(1);
                    dstFolderId = 1;
                    $scope.allFolder = splitFolder(response.data.info);
                } else {
                    alert(response.data.info);
                }
            }, function (response) {
                alert(response.status);
            });
            $("#chooseFolder").modal('setting', 'closable', false)
                .modal({
                    onApprove: function () {
                        $http.put('/api/v1/file/move',{
                            file: {
                                id: id,
                                dst_folder_id: dstFolderId
                            }
                        }).then(function (response) {
                            if (200 === response.data.success) {
                                change(CurrentFolder);
                            } else {
                                alert(response.data.info);
                            }
                        }, function (response) {
                            alert(response.status);
                        });
                    }
                })
                .modal('show');
        };

        $scope.chooseFolder = function (id) {
            //dst folder id
            $http.get('/api/v1/folder/'+id).then(function (response) {
                if (200 == response.data.success) {
                    dstFolderId = id;
                    dstFolderStack.push(id);
                    $scope.allFolder = splitFolder(response.data.info);
                } else {
                    alert(response.data.info);
                }
            }, function (response) {
                alert(response.status);
            });
        };

        $scope.backToChooseFolder = function () {
            if (undefined == dstFolderId || dstFolderStack.length === 1)
                return;
            dstFolderStack.pop();
            dstFolderId = dstFolderStack[dstFolderStack.length-1];
            $http.get('/api/v1/folder/'+dstFolderId).then(function (response) {
                if (200 === response.data.success) {
                    $scope.allFolder = splitFolder(response.data.info);
                } else {
                    alert(response.data.info);
                }
            }, function (response) {
                alert(response.status);
            });
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

        $scope.search = function () {
            if (undefined != $scope.queryText && '' !== $scope.queryText) {
                query($scope.queryText);
            } else {
                change(CurrentFolder);
            }
        };

        $scope.showUploadTasks = function () {
            $('#uploadTasks').modal('show');
        };

    }

    function splitFolder(data) {
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
        return folders;
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
        };
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
               var date = new Date();
               UploadedTasks.push({'filename':$scope.uncheckedFile.name,'time':date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()});
               $scope.allUploadTasks = UploadedTasks;
               $('.ui .progress').progress('reset').progress('set label', '等待上传');
           } else {
               alert(response.data.info);
               $('.ui .progress').progress('set error').progress('set label', '出错');
           }
       }, function (response) {
           alert(response.status);
       }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log(evt.loaded);
           $('.ui .progress').progress('set progress', progressPercentage);
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

    function encrypt(id, isFolder) {
        if (isFolder) {
            $scope.operation = {
                name: '加密文件夹',
                placeholder: '请输入密码，并且记牢此密码！'
            };
        } else {
            $scope.operation = {
                name: '加密文件',
                placeholder: '请输入密码，并且记牢此密码！'
            }
        }
        $('#showDetailedInfo').modal({
            onApprove: function () {
                if (isFolder) {
                    $http({
                        method: 'post',
                        url: 'api/v1/folder/encrypt',
                        data: {
                            folder : {
                                folder_id: id,
                                pass_phrase: $scope.operation.text
                            }
                        }
                    }).then(function (response) {
                        if (200 === response.data.success) {
                            change(CurrentFolder);
                            $scope.feedBackMessage = '操作成功！';
                            $('#feedback').modal('show');
                        } else {
                            alert(response.data.info);
                        }
                    }, function (response) {
                        alert(response.status);
                    })
                } else {
                    $http({
                        method: 'post',
                        url: 'api/v1/file/encrypt',
                        data: {
                            file : {
                                id: id,
                                pass_phrase: $scope.operation.text
                            }
                        }
                    }).then(function (response) {
                        if (200 === response.data.success) {
                            change(CurrentFolder);
                            $scope.feedBackMessage = '操作成功！';
                            $('#feedback').modal('show');
                        } else {
                            alert(response.data.info);
                        }
                    }, function (response) {
                        alert(response.status);
                    })
                }
            }
        }).modal('show');
    }

    function decrypt(id, isFolder) {
        if (isFolder) {
            $scope.operation = {
                name: '解密文件夹',
                placeholder: '请输入密码'
            };
        } else {
            $scope.operation = {
                name: '解密文件',
                placeholder: '请输入密码'
            }
        }
        $('#showDetailedInfo').modal({
            onApprove: function () {
                if (isFolder) {
                    $http({
                        method: 'post',
                        url: 'api/v1/folder/decrypt',
                        data: {
                            folder : {
                                folder_id: id,
                                pass_phrase: $scope.operation.text
                            }
                        }
                    }).then(function (response) {
                        if (200 === response.data.success) {
                            change(CurrentFolder);
                            $scope.feedBackMessage = '操作成功！';
                            $('#feedback').modal('show');
                        } else {
                            alert(response.data.info);
                        }
                    }, function (response) {
                        alert(response.status);
                    })
                } else {
                    $http({
                        method: 'post',
                        url: 'api/v1/file/decrypt',
                        data: {
                            file : {
                                id: id,
                                pass_phrase: $scope.operation.text
                            }
                        }
                    }).then(function (response) {
                        if (200 === response.data.success) {
                            change(CurrentFolder);
                            $scope.feedBackMessage = '操作成功！';
                            $('#feedback').modal('show');
                        } else {
                            alert(response.data.info);
                        }
                    }, function (response) {
                        alert(response.status);
                    })
                }
            }
        }).modal('show');
    }

    function share(id) {
        $http({
            method: 'post',
            url: 'api/v1/file/share',
            data: {
                file: {
                    id: id
                }
            }
        }).then(function (response) {
            if (200 === response.data.success) {
                change(CurrentFolder);
                $scope.feedBackMessage = "已分享，立刻点击下载吧！";
                $scope.feedBackMessage1 = "api/v1/shared/"+id;
                $('#feedback').modal('show');
            } else {
                alert(response.data.info);
            }
        }, function (response) {
            alert(response.status);
        })
    }

});