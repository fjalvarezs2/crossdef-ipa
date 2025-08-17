var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");


    var app = angular.module('frenchEx', [ 'ngMaterial', 'ngTable', 'chart.js' ]);
    app.controller('phonetiqueController', phonetiqueController).config(
            function($mdThemingProvider) {
                $mdThemingProvider.theme('default').primaryPalette('teal')
                        .accentPalette('amber');
                $mdThemingProvider.theme('success-toast');
                $mdThemingProvider.theme('error-toast');

            });

    app.config(function(ChartJsProvider) {
        ChartJsProvider.setOptions({
            colors : [ '#009688', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C',
                    '#949FB1', '#4D5360' ]
        });
    });

    phonetiqueController.$inject = [ "$scope", "$mdToast", "$mdDialog", "NgTableParams", "$http", "$q" ];

    function phonetiqueController($scope, $mdToast, $mdDialog, NgTableParams, $http, $q) {

        $scope.wordLists  =  {"level-1" : "A1 - Words [1..500]",
                            "level-2" : "A2 - Words [501..1,000]",
                            "level-3" : "B1 - Words [1,001..2000]",
                            "level-4" : "B2 - Words [2,001..4000]",
                            "level-5" : "C1 - Words [4,001..8000]",
                            "difficult-1" :"Selection of difficult words",
                            "theatre": "Script: Le Petasses"};
        $scope.selectedWordList = "level-1";

        $scope.progress = [];
        $scope.labelsProgress = [];
        $scope.ortho = "";
        $scope.phonemes = [];

        $scope.labelsDonut = [ "Good", "Bad" ];
        $scope.colors = [ '#009688', '#f7464a' ];
        $scope.series = 'progress';
        $scope.showPron = true;
        $scope.showTypedPron = true;
        $scope.showDef = true;
        $scope.exSize = 20;
        $scope.typedIpa = "";

        $scope.domainServer = "/lib/";
        $scope.domainEspeak = "/cgi-bin/transcriptioner";
        
        $scope.doneEx = [];

        $scope.tableParams = 
            new NgTableParams({count : 1000}, {counts : [], dataset : $scope.doneEx});

        $scope.toggleShowPron = function() {
            $scope.showPron = !$scope.showPron;
        };

        $scope.toggleShowTypedPron = function() {
            $scope.showTypedPron = !$scope.showTypedPron;
        }; 

        $scope.checkShowPron = function() {
            return $scope.showPron;
        };

        // -> Fisher–Yates shuffle algorithm
        var shuffleArray = function(array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        };

        $scope.loadWordList = function(wordList){ 
            $http.get($scope.domainServer + wordList + ".json").then(function(response) {
                $scope.difficultWords = response.data.exercises;
                $scope.restart();
            });
        };

        $scope.loadPhonemes = function(){
            $http.get($scope.domainServer + "ipa.json").then(function(response) {
                $scope.phonemes = response.data.phonemes;
            });
        };
        
        $scope.loadIpa = function(){ 
            if (! $scope.currentEx().ipa ) { 
                $scope.currentEx().ipa = "";          
                $http.get($scope.domainEspeak + "?lang=fr&word=" + $scope.currentEx().ortho).then(function(response) {
                    $scope.currentEx().ipa = response.data.transcriptions.fr.replace(/\(fr\)/g,"");
                });
            }
        };

        var canceler = $q.defer();
        var resolved = false;

        var cancel = function() {
              canceler.resolve("http call aborted");
        };


        $scope.loadTypedIpa = function(){ 

            if (resolved) {
                cancel();
            }

            canceler = $q.defer();
            resolved = true;

            $scope.typedIpa = "";
            $http.get($scope.domainEspeak + "?lang=fr&word=" + $scope.ortho).then(function(response) {
                $scope.typedIpa = response.data.transcriptions.fr.replace(/\(fr\)/g,"");
                resolved = false;
            });
            
        };

        $scope.checkOrtho = function() {
            if ($scope.ortho == $scope.currentEx().ortho) {
                $scope.showSimpleToast("success-toast", "Bravo!");
                $scope.goodEx++;
                $scope.summaryEx[0]++;

            } else {
                $scope.showSimpleToast("error-toast", "The right spelling is: \"" +
                         $scope.currentEx().ortho + "\" instead of \"" +
                         $scope.ortho + "\"");
                $scope.currentEx().userOrtho = $scope.ortho;
                $scope.doneEx.unshift($scope.currentEx());
                $scope.tableParams.reload();
                $scope.badEx++;
                $scope.summaryEx[1]++;
            }

            $scope.labelsProgress[$scope.activityNumber - 1] = '';
            $scope.progress[$scope.activityNumber - 1] = $scope.goodEx - $scope.badEx;
        };

        $scope.showSimpleToast = function(messageType, messsage) {
            $mdToast.show($mdToast.simple().textContent(messsage).position(
                    'top center').theme(messageType).hideDelay(3000));
        };

        $scope.currentEx = function() {
            return $scope.exercises ?  $scope.exercises[$scope.activityNumber - 1] : null;
        };

        $scope.pronounce = function() {
             if ( typeof SpeechSynthesisUtterance !== "undefined" && $scope.currentEx()) { 
                    var msg = new SpeechSynthesisUtterance($scope.currentEx().ortho);
                msg.lang = 'fr-FR';
                window.speechSynthesis.speak(msg);
            }

            $scope.loadIpa();
        };

        $scope.typedPronounce = function() {
             if ( typeof SpeechSynthesisUtterance !== "undefined" && $scope.ortho ){ 
                var msg = new SpeechSynthesisUtterance($scope.ortho);
                msg.lang = 'fr-FR';
                window.speechSynthesis.speak(msg);
            }

            $scope.loadIpa();
        };

        $scope.nextEx = function() {
            $scope.checkOrtho();

            if ($scope.activityNumber >= $scope.exercises.length) {
                $scope.showSimpleToast("success-toast", "Test completed !");
            } else {
                $scope.activityNumber++;
                $scope.ortho = "";
                $scope.typedIpa = "";
                $scope.pronounce();
            }
        };

        $scope.restart = function() {
            $scope.exercises = shuffleArray($scope.difficultWords).slice(0, $scope.exSize);
            init();
        };

        $scope.reattempt = function() {
            $scope.exercises = angular.copy($scope.doneEx);
            init();
        };

        var init = function() {
            shuffleArray($scope.exercises);
            $scope.doneEx.length = 0;
            $scope.progress.length = 0;
            $scope.labelsProgress.lenth = 0;
            $scope.tableParams.reload();
            $scope.goodEx = 0;
            $scope.badEx = 0;
            $scope.summaryEx = [ $scope.goodEx, $scope.badEx ];
            $scope.activityNumber = 1;
            $scope.progress = [];
            $scope.labelsProgress = [];
            $scope.ortho = "";
            $scope.typedIpa = "";
            $scope.pronounce();
        }; 

        $scope.phonemeLegend = function(code) {
            if (typeof $scope.phonemes == 'undefined') return;

            for(var i=0; i<$scope.phonemes.length; i++) {
                if ($scope.phonemes[i].ipa == code) {
                    return code +": " + $scope.phonemes[i].exampleFr + " | " + $scope.phonemes[i].exampleEn;
                } 
            }
        };

        $scope.codePointArray = function(stringPhonems) {
            var re= /.[\u0300-\u036F]*/g;
            var match, matches= [];
            while (match= re.exec(stringPhonems))
                matches.push(match[0]);
            return matches;
        };

        $scope.loadWordList($scope.selectedWordList);
        $scope.loadPhonemes();

    }



}
/*
     FILE ARCHIVED ON 05:30:44 Aug 22, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:51:41 Aug 15, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.669
  exclusion.robots: 0.023
  exclusion.robots.policy: 0.011
  esindex: 0.012
  cdx.remote: 7.221
  LoadShardBlock: 151.516 (3)
  PetaboxLoader3.datanode: 211.27 (5)
  PetaboxLoader3.resolve: 227.663 (3)
  load_resource: 504.25 (2)
*/