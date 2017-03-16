app.controller('Home', ['$scope', '$rootScope', 'userRequests',
    function ($scope, $rootScope, userRequests) {

        $scope.server_info = {};

        function getServerInfo() {
            userRequests.CRUDUser('getServerInfo', {
                server_id : $rootScope.userInfo.server_info.server_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                if (!data.error) {
                    $scope.server_info = data;
                }
                else {

                }
            });
        }

        $scope.getHomeData = function() {
            getServerInfo();
        };

        $scope.$watch(function() {
            return $rootScope.userInfo.server_id;
        }, function() {
            getServerInfo();
        });

    }
]);