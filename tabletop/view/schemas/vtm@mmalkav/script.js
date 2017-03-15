window.prepareCharListFunctions = function ($scope, $rootScope, $translate) {
    function startEditFunctions() {

    }
    function startCreateFunctions(isNew) {
        $scope.newChar = {
            main: {
                Name: "",
                Player: "",
                Chronicle: "",
                Nature: "",
                Demeanor: "",
                Concept: "",
                Clan: "",
                Generation: "",
                Sire: ""
            },
            attr: {
                Strength: 1,
                Dexterity: 1,
                Stamina: 1,
                Charisma: 1,
                Manipulation: 1,
                Appearance: 1,
                Perception: 1,
                Intelligence: 1,
                Wits: 1
            },
            abilities: {
                Alertness: 0,
                Athletics: 0,
                Brawl: 0,
                Dodge: 0,
                Empathy: 0,
                Expression: 0,
                Intimidation: 0,
                Leadership: 0,
                Streetwise: 0,
                Subterfuge: 0,

                AnimalKen: 0,
                Crafts: 0,
                Drive: 0,
                Etiquette: 0,
                Firearms: 0,
                Performance: 0,
                Melee: 0,
                Security: 0,
                Stealth: 0,
                Survival: 0,

                Academics: 0,
                Computer: 0,
                Finance: 0,
                Investigation: 0,
                Law: 0,
                Linguistics: 0,
                Medicine: 0,
                Occult: 0,
                Politics: 0,
                Science: 0
            },
            disciplines: {},
            advantages: {},
            virtues: {}
        };
        $scope.userType = $rootScope.userInfo.type;
        $scope.saveCharacterProceed = function(newChar) {
            window.saveCharacterProceed(newChar);
        };
        if($scope.userType != 'player') {
            $scope.newChar.start = {
                "Talents" : 999,
                "Skills" : 999,
                "Knowledges" : 999,
                "Physical" : 999,
                "Social" : 999,
                "Mental" : 999
            };
        }
        $(".attr1table input").click(function () {
            $(".attr1table input." + this.className).not($(this)).each(function () {
                this.checked = false;
            });
        });
        $scope.createNext = function (from, to) {
            console.log($scope.newChar);
            $('#' + from).closeModal();
            $('#' + to).openModal();
        };
        $scope.changeStat = function (type, val, attr, group) {
            if ($scope.newChar.start['' + group] - val > -1 && $scope.newChar[''+type]['' + attr] + val > 0 && $scope.newChar[''+type]['' + attr] + val < 6) {
                $scope.newChar.start['' + group] -= val;
                $scope.newChar[''+type]['' + attr] += val;
            }
        };
        if($scope.userType == 'player' || isNew) $('#modalCharMain').openModal();
    }

    $scope.attrPoints = {
        prices: [3, 5, 8],
        starting: [3, 5, 8]
    };
    $scope.abilitiesPoints = {
        prices: [3, 5, 8],
        starting: [8, 12, 20]
    };
    $scope.attrGroups = [
        {
            title: "Physical",
            array: ['Strength', 'Dexterity', 'Stamina']
        },
        {
            title: "Social",
            array: ['Charisma', 'Manipulation', 'Appearance']
        },
        {
            title: "Mental",
            array: ['Perception', 'Intelligence', 'Wits']
        }
    ];
    $scope.abilitiesGroups = [
        {
            title: "Talents",
            array: ["Alertness","Athletics","Brawl","Dodge","Empathy","Expression","Intimidation","Leadership","Streetwise","Subterfuge"]
        },
        {
            title: "Skills",
            array: ["AnimalKen","Crafts","Drive","Etiquette","Firearms","Performance","Melee","Security","Stealth","Survival"]
        },
        {
            title: "Knowledges",
            array: ["Academics","Computer","Finance","Investigation","Law","Linguistics","Medicine","Occult","Politics","Science"]
        }
    ];
    window.createCharacterDialog = function(isNew) {
        if($scope.char && $scope.char.main && $scope.char.main.Name && !isNew) {
            console.log("start edit func");
            startEditFunctions();
        }
        else {
            console.log("start create func");
            startCreateFunctions(isNew);
        }
    };
    window.createCharacterDialog();

    $translate.use("/schemas/" + $rootScope.currentSchema + "/" + $rootScope.currentSchema+"-" + $rootScope.userInfo.lang).then(function(){
        $translate.refresh();
    });

    $scope.range = function(n) {
        return new Array(n);
    };

    var resizeTV = function() {
        var wdt = $(window).width(), dwdt = 450;
        $('.attr-group').css({
            'font-size': 14*wdt/dwdt + 'px'
        });
        $('.attr-name').css({
            'font-size': 12*wdt/dwdt + 'px'
        });
        $('.statpoint').css({
            'width': 8*wdt/dwdt + 'px',
            'height': 8*wdt/dwdt + 'px'
        });
        $('.attr-stat').css({
            'font-size': 12*wdt/dwdt + 'px'
        });
        $('.attr-space').css({
            'font-size': 17*wdt/dwdt + 'px'
        });
        $('.vtm_main .col.s12').css({
            'font-size': 30*wdt/dwdt + 'px'
        });
    };
    $(window).resize(function() { resizeTV()});
    resizeTV();
};
window.prepareCharList();
