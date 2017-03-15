var templates = {};

templates["../tabletop/view/modules/actions/actions.html"] = "<div class=\"global-wrapper\">\n" +
   "\n" +
   "    <h4 class=\"page-header global-page-header center\">\n" +
   "        <span>\n" +
   "            {{\"Actions\" | translate}}\n" +
   "        </span>\n" +
   "    </h4>\n" +
   "\n" +
   "    <div class=\"chat-wrapper\">\n" +
   "        <div class=\"chat-body\">\n" +
   "            <ul class=\"chat-list\">\n" +
   "                <li class=\"chat-msg\" ng-repeat=\"msg in chatMsgs track by $index\">\n" +
   "                    <span>\n" +
   "                        {{msg.username}} - {{msg.dt | date:'HH:mm:ss'}} : {{msg.text}}\n" +
   "                        <!--mmalkav - (11:11:11) : ActionName=8,7,3,4,5,6,7,8,9,4-->\n" +
   "                    </span>\n" +
   "                </li>\n" +
   "            </ul>\n" +
   "        </div>\n" +
   "        <div class=\"chat-footer\">\n" +
   "            <span class=\"type-select\">\n" +
   "                <div class=\"fixed-action-btn horizontal click-to-toggle actions-bot\">\n" +
   "                    <a class=\"btn-floating black\">\n" +
   "                        <i class=\"large material-icons\">settings</i>\n" +
   "                    </a>\n" +
   "                    <ul>\n" +
   "                        <li>\n" +
   "                            <a class=\"btn-floating black\" ng-click=\"actionMode('dices')\">\n" +
   "                                <img src=\"/files/images/icons/d20.svg\" alt=\"dices\">\n" +
   "                            </a>\n" +
   "                        </li>\n" +
   "                        <li>\n" +
   "                            <a class=\"btn-floating red\" ng-click=\"actionMode('fight')\">\n" +
   "                                <img src=\"/files/images/icons/fight.svg\" alt=\"dices\">\n" +
   "                            </a>\n" +
   "                        </li>\n" +
   "                        <li>\n" +
   "                            <a class=\"btn-floating yellow darken-1\" ng-click=\"actionMode('chat')\">\n" +
   "                                <i class=\"material-icons\">chat</i>\n" +
   "                            </a>\n" +
   "                        </li>\n" +
   "                        <li>\n" +
   "                            <a class=\"btn-floating blue\" ng-click=\"actionMode('party')\">\n" +
   "                                <i class=\"material-icons\">group</i>\n" +
   "                            </a>\n" +
   "                        </li>\n" +
   "                        <li>\n" +
   "                            <a class=\"btn-floating green\" ng-click=\"actionMode('global')\">\n" +
   "                                <i class=\"material-icons\">language</i>\n" +
   "                            </a>\n" +
   "                        </li>\n" +
   "                    </ul>\n" +
   "                </div>\n" +
   "            </span>\n" +
   "            <span class=\"type-msg-textbox\">\n" +
   "                <input type=\"text\" placeholder=\"Type message here\" ng-model=\"textMsg\"/>\n" +
   "            </span>\n" +
   "            <span class=\"type-msg-send\">\n" +
   "                <button class=\"btn-floating red\" ng-click=\"sendMessage(textMsg, 'chat')\">\n" +
   "                    <i class=\"material-icons right\">input</i>\n" +
   "                </button>\n" +
   "            </span>\n" +
   "            <!--<span class=\"type-msg-btn\"></span>-->\n" +
   "            <!--<span class=\"roll-btn\"></span>-->\n" +
   "            <!--<span class=\"roll-dselect\"></span>-->\n" +
   "            <!--<span class=\"roll-cselect\"></span>-->\n" +
   "        </div>\n" +
   "    </div>\n" +
   "\n" +
   "\n" +
   "</div>\n" +
   "\n" +
   "<div id=\"modal-dices\" class=\"modal\">\n" +
   "    <a class=\"close-btn-m modal-close\">\n" +
   "        <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
   "    </a>\n" +
   "    <div class=\"modal-content\">\n" +
   "        <h4>Dices</h4>\n" +
   "        <form class=\"col s12\" name=\"vtm_main_form\">\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <select class=\"icons\" ng-model=\"currentDice\">\n" +
   "                        <option value=\"6\" data-icon=\"/files/images/icons/d6.svg\" class=\"circle\"></option>\n" +
   "                        <option value=\"8\" data-icon=\"/files/images/icons/d8.svg\" class=\"circle\"></option>\n" +
   "                        <option value=\"10\" data-icon=\"/files/images/icons/d10.svg\" class=\"circle\"></option>\n" +
   "                        <option value=\"12\" data-icon=\"/files/images/icons/d12.svg\" class=\"circle\"></option>\n" +
   "                        <option value=\"20\" data-icon=\"/files/images/icons/d20.svg\" class=\"circle\"></option>\n" +
   "                    </select>\n" +
   "                    <label>\n" +
   "                        <img ng-if=\"currentDice\" ng-src=\"/files/images/icons/d{{currentDice}}.svg\">\n" +
   "                    </label>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s2\">\n" +
   "                    <i class=\"fa fa-minus left\" ng-click=\"changeNumber(-1)\"></i>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s2 currentNumber\">\n" +
   "                    <span class=\"cur-number\">\n" +
   "                        {{currentNumber}}\n" +
   "                    </span>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s2\">\n" +
   "                    <i class=\"fa fa-plus right\" ng-click=\"changeNumber(1)\"></i>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "\n" +
   "        </form>\n" +
   "    </div>\n" +
   "    <div class=\"modal-footer center\">\n" +
   "        <button ng-click=\"sendMessage(currentDice+','+currentNumber, 'roll')\" class=\"modal-action modal-close waves-effect waves-green btn-flat btn-modal-m\">\n" +
   "            Roll!\n" +
   "        </button>\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<script>\n" +
   "    $(document).ready(function() {\n" +
   "        $('select').material_select();\n" +
   "        $('modal').leanModal();\n" +
   "    });\n" +
   "</script>";

