app.controller('Login', ['$scope', '$rootScope', '$routeParams', '$cookieStore', 'userRequests', '$localStorage', '$translate',
    function ($scope, $rootScope, $routeParams, $cookieStore, userRequests, $localStorage, $translate) {

        $scope.$storage = $localStorage;

        window.deleteCookie = function() {
            $cookieStore.remove('token');
        };

        $scope.showToastError = function (errorMsg) {
            if(errorMsg == 'Already logged in.') errorMsg = '<span onclick="deleteCookie()">' + errorMsg + '</span>';
            Materialize.toast(errorMsg, 3000, 'teal darken-3 rounded');
        };

        $scope.userLogin = function () {
            if ($scope.login) {
                var formData = $scope.login;
                var path = 'signin';
                userRequests.CRUDUser(path, formData, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('token', token);
                        $rootScope.getUserData();
                    } else {
                        $scope.showToastError($scope.message);
                    }
                });
            } else {
                $scope.message = 'Fields are required!';
            }
        };

        $rootScope.getUserData = function () {
            var token = $cookieStore.get('token');
            if (token) {
                userRequests.getSettings(function (data) {
                    if (!data.error && data.data) {
                        $rootScope.globalSettings = data.data.settings;
                        userRequests.getUserInfo(function (data) {
                            if (!data.error) {
                                switch (data.user_language) {
                                    case 'ENGLISH':
                                        console.log("locale-en");
                                        $translate.use("en");
                                        $rootScope.locale = "en";
                                        break;
                                    case 'FRENCH':
                                        console.log("locale-fr");
                                        $translate.use("fr");
                                        $rootScope.locale = "fr";
                                        break;
                                }
                                $rootScope.userInfo = data;
                                $rootScope.isLoggedIn = true;
                            }
                        });
                    }
                    else {
                    }
                });
            }
        };

    }
]);