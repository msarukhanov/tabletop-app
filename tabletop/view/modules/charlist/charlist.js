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
                        $rootScope.currentSchema = data.data.schema;
                        $scope.currentChar = data.data.char.list;
                        window.prepareCharList = function() {
                           // window.prepareCharListFunctions($scope, $rootScope, data.data.char);
                        };
                    }
                    else {
                        //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                    }
                });
            }
            else {
                $rootScope.currentSchema = $rootScope.userInfo.server_info.charlist_name;
                $scope.currentChar = $rootScope.userInfo.char_info.charlist.list;
                window.prepareCharList = function() {
                    //window.prepareCharListFunctions($scope, $rootScope, $rootScope.userInfo.char_info.charlist);
                };
                $rootScope.hideLoader = true;
            }
        }
        else if($rootScope.userInfo && !$rootScope.userInfo.char_id) {
            //TODO create character dialog
        }
    }
]);