templates["../tabletop/view/modules/bio/bio.html"] = "<div class=\"global-wrapper bio\" ng-init=\"getCharacterBio()\">\n" +
   "    <h5 class=\"page-header global-page-header center\">{{\"Bio\" | translate}}</h5>\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\">\n" +
   "        <div class=\"row\">\n" +
   "            <div class=\"col s12\">\n" +
   "                <textarea ng-model=\"bio\"></textarea>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "        <div class=\"row\">\n" +
   "            <div class=\"col s12 center\">\n" +
   "                <a ng-show=\"isNew\" ng-click=\"saveCharacterBio()\" class=\"btn waves-effect waves-light red\">\n" +
   "                    Save\n" +
   "                </a>\n" +
   "                <a ng-show=\"!isNew\" ng-click=\"updateCharacterBio()\" class=\"btn waves-effect waves-light red\">\n" +
   "                    Save\n" +
   "                </a>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "    <!--<div class=\"pre-loader global-loader global-wrapper center valign-wrapper\" ng-show=\"!hideLoader\">-->\n" +
   "    <!--<i class=\"fa fa-cog fa-spin fa-3x pre-loader  valign center-block\"></i>-->\n" +
   "    <!--</div>-->\n" +
   "</div>\n" +
   "\n" +
   "<div id=\"modalNewBio\" class=\"modal bottom-sheet mainform\">\n" +
   "    <a class=\"close-btn-m modal-close\">\n" +
   "        <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
   "    </a>\n" +
   "    <div class=\"modal-content\">\n" +
   "        <h4>Creating Character</h4>\n" +
   "        <h5>Bio</h5>\n" +
   "        <form class=\"col s12\" name=\"vtm_main_form\">\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s12\">\n" +
   "                    And finally give your character unique and beautiful biography.\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"modal-footer center\">\n" +
   "                <button class=\"modal-action modal-close waves-effect waves-green btn-flat btn-modal-m\">\n" +
   "                    Close\n" +
   "                </button>\n" +
   "            </div>\n" +
   "        </form>\n" +
   "    </div>\n" +
   "</div>";

