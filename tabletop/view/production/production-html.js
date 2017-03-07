var templates = {};

templates["../tabletop/view/modules/bio/bio.html"] = "<div class=\"global-wrapper\" ng-init=\"getCharacterData()\">\n" +
   "    <h4 class=\"page-header global-page-header center\">{{\"BIO\" | translate}}</h4>\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\">\n" +
   "        <div class=\"row\">\n" +
   "            <div class=\"col s12\">\n" +
   "                <textarea></textarea>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "    <!--<div class=\"pre-loader global-loader global-wrapper center valign-wrapper\" ng-show=\"!hideLoader\">-->\n" +
   "    <!--<i class=\"fa fa-cog fa-spin fa-3x pre-loader  valign center-block\"></i>-->\n" +
   "    <!--</div>-->\n" +
   "</div>";

templates["../tabletop/view/modules/charlist/charlist.html"] = "<div class=\"global-wrapper\" ng-init=\"getCharacterData()\">\n" +
   "\n" +
   "    <h4 class=\"page-header global-page-header center\" ng-show=\"!hideLoader\">\n" +
   "        {{\"Character\" | translate}}\n" +
   "    </h4>\n" +
   "\n" +
   "    <h4 class=\"page-header global-page-header center\" ng-show=\"hideLoader\">\n" +
   "        {{\"Character\" | translate}}\n" +
   "    </h4>\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\" ng-show=\"hideLoader\">\n" +
   "        <char-list char=\"currentChar\"></char-list>\n" +
   "    </div>\n" +
   "\n" +
   "</div>\n" +
   "";

templates["../tabletop/view/modules/home/home.html"] = "<div class=\"global-wrapper\" ng-init=\"getCharacterData()\">\n" +
   "    <h4 class=\"page-header global-page-header center\" ng-show=\"!userInfo.char_info.length\">\n" +
   "        {{userInfo.username}}\n" +
   "        <!--{{\"Character\" | translate}}-->\n" +
   "    </h4>\n" +
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
   "                    <li>\n" +
   "                        <a ng-click='menuLink(\"/games\")' ng-class=\"{active: activeTab=='/games'}\">\n" +
   "                            <i class=\"fa fa-globe fa-fw\"></i> {{\"Games\" | translate}}\n" +
   "                        </a>\n" +
   "                    </li>\n" +
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
   "    <div ng-view id=\"main\"></div>\n" +
   "\n" +
   "    <div class=\"pre-loader global-loader global-wrapper center valign-wrapper\" ng-show=\"!hideLoader\">\n" +
   "        <i class=\"fa fa-cog fa-spin fa-3x pre-loader  valign center-block\"></i>\n" +
   "    </div>\n" +
   "\n" +
   "</div>\n" +
   "\n" +
   "\n" +
   "<script>\n" +
   "    $('.collapsible').collapsible({\n" +
   "        accordion: false\n" +
   "    });\n" +
   "</script>";

templates["../tabletop/view/modules/schemas/vtm@mmalkav.html"] = "<div class=\"row vtm_attributes\">\n" +
   "    <div class=\"col s4\">\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Name</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Name}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Player</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Player}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Chronicle</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Chronicle}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Physical</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Strength</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Strength}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Dexterity</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Dexterity}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Stamina</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Stamina}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Talents</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Alertness</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Alertness}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Athletics</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Strength}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Brawl</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Brawl}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Dodge</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Dodge}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Empathy</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Empathy}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Expression</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Expression}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Intimidation</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Intimidation}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Leadership</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Leadership}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Streetwise</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Streetwise}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Subterfuge</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Subterfuge}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Disciplines</p>\n" +
   "\n" +
   "    </div>\n" +
   "    <div class=\"col s4\">\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Nature</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Nature}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Demeanor</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Demeanor}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Concept</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Concept}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\">Attributes</p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Social</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Charisma</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Charisma}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Manipulation</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Manipulation}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Appearance</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Appearance}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\">Abilities</p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Skills</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">AnimalKen</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.AnimalKen}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Crafts</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Crafts}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Drive</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Drive}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Etiquette</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Etiquette}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Firearms</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Firearms}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Performance</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Performance}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Melee</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Melee}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Security</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Security}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Stealth</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Stealth}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Survival</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Survival}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\">Advantages</p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Backgrounds</p>\n" +
   "    </div>\n" +
   "    <div class=\"col s4\">\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Clan</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Clan}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Generation</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Generation}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Sire</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Sire}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Mental</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Perception</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Perception}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Intelligence</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Intelligence}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Wits</span>\n" +
   "            <span class=\"attr-stat\">{{char.attr.Wits}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Knowledges</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Academics</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Academics}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Computer</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Computer}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Finance</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Finance}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Investigation</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Investigation}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Law</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Law}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Linguistics</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Linguistics}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Medicine</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Medicine}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Occult</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Occult}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Politics</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Politics}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Science</span>\n" +
   "            <span class=\"attr-stat\">{{char.abi.Science}}</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr-space\"></p>\n" +
   "\n" +
   "        <p class=\"attr-group\">Virtues</p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Conscience / Conviction</span>\n" +
   "            <span class=\"attr-stat\">5</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Self-Control / Instinct</span>\n" +
   "            <span class=\"attr-stat\">4</span>\n" +
   "        </p>\n" +
   "\n" +
   "        <p class=\"attr\">\n" +
   "            <span class=\"attr-name\">Courage</span>\n" +
   "            <span class=\"attr-stat\">4</span>\n" +
   "        </p>\n" +
   "    </div>\n" +
   "</div>";
