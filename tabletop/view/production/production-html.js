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
   "    <!--<h4 class=\"page-header global-page-header center\" ng-show=\"hideLoader\">-->\n" +
   "        <!-- -->\n" +
   "    <!--</h4>-->\n" +
   "\n" +
   "    <div class=\"panel global-panel-default\" ng-show=\"hideLoader\" ng-if=\"currentChar && currentSchema\">\n" +
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

templates["../tabletop/view/modules/schemas/vtm@mmalkav.html"] = "<svg style=\"&#10; width: 100%;&#10;\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 2513.000000 263.000000\"\n" +
   "     height=\"100%\" width=\"100%\" version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
   "    <g transform=\"translate(0.000000,263.000000) scale(0.100000,-0.100000)\" fill=\"#000000\" stroke=\"none\">\n" +
   "        <path d=\"M4500 2383 c-40 -12 -111 -16 -267 -17 -116 0 -211 -2 -210 -2 1 -1 42 -18 90 -38 171 -70 317 -155 371 -215 l19 -21 51 29 51 28 325 -77 c179 -43 318 -80 310 -83 -8 -3 -55 -13 -105 -22 -430 -79 -1041 -233 -1950 -491 -692 -197 -680 -194 -820 -201 -108 -5 -126 -4 -168 15 -36 16 -47 26 -47 43 0 21 1 21 18 6 30 -28 89 -22 123 12 36 36 37 60 3 100 -89 106 -264 30 -264 -114 0 -46 20 -84 65 -124 l36 -31 -389 0 -388 0 -48 49 -49 50 -46 -23 c-100 -51 -268 -101 -421 -127 l-75 -12 130 -22 c155 -26 256 -55 346 -100 l67 -33 28 29 28 29 4034 0 c2870 0 4039 3 4054 11 31 17 50 71 37 108 -6 17 -19 36 -29 41 -10 5 -746 181 -1636 390 -891 209 -1639 386 -1664 393 -44 13 -43 13 100 25 580 49 1095 66 1505 52 562 -20 895 -57 1563 -172 79 -14 112 -2 112 40 0 52 -16 60 -160 87 -1013 185 -1920 212 -3185 95 -115 -11 -241 -22 -280 -26 -65 -5 -105 3 -585 116 -283 66 -523 123 -532 126 -9 3 -28 25 -43 49 -29 50 -27 49 -105 28z m2620 -829 c855 -201 1557 -367 1559 -370 2 -2 -1365 -4 -3039 -4 -1674 0 -3041 2 -3039 4 4 4 535 156 1039 297 511 143 1061 279 1435 353 178 36 446 84 475 85 8 1 715 -164 1570 -365z\"/>\n" +
   "        <path d=\"M20776 2356 c-14 -25 -34 -47 -44 -50 -9 -3 -267 -64 -572 -136 l-555 -130 -270 25 c-932 86 -1584 98 -2255 40 -449 -39 -1082 -136 -1122 -172 -37 -33 -12 -93 38 -93 13 0 128 18 256 40 390 66 758 108 1147 130 233 13 834 13 1096 0 200 -10 737 -49 742 -54 1 -1 -730 -174 -1625 -384 -1543 -363 -1628 -384 -1649 -410 -33 -39 -31 -94 3 -121 l27 -21 3990 0 3990 0 44 -41 c24 -22 47 -39 51 -37 135 71 267 112 452 140 47 7 74 14 60 16 -155 22 -346 76 -457 130 l-61 29 -38 -38 -38 -39 -364 0 -364 0 26 30 c55 66 53 149 -5 215 -56 63 -154 67 -213 9 -48 -49 -31 -107 38 -134 24 -9 36 -7 67 8 42 21 54 9 21 -21 -31 -29 -76 -39 -163 -39 -130 0 -208 19 -800 186 -1011 287 -1469 402 -2034 512 -76 15 -134 29 -127 32 6 2 170 41 364 87 l352 83 44 -28 45 -28 63 52 c69 57 211 134 342 186 45 18 82 33 82 34 0 0 -93 1 -208 1 -160 1 -222 5 -275 18 -38 9 -70 17 -72 17 -2 0 -15 -20 -29 -44z m-786 -491 c392 -68 897 -183 1425 -325 285 -76 1248 -349 1254 -355 2 -3 -1341 -5 -2985 -4 -1644 0 -2984 3 -2977 6 36 14 3013 711 3043 712 19 1 127 -15 240 -34z\"/>\n" +
   "        <path d=\"M9502 2252 c83 -87 117 -162 192 -427 18 -66 55 -185 81 -265 26 -80 62 -192 80 -250 18 -58 78 -249 135 -425 56 -176 117 -371 136 -433 40 -130 59 -170 143 -301 37 -57 63 -88 66 -80 3 8 4 484 3 1059 l-3 1045 -112 3 c-62 1 -113 -1 -113 -6 0 -5 11 -19 25 -32 14 -13 35 -48 47 -79 23 -56 23 -60 26 -655 2 -329 -1 -603 -6 -608 -4 -4 -16 17 -26 49 -10 32 -49 157 -88 278 -38 121 -86 270 -105 330 -19 61 -52 164 -73 230 -21 66 -57 181 -80 255 -23 74 -59 187 -80 250 l-38 115 -133 3 -133 3 56 -59z\"/>\n" +
   "        <path d=\"M9810 2294 c0 -8 5 -24 10 -35 11 -19 54 -19 2930 -19 l2920 0 0 35 0 35 -2930 0 c-2652 0 -2930 -1 -2930 -16z\"/>\n" +
   "        <path d=\"M10955 2153 c25 -37 23 -62 -25 -438 -23 -176 -47 -374 -55 -440 -26 -211 -46 -329 -66 -374 -10 -24 -19 -45 -19 -47 0 -2 36 -4 80 -4 44 0 80 2 80 4 0 2 -7 17 -15 32 -8 16 -15 45 -15 64 0 46 39 370 46 381 9 14 124 11 129 -3 5 -16 34 -257 42 -350 4 -53 2 -73 -11 -92 -9 -14 -16 -28 -16 -31 0 -3 38 -5 85 -5 47 0 85 2 85 5 0 3 -9 32 -19 63 -11 32 -25 94 -30 138 -41 315 -63 480 -82 619 -11 88 -31 237 -43 330 l-21 170 -74 3 -74 3 18 -28z m98 -478 c10 -80 15 -150 12 -155 -3 -6 -22 -10 -42 -10 l-36 0 7 78 c8 103 28 232 35 232 4 0 14 -65 24 -145z\"/>\n" +
   "        <path d=\"M11810 2175 c0 -3 10 -20 23 -36 l22 -31 0 -551 c0 -533 -3 -586 -31 -684 -6 -22 -4 -23 69 -23 l76 0 -15 28 c-11 22 -14 103 -13 472 1 245 3 436 6 425 26 -120 83 -411 88 -450 8 -58 52 -202 64 -209 4 -3 15 36 24 87 8 51 29 175 46 277 18 102 34 196 37 210 15 64 19 -35 14 -404 -5 -369 -6 -395 -24 -415 l-19 -21 88 0 c72 0 86 3 82 14 -31 79 -32 109 -32 688 0 456 3 590 13 599 24 25 11 30 -60 27 l-73 -3 -7 -75 c-8 -83 -81 -451 -94 -471 -5 -9 -14 18 -25 71 -10 47 -34 162 -53 255 -20 94 -36 182 -36 198 l0 27 -85 0 c-47 0 -85 -2 -85 -5z\"/>\n" +
   "        <path d=\"M12923 2143 l22 -38 0 -595 c0 -551 -1 -598 -17 -623 -10 -14 -18 -29 -18 -32 0 -3 38 -5 85 -5 47 0 85 2 85 5 0 3 -7 22 -17 43 -13 30 -17 83 -21 290 l-4 253 39 -7 c33 -5 44 -2 70 20 63 53 102 189 103 362 0 165 -30 273 -91 329 l-39 35 -110 0 -109 0 22 -37z m200 -190 c31 -69 30 -270 -2 -357 -23 -63 -46 -96 -68 -96 -10 0 -13 47 -13 250 l0 250 31 0 c26 0 33 -6 52 -47z\"/>\n" +
   "        <path d=\"M13770 2175 c0 -3 8 -18 18 -32 16 -25 17 -73 17 -628 0 -555 -1 -603 -17 -628 -10 -14 -18 -29 -18 -32 0 -3 38 -5 85 -5 47 0 85 2 85 3 0 2 -8 19 -17 38 -17 31 -18 82 -18 624 0 534 2 594 17 628 l17 37 -85 0 c-46 0 -84 -2 -84 -5z\"/>\n" +
   "        <path d=\"M14470 2176 c0 -2 8 -21 18 -42 16 -36 17 -89 17 -629 0 -546 -1 -593 -17 -618 -10 -14 -18 -29 -18 -32 0 -3 38 -5 85 -5 47 0 85 2 85 3 0 2 -7 19 -16 37 -14 27 -17 77 -20 289 -5 298 -7 300 77 -43 31 -128 62 -232 74 -250 19 -28 27 -31 78 -34 31 -2 57 -1 57 2 0 3 -16 44 -35 91 -37 90 -85 247 -130 431 l-27 112 26 45 c46 78 66 172 67 315 0 156 -22 242 -77 297 l-35 35 -104 0 c-58 0 -105 -2 -105 -4z m215 -237 c27 -100 15 -235 -28 -319 -13 -25 -31 -46 -40 -48 -16 -3 -17 15 -17 217 0 199 2 221 18 230 25 15 50 -15 67 -80z\"/>\n" +
   "        <path d=\"M15290 2171 c0 -6 4 -13 10 -16 11 -7 28 -66 40 -143 5 -30 10 -402 10 -826 2 -793 2 -782 -35 -868 -7 -17 6 -18 188 -18 108 0 198 4 201 8 7 12 48 333 43 338 -2 3 -18 -20 -35 -50 -44 -77 -134 -138 -217 -148 l-30 -3 -3 458 -2 457 49 0 c27 0 53 -6 59 -13 6 -7 16 -43 23 -81 9 -48 15 -63 20 -50 11 27 11 314 0 314 -5 0 -14 -7 -21 -15 -8 -10 -31 -15 -71 -15 l-59 0 0 265 0 265 30 0 c16 0 48 -7 70 -16 44 -18 73 -60 85 -127 15 -80 25 -29 25 128 l0 165 -190 0 c-112 0 -190 -4 -190 -9z\"/>\n" +
   "        <path d=\"M10427 773 c-12 -12 -7 -52 7 -60 8 -4 1097 -7 2420 -5 l2406 2 0 35 0 35 -2413 0 c-1328 0 -2417 -3 -2420 -7z\"/>\n" +
   "        <path d=\"M10427 644 c-3 -3 -4 -11 -2 -17 2 -7 6 -24 9 -39 8 -34 18 -36 31 -5 6 13 21 23 38 25 l27 3 0 -131 c0 -107 -3 -132 -15 -136 -8 -4 -15 -12 -15 -20 0 -10 14 -14 48 -14 l47 0 -3 151 -4 151 29 -4 c17 -2 32 -11 38 -25 5 -13 12 -23 15 -23 8 0 28 78 22 85 -7 7 -257 6 -265 -1z\"/>\n" +
   "        <path d=\"M11016 628 c-11 -15 -16 -45 -16 -85 l0 -63 -50 0 c-27 0 -50 3 -51 8 -1 4 -2 31 -4 60 -2 43 1 55 17 63 30 16 11 29 -42 29 -51 0 -71 -13 -45 -27 13 -8 16 -32 16 -137 1 -113 -1 -129 -17 -141 -17 -12 -18 -14 -2 -20 9 -4 29 -5 45 -3 27 3 28 5 29 63 1 33 2 66 3 73 0 8 18 12 51 12 l50 0 0 -59 c0 -44 -4 -60 -16 -65 -29 -11 -3 -26 46 -26 56 0 67 9 39 33 -17 15 -19 30 -19 135 0 75 4 122 11 129 15 15 4 43 -15 43 -8 0 -22 -10 -30 -22z\"/>\n" +
   "        <path d=\"M11215 636 c-15 -11 -17 -17 -7 -28 7 -9 13 -59 15 -124 2 -95 6 -114 25 -142 27 -37 89 -58 130 -44 42 14 36 27 -10 24 -58 -5 -87 25 -90 94 l-3 49 48 3 c26 2 47 -1 47 -6 0 -4 7 -17 15 -28 13 -17 14 -14 15 44 0 60 -12 83 -23 41 -5 -17 -12 -20 -54 -17 l-48 3 0 50 0 50 58 3 c52 3 59 1 64 -17 10 -39 30 -24 24 17 l-6 37 -90 3 c-66 2 -95 -1 -110 -12z\"/>\n" +
   "        <path d=\"M11657 643 c-4 -3 2 -13 14 -21 19 -13 20 -23 18 -195 l-2 -182 35 -39 34 -40 -4 209 c-4 175 -2 206 9 200 8 -5 33 -21 56 -37 23 -15 46 -28 50 -28 5 0 28 14 51 31 23 17 47 27 53 23 8 -4 10 -63 9 -193 -2 -102 -2 -190 -1 -196 0 -5 13 7 28 28 l26 37 -2 184 c-2 176 -2 185 18 198 27 19 17 28 -30 28 -26 0 -52 -10 -88 -35 -28 -19 -55 -35 -61 -35 -6 0 -33 16 -61 35 -41 28 -61 35 -98 35 -26 0 -51 -3 -54 -7z\"/>\n" +
   "        <path d=\"M12293 638 c-5 -7 -31 -74 -58 -148 -27 -74 -54 -139 -62 -143 -28 -17 -14 -37 27 -37 40 0 52 14 30 36 -5 5 -6 22 -2 39 8 27 13 30 55 33 47 3 48 2 63 -35 23 -59 29 -68 53 -71 23 -4 41 25 22 37 -6 4 -33 71 -59 149 -27 78 -51 144 -54 147 -3 3 -10 0 -15 -7z\"/>\n" +
   "        <path d=\"M12894 640 c-80 -32 -95 -177 -24 -232 17 -13 51 -40 76 -60 46 -39 85 -47 129 -28 16 7 11 9 -21 9 -28 1 -47 8 -59 21 -10 11 -16 21 -14 23 2 2 17 11 32 21 113 70 71 257 -57 255 -22 0 -51 -4 -62 -9z m81 -20 c30 -11 55 -63 55 -112 0 -43 -33 -96 -65 -104 -81 -20 -127 135 -59 203 26 26 32 27 69 13z\"/>\n" +
   "        <path d=\"M13199 634 c-10 -12 -10 -20 -1 -35 7 -11 12 -59 12 -118 0 -111 10 -145 49 -160 20 -9 108 -9 161 -2 3 1 4 62 2 136 -4 118 -2 138 13 155 23 26 11 40 -35 40 -47 0 -62 -18 -32 -38 20 -13 22 -23 22 -117 0 -88 -3 -106 -21 -129 -25 -32 -68 -35 -95 -5 -16 18 -20 40 -23 143 -4 138 -17 172 -52 130z\"/>\n" +
   "        <path d=\"M13581 636 c-9 -11 -9 -20 -2 -35 6 -11 11 -63 11 -116 0 -106 13 -144 57 -164 26 -12 73 -14 97 -5 29 11 17 20 -21 16 -51 -5 -78 22 -88 84 -5 34 -3 49 7 55 23 15 57 10 78 -11 11 -11 22 -20 25 -20 3 0 5 23 5 50 0 52 -5 60 -24 36 -10 -14 -38 -20 -79 -17 -15 1 -18 9 -15 49 l3 47 53 3 c47 3 54 1 59 -17 7 -29 23 -26 23 3 0 52 -6 56 -95 56 -60 0 -86 -4 -94 -14z\"/>\n" +
   "        <path d=\"M13925 640 c-5 -8 -1 -18 11 -27 16 -12 19 -30 22 -128 3 -104 2 -115 -17 -134 -33 -33 -25 -41 39 -41 64 0 72 8 39 41 -15 15 -19 30 -17 62 3 41 4 42 40 45 29 3 40 -1 52 -20 20 -32 31 -94 17 -102 -24 -15 -9 -26 34 -26 41 0 58 11 36 24 -5 3 -14 27 -21 53 -6 27 -18 56 -27 65 -14 15 -13 20 6 44 30 38 28 94 -4 124 -22 21 -38 24 -114 28 -64 3 -91 1 -96 -8z\"/>\n" +
   "        <path d=\"M14425 633 c-4 -10 -27 -74 -52 -143 -25 -69 -54 -134 -64 -146 -23 -25 -16 -34 27 -34 39 0 49 12 32 39 -9 15 -9 25 0 45 10 22 18 26 57 26 41 0 47 -3 55 -27 18 -51 36 -78 54 -81 29 -6 42 14 24 35 -8 10 -37 82 -63 161 -27 78 -52 142 -56 142 -4 0 -10 -8 -14 -17z\"/>\n" +
   "        <path d=\"M14685 640 c-5 -8 1 -19 14 -30 22 -16 23 -22 20 -156 -3 -133 -2 -139 17 -136 28 5 46 4 77 -4 43 -10 82 12 111 66 48 89 26 209 -47 246 -41 22 -181 32 -192 14z m173 -50 c76 -71 40 -260 -49 -260 -16 0 -32 6 -36 14 -4 8 -7 71 -5 140 l3 126 33 0 c18 0 41 -8 54 -20z\"/>\n" +
   "        <path d=\"M15073 638 c-7 -8 -8 -54 -3 -129 10 -158 33 -199 112 -199 18 0 40 5 48 10 11 7 7 10 -18 10 -46 0 -68 14 -81 51 -17 50 -14 87 8 94 30 9 68 -5 77 -28 6 -19 8 -18 11 11 2 17 2 47 0 65 -3 28 -5 29 -11 10 -9 -23 -47 -37 -77 -28 -15 5 -19 16 -19 56 l0 49 49 0 c39 0 52 -4 65 -22 16 -23 16 -22 13 17 l-2 40 -81 3 c-57 2 -84 -1 -91 -10z\"/>\n" +
   "        <path d=\"M12515 615 c-44 -44 -22 -108 47 -135 87 -35 108 -72 67 -124 -16 -21 -29 -26 -62 -26 -31 0 -38 -3 -27 -10 8 -5 35 -10 58 -10 36 0 49 5 72 30 35 38 46 82 29 121 -9 22 -30 39 -80 65 -74 37 -88 63 -48 84 30 16 66 4 81 -26 18 -37 32 -34 39 9 5 34 4 35 -30 41 -77 13 -121 7 -146 -19z\"/>\n" +
   "    </g>\n" +
   "</svg>\n" +
   "<div class=\"row vtm_main\" ng-init=\"prepareCharList()\">\n" +
   "    <div class=\"col s12 center\">\n" +
   "        {{char.main.Name}}\n" +
   "    </div>\n" +
   "    <div class=\"col s6\">\n" +
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
   "    </div>\n" +
   "    <div class=\"col s6\">\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Clan</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Clan}}</span>\n" +
   "        </p>\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Generation</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Generation}}</span>\n" +
   "        </p>\n" +
   "        <p class=\"main_info\">\n" +
   "            <span class=\"attr-name\">Sire</span>\n" +
   "            <span class=\"attr-stat\">{{char.main.Sire}}</span>\n" +
   "        </p>\n" +
   "    </div>\n" +
   "</div>\n" +
   "<div class=\"row vtm_attributes\">\n" +
   "\n" +
   "    <div class=\"col s4\">\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Name</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Name}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Player</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Player}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Chronicle</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Chronicle}}</span>-->\n" +
   "        <!--</p>-->\n" +
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
   "            <span class=\"attr-stat\">{{char.abi.Athletics}}</span>\n" +
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
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Nature</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Nature}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Demeanor</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Demeanor}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Concept</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Concept}}</span>-->\n" +
   "        <!--</p>-->\n" +
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
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Clan</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Clan}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Generation</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Generation}}</span>-->\n" +
   "        <!--</p>-->\n" +
   "\n" +
   "        <!--<p class=\"main_info\">-->\n" +
   "        <!--<span class=\"attr-name\">Sire</span>-->\n" +
   "        <!--<span class=\"attr-stat\">{{char.main.Sire}}</span>-->\n" +
   "        <!--</p>-->\n" +
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
   "</div>\n" +
   "\n" +
   "<div id=\"modalCharMain\" class=\"modal bottom-sheet mainform\">\n" +
   "    <a class=\"close-btn modal-close\">\n" +
   "        <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
   "    </a>\n" +
   "    <div class=\"modal-content\">\n" +
   "        <h4>Creating Character</h4>\n" +
   "        <h5>Main info ( step 1 of 8 )</h5>\n" +
   "        <form class=\"col s12\" name=\"vtm_main_form\">\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s12\">\n" +
   "                    <input id=\"c_name\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Name\" required>\n" +
   "                    <label for=\"c_name\">Name</label>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_nature\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Nature\">\n" +
   "                    <label for=\"c_nature\">Nature</label>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_demeanor\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Demeanor\">\n" +
   "                    <label for=\"c_demeanor\">Demeanor</label>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_clan\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Clan\">\n" +
   "                    <label for=\"c_clan\">Clan</label>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_generation\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Generation\">\n" +
   "                    <label for=\"c_generation\">Generation</label>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_concept\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Concept\">\n" +
   "                    <label for=\"c_concept\">Concept</label>\n" +
   "                </div>\n" +
   "                <div class=\"input-field col s6\">\n" +
   "                    <input id=\"c_sire\" type=\"text\" class=\"validate\" ng-model=\"newChar.main.Sire\">\n" +
   "                    <label for=\"c_sire\">Sire</label>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"modal-footer\">\n" +
   "                <a class=\"modal-action modal-close waves-effect waves-green btn-flat close-modal\">\n" +
   "                    Close\n" +
   "                </a>\n" +
   "                <button ng-disabled=\"!vtm_main_form.$valid\" ng-click=\"createNext('modalCharMain','modalCharAttr1')\" class=\"waves-effect waves-green btn-flat next-modal\">\n" +
   "                    Next\n" +
   "                </button>\n" +
   "            </div>\n" +
   "        </form>\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<div id=\"modalCharAttr1\" class=\"modal bottom-sheet mainform\">\n" +
   "    <a class=\"close-btn modal-close\">\n" +
   "        <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
   "    </a>\n" +
   "    <div class=\"modal-content\">\n" +
   "        <h4>Creating Character</h4>\n" +
   "        <h5>Attributes cost ( step 2 of 8 )</h5>\n" +
   "        <form class=\"col s12\" name=\"vtm_attr1_form\">\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    Physical\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                   Social\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    Mental\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    3\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"a1\" type=\"radio\" class=\"a1\" name=\"a1\" ng-model=\"newChar.pref.Physical\" value=\"3\"><label for=\"a1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"a2\" type=\"radio\" class=\"a2\" name=\"a1\" ng-model=\"newChar.pref.Social\" value=\"3\"><label for=\"a2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"a3\" type=\"radio\" class=\"a3\" name=\"a1\" ng-model=\"newChar.pref.Mental\" value=\"3\"><label for=\"a3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    5\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"b1\" type=\"radio\" class=\"a1\" name=\"a2\" ng-model=\"newChar.pref.Physical\" value=\"5\"><label for=\"b1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"b2\" type=\"radio\" class=\"a2\" name=\"a2\" ng-model=\"newChar.pref.Social\" value=\"5\"><label for=\"b2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"b3\" type=\"radio\" class=\"a3\" name=\"a2\" ng-model=\"newChar.pref.Mental\" value=\"5\"><label for=\"b3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    8\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"c1\" type=\"radio\" class=\"a1\" name=\"a3\" ng-model=\"newChar.pref.Physical\" value=\"8\"><label for=\"c1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"c2\" type=\"radio\" class=\"a2\" name=\"a3\" ng-model=\"newChar.pref.Social\" value=\"8\"><label for=\"c2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"c3\" type=\"radio\" class=\"a3\" name=\"a3\" ng-model=\"newChar.pref.Mental\" value=\"8\"><label for=\"c3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "            </div>\n" +
   "        </form>\n" +
   "        <h5>Attributes starting ( step 3 of 8 )</h5>\n" +
   "        <form class=\"col s12\" name=\"vtm_attr1_form\">\n" +
   "            <div class=\"row\">\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    Physical\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    Social\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    Mental\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    3\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sa1\" type=\"radio\" class=\"a1\" name=\"a1\" ng-model=\"newChar.start.Physical\" value=\"3\"><label for=\"sa1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sa2\" type=\"radio\" class=\"a2\" name=\"a1\" ng-model=\"newChar.start.Social\" value=\"3\"><label for=\"sa2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sa3\" type=\"radio\" class=\"a3\" name=\"a1\" ng-model=\"newChar.start.Mental\" value=\"3\"><label for=\"sa3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    5\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sb1\" type=\"radio\" class=\"a1\" name=\"a2\" ng-model=\"newChar.start.Physical\" value=\"5\"><label for=\"sb1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sb2\" type=\"radio\" class=\"a2\" name=\"a2\" ng-model=\"newChar.start.Social\" value=\"5\"><label for=\"sb2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sb3\" type=\"radio\" class=\"a3\" name=\"a2\" ng-model=\"newChar.start.Mental\" value=\"5\"><label for=\"sb3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "\n" +
   "                <div class=\"col s1\"></div>\n" +
   "                <div class=\"col s1\">\n" +
   "                    8\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sc1\" type=\"radio\" class=\"a1\" name=\"a3\" ng-model=\"newChar.start.Physical\" value=\"8\"><label for=\"sc1\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sc2\" type=\"radio\" class=\"a2\" name=\"a3\" ng-model=\"newChar.start.Social\" value=\"8\"><label for=\"sc2\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s3\">\n" +
   "                    <input id=\"sc3\" type=\"radio\" class=\"a3\" name=\"a3\" ng-model=\"newChar.start.Mental\" value=\"8\"><label for=\"sc3\"></label>\n" +
   "                </div>\n" +
   "                <div class=\"col s1\"></div>\n" +
   "            </div>\n" +
   "            <div class=\"modal-footer\">\n" +
   "                <a class=\"modal-action modal-close waves-effect waves-green btn-flat close-modal\">\n" +
   "                    Close\n" +
   "                </a>\n" +
   "                <button ng-click=\"createNext('modalCharAttr1','modalCharAttr2')\" class=\"waves-effect waves-green btn-flat next-modal\">\n" +
   "                    Next\n" +
   "                </button>\n" +
   "            </div>\n" +
   "        </form>\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<div id=\"modalCharAttr2\" class=\"modal bottom-sheet mainform\">\n" +
   "    <a class=\"close-btn modal-close\">\n" +
   "        <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
   "    </a>\n" +
   "    <div class=\"modal-content\">\n" +
   "        <h4>Creating Character</h4>\n" +
   "\n" +
   "        <div class=\"row\">\n" +
   "            <h5>Physical attributes ( step 4 of 8 )</h5>\n" +
   "            <form class=\"col s12\" name=\"vtm_attr1_form\">\n" +
   "                <div class=\"col s4\" ng-repeat=\"stat in ['Strength','Dexterity','Stamina']\">\n" +
   "                    <div class=\"col s12\">\n" +
   "                        {{stat}}\n" +
   "                    </div>\n" +
   "                    <div class=\"col s12\">\n" +
   "                        <i class=\"fa fa-minus\" ng-click=\"changeAttr(-1,stat, 'social')\" aria-hidden=\"true\"></i>{{newChar.attr[\"\"+stat] || 1}}<i ng-click=\"changeAttr(-1,stat, 'social')\" class=\"fa fa-plus\" aria-hidden=\"true\"></i>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" ng-click=\"changeAttr(-1,stat, 'social')\" aria-hidden=\"true\"></i>{{newChar.attr[\"\"+stat] || 1}}<i ng-click=\"changeAttr(-1,stat, 'social')\" class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Strength-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Strength || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Dexterity-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Dexterity || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Stamina-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Stamina || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "            </form>\n" +
   "            <h5>Social attributes ( step 5 of 8 )</h5>\n" +
   "            <form class=\"col s12\" name=\"vtm_attr1_form\">\n" +
   "                <div class=\"col s4\" ng-repeat=\"stat in ['Charisma','Manipulation','Appearance']\">\n" +
   "                    <div class=\"col s12\">\n" +
   "                        {{stat}}\n" +
   "                    </div>\n" +
   "                    <div class=\"col s12\">\n" +
   "                        <i class=\"fa fa-minus\" ng-click=\"changeAttr(-1,stat, 'social')\" aria-hidden=\"true\"></i>{{newChar.attr[\"\"+stat] || 1}}<i ng-click=\"changeAttr(-1,stat, 'social')\" class=\"fa fa-plus\" aria-hidden=\"true\"></i>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Charisma-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Charisma || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Manipulation-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Manipulation || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Appearance-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Appearance || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "            </form>\n" +
   "            <h5>Mental attributes ( step 6 of 8 )</h5>\n" +
   "            <form class=\"col s12\" name=\"vtm_attr1_form\">\n" +
   "                <div class=\"col s4\" ng-repeat=\"stat in ['Perception','Intelligence','Wits']\">\n" +
   "                    <div class=\"col s12\">\n" +
   "                        {{stat}}\n" +
   "                    </div>\n" +
   "                    <div class=\"col s12\">\n" +
   "                        <i class=\"fa fa-minus\" ng-click=\"changeAttr(-1,stat, 'social')\" aria-hidden=\"true\"></i>\n" +
   "                        {{newChar.attr[\"\"+stat] || 1}}\n" +
   "                        <i ng-click=\"changeAttr(-1,stat, 'social')\" class=\"fa fa-plus\" aria-hidden=\"true\"></i>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Perception-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Perception || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Intelligence-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i>{{newChar.attr.Intelligence || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--Wits-->\n" +
   "                <!--</div>-->\n" +
   "                <!--<div class=\"col s12\">-->\n" +
   "                <!--<i class=\"fa fa-minus\" aria-hidden=\"true\"></i> {{newChar.attr.Wits || 1}}<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>-->\n" +
   "                <!--</div>-->\n" +
   "                <div class=\"modal-footer\">\n" +
   "                    <a class=\"modal-action modal-close waves-effect waves-green btn-flat close-modal\">\n" +
   "                        Close\n" +
   "                    </a>\n" +
   "                    <button ng-click=\"createNext('modalCharAttr2','modalCharAttr2')\" class=\"waves-effect waves-green btn-flat next-modal\">\n" +
   "                        Next\n" +
   "                    </button>\n" +
   "                </div>\n" +
   "            </form>\n" +
   "        </div>\n" +
   "\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "<style>\n" +
   "    .modal.bottom-sheet.mainform {\n" +
   "        max-height: 100%;\n" +
   "    }\n" +
   "    .next-modal {\n" +
   "        color: #fff;\n" +
   "        background-color: #000;\n" +
   "        font-size: 16px;\n" +
   "    }\n" +
   "    .next-modal[disabled] {\n" +
   "        background-color: #eee;\n" +
   "    }\n" +
   "    .modal .modal-footer .btn-flat.close-modal {\n" +
   "        float: left;\n" +
   "        border: 1px solid #000;\n" +
   "    }\n" +
   "    #modalCharAttr1 .col {\n" +
   "        min-height: 31px;\n" +
   "    }\n" +
   "    .close-btn {\n" +
   "        position: absolute;\n" +
   "        font-size: 25px;\n" +
   "        right: 10px;\n" +
   "        top: 5px;\n" +
   "        color: #000;\n" +
   "    }\n" +
   "    .vtm_attributes, .vtm_main {\n" +
   "        padding: 0 10px;\n" +
   "        margin: 0 10px;\n" +
   "        border: 2px solid #000;\n" +
   "    }\n" +
   "\n" +
   "    char-list {\n" +
   "        float: left;\n" +
   "        padding-top: 10px;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main {\n" +
   "        border-top: none;\n" +
   "        border-bottom: none;\n" +
   "        padding-top: 15px;\n" +
   "        margin-top: -15px;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes {\n" +
   "        padding-bottom: 15px;\n" +
   "        border-top: none;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main .col, .vtm_attributes .col {\n" +
   "        padding: 0;\n" +
   "        border-right: 1px solid #000;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main .col.s12 {\n" +
   "        border: none;\n" +
   "        font-size: 20px;\n" +
   "        font-weight: 900;\n" +
   "        text-decoration: underline;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .col {\n" +
   "        min-height: 500px;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main .col:last-child, .vtm_attributes .col:last-child {\n" +
   "        border: none;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main p {\n" +
   "        padding-left: 5px;\n" +
   "        margin: 0;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes p {\n" +
   "        margin: 0;\n" +
   "        padding: 2px 0;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main .attr-stat {\n" +
   "        font-weight: normal;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_main .main_info {\n" +
   "        font-weight: 900;\n" +
   "        text-overflow: ellipsis;\n" +
   "        word-break: break-all;\n" +
   "        white-space: nowrap;\n" +
   "        overflow: hidden;\n" +
   "        padding-left: 3px;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .attr-space {\n" +
   "        padding: 5px 0;\n" +
   "        height: 30px;\n" +
   "        float: left;\n" +
   "        width: 100%;\n" +
   "        text-align: center;\n" +
   "        font-size: 120%;\n" +
   "        margin-left: -1px;\n" +
   "        margin-right: -1px;\n" +
   "        background: #fff;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .attr-group {\n" +
   "        padding: 5px 0;\n" +
   "        border-top: 1px solid #000;\n" +
   "        border-bottom: 1px solid #000;\n" +
   "        float: left;\n" +
   "        width: 100%;\n" +
   "        text-align: center;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .attr {\n" +
   "        width: 100%;\n" +
   "        float: left;\n" +
   "        padding-left: 5px;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .attr-stat, .vtm_main .attr-stat {\n" +
   "        float: right;\n" +
   "        margin-right: 2px;\n" +
   "        margin-top: 2px;\n" +
   "        border-radius: 50px;\n" +
   "        line-height: 17px;\n" +
   "        text-align: center;\n" +
   "    }\n" +
   "\n" +
   "    .vtm_attributes .attr-name {\n" +
   "        float: left;\n" +
   "        max-width: 80%;\n" +
   "        font-size: 12px;\n" +
   "        line-height: 14px;\n" +
   "    }\n" +
   "</style>\n" +
   "\n" +
   "<script>\n" +
   "    $(document).ready(function () {\n" +
   "\n" +
   "    });\n" +
   "    window.prepareCharListFunctions = function($scope, $rootScope) {\n" +
   "\n" +
   "        function startEditFunctions() {\n" +
   "\n" +
   "        }\n" +
   "\n" +
   "        function startCreateFunctions() {\n" +
   "            $scope.newChar = {\n" +
   "                main : {\n" +
   "                    Name : \"\",\n" +
   "                    Player : \"\",\n" +
   "                    Chronicle : \"\",\n" +
   "                    Nature : \"\",\n" +
   "                    Demeanor : \"\",\n" +
   "                    Concept : \"\",\n" +
   "                    Clan : \"\",\n" +
   "                    Generation : \"\",\n" +
   "                    Sire : \"\"\n" +
   "                },\n" +
   "                attr : {\n" +
   "                    Alertness : \"\",\n" +
   "                    Athletics : \"\",\n" +
   "                    Brawl : \"\",\n" +
   "                    Dodge : \"\",\n" +
   "                    Empathy : \"\",\n" +
   "                    Expression : \"\",\n" +
   "                    Intimidation : \"\",\n" +
   "                    Leadership : \"\",\n" +
   "                    Streetwise : \"\",\n" +
   "                    Subterfuge : \"\",\n" +
   "                    AnimalKen : \"\",\n" +
   "                    Crafts : \"\",\n" +
   "                    Drive : \"\",\n" +
   "                    Etiquette : \"\",\n" +
   "                    Firearms : \"\",\n" +
   "                    Performance : \"\",\n" +
   "                    Melee : \"\",\n" +
   "                    Security : \"\",\n" +
   "                    Stealth : \"\",\n" +
   "                    Survival : \"\",\n" +
   "                    Academics : \"\",\n" +
   "                    Computer : \"\",\n" +
   "                    Finance : \"\",\n" +
   "                    Investigation : \"\",\n" +
   "                    Law : \"\",\n" +
   "                    Linguistics : \"\",\n" +
   "                    Medicine : \"\",\n" +
   "                    Occult : \"\",\n" +
   "                    Politics : \"\",\n" +
   "                    Science : \"\"\n" +
   "                },\n" +
   "                disciplines : {\n" +
   "\n" +
   "                },\n" +
   "                advantages : {\n" +
   "\n" +
   "                },\n" +
   "                virtues : {\n" +
   "\n" +
   "                }\n" +
   "            };\n" +
   "            $(\".attr1table input\").click(function(){\n" +
   "                $(\".attr1table input.\"+this.className).not($(this)).each(function(){\n" +
   "                    this.checked = false;\n" +
   "                });\n" +
   "            });\n" +
   "            $scope.createNext = function(from, to) {\n" +
   "                console.log($scope.newChar);\n" +
   "                $('#'+from).closeModal();\n" +
   "                $('#'+to).openModal();\n" +
   "            };\n" +
   "            //$('#modalCharMain').openModal();\n" +
   "            $('#modalCharAttr2').openModal();\n" +
   "        }\n" +
   "\n" +
   "        if ($scope.char.list && $scope.char.list.concept) {\n" +
   "            console.log(\"start edit func\");\n" +
   "            $scope.currentChar = angular.copy($scope.char);\n" +
   "            startEditFunctions();\n" +
   "        }\n" +
   "        else {\n" +
   "            startCreateFunctions();\n" +
   "        }\n" +
   "    };\n" +
   "    window.prepareCharList();\n" +
   "</script>";