templates["../tabletop/view/modules/charlist/charlist.html"] = "<div class=\"global-wrapper charl\" ng-init=\"getCharacterData()\">\n" +
   "\n" +
   "    <h5 class=\"page-header global-page-header center\">\n" +
   "        {{\"Character\" | translate}}\n" +
   "        <a ng-click=\"createCharacterDialog()\" ng-show=\"hideLoader && !currentChar\" ng-if=\"userInfo.type != 'player'\" class=\"right btn-floating waves-effect waves-light red\" style=\"position: absolute;right: 10px;\">\n" +
   "            <i class=\"material-icons\">add</i>  New Char\n" +
   "        </a>\n" +
   "    </h5>\n" +
   "\n" +
   "    <!--<h4 class=\"page-header global-page-header center\" ng-show=\"hideLoader\">-->\n" +
   "        <!-- -->\n" +
   "    <!--</h4>-->\n" +
   "    <div class=\"panel global-panel-default\" ng-show=\"hideLoader && !currentChar\" ng-if=\"userInfo.type != 'player'\">\n" +
   "\n" +
   "        <ul class=\"collapsible\" data-collapsible=\"expandable\">\n" +
   "            <li>\n" +
   "                <div class=\"collapsible-header\">\n" +
   "                    Players' chars.\n" +
   "                </div>\n" +
   "                <div class=\"collapsible-body\">\n" +
   "                    <ul class=\"collection\">\n" +
   "                        <li class=\"collection-item\" ng-repeat=\"char in charList.players\">\n" +
   "                            <a ng-href=\"/#!/charlist{{char.id}}\">{{char.char_name}} ({{char.username}})</a>\n" +
   "                        </li>\n" +
   "                    </ul>\n" +
   "                </div>\n" +
   "            </li>\n" +
   "            <li>\n" +
   "                <div class=\"collapsible-header\">\n" +
   "                    NPCs.\n" +
   "                </div>\n" +
   "                <div class=\"collapsible-body\">\n" +
   "                    <ul class=\"collection\">\n" +
   "                        <li class=\"collection-item\" ng-repeat=\"char in charList.npc\">\n" +
   "                            <a ng-href=\"/#!/charlist{{char.id}}\">{{char.char_name}}</a>\n" +
   "                        </li>\n" +
   "                    </ul>\n" +
   "                </div>\n" +
   "            </li>\n" +
   "        </ul>\n" +
   "        <script>\n" +
   "            $('.collapsible').collapsible({\n" +
   "                //accordion: false\n" +
   "            });\n" +
   "        </script>\n" +
   "\n" +
   "    </div>\n" +
   "    <div class=\"panel global-panel-default\" ng-show=\"hideLoader\">\n" +
   "        <char-list char=\"currentChar\" schema=\"currentSchema\"></char-list>\n" +
   "    </div>\n" +
   "\n" +
   "</div>\n" +
   "\n" +
   "\n" +
   "";

