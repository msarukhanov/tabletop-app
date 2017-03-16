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
app.controller('Charlist', ['$scope', '$rootScope', '$routeParams', '$location', '$translate', 'userRequests',
    function ($scope, $rootScope, $routeParams, $location, $translate, userRequests) {

        $rootScope.hideLoader = false;

        var translateSchema = function() {
            $scope.$evalAsync(function() {
                $translate.refresh();
            });
        };
        var listId = '';

        window.saveCharacterProceed = function(newChar, isNpc) {
            userRequests.CRUDUser('saveCharacterList', {
                newChar : newChar,
                npc : isNpc,
                schema_id : $rootScope.userInfo.server_info.schema_id
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $('#modalCharFinish').openModal();
                    if(!isNpc) {
                        $scope.currentChar = data.data.char.list;
                        $location.path('/bio' + data.data.char.id + "?new");
                    }
                }
                else {

                }
            });
        };
        window.editCharacterProceed = function(list) {
            userRequests.CRUDUser('editCharacterList', {
                list : list,
                listId : listId
            }, function (data) {
                $scope.error = data.error;
                $scope.message = data.message;
                $rootScope.hideLoader = true;
                if (!data.error) {
                    $('#editCharFinish').closeModal();
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
                    $scope.currentChar = data.data.list || data.data.char.list;
                    $rootScope.currentSchema = data.data.schema || $rootScope.userInfo.server_info.charlist_name;
                    listId = data.data.id;
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
app.controller('Login', ['$scope', '$rootScope', '$routeParams', '$cookieStore', 'userRequests', '$translate',
    function ($scope, $rootScope, $routeParams, $cookieStore, userRequests, $translate) {

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
app.controller('MainCtrl', ['userRequests', '$rootScope', '$scope', '$cookieStore', '$location', '$translate',
    function (userRequests, $rootScope, $scope, $cookieStore, $location, $translate) {

        $rootScope.isLoggedIn = false;
        $rootScope.readOnly = false;
        $rootScope.showLM = false;
        $rootScope.hideLoader = true;
        $scope.menuLink = function (link) {
            $location.url(link);
            $rootScope.showLM = false;
        };
        $rootScope.toggleLeftMenu = function(param) {
            $rootScope.showLM = param!=undefined ? param : !$rootScope.showLM;
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
                        $rootScope.mainLocale = "locales/locale-" + $rootScope.userInfo.lang;
                        $translate.use("locales/locale-" + $rootScope.userInfo.lang);
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