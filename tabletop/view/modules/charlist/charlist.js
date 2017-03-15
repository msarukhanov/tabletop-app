app.controller('Charlist', ['$scope', '$rootScope', '$routeParams', '$location', '$translate', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, $translate, userRequests) {

        $rootScope.hideLoader = false;

        var translateSchema = function() {
            $scope.$evalAsync(function() {
                $translate.refresh();
            });
        };

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
            window.createCharacterDialog(true);
        };

        function getChar(char_id) {
            userRequests.CRUDUser('getCharacterList', {
                char_id : char_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $rootScope.currentSchema = data.data.schema || $rootScope.userInfo.server_info.charlist_name;
                    $scope.currentChar = data.data.list;
                    translateSchema();
                    $rootScope.getUserData();
                }
                else {
                    //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                }
            });
        }
        var currentCharacter = '';
        if($routeParams.char_id && $routeParams.char_id!="") {
            currentCharacter = $routeParams.char_id;
        }
        else if($rootScope.userInfo && $rootScope.userInfo.char_id && $rootScope.userInfo.char_info) {
            currentCharacter = $rootScope.userInfo.char_id;
        }
        if(currentCharacter) {
            getChar(currentCharacter);
        }
        else {
            userRequests.CRUDUser('getCharactersList', {
                users : $rootScope.userInfo.server_info.users
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $rootScope.currentSchema = data.data.schema || $rootScope.userInfo.server_info.charlist_name;
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