templates["../tabletop/view/modules/home/home.html"] = "<div class=\"global-wrapper\" ng-init=\"getCharacterData()\">\n" +
   "    <h5 class=\"page-header global-page-header center\" ng-show=\"!userInfo.char_info.length\">\n" +
   "        {{userInfo.username}}\n" +
   "        <!--{{\"Character\" | translate}}-->\n" +
   "    </h5>\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\">\n" +
   "        <div class=\"panel-body global-panel-body\" ng-show=\"hideLoader\">\n" +
   "            <ul class=\"collapsible\" data-collapsible=\"expandable\" ng-show=\"!userInfo.char_info.length\">\n" +
   "                <li ng-show=\"userInfo.server_info.schema_id\">\n" +
   "                    <div class=\"collapsible-header active\">\n" +
   "                        <i class=\"material-icons\">language</i> Current Game.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <div class=\"row\">\n" +
   "                            <div class=\"col offset-s1 s4 bold\">{{\"Title\" | translate}}</div>\n" +
   "                            <div class=\"col s6\">{{userInfo.server_info.name}}</div>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <li ng-show=\"userInfo.char_info.char_id\">\n" +
   "                    <div class=\"collapsible-header active\">\n" +
   "                        <i class=\"material-icons\">assignment</i> Current Character.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <div class=\"row\">\n" +
   "                            <div class=\"col offset-s1 s4 bold\">{{\"Name\" | translate}}</div>\n" +
   "                            <div class=\"col s6\">{{userInfo.char_info.char_name}}</div>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <div class=\"collapsible-header\">\n" +
   "                        <i class=\"material-icons\">language</i> Available Games.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <span>Lorem ipsum dolor sit amet.</span>\n" +
   "                        <span>Lorem ipsum dolor sit amet.</span>\n" +
   "                        <span>Lorem ipsum dolor sit amet.</span>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <!--<li>-->\n" +
   "                    <!--<div class=\"collapsible-header\">-->\n" +
   "                        <!--<i class=\"material-icons\">people</i> Party (coming soon)-->\n" +
   "                    <!--</div>-->\n" +
   "                    <!--<div class=\"collapsible-body\">-->\n" +
   "                        <!--<span>Shepard</span>, <span>Alice</span>-->\n" +
   "                    <!--</div>-->\n" +
   "                <!--</li>-->\n" +
   "            </ul>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<script>\n" +
   "    $('.collapsible').collapsible({\n" +
   "        //accordion: false\n" +
   "    });\n" +
   "</script>\n" +
   "";

templates["../tabletop/view/modules/leftmenu/leftmenu.html"] = "<!DOCTYPE html>\n" +
   "<html lang=\"en\">\n" +
   "<head>\n" +
   "    <meta charset=\"UTF-8\">\n" +
   "    <title></title>\n" +
   "</head>\n" +
   "<body>\n" +
   "\n" +
   "</body>\n" +
   "</html>";

templates["../tabletop/view/modules/login/login.html"] = "<div class=\"container login-container valign-wrapper\" ng-controller=\"Login\">\n" +
   "    <div class=\"login-panel panel panel-default valign center-block\">\n" +
   "        <div class=\"panel-heading my-new-heading\">\n" +
   "            <h3 class=\"panel-title center\">{{\"Sign In\" | translate}}</h3>\n" +
   "            <div class=\"panel-body\">\n" +
   "                <form role=\"form\" name=\"myForm\">\n" +
   "                    <fieldset>\n" +
   "                        <div class=\"form-group\">\n" +
   "                            <input ng-model=\"login.username\" required class=\"form-control new-form-control\"\n" +
   "                                   placeholder=\"{{'Username' | translate}}\" name=\"username\" type=\"text\" autofocus>\n" +
   "                        </div>\n" +
   "                        <div class=\"form-group\">\n" +
   "                            <input ng-model=\"login.password\" required class=\"form-control new-form-control\"\n" +
   "                                   placeholder=\"{{'Password' | translate}}\" name=\"password\" type=\"password\" value=\"\">\n" +
   "                        </div>\n" +
   "                        <button ng-click=\"userLogin()\" ng-disabled=\"myForm.username.$dirty && myForm.username.$invalid ||\n" +
   "  									myForm.password.$dirty && myForm.password.$invalid\"\n" +
   "                                type=\"submit\" class=\"btn btn-lg btn-success btn-block login-btn-success center-block\">{{\"Login\" | translate}}\n" +
   "                        </button>\n" +
   "                    </fieldset>\n" +
   "                </form>\n" +
   "            </div>\n" +
   "            <div onerror=\"showToastError()\"></div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "</div>";

