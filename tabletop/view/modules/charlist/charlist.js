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
