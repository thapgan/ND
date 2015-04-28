var app = angular.module('nhapds', ['ngAnimate', 'toaster'])
.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
})
.controller('nhapdsCtrl', function ($scope, toaster, $window, $rootScope, $document) {
    $scope.dsEnable = true;
    $scope.bDiemEnable = false;
    $scope.bDiem = [];
    $scope.inputTyping = '';

    $scope.indexDiem = -1;
    $scope.diemflag = true;


    $scope.delete = function () {
        $scope.dsEnable = true;
        $scope.bDiemEnable = false;
        $scope.bDiem = [];
        $scope.inputTyping = '';
        $scope.indexDiem = -1;
        $scope.diemflag = true;
            
        toaster.pop('success', '', 'Bảng điểm vừa nhập đã được xoá. Click vào nút nhập điểm để nhập bảng điểm mới.');
    }
    
    $scope.finishDiem = function (index) {
        $scope.bDiem[index].dEditable = false;
    }
    
    $scope.editDiem = function (index) {
        $scope.bDiem[index].dEditable = true;
    }
    
    $scope.nhapdiem = function () {
        
        if ($scope.bDiem.length > 0) { // focus to textbox
            $scope.$broadcast('nhapdiem');
        } else {
            if ($scope.dsEnable) {//get student list
                var t = window.frames["vnua"].contentDocument.getElementById('ctl00_ContentPlaceHolder1_ctl00_grdNhapDiem');
                if (t == null || t.firstElementChild == null) {
                    toaster.pop('warning', '', 'Hãy đăng nhập vào website phòng đào tạo và mở bảng điểm cần nhập. Sau đó click vào nút Nhập điểm.');
                } else {
                    var rowCollect = t.firstElementChild;
                    for (var j = 1; j < rowCollect.childElementCount; j++) {
                        var row = rowCollect.childNodes[j];
                        var ma_sv = row.childNodes[2].getElementsByTagName('span')[0].innerText;
                        $scope.bDiem.push({ masv: ma_sv, diem: null, dEditable: false })
                    }
                    
                    $scope.dsEnable = false;
                    $scope.bDiemEnable = true;
                    toaster.pop('success', '', 'Click vào nút nhập điểm và bắt đầu nhập điểm. Khi nhập điểm chỉ cần nhập liên tiếp các điểm thi theo danh sách.');
                    $scope.$broadcast('nhapdiem');
                }

            }
            else {
                toaster.pop('warning', '', 'Hãy đăng nhập vào website phòng đào tạo và mở bảng điểm cần nhập. Sau đó click vào nút Nhập điểm.');
            }
        }
    }
    
    $scope.chuyendiem = function (index) { //index: 1 chuyen can, 2 kiem tra, 3 thi
        if ($scope.bDiem == null || $scope.bDiem.length == 0) {
            toaster.pop('warning', '', 'Bạn chưa nhập điểm!');
        } else {
            
                var t = window.frames["vnua"].contentDocument.getElementById('ctl00_ContentPlaceHolder1_ctl00_grdNhapDiem');
                if (t == null || t.firstElementChild == null) {
                    toaster.pop('warning', '', 'Hãy đăng nhập vào website phòng đào tạo và mở danh sách sinh viên tương ứng với bảng điểm vừa nhập. Sau đó click vào nút chuyển điểm.');
                } else {
                    var rowCollect = t.firstElementChild;
                    for (var i = 0; i < $scope.bDiem.length; i++) {//col 2, 5,6,7
                        for (var j = 1; j < rowCollect.childElementCount; j++) {
                            var row = rowCollect.childNodes[j];
                            var masv = row.childNodes[2].getElementsByTagName('span')[0].innerText;
                            if (masv == $scope.bDiem[i].masv) {
                                
                                if (index == 1) {
                                    row.childNodes[5].getElementsByTagName('input')[0].value = $scope.bDiem[i].diem ? $scope.bDiem[i].diem : 0;//Diem chuyen can                                        
                                } else if (index == 2) {
                                    row.childNodes[6].getElementsByTagName('input')[0].value = $scope.bDiem[i].diem ? $scope.bDiem[i].diem : 0;//Diem giua ky
                                } else {
                                    row.childNodes[7].getElementsByTagName('input')[0].value = $scope.bDiem[i].diem ? $scope.bDiem[i].diem : 0;//Diem thi
                                }
                                break;
                            }
                        }
                    }
                }
            $scope.dsEnable = true;
            $scope.bDiemEnable = false;
        }
    }

    $scope.changed = function (event){
        if (event.keyCode == 49) { //press 1
            $scope.indexDiem++;
            if ($scope.indexDiem < $scope.bDiem.length) {
                $scope.bDiem[$scope.indexDiem].diem = 1;
            } else {
                toaster.pop('warning', '', 'Đã nhập xong. Bạn có thể sửa điểm bằng cách click đúp vào điểm cần sửa.');
            }
            $scope.diemflag = false; //mark having 1 character in textbox
            $scope.inputTyping = null;
            
        } else {
            if (event.keyCode >= 48 && event.keyCode <= 57) {//press 0, 2,...9
                if ($scope.diemflag) {
                    $scope.indexDiem++;
                    if ($scope.indexDiem < $scope.bDiem.length) {
                        $scope.bDiem[$scope.indexDiem].diem = String.fromCharCode(event.keyCode);
                    } else {
                        toaster.pop('warning', '', 'Đã nhập xong. Bạn có thể sửa điểm bằng cách click đúp vào điểm cần sửa.');
                    }
                    $scope.inputTyping = null;
                } else {//previous character is 1
                    if (event.keyCode == 48) {//typing 10
                        $scope.bDiem[$scope.indexDiem].diem = 10;
                        $scope.inputTyping = null;
                        $scope.diemflag = true;
                    } else {
                        $scope.indexDiem++;
                        if ($scope.indexDiem < $scope.bDiem.length) {
                            $scope.bDiem[$scope.indexDiem].diem = String.fromCharCode(event.keyCode);
                        } else {
                            toaster.pop('warning', '', 'Đã nhập xong. Bạn có thể sửa điểm bằng cách click đúp vào điểm cần sửa.');
                        }
                        $scope.inputTyping = null;
                    }
                }
            } else {
                if (event.keyCode == 111 && !$scope.diemflag) { //type o to input 1 and 0
                    $scope.indexDiem++;
                    if ($scope.indexDiem < $scope.bDiem.length) {
                        $scope.bDiem[$scope.indexDiem].diem = 0;
                    } else {
                        toaster.pop('warning', '', 'Đã nhập xong. Bạn có thể sửa điểm bằng cách click đúp vào điểm cần sửa.');
                    }
                    $scope.diemflag = true;
                    $scope.inputTyping = null;
                } else { 
                    if (event.keyCode == 32) { //sapce for delete
                        if ($scope.indexDiem >= $scope.bDiem.length) {
                            $scope.indexDiem = $scope.bDiem.length - 1;
                        }
                        $scope.bDiem[$scope.indexDiem].diem = null;//clear value
                        $scope.indexDiem--;

                    } else {//type other characters
                        $scope.inputTyping = null;
                    }
                }
            }
        }
    }
});