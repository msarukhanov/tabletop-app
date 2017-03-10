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