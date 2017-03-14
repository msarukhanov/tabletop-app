app.controller('Charlist', ['$scope', '$rootScope', '$routeParams', '$location', '$translate', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, $translate, userRequests) {

        $rootScope.hideLoader = false;

        var translateSchema = function() {

            $scope.$evalAsync(function() {
                $translate.refresh();
            });
        };
        //$scope.prepareCharList = function() {
        //    $translate.use("/schemas/" + $rootScope.currentSchema + "/" + $rootScope.currentSchema+"-" + $rootScope.userInfo.lang).then(function () {
        //        console.log("aa");
        //        $translate.refresh();
        //    });
        //};
        
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

        if($routeParams.char_id && $routeParams.char_id!="") {
            userRequests.CRUDUser('getCharacterList', {
                char_id : $routeParams.char_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $rootScope.currentSchema = data.data.schema || $rootScope.userInfo.server_info.charlist_name;
                    translateSchema();
                    $scope.currentChar = data.data.list;
                    $rootScope.getUserData();
                }
                else {
                    //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                }
            });
        }
        else if($rootScope.userInfo && $rootScope.userInfo.char_id && $rootScope.userInfo.char_info) {
            if(!$rootScope.userInfo.char_info.charlist || !$rootScope.userInfo.server_info.charlist_name) {
                userRequests.CRUDUser('getCharacterList', {
                    char_id : $rootScope.userInfo.char_id
                }, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    $rootScope.hideLoader = true;
                    if (!data.error) {
                        $rootScope.currentSchema = data.data.schema;
                        translateSchema();
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
                translateSchema();
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
                    translateSchema();
                    $scope.charList = data.data;
                    $rootScope.getUserData();
                }
                else {
                    //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                }
            });

        }
    }
]);
