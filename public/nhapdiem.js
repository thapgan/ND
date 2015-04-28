var app = angular.module('nhapdiem', ['ngAnimate','toaster'])
.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
})
.controller('nhapdiemCtrl', function ($scope, toaster) {
    $scope.dsEnable = false;
    $scope.bDiemEnable = true;
    $scope.daotao = "Mở website phòng đào tạo"
    $scope.bDiem = [];
    $scope.inputTyping = '';
    $scope.masvflag = true;
    $scope.insertFlag = true;
    
    $scope.opendaotao = function (){
        if ($scope.dsEnable) {
            $scope.dsEnable = false;
            $scope.daotao = "Mở website phòng đào tạo"
            $scope.bDiemEnable = true;
        } else {
            $scope.dsEnable = true;
            $scope.bDiemEnable = false;
            $scope.daotao = "Mở bản điểm vừa nhập"
            toaster.pop('success', '', 'Website phòng đào tạo đã được mở bên dưới. Hãy đăng nhập và mở danh sách sinh viên tương ứng với bảng điểm vừa nhập, sau đó click vào nút chuyển điểm tương ứng để chuyển điểm sang website của phòng đào tạo.');
        }
    }
    
    $scope.delete = function (){
        $scope.dsEnable = false;
        $scope.bDiemEnable = true;
        $scope.daotao = "Mở website phòng đào tạo"
        $scope.bDiem = [];
        $scope.inputTyping = '';
        $scope.masvflag = true;
        $scope.insertFlag = true;
        toaster.pop('success', '', 'Bảng điểm vừa nhập đã được xoá. Click vào nút nhập điểm để nhập bảng điểm mới.');
    }

    $scope.parseTyping = function () {
        if ($scope.inputTyping) {
            if ($scope.masvflag) { //typing masv
                
                if ($scope.insertFlag) {
                    $scope.bDiem.push({ masv: '', diem: '', msEditable: false, dEditable:false });
                    $scope.insertFlag = false;
                }

                $scope.bDiem[$scope.bDiem.length-1].masv = $scope.inputTyping;

                if ($scope.inputTyping.toString().length == 6) {
                    var masv = parseInt($scope.inputTyping,10);
                    $scope.inputTyping = null;
                    $scope.bDiem[$scope.bDiem.length - 1].masv = masv;
                    $scope.masvflag = false;                    
                }

            } else { //typing diem
                var diem = parseInt($scope.inputTyping, 10);
                if (diem == 0 || (diem > 1 && diem <= 10)) { //finished
                    $scope.inputTyping = null;
                    $scope.bDiem[$scope.bDiem.length - 1].diem = diem;
                    $scope.insertFlag = true;                
                    $scope.masvflag = true;
                } else { //diem >10
                    if (diem > 10) {
                        var m = diem % 10;
                        $scope.inputTyping = diem - 10;
                        $scope.bDiem[$scope.bDiem.length - 1].diem = diem;
                        $scope.insertFlag = true;
                        $scope.masvflag = true;
                    } else { //diem =1
                        $scope.bDiem[$scope.bDiem.length - 1].diem = diem;
                    }
                }
            }
        }
    }

    $scope.finishMasv = function (index){
        $scope.bDiem[index].msEditable = false;
    }

    $scope.editMasv = function (index) { 
        $scope.bDiem[index].msEditable = true;
    }

    $scope.nhapdiem = function (){
        $scope.dsEnable = false;
        $scope.daotao = "Mở website phòng đào tạo"
        $scope.bDiemEnable = true;
        $scope.$broadcast('nhapdiem');
        toaster.pop('success', '', 'Bạn đã có thể bắt đầu nhập điểm. Bạn chỉ cần gõ liên tục mã sinh viên và điểm thi, hệ thống sẽ tự động phân tách mã sinh viên và điểm thi cho bạn.');
    }

    $scope.chuyendiem = function (index){ //index: 1 chuyen can, 2 kiem tra, 3 thi
        if ($scope.bDiem == null || $scope.bDiem.length == 0) {
            toaster.pop('warning', '', 'Bạn chưa nhập điểm!');
        } else {
                if ($scope.dsEnable) {
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
                                    } else if (index==2) {
                                        row.childNodes[6].getElementsByTagName('input')[0].value = $scope.bDiem[i].diem ? $scope.bDiem[i].diem : 0;//Diem giua ky
                                    } else {
                                        row.childNodes[7].getElementsByTagName('input')[0].value = $scope.bDiem[i].diem ? $scope.bDiem[i].diem : 0;//Diem thi
                                    }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    toaster.pop('warning', '', 'Hãy đăng nhập vào website phòng đào tạo và mở danh sách sinh viên tương ứng với bảng điểm vừa nhập. Sau đó click vào nút chuyển điểm.');
                }
            }
        }
});