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
                        console.log(data.data);
                        $scope.schema = data.data.schema;
                        $scope.currentChar = data.data.charlist.list;
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

    }
]);
