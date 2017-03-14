app.controller('Actions', ['$scope', '$rootScope', '$routeParams', '$location', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, userRequests) {

        $rootScope.hideLoader = false;

        $scope.chatMsgs = [];
        $scope.textMsg = '';
        $scope.currentDice = 10;
        $scope.currentNumber = 1;

        $scope.changeNumber = function(val) {
            if($scope.currentNumber + val > 0 && $scope.currentNumber + val < 20) {
                $scope.currentNumber += val;
            }
        };


        $scope.actionMode = function(mode) {
            $('#modal-'+mode).openModal();
        };

        var socket = io.connect(location.origin);
        socket.on("connect", function(){
            socket.emit('ucon', $rootScope.userInfo);
            socket.on('message', function(msg){
                $rootScope.$apply(function() {
                    if(msg.length) {
                        switch(msg[0]) {
                            case 'sm':
                                console.log("Server Message", msg[1]);
                                switch(msg[1]) {
                                    case 'connected':
                                        console.log("connected");
                                        socket.json.send(['start']);
                                        $rootScope.hideLoader = true;
                                        break;
                                    case 'joined':
                                        console.log("joined : " + msg[2]);
                                        $rootScope.sendMessage = function(text, type) {
                                            socket.json.send(['upd', type, {text : text}]);
                                            if(type=='chat') $scope.textMsg = '';
                                        };
                                        socket.json.send(['log-s']);
                                        break;
                                }
                                break;
                            case 'log-s':
                                $scope.chatMsgs = msg[1];
                                break;
                            case 'log-u':
                                $scope.chatMsgs.push(msg[1]);
                                if($scope.chatMsgs.length > 50) $scope.chatMsgs.shift();
                                break;
                        }
                    }
                });
            });
        });

    }
]);
