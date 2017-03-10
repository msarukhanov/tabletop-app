app.controller('Bio', ['$scope', '$rootScope', '$routeParams', '$location', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, userRequests) {

        $rootScope.hideLoader = false;

        $scope.isNew = ($location.url().indexOf("new") > -1);
        var char_id = ($rootScope.userInfo && $rootScope.userInfo.char_id) ?
            $rootScope.userInfo.char_id : $routeParams.char_id;

        $scope.getCharacterBio = function() {
            userRequests.CRUDUser('getCharacterBio', {
                char_id : char_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $scope.bio = data.data;
                }
                else {

                }
            });
        };
        $scope.saveCharacterBio = function() {
            userRequests.CRUDUser('saveCharacterBio', {
                bio : $scope.bio,
                char_id : char_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $scope.isNew = false;
                }
                else {

                }
            });
        };
        $scope.updateCharacterBio = function() {
            userRequests.CRUDUser('updateCharacterBio', {
                bio : $scope.bio,
                char_id : char_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {

                }
                else {

                }
            });
        };

        console.log($scope.isNew)
        if($scope.isNew) {
            $('#modalNewBio').openModal();
        }

    }
]);
app.controller('Charlist', ['$scope', '$rootScope', '$routeParams', '$location', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, userRequests) {

        $rootScope.hideLoader = false;

        window.saveCharacterProceed = function(newChar) {
            userRequests.CRUDUser('saveCharacterList', {
                newChar : newChar,
                schema_id : $rootScope.userInfo.server_info.schema_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $('#modalCharFinish').openModal();
                    $scope.currentChar = data.data.char.list;
                    $location.path('/bio' + data.data.char.id + "?new");
                }
                else {

                }
            });
        };
        $scope.createCharacterDialog = function() {
            window.createCharacterDialog();
        };

        if($rootScope.userInfo && $rootScope.userInfo.char_id && $rootScope.userInfo.char_info) {
            if(!$rootScope.userInfo.char_info.charlist || !$rootScope.userInfo.server_info.charlist_name) {
                userRequests.CRUDUser('getCharacterList', {
                    char_id : $rootScope.userInfo.char_id
                }, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    $rootScope.hideLoader = true;
                    if (!data.error) {
                        $rootScope.currentSchema = data.data.schema;
                        $scope.currentChar = data.data.char.list;
                        $rootScope.getUserData();
                    }
                    else {
                        //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                    }
                });
            }
            else {
                $rootScope.currentSchema = $rootScope.userInfo.server_info.charlist_name;
                $scope.currentChar = $rootScope.userInfo.char_info.charlist.list;
                $rootScope.hideLoader = true;
            }

        }
        else if($rootScope.userInfo && (!$rootScope.userInfo.char_id || !$rootScope.userInfo.char_info)) {
            $rootScope.currentSchema = $rootScope.userInfo.server_info.charlist_name;
            userRequests.CRUDUser('getCharactersList', {
                users : $rootScope.userInfo.server_info.users
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $rootScope.currentSchema = $rootScope.userInfo.server_info.charlist_name || data.data.schema;
                    $scope.charList = data.data.chars;
                    $rootScope.getUserData();
                }
                else {
                    //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                }
            });

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