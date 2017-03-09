window.prepareCharListFunctions = function ($scope, $rootScope) {
    function startEditFunctions() {

    }
    function startCreateFunctions() {
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
        $('#modalCharMain').openModal();
    }

    if ($scope.char.list && $scope.char.list.concept) {
        console.log("start edit func");
        $scope.currentChar = angular.copy($scope.char);
        startEditFunctions();
    }
    else {
        startCreateFunctions();
    }
};
window.prepareCharList();