templates["../tabletop/view/modules/main/main.html"] = "<div id=\"page-wrapper\">\n" +
   "    <nav>\n" +
   "        <div class=\"nav-wrapper\">\n" +
   "            <div class=\"left\">\n" +
   "                <a href=\"\" data-activates=\"mobile-demo\" class=\"button-collapse dropdown-button\" ng-click=\"toggleLeftMenu()\">\n" +
   "                    <i class=\"fa fa-navicon\"></i>\n" +
   "                </a>\n" +
   "                <ul class=\"dropdown-content dr-left menu lm_{{showLM}}\" id=\"mobile-demo\">\n" +
   "                    <li>\n" +
   "                        <a ng-click='menuLink(\"/\")' ng-class=\"{active: activeTab=='/'}\">\n" +
   "                            <i class=\"fa fa-home fa-fw\"></i> {{\"Home\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
   "                    <!--<li>-->\n" +
   "                        <!--<a ng-click='menuLink(\"/games\")' ng-class=\"{active: activeTab=='/games'}\">-->\n" +
   "                            <!--<i class=\"fa fa-globe fa-fw\"></i> {{\"Games\" | translate}}-->\n" +
   "                        <!--</a>-->\n" +
   "                    <!--</li>-->\n" +
   "                    <li ng-if=\"userInfo.server_info.schema_id\">\n" +
   "                        <a ng-click='menuLink(\"/charlist\")' ng-class=\"{active: activeTab=='/charlist'}\">\n" +
   "                            <i class=\"fa fa-address-card fa-fw\"></i> {{\"Charlist\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
   "                    <li ng-if=\"userInfo.server_info.schema_id\">\n" +
   "                        <a ng-click='menuLink(\"/bio\")' ng-class=\"{active: activeTab=='/bio'}\">\n" +
   "                            <i class=\"fa fa-book fa-fw\"></i> {{\"Bio\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
   "                    <li ng-if=\"userInfo.server_info.schema_id\">\n" +
   "                        <a ng-click='menuLink(\"/actions\")' ng-class=\"{active: activeTab=='/actions'}\">\n" +
   "                            <i class=\"fa fa-bolt fa-fw\"></i> {{\"Actions\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
   "                </ul>\n" +
   "            </div>\n" +
   "            <ul class=\"right\">\n" +
   "                <li>\n" +
   "                    <a href=\"\">\n" +
   "                        <i class=\"fa fa-user fa-fw\"></i> {{userInfo.username}}\n" +
   "                    </a>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <a href=\"/#!/\" ng-click=\"logout()\">\n" +
   "                        {{\"LOGOUT\" | translate}} <i class=\"fa fa-sign-out\"></i>\n" +
   "                    </a>\n" +
   "                </li>\n" +
   "            </ul>\n" +
   "        </div>\n" +
   "    </nav>\n" +
   "\n" +
   "    <div ng-view ng-click=\"toggleLeftMenu(false)\" id=\"main\"></div>\n" +
   "\n" +
   "    <div class=\"pre-loader global-loader global-wrapper center valign-wrapper\" ng-show=\"!hideLoader\">\n" +
   "        <i class=\"fa fa-cog fa-spin fa-3x pre-loader  valign center-block\"></i>\n" +
   "    </div>\n" +
   "\n" +
   "    <footer class=\"page-footer\">\n" +
   "        <div class=\"footer-copyright\">\n" +
   "            <div class=\"container\">\n" +
   "                <a class=\"copyr\" href=\"https://www.facebook.com/msarukhanov\"> © 2017 @mmalkav </a>\n" +
   "                <a class=\"right\" href=\"https://www.facebook.com/tabletopbymmalkav/\">\n" +
   "                    <i class=\"fa fa-twitter-square\"></i>\n" +
   "                </a>\n" +
   "                <a class=\"right\" href=\"https://www.facebook.com/tabletopbymmalkav/\">\n" +
   "                    <i class=\"fa fa-facebook-official\"></i>\n" +
   "                </a>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "    </footer>\n" +
   "\n" +
   "</div>\n" +
   "\n" +
   "\n" +
   "<script>\n" +
   "    $('.collapsible').collapsible({\n" +
   "        accordion: false\n" +
   "    });\n" +
   "</script>";
