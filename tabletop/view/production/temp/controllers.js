app.controller('Charlist', ['$scope', '$rootScope', '$routeParams', 'userRequests',
    function ($scope, $rootScope, $routeParams, userRequests) {

        $rootScope.hideLoader = false;
        if($rootScope.userInfo && $rootScope.userInfo.char_id) {
            if(!$rootScope.userInfo.char_info.charlist || !$rootScope.userInfo.server_info.charlist_name) {
                userRequests.CRUDUser('getCharacterList', {
                    char_id : $rootScope.userInfo.char_id
                }, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    $rootScope.hideLoader = true;
                    if (!data.error) {
                        $scope.schema = data.data.schema;
                        $scope.currentChar = data.data.char.list;
                    }
                    else {
                        //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                    }
                });
            }
            else {
                $scope.schema = $rootScope.userInfo.server_info.charlist_name;
                $scope.currentChar = $rootScope.userInfo.char_info.charlist.list;
                $rootScope.hideLoader = true;
            }
        }
        else if($rootScope.userInfo && !$rootScope.userInfo.char_id) {
            //TODO create character dialog
        }
    }
]);

app.controller('Home', ['$scope', '$rootScope', '$routeParams',
    function ($scope, $rootScope, $routeParams) {


    }
]);
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
app.controller('MainCtrl', ['userRequests', '$rootScope', '$scope', '$cookieStore', '$localStorage', '$location', '$translate',
    function (userRequests, $rootScope, $scope, $cookieStore, $localStorage, $location, $translate) {

        $rootScope.isLoggedIn = false;
        $rootScope.readOnly = false;
        $rootScope.showLM = false;
        $rootScope.hideLoader = true;
        $scope.menuLink = function (link) {
            $location.url(link);
            $rootScope.showLM = false;
        };
        $rootScope.toggleLeftMenu = function() {
            $rootScope.showLM = !$rootScope.showLM;
        };
        $scope.logout = function () {
            $cookieStore.remove('ttapp_token');
            $rootScope.isLoggedIn = false;
            location.reload();
        };

        $rootScope.getUserData = function () {
            $rootScope.hideLoader = false;
            var token = $cookieStore.get('ttapp_token');
            if (token) {
                userRequests.CRUDUser('accountInfo', {}, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    $rootScope.hideLoader = true;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('ttapp_token', token);
                        $rootScope.userInfo = data.data;
                        $rootScope.isLoggedIn = true;
                    }
                    else {
                        //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                    }
                });
            }
            else $rootScope.isLoggedIn = false;
        };
        $rootScope.getUserData();
    }
]);