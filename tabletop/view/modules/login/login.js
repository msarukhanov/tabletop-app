app.controller('Login', ['$scope', '$rootScope', '$routeParams', '$cookieStore', 'userRequests', '$localStorage', '$translate',
    function ($scope, $rootScope, $routeParams, $cookieStore, userRequests, $localStorage, $translate) {

        window.deleteCookie = function() {
            $cookieStore.remove('ttapp_token');
        };

        $scope.showToastError = function (errorMsg) {
            if(errorMsg == 'Already logged in.') errorMsg = '<span onclick="deleteCookie()">' + errorMsg + '</span>';
            Materialize.toast(errorMsg, 3000, 'teal darken-3 rounded');
        };

        $scope.userLogin = function () {
            if ($scope.login) {
                var formData = $scope.login;
                userRequests.CRUDUser('signIn', formData, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('ttapp_token', token);
                        $rootScope.getUserData();
                    } else {
                        if($scope.message == 'Already logged in.') {
                            $cookieStore.remove('ttapp_token');
                            userRequests.CRUDUser('signIn', formData, function (data) {
                                $scope.error = data.error;
                                $scope.message = data.message;
                                if (!data.error) {
                                    var token = data.data.user_token;
                                    $cookieStore.put('ttapp_token', token);
                                    $rootScope.getUserData();
                                } else {
                                    if($scope.message == 'Already logged in.') {
                                        $cookieStore.remove('ttapp_token');
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                $scope.message = 'Fields are required!';
            }
        };
    }
]);