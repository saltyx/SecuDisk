/**
 * Created by shiya on 2017/4/22.
 */


app = angular.module('myApp',['ngFileUpload']);

app.run(function ($http) {
    console.log('module.run');
    var token = localStorage.getItem('token');
    if (token != undefined && token != null) {
        $http.defaults.headers.common.Authorization = 'Token token=' + localStorage.getItem('token');
    }
});

var CurrentFolder = 1;
var UploadTasks = [];