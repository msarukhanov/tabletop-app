app.controller('Actions', ['$scope', '$rootScope', '$routeParams', '$location', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, userRequests) {

        $rootScope.hideLoader = false;

        var socket = io.connect(location.origin);
        socket.on("connect", function(){
            console.log("connected");
            socket.emit('ucon', $rootScope.userInfo);
            socket.on('message', function(msg){
                if(msg.length) {
                    switch(msg[0]) {
                        case 'sm':
                            console.log("Server Message", msg[1]);
                            break;
                        case 'um':
                            console.log("User Message", msg[1]);
                            break;
                    }
                }
            });
        });

    }
]);
