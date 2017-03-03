var templates = {};

templates["../terminal/view/modules/home/home.html"] = "<div class=\"global-wrapper\" ng-init=\"getCharacterData()\">\n" +
   "    <h4 class=\"page-header global-page-header center\">{{\"Character\" | translate}}</h4>\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\">\n" +
   "        <div class=\"panel-header\" ng-show=\"!hideLoader\">\n" +
   "            {{\"Vincent Krieg\" | translate}}\n" +
   "            <div class=\"btn-group pull-right header-right-column\">\n" +
   "                <label>( {{\"VTM\" | translate}}</label> <label>-</label> <label>{{\"Detroit1\" | translate}} )</label>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "        <div class=\"panel-body global-panel-body\" ng-show=\"!hideLoader\">\n" +
   "            <ul class=\"collapsible\" data-collapsible=\"expandable\">\n" +
   "                <li>\n" +
   "                    <div class=\"collapsible-header\">\n" +
   "                        <i class=\"material-icons\">accessibility</i> Stats.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body attributes\">\n" +
   "                        <div class=\"row\">\n" +
   "                            <div class=\"col s4\">\n" +
   "                                <p class=\"main_info\">Name:</p>\n" +
   "                                <p class=\"main_info\">Player:</p>\n" +
   "                                <p class=\"main_info\">Chronicle:</p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Physical</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Strength</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Dexterity</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Stamina</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Talents</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Alertness</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Athletics</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Brawl</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Dodge</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Empathy</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Expression</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Intimidation</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Leadership</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Streetwise</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Subterfuge</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Disciplines</p>\n" +
   "\n" +
   "                            </div>\n" +
   "                            <div class=\"col s4\">\n" +
   "                                <p class=\"main_info\">Nature:</p>\n" +
   "                                <p class=\"main_info\">Demeanor:</p>\n" +
   "                                <p class=\"main_info\">Concept:</p>\n" +
   "                                <p class=\"attr-space\">Attributes</p>\n" +
   "                                <p class=\"attr-group\">Social</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Charisma</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Manipulation</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Appearance</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\">Abilities</p>\n" +
   "                                <p class=\"attr-group\">Skills</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Animal Ken</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Crafts</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Drive</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Etiquette</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Firearms</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Performance</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Melee</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Security</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Stealth</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Survival</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\">Advantages</p>\n" +
   "                                <p class=\"attr-group\">Backgrounds</p>\n" +
   "                            </div>\n" +
   "                            <div class=\"col s4\">\n" +
   "                                <p class=\"main_info\">Clan:</p>\n" +
   "                                <p class=\"main_info\">Generation:</p>\n" +
   "                                <p class=\"main_info\">Sire:</p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Mental</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Perception</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Intelligence</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Wits</span>\n" +
   "                                    <span class=\"attr-stat\">6</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Knowledges</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Academics</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Computer</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Finance</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Investigation</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Law</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Linguistics</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Medicine</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Occult</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Politics</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Science</span>\n" +
   "                                    <span class=\"attr-stat\">7</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr-space\"></p>\n" +
   "                                <p class=\"attr-group\">Virtues</p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Conscience / Conviction</span>\n" +
   "                                    <span class=\"attr-stat\">5</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Self-Control / Instinct</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                                <p class=\"attr\">\n" +
   "                                    <span class=\"attr-name\">Courage</span>\n" +
   "                                    <span class=\"attr-stat\">4</span>\n" +
   "                                </p>\n" +
   "                            </div>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <div class=\"collapsible-header\">\n" +
   "                        <i class=\"material-icons\">assignment</i> Bio.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <span>Lorem ipsum dolor sit amet.</span>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <div class=\"collapsible-header\">\n" +
   "                        <i class=\"material-icons\">language</i> Status.\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <span>Lorem ipsum dolor sit amet.</span>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <div class=\"collapsible-header\">\n" +
   "                        <i class=\"material-icons\">people</i> Party (coming soon)\n" +
   "                    </div>\n" +
   "                    <div class=\"collapsible-body\">\n" +
   "                        <span>Shepard</span>, <span>Alice</span>\n" +
   "                    </div>\n" +
   "                </li>\n" +
   "            </ul>\n" +
   "        </div>\n" +
   "        <!--<div class=\"pre-loader global-loader global-wrapper center valign-wrapper\" ng-show=\"!hideLoader\">-->\n" +
   "        <!--<i class=\"fa fa-cog fa-spin fa-3x pre-loader  valign center-block\"></i>-->\n" +
   "        <!--</div>-->\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<script>\n" +
   "    $('.collapsible').collapsible({\n" +
   "        accordion: true\n" +
   "    });\n" +
   "</script>\n" +
   "";

templates["../terminal/view/modules/leftmenu/leftmenu.html"] = "<!DOCTYPE html>\n" +
   "<html lang=\"en\">\n" +
   "<head>\n" +
   "    <meta charset=\"UTF-8\">\n" +
   "    <title></title>\n" +
   "</head>\n" +
   "<body>\n" +
   "\n" +
   "</body>\n" +
   "</html>";

templates["../terminal/view/modules/login/login.html"] = "<div class=\"container login-container valign-wrapper\" ng-controller=\"Login\">\n" +
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

templates["../terminal/view/modules/main/main.html"] = "<div id=\"page-wrapper\">\n" +
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
   "                    <li>\n" +
   "                        <a ng-click='menuLink(\"/games\")' ng-class=\"{active: activeTab=='/games'}\">\n" +
   "                            <i class=\"fa fa-globe fa-fw\"></i> {{\"Games\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
   "                </ul>\n" +
   "            </div>\n" +
   "            <ul class=\"right\">\n" +
   "                <li>\n" +
   "                    <a href=\"\" class=\"dropdown-button\" data-activates=\"user-dropdown\">\n" +
   "                        <i class=\"fa fa-user fa-fw\"></i> {{userInfo.username}}\n" +
   "                    </a>\n" +
   "                </li>\n" +
   "                <li>\n" +
   "                    <a href=\"#\" ng-click=\"logout()\">{{\"LOGOUT\" | translate}}\n" +
   "                        <i class=\"fa fa-sign-out\"></i>\n" +
   "                    </a>\n" +
   "                </li>\n" +
   "            </ul>\n" +
   "        </div>\n" +
   "    </nav>\n" +
   "\n" +
   "    <div ng-view id=\"main\">\n" +
   "\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "\n" +
   "<script>\n" +
   "    $('.collapsible').collapsible({\n" +
   "        accordion: false\n" +
   "    });\n" +
   "</script>";