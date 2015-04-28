var app = angular.module('nhapfile', ['ngAnimate', 'toaster', 'angularFileUpload'])
.controller('nhapFileCtrl', function ($scope, $upload, toaster) {
    $scope.data = null;
    $scope.nhapDiemEnable = false;
    $scope.fileEnable = false;
    $scope.textBoxEnable = false;

    $scope.colMasv = -1;
    $scope.colCC = -1;
    $scope.colKT = -1;
    $scope.colThi = -1;
    $scope.onFileSelect = function ($files) {
        if ($scope.colMasv < 0) {
            toaster.pop('warning', '', 'Ph?i ch?n v? trí các c?t tr??c khi g?i file ?i?m.');
        }
        else {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/upload', 
                    data: { colMasv: $scope.colMasv, colCC: $scope.colCC, colKT: $scope.colKT, colThi: $scope.colThi },
                    file: file
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    
                    $scope.data = data;
                    $scope.nhapDiemEnable = true;
                    $scope.textBoxEnable = true;
                });
            }
        }
    }
    
    $scope.nhapdiem = function () {
        if ($scope.data == null || $scope.data.length == 0) {
            $scope.data = null;
            $scope.flag = true;
            toaster.pop('warning', '', 'B?n ch?a nh?p file ?i?m ho?c file ?i?m b? l?i.');
        } else {
            if ($scope.colMasv < 0) { 
                toaster.pop('warning', '', 'V? trí c?t mã sinh viên không ?úng!');
            } else {
                var t = window.frames["vnua"].contentDocument.getElementById('ctl00_ContentPlaceHolder1_ctl00_grdNhapDiem');
                if (t == null || t.firstElementChild == null) {
                    toaster.pop('warning', '', 'Hãy ??ng nh?p vào website phòng ?ào t?o và m? danh sách sinh viên t??ng ?ng v?i file ?i?m v?a nh?p. Sau ?ó click vào nút nh?p ?i?m.');
                } else {
                    var rowCollect = t.firstElementChild;
                    for (var i = 0; i < $scope.data.length; i++) {//col 2, 5,6,7
                        for (var j = 1; j < rowCollect.childElementCount; j++) {
                            var row = rowCollect.childNodes[j];
                            var masv = row.childNodes[2].getElementsByTagName('span')[0].innerText;
                            if (masv == $scope.data[i][0]) {
                                var index = 1;
                                if ($scope.colCC >= 0) {
                                    row.childNodes[5].getElementsByTagName('input')[0].value = $scope.data[i][index] ? $scope.data[i][index] : 0;//Diem chuyen can
                                    index++;
                                }
                                if ($scope.colKT >= 0) {
                                    row.childNodes[6].getElementsByTagName('input')[0].value = $scope.data[i][index] ? $scope.data[i][index] : 0;//Diem giua ky
                                    index++;
                                }
                                if ($scope.colThi >= 0) {
                                    row.childNodes[7].getElementsByTagName('input')[0].value = $scope.data[i][index] ? $scope.data[i][index] : 0;//Diem thi
                                    index++;
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.change = function (){
        if ($scope.colMasv > -1 && ($scope.colCC > -1 || $scope.colKT > -1 || $scope.colThi > -1)) {
            $scope.fileEnable = true;
        } else {
            $scope.fileEnable = false;
        }
    }

    $scope.refresh = function () {
        $scope.data = null;
        $scope.nhapDiemEnable = false;
        $scope.fileEnable = false;
        $scope.textBoxEnable = false;
    }
});