$(document).ready(function() {

    // record game select
    $(".game-link").on("click", function(elem) {
        ga("Game", "select", $(this).data("id")+": "+$(this).data("name"));
        return true;
    });

    // set embed link
    var thisUrl = document.location.toString();
    $("#embed-link").val('<iframe height="440" width="420" src="'+thisUrl+((thisUrl.indexOf("?") < 0) ? "?" : "&")+'e=1" frameborder="0" allowfullscreen></iframe>');

    $("#btn-embed-link").on("click", function(elem) {
        try {
            // record analytic event
            var gameCookie = $.cookie("Woggle-game");
            var gameData = gameCookie ? $.parseJSON(gameCookie) : {};
            if (!$.isEmptyObject(gameCookie)) {
                ga(
                    "send",
                    "event",
                    gameData.id+": "+gameData.gn,
                    "share-embed",
                    $("#embed-link").val()
                );
            }
        } catch (e) {
        }

        // show embed link
        $("#container-link-link").hide();   // we don't want to display the share link at the same time
        $("#container-embed-link").show();
        $("#embed-link").select();
    });

    $("#close-embed-link").on("click", function(elem) {
        elem.preventDefault();
        $("#container-embed-link").hide();
    });

    // set share link
    var linkUrl = document.location.toString();
    $("#link-link").val(linkUrl+((linkUrl.indexOf("?") < 0) ? "?" : "&")+'s=1');

    $("#btn-link-link").on("click", function(elem) {
        try {
            // record analytic event
            var gameCookie = $.cookie("Woggle-game");
            var gameData = gameCookie ? $.parseJSON(gameCookie) : {};
            if (!$.isEmptyObject(gameCookie)) {
                ga(
                    "send",
                    "event",
                    gameData.id+": "+gameData.gn,
                    "share-link",
                    $("#link-link").val()
                );
            }
        } catch (e) {
        }

        // show share link
        $("#container-embed-link").hide(); // we don't want to display the embed iframe at the same time
        $("#container-link-link").show();
        $("#link-link").select();
    });

    $("#close-link-link").on("click", function(elem) {
        elem.preventDefault();
        $("#container-link-link").hide();
    });

});

$(document).ready(function(){

    (function() {

        // turn on/off debugging
        setDebug(getUrlParameter("debug") || false);

        // bind before load events to DOM elements
        bindPageEventsBeforeLoad();

        // get options
        if ((typeof woggle === "undefined") || $.isEmptyObject(woggle)) {
            // no woggle json object so nothing to do
            $("#container-initializing").removeClass("show").addClass("hide");
            $("#container-content").removeClass("hide").addClass("show");
            return false;
        } else if ((typeof woggle.game === "undefined") || (typeof woggle.game.id === "undefined")) {
            // invalid woggle json object. woggle must at least specify the game id.
            try { settings.ga("Error", "invalid-woggle", document.location.href+", woggle: "+woggle.stringify()); } catch (e) {}
            alert("Invalid woggle object.")
            $("#container-initializing").removeClass("show").addClass("hide");
            $("#container-content").removeClass("hide").addClass("show");
            return false;
        }

        // flag to indicate we are in the middle of processing something
        var processingFlag = false;

        // settings
        var version = "1.0.2",
            copyright = 2015;

        // games
        var games = [
            {
                id: 1,
                name: "Thwords",
                shortName: "Thwords",
                abbrev: "TH",
                slug: "thwords",
                description: null,
                details: null,
                lang: "en",
                random: 0,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 0,
                lesson_choose: 0,
                bonus_on: 0,
                save_on: 0
            },
            {
                id: 2,
                name: "Thword Plays",
                shortName: "Thword Plays",
                abbrev: "TP",
                slug: "thword-plays",
                description: null,
                details: null,
                lang: "en",
                random: 0,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 1,
                save_on: 1
            },
            {
                id: 3,
                name: "Anti-Thwords",
                shortName: "Anti-Thwords",
                abbrev: "AT",
                slug: "anti-thwords",
                description: null,
                details: null,
                lang: "en",
                random: 0,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 0,
                lesson_choose: 0,
                bonus_on: 0,
                save_on: 0
            },
            {
                id: 4,
                name: "Foreign Thwords",
                shortName: "Foreign Thwords",
                abbrev: "FT",
                slug: "foreign-thwords",
                description: null,
                details: null,
                lang: "es",
                random: 0,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 1,
                save_on: 1
            },
            {
                id: 5,
                name: "Random Thwords",
                shortName: "Random Thwords",
                abbrev: "RT",
                slug: "random-thwords",
                description: null,
                details: null,
                lang: "en",
                random: 1,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 0,
                save_on: 0
            },
            {
                id: 6,
                name: "Random Foreign Thwords",
                shortName: "Random Foreign",
                abbrev: "RFT",
                slug: "random-foreign-thwords",
                description: null,
                details: null,
                lang: "en",
                random: 1,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 1,
                save_on: 1
            },
            {
                id: 7,
                name: "Totally Random Thwords",
                shortName: "Totally Random",
                abbrev: "TRT",
                slug: "totally-random-thwords",
                description: null,
                details: null,
                lang: "en",
                random: 1,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 1,
                save_on: 1
            },
            {
                id: 8,
                name: "Language Drills",
                shortName: "Language Drills",
                abbrev: "LD",
                slug: "language-drills",
                description: null,
                details: null,
                lang: "en",
                random: 1,
                category_choose: 0,
                subject_choose: 0,
                topic_choose: 1,
                lesson_choose: 0,
                bonus_on: 1,
                save_on: 1
            }
        ];

        // default values
        var defaults = {
            overlayBackgroundOpacity: 0.5
        }

        // define Mustache templates
        var aboutTemplate = document.getElementById("about-template").innerHTML,
            answersTemplate = document.getElementById("answers-template").innerHTML,
            charRackTemplate = document.getElementById("char-rack-template").innerHTML,
            chooseCategoryTemplate = document.getElementById("choose-category-template").innerHTML,
            chooseLessonTemplate = document.getElementById("choose-lesson-template").innerHTML,
            chooseSubjectTemplate = document.getElementById("choose-subject-template").innerHTML,
            chooseTopicTemplate = document.getElementById("choose-topic-template").innerHTML,
            congratsMsgTemplate = document.getElementById("congrats-msg-template").innerHTML,
            endOfGameOverlayTemplate = document.getElementById("end-of-game-overlay-template").innerHTML,
            gameSaveTemplate = document.getElementById("game-save-template").innerHTML,
            gameStatsTemplate = document.getElementById("game-stats-template").innerHTML,
            generalFeedbackTemplate = document.getElementById("general-feedback-template").innerHTML,
            helpTemplate = document.getElementById("help-template").innerHTML,
            highScoresTemplate = document.getElementById("high-scores-template").innerHTML,
            initializingTemplate = document.getElementById("initializing-template").innerHTML,
            loadingTemplate = document.getElementById("loading-template").innerHTML,
            questionFillInTheBlankTemplate = document.getElementById("question-fill-in-the-blank-template").innerHTML,
            questionMultipleChoiceTemplate = document.getElementById("question-multiple-choice-template").innerHTML,
            questionMultiSelectTemplate = document.getElementById("question-multi-select-template").innerHTML,
            questionSequenceTemplate = document.getElementById("question-sequence-template").innerHTML,
            questionTextTemplate = document.getElementById("question-text-template").innerHTML,
            roundStatsTemplate = document.getElementById("round-stats-template").innerHTML,
            settingsTemplate =  document.getElementById("settings-template").innerHTML,
            startSettingsTemplate =  document.getElementById("start-settings-template").innerHTML,
            tileRackTemplate =  document.getElementById("tile-rack-template").innerHTML,
            tileValuesTemplate =  document.getElementById("tile-values-template").innerHTML,
            tileValuesTableTemplate =  document.getElementById("tile-values-table-template").innerHTML,
            wrongAnswerTemplate =  document.getElementById("wrong-answer-template").innerHTML;

        // get the default variables for the game
        var gameDefaults = getGameById(woggle.game.id);
        if ($.isEmptyObject(gameDefaults)) {
            try { settings.ga("Error", "undefined-game-id", document.location.href+" : "+JSON.stringify(woggle)); } catch (e) {}
            alert("Game " + woggle.game.id + " not defined.");
            return false;
        }

        // set presets from url parameters
        var presets = getUrlParameters(true);

        // get saved settings / user / group / game / round / play
        var savedSettings = $.cookie("Woggle-settings");
        savedSettings = savedSettings ? $.parseJSON(savedSettings) : {};

        var savedUser = $.cookie("Woggle-user");
        savedUser = savedUser ? $.parseJSON(savedUser) : {};

        var savedGroup = $.cookie("Woggle-group");
        savedGroup = savedGroup ? $.parseJSON(savedGroup) : {};

        var savedGame = $.cookie("Woggle-game");
        savedGame = savedGame ? $.parseJSON(savedGame) : {};

        var savedRound = $.cookie("Woggle-round");
        savedRound = savedRound ? $.parseJSON(savedRound) : {};

        var savedPlay = $.cookie("Woggle-play");
        savedPlay = savedPlay ? $.parseJSON(savedPlay) : {};

        // see if we are starting a new game or continuing an existing one
        var newGame = true;
        if (!$.isEmptyObject(savedSettings) && !$.isEmptyObject(savedUser) && !$.isEmptyObject(savedGroup)
            && !$.isEmptyObject(savedGame)  && !$.isEmptyObject(savedRound) && !$.isEmptyObject(savedPlay)) {
            if ((typeof savedGame.id !== "undefined") && (typeof savedGame.ga !== "undefined") && (parseInt(savedGame.ga) > 0)) {
                // user currently already has an active game

                if (savedGame.id == woggle.game.id) {
                    // continue existing game
                    newGame = false;
                } else {
                    if (confirm("You currently have an active game of "+savedGame.gn+".\n\nIf you continue you will lose that game.\n\nDo you want to start this new game anyway?")) {
                        newGame = true;
                    } else {
                        // go to different existing game
                        document.location.href = savedGame.ur;
                        return false;
                    }
                }
            }
        }

        // set default lang
        var defaultLang = "en";
        if (typeof savedGame.al !== "undefined") {
            defaultLang = savedGame.al;
        }

        // set default skill level
        var defaultSkillLevel = 2;
        if (typeof savedGame.gs !== "undefined") {
            defaultSkillLevel = savedGame.gs;
        }

        // set default knowledge level
        var defaultKnowledgeLevel = 2;
        if (typeof savedGame.gk !== "undefined") {
            defaultKnowledgeLevel = savedGame.gk;
        }

        // show "initializing" overlay
        $("#container-content").removeClass("show").addClass("hide");
        $("#container-initializing").removeClass("hide").addClass("show");

        // record initialization options
        try {ga("send", "event", "Game", "initialize", "woggle: "+JSON.stringify(woggle));} catch (e) {}

        // define game types
        var allGameIds = [1, 2, 3, 4];
        var standardGameIds = [1, 2, 3];
        var multilanguageGameIds = [6, 7, 8];

        // available languages
        var languages = {
            de: "German",
            en: "English",
            es: "Spanish",
            fr: "French",
            is: "Icelandic",
            it: "Italian",
            pl: "Polish",
            pt: "Portuguese",
            ru: "Russian",
            tr: "Turkish",
            uk: "Ukrainian"
        };

        // foreign langs
        var foreignLangs = ["de", "es", "fr", "is", "it", "pl", "pt", "ru", "tr", "uk"];

        // skill levels
        var skillLevels = [
            {
                value: 1,
                name: "Novice",
                abbrev: 'N'
            },
            {
                value: 2,
                name: "Amateur",
                abbrev: 'A'
            },
            {
                value: 3,
                name: "Pro",
                abbrev: 'P'
            },
            {
                value: 4,
                name: "Expert",
                abbrev: 'E'
            }
        ];

        // knowledge levels
        var knowledgeLevels = [
            {
                value: 0,
                name: "Elementary",
                abbrev: 'el'
            },
            {
                value: 1,
                name: "High School",
                abbrev: 'hs'
            },
            {
                value: 2,
                name: "College",
                abbrev: 'co'
            },
            {
                value: 3,
                name: "Graduate",
                abbrev: 'gr'
            },
            {
                value: 4,
                name: "Doctorate",
                abbrev: 'do'
            },
            {
                value: 5,
                name: "Genius",
                abbrev: 'ge'
            },
            {
                value: 6,
                name: "Super Genius",
                abbrev: 'g+'
            }

        ];

        // array of tiles to be flipped
        var flipTileStack = [];

        // timeout settings
        var overlayDivTimeout,
            overlayButtonTimeout;

        // root directory for the json api
        var apiRoot = "/api/",
            apiTimeout = 10000;

        // set session id
        var sessionId = generateSessionId();

        // define settngs properties
        var settingsProperties = [
            ["sessionId", sessionId, "se"],                 // session id
            ["domain", document.domain, "dm"],              // game domain
            ["apiDomain", null, "ad"],                      // current api domain
            ["apiDomains", [document.domain], "as"],        // array of all api domains
            ["statsDomain", null, "sd"],                    // statistics domain
            ["showAds", 0, "ads"] ,                         // display ads (1=yes, 0=no)
            ["adUrl", "http://ads.thwords.com/ad", "adu"] , // display ads (1=yes, 0=no)
            ["overlayDivDelay", 0, "odd"],                  // default delay to hide overlay div
            ["overlayButtonDelay", 500, "obd"],             // default delay to hide overlay button
            ["tileFlipDelay", 300, "tfd" ],                 // delay between each tile flip
            ["timeStamp", Date.now(), "ts" ]                // time stamp
        ];

        // define user properties
        var userProperties = [
            ["sessionId", sessionId, "se"],                 // session id
            ["id", null, "id"],                             // user id
            ["name", null, "na"],                           // user name
            ["username", null, "un"],                       // user username
            ["email", null, "em"],                          // user email
            ["lang", "en", "al"],                           // user lang (only en for now)
            ["langs", [], "ap"],                            // user preferred langs (defaults to all)
            ["timeStamp", Date.now(), "ts" ]                // time stamp
        ];

        // define group properties
        var groupProperties = [
            ["sessionId", sessionId, "se"],                 // session id
            ["id", null, "id"],                             // group id
            ["name", null, "na"],                           // group name
            ["timeStamp", Date.now(), "ts" ]                // time stamp
        ];

        // define game/round/play properties
        var thwordProperties = [
            ["sessionId", sessionId, "se"],                 // session id
            ["id", -1, "id"],                               // game id
            ["status", -1, "ga"],                           // game status (-1=not started, 1=active, 0=over)
            ["count", 0, "go"],                             // number of times this game has been played
            ["name", "Thwords", "gn"],                      // game name
            ["shortName", "Thwords", "sn"],                 // game short name
            ["abbrev", "TH", "ab"],                         // game abbreviation
            ["description", null, "gd"],                    // game description
            ["details", null, "gt"],                        // game details
            ["slug", "thwords", "gg"],                      // game slug
            ["url", window.location.href, "ur"],            // game url
            ["random", 0, "gr"],                            // is this a randomized game? (0 or 1)
            ["lang", "en", "al"],                           // game lang
            ["langs", foreignLangs, "ap"],                  // game preferred langs
            ["knowledgeLevel", 2, "gk"],                    // game knowledge level
            ["skillLevel", 2, "gs"],                        // game skill level
            ["maxPlays", -1, "gm"],                         // maximum number of times this game can be played (-1=unlimited)
            ["category-choose", 0, "cc"],                   // user chooses categories (1=yes or 0=no)
            ["category-id", 0, "ci"],                       // category id
            ["category-name", null, "cn"],                  // category name
            ["category-max", 1, "cm"],                      // maximum number of times that this category can be played
            ["category-count", 0, "co"],                    // number of times that this category has been played
            ["category-played", [], "cp"],                  // array of category ids played
            ["subject-choose", 0, "uc"],                    // user chooses subjects (1=yes or 0=no)
            ["subject-id", 0, "ui"],                        // subject id
            ["subject-name", null, "un"],                   // subject name
            ["subject-max", 1, "um"],                       // maximum number of times that this subject can be played
            ["subject-count", 0, "uo"],                     // number of times that this subject has been played
            ["subject-played", [], "up"],                   // array of subject ids played
            ["topic-choose", 0, "tc"],                      // user chooses topics (1=yes or 0=no)
            ["topic-id", 0, "ti"],                          // topic id
            ["topic-name", null, "tn"],                     // topic name
            ["topic-lang", "en", "tl"],                     // topic lang
            ["topic-description", null, "td"],              // topic description
            ["topic-details", null, "tt"],                  // topic details
            ["topic-max", 1, "tm"],                         // maximum number of times that this topic can be played
            ["topic-count", 0, "to"],                       // number of times that this topic has been played
            ["topic-played", [], "tp"],                     // array of topic ids played
            ["lesson-choose", 0, "lc"],                     // user chooses lessons (1=yes or 0=no)
            ["lesson-id", 0, "li"],                         // lesson id
            ["lesson-name", null, "ln"],                    // lesson name
            ["lesson-max", 1, "lm"],                        // maximum number of times that this lesson can be played
            ["lesson-count", 0, "lo"],                      // number of times that this lesson has been played
            ["lesson-played", [], "lp"],                    // array of lesson ids played
            ["thword-total", 0, "zt"],                      // total number of Thwords played
            ["thword-count", 0, "zc"],                      // count of Thwords solved
            ["thword-percent", null, "zp"],                 // percent of Thwords solved
            ["move-max", 0, "mm"],                          // maximum number of moves allowed
            ["move-total", 0, "mt"],                        // total moves available
            ["move-count",  0, "mc"],                       // count of move hits
            ["move-percent", null, "mp"],                   // move hit percent
            ["move-strikes", 0, "mx"],                      // move strikes
            ["move-remaining", 0, "mr"],                    // move hit percent
            ["point-total", 0, "pt"],                       // total points available
            ["point-count", 0, "pc"],                       // count of points
            ["point-percent", null, "pp"],                  // point percent
            ["bonus-on", 1, "pb"],                          // play bonus questions (1=yes or 0=no)
            ["bonus-total", 0, "bt"],                       // total bonuses available
            ["bonus-count", 0, "bc"],                       // count of bonuses solved
            ["bonus-value", 0, "bv"],                       // bonus points value
            ["bonus-percent", null, "bp"],                  // bonus solved percent
            ["save-on", 1, "ps"],                           // are save attempts allowed?
            ["save-status", -1, "sa"],                      // are we in the middle of a save attempt
            ["save-total", 0, "st"],                        // total saves available
            ["save-count", 0, "sc"],                        // count of successful saves
            ["save-percent", null, "sp"],                   // save percent
            ["hitStreak-current", 0, "hc"],                 // current hit streak
            ["hitStreak-long", 0, "hl"],                    // longest hit streak

            ["thwords", {}, "tz"],                          // thwords
            ["char-played", [], "ch" ],                     // characters played
            ["tile-flipped", [], "tf" ],                    // tiles flipped

            ["quiz", {}, "qz"],                             // quiz

            ["survey", {}, "su"],                           // survey

            ["bonusQuestions", {}, "bq"],                   // bonus questions

            ["timeStamp", Date.now(), "ts" ]                // time stamp
        ];

        var accentMap = {
            "á":"a", "à":"a", "ä":"a", "â":"a", "å":"a", "æ":"a", "α":"a", "ã":"a",
            "ç":"c",
            "é":"e", "è":"e", "ë":"e", "ê":"e", "ε":"e", "η":"e",
            "ğ":"g",
            "í":"i", "ì":"i", "ï":"i", "î":"i", "ι":"i", "ı":"i",
            "ñ":"n",
            "ó":"o", "ò":"o", "ö":"o", "ô":"o", "œ":"o", "ο":"o", "ω":"o", "ø":"o", "õ":"o",
            "ş":"s",
            "ú":"u", "ù":"u", "ü":"u", "û":"u", "υ":"u",
            "ÿ":"y"
        }

        // initialize settings / user / group / game / round / play
        if (!newGame) {

            // continuation of an existing game
            // create the settings, user, group, game, round and play object
            var settings = new Woggle("settings", {}, settingsProperties, savedSettings);
            var user = new Woggle("user", {}, userProperties, savedUser);
            var group = new Woggle("group", {}, groupProperties, savedGroup);
            var game = new Woggle("game", {}, thwordProperties, savedGame);
            var round = new Woggle("round", {parent: game}, thwordProperties, savedRound);
            var play = new Woggle("play", {parent: round}, thwordProperties, savedPlay);

        } else {
            // start a new game

            // make sure all game properties are set
            for (var prop in gameDefaults) {
                if (gameDefaults.hasOwnProperty(prop) && (typeof woggle.game[prop] === "undefined")) {
                    woggle.game[prop] = gameDefaults[prop];
               }
            }

            // create the settings object
            // use saved settings, but override them with the specified settings for the current game

            var settings = new Woggle("settings", {}, settingsProperties, savedSettings);
            if ((typeof woggle.settings !== "undefined") && !$.isEmptyObject(woggle.settings)) {
                $.each(woggle.settings, function(property, value) {
                    settings.setProperty(property, value);
                });
            }

            // create the user, group, game, round and play object
            var user = new Woggle("user", {}, userProperties, savedUser);
            var group = new Woggle("group", {}, groupProperties, savedGroup);
            var game = new Woggle("game", {}, thwordProperties, woggle.game || {});
            var round = new Woggle("round", {parent: game}, thwordProperties, woggle.game || {});
            var play = new Woggle("play", {parent: round}, thwordProperties, woggle.game || {});

            // set default skill level
            play.setProperty("lang", defaultLang, true);
            play.setProperty("skillLevel", defaultSkillLevel, true);
            play.setProperty("knowledgeLevel", defaultKnowledgeLevel, true);
        }


        /**
         * Add additional methods to the settings object.
         */
        settings.getApiDomain = function() {
            return this.apiDomain ? this.apiDomain : this.nextApiDomain();
        };
        settings.nextApiDomain = function() {
            if (this.apiDomains.length === 0) {
                if (settings._validation) {
                    settings.ga("Error", "no-apiDomains-specified", document.location.href);
                    alert("No apiDomains specified.");
                }
                return null;
            } else if ((this.apiDomains.length === 1) || !this.apiDomain) {
                this.setProperty("apiDomain", this.apiDomains[0]);
                return this.apiDomain;
            } else {
                for (var i=0; i<this.apiDomains.length; i++) {
                    if (this.apiDomains[i] === this.apiDomain) {
                        this.apiDomain = ((i + 1) < this.apiDomains.length) ? this.apiDomains[i+1] : this.apiDomains[0]
                        break;
                    }
                }
                return this.apiDomain;
            }
        };
        settings.getStatsDomain = function() {
            return this.statsDomain ? this.statsDomain : this.getApiDomain();
        };


        /**
         * Add additional methods to the play object.
         */
        play.adjustedBonusOn = function() {
            if (game.point.total > 1000) {
                return play.bonus.on;
            } else if (game.point.total > 2000) {
                // no more bonuses
                return 0;
            } else {
                return play.bonus.on;
            }
        };

        play.adjustedChooseCategory = function() {
            if (game.point.total > 2000) {
                return 0;
            } else {
                return play.category.choose;
            }
        };

        play.adjustedChooseLesson = function() {
            if (game.point.total > 2000) {
                return 0;
            } else {
                return play.lesson.choose;
            }
        };

        play.adjustedChooseSubject = function() {
            if (game.point.total > 2000) {
                return 0;
            } else {
                return play.subject.choose;
            }
        };

        play.adjustedChooseTopic = function() {
            if (game.point.total > 2000) {
                return 0;
            } else {
                return play.topic.choose;
            }
        };

        play.adjustedKnowledgeLevel = function() {
            if (game.point.total > 1000) {
                return (this.knowledgeLevel < 3) ? this.knowledgeLevel + 1 : this.knowledgeLevel;
            } else if (game.point.total > 2500) {
                return 4;
            } else {
                return this.knowledgeLevel;
            }
        };

        play.adjustedSkillLevel = function() {
            if (game.point.total > 1000) {
                return (this.skillLevel < 3) ? this.skillLevel + 1 : this.skillLevel;
            } else if (game.point.total > 2500) {
                return 4;
            } else {
                return this.skillLevel;
            }
        };

        play.generateQuestion = function(question, answers, options) {

            options = options || {};
            var points = (typeof options.points !== "undefined") ? options.points : 1;

            // q - question type type: mc - multiple choice, ms - multi-select, tx - text, fi - fill-in-the-blank, sq - sequence
            var resp = {
                t: (typeof options.qType !== "undefined") ? options.qType : "mc",  // question type
                q: question,    // questions
                a: null,        // answer
                o: [],          // options
                c: null,        // correct index (@TODO: support multi-select)
                p: points       // point value
            }

            if (answers.constructor.toString().indexOf("Array") > -1) {

                // answers is an array of answers

                if (typeof options.idx === "undefined") {
                    this.ga("Error", "generateQuestions-no-index-specified", "answers: "+JSON.stringify(answers));
                    alert("generateQuestions method no index specified, answers: "+JSON.stringify(answers));
                    return false;
                }
                if (typeof answers[options.idx] === "undefined") {
                    this.ga("Error", "generateQuestions-invalid-idx", "answers: "+JSON.stringify(answers));
                    alert("generateQuestions method invalid idx "+options.idx+", answers: "+JSON.stringify(answers));
                    return false;
                }

                // set answer
                resp.a = answers[options.idx];

                // create the question
                switch (resp.t) {
                    case "tx":
                        // text
                        resp.a = question;
                        resp.q = answers[options.idx];
                        break;

                    case "tf":
                    case "yn":
                        // true/false or yes/no

                        if (Math.random() < 0.5) {
                            // the answer is True (or Yes)
                            resp.c = 0;
                            resp.q = resp.q + " = " + resp.a;
                        } else {
                            // the answer is False (or No)
                            resp.c = 1;
                            var wrongAnswer = "";

                            // create a shuffled array
                            var tempArray = [];
                            $.each(answers, function(i, label) {
                                tempArray[tempArray.length] = {idx: i, label: label};
                            });
                            tempArray = shuffle(tempArray);

                            // select a wrong answer to display
                            for (var i=0; i<tempArray.length; i++) {
                                if (tempArray[i].idx != options.idx) {
                                    wrongAnswer = tempArray[i].label;
                                }
                            }
                            resp.q = resp.q + " = " + wrongAnswer;
                        }

                        resp.o = (resp.t == "tf") ? ["True", "False"] : ["Yes", "No"];

                        break;
                    case "mc":
                    default:
                        // multiple choice

                        if (duplicateArrayValues(answers)) {
                            // there are duplicate answers so we can't do a multiple choice bonus question
                            // @TODO: maybe if we have duplicate answers we want to do text answer
                            return false;
                        }

                        // create a shuffled array
                        var tempArray = [];
                        $.each(answers, function(i, label) {
                            tempArray[tempArray.length] = {idx: i, label: label};
                        });
                        tempArray = shuffle(tempArray);

                        // create array of answers options using the shuffled array order
                        for (var i=0; i<tempArray.length; i++) {
                            resp.o[resp.o.length] = tempArray[i].label;
                            if (tempArray[i].idx == options.idx) {
                                resp.c = i;
                            }
                        }
                        break;
                }
            } else {

                // answers is just a single answer

                //.set answer
                resp.t = "tx";
                resp.a = answers;
            }

            return resp;
        };

        play.generateBonusQuestions = function() {
            this.bonusQuestions = {};
            this.bonusQuestions.questions = [];

            // we must have at least 2 answers; we pull the bonus question from aux1 so it must match the ans array
            if (!$.isEmptyObject(play) && !$.isEmptyObject(this.thwords)
                && (typeof this.thwords.ans !== "undefined") && (this.thwords.ans.length > 1)
                && (typeof this.thwords.aux1 !== "undefined") && (this.thwords.ans.length === this.thwords.aux1.length)) {

                if (this.id == 4) {

                    // Foreign Thwords (generate one question for each Thword)

                    try {
                        var questions = [];
                        for (var i=0; i<this.thwords.ans.length; i++) {

                            var question = this.generateQuestion(
                                this.thwords.ans[i],
                                this.thwords.aux1,
                                {
                                    idx: i,
                                    qType: play.getQuestionType(this.thwords.ans[idx], {gameId: this.id, lang: this.lang})
                                }
                            );

                            if (question !== false) {
                                questions[questions.length] = question;
                            }
                        }

                        this.bonusQuestions.questions = shuffle(questions);

                    } catch (e) {
                        console.log(e);
                        this.ga("Error", "generateBonusQuestions: multiple", e.toString());
                    }

                } else {

                    // generate a single question

                    try {
                        var idx = Math.floor(Math.random() * this.thwords.aux1.length);

                        if (this.thwords.aux1[idx]) {  // Make sure there is an aux1 value

                            var question = this.generateQuestion(
                                this.thwords.ans[idx],
                                this.thwords.aux1,
                                {
                                    idx: idx,
                                    qType: play.getQuestionType(this.thwords.ans[idx])
                                }
                            );

                            if (question !== false) {
                                this.bonusQuestions.questions = [question];
                            }
                        }

                    } catch (e) {
                        this.ga("Error", "generateBonusQuestions: single", e.toString());
                        console.log(e);
                    }
                }
            }

            // set the bonus question pointer to the first question (or way past the end if there are no questions)
            this.bonusQuestions.idx = (this.bonusQuestions.questions.length > 0) ? 0 : 9999;
        };

        play.getQuestionType = function(answer, options) {

            answer = answer || "";
            options = options || {};
            var gameId = (typeof options.gameId !== "undefined") ? options.gameId : -1;
            var lang = (typeof options.lang !== "undefined") ? options.lang : "en";

            if (play.id == 2) {
                // Thword Plays are always multiple choice
                return "mc";

            } else if (play.id == 4) {

                var skillLevel = this.adjustedSkillLevel();
                var randNum = Math.random();

                switch (skillLevel) {
                    case 3:  // Pro
                        if (randNum < 0.2) {
                            if (["ru", "uk"].indexOf(lang) > -1) {
                                return "mc";
                            } else {
                                return (answer.length <= 12) ? "tx" : "mc"
                            }
                        } else if (randNum < 0.4) {
                            return "tf";
                        } else {
                            return "mc";
                        }
                        break;
                    case 4:  // Expert
                        if (randNum < 0.4) {
                            if (["ru", "uk"].indexOf(lang) > -1) {
                                return "mc";
                            } else {
                                return (answer.length <= 15) ? "tx" : "mc"
                            }
                        } else if (randNum < 0.6) {
                            return "tf";
                        } else {
                            return "mc";
                        }
                        break;
                    case 0:
                    case 1:  // Novice
                    case 2:  // Amateur
                    default:
                        if (randNum < 0.25) {
                            return "tf";
                        } else {
                            return "mc";
                        }
                        break;
                }
            } else {
                // Thwords and Anti-Thwords (and all other games) do not have bonus questions
                return false
            }
        };

        // if debug is on then attach a copy of the thwordData to the window object so it's easy to view
        // @TODO: maybe we should remove this after deployment - 2015/12/18
        if (isDebugOn()) {
            window.thwordData = {
                settings: settings,
                user: user,
                group: group,
                game: game,
                round: round,
                play: play
            }
        }

        // process url parameters
        processUrlParameters();

        // update the embed/share links (w/ the skill and knowledge levels)
        // @TODO: should we also add the lang and langs? - 2015/12/18
        updateShareLinks();

        if (getUrlParameter("s") == 1) {
            game.ga(game.id+": "+game.name, "start-shared", "url: "+document.location.href);
        } else if (getUrlParameter("e") == 1) {
            game.ga(game.id+": "+game.name, "start-embed", "url: "+document.location.href);
        } else {
            game.ga(game.id+": "+game.name, "start-new", "url: "+document.location.href);
        }

        // update debug display
        updateDebug();

        // bind game events to DOM elements
        bindGameEvents();

        // hide "initializing" overlay
        $("#container-content").removeClass("hide").addClass("show");
        $("#container-initializing").removeClass("show").addClass("hide");

        // bind after load events to DOM elements
        bindPageEventsAfterLoad();

        // hide the ad overlay except when we are loading a new page for each round
        // because for those we show the ad first
        if (document.location.toString().toLowerCase().indexOf("/next/") < 0) {
            hideAdOverlay();
        } else {
            $("#overlay-ad").removeClass("hide").addClass("show");
        }

        // show all of the game elements
        showGameElements();

        // show pregame settings form
        if (newGame) {
            showPregameSettingsForm();
        } else {
            //if (play.status > 0) { alert('aa')
            //    showGamePanel("topic", true);
            //    showGamePanel("score");
            //    setCharRack();
            //    showGamePanel("chars");
            //    setAnswers();
            //    showGamePanel("answers");
            //} else {
                startGame();
            //}
        }

        var selectBonusAnswerOption = function(elem) {

            var idx = parseInt($(elem).data("idx"));
            var option = parseInt($(elem).data("option"));
            var correct = play.bonusQuestions.questions[idx].c;
            var points = play.bonusQuestions.questions[idx].p;

            if (option == correct) {

                // add to stats
                addPoints(points)

                play.addToCount("bonus", 1, true);

                var msg = "Correct";
                if ((["tf", "yn"].indexOf(play.bonusQuestions.questions[idx].t) > -1) && (play.bonusQuestions.questions[idx].c > 0)) {
                    // the answer was No or False so display the correct answer
                    msg += "<p>The right answer is "+play.bonusQuestions.questions[idx].a+".</p>";
                    var timeout = 5000;
                } else {
                    var timeout = settings.overlayButtonDelay;
                }

                $("#submit-question-answer").removeClass("show").addClass("hide");

                overlayButton(msg,
                    {
                        type: "success",
                        class: "process-bonus",
                        data: {idx: idx, option: option, correct: correct, points: points},
                        timeout: timeout
                    });
            } else {
                overlayButton(Mustache.render(wrongAnswerTemplate, {correctAnswer: play.bonusQuestions.questions[idx].a}),
                    {
                        type: "error",
                        class: "process-bonus",
                        data: {idx: idx, option: option, correct: correct, points: points},
                        timeout: 0
                    });
            }
        };

        var selectCategory = function(elem) {

            // set the category for this play
            if (typeof $(elem).data("category-id") === "undefined") {
                alert("No category selected.");
                return false;
            }

            if (parseInt($(elem).data("category-id")) > 0) {
                var categoryId = parseInt($(elem).data("category-id"));
                var categoryName = $(elem).text();
            } else {
                var categoryId = 0;
                var categoryName = "WILD CARD";
            }

            play.ga(play.id+": "+play.name, "category-select", categoryId+": "+categoryName);

            try {
                // start play
                if (play.adjustedChooseSubject() > 0) {
                    createSubjectSelectList();
                } else if (play.adjustedChooseTopic() > 0) {
                    createTopicSelectList();
                } else {
                    fetchPlay({category_id: categoryId});
                }
            } catch (e) {
                console.log(e);
                settings.ga("Error", "selectCategory", e.toString());
            }
        };

        var selectLesson = function(elem) {

            // set the lesson for this play
            if (typeof $(elem).data("lesson-id") === "undefined") {
                alert("No lesson selected.");
                return false;
            }

            if (parseInt($(elem).data("lesson-id")) > 0) {
                var lessonId = parseInt($(elem).data("lesson-id"));
                var lessonName = $(elem).text();
            } else {
                var lessonId = 0;
                var lessonName = "WILD CARD";
            }

            play.ga(play.id+": "+play.name, "lesson-select", lessonId+": "+lessonName);

            try {
                // start play
                fetchPlay({lesson_id: lessonId});
            } catch (e) {
                console.log(e);
                settings.ga("Error", "selectLesson", e.toString());
            }
        };

        var selectSubject = function(elem) {

            // set the subject for this play
            if (typeof $(elem).data("subject-id") === "undefined") {
                alert("No subject selected.");
                return false;
            }

            if (parseInt($(elem).data("subject-id")) > 0) {
                var subjectId = parseInt($(elem).data("subject-id"));
                var subjectName = $(elem).text();
            } else {
                var subjectId = 0;
                var subjectName = "WILD CARD";
            }

            play.ga(play.id+": "+play.name, "subject-select", subjectId+": "+subjectName);

            try {
                // start play
                if (play.adjustedChooseTopic() > 0) {
                    createTopicSelectList();
                } else {
                    fetchPlay({subject_id: subjectId});
                }
            } catch (e) {
                console.log(e);
                settings.ga("Error", "selectSubject", e.toString());
            }
        };

        var selectTopic = function(elem) {

            resetFeedbackButtons();

            // set the topic for this play
            if (typeof $(elem).data("topic-id") === "undefined") {
                alert("No topic selected.");
                return false;
            }

            if (parseInt($(elem).data("topic-id")) > 0) {
                var topicId = parseInt($(elem).data("topic-id"));
                var topicName = $(elem).text();
            } else {
                var topicId = 0;
                var topicName = "WILD CARD";
            }

            play.ga(play.id+": "+play.name, "topic-select", topicId+": "+topicName);

            try {
                // start play
                fetchPlay({topic_id: topicId});
            } catch (e) {
                console.log(e);
                settings.ga("Error", "selectTopic", e.toString());
            }
        };

        function accentFold(textStr)
        {
            if (!textStr) { return ''; }
            var retStr = '';
            for (var i=0; i < textStr.length; i++) {
                retStr += accentMap[textStr.charAt(i)] || textStr.charAt(i);
            }

            return retStr;
        }

        function addHit() {

            // add move
            play.addToTotal("move", 1);

            // add hit
            play.addToCount("move", 1);

            // set remaining
            play.setProperty("move-remaining", play.move.max - play.move.total);
            play.store();

            // increment hit streak
            play.setProperty("hitStreak-current", play.hitStreak.current + 1, true);
            if (game.hitStreak.current > game.hitStreak.long) {
                play.setProperty("hitStreak-long", play.hitStreak.long + 1, true);
            }

            // update styles
            reflowStyles();
        }

        function addPoints(points) {
            var points = parseInt(points);

            try {
                // update points
                play.addToCount("point", points)
            } catch (e) {
                console.log(e);
                settings.ga("Error", "addPoints", e.toString());
            }

            // update styles
            reflowStyles();
        }

        function allAnswersSolved() {
            // check tiles for all answers
            var areAllAnswersSolved = true;
            for (var idx=0; idx<play.thwords.tls.length; idx++) {
                if (!allTilesSolved(idx)) {
                    areAllAnswersSolved = false;
                }
            }

            return areAllAnswersSolved;
        }

        function allTilesSolved(idx, markWrongAnswer) {

            markWrongAnswer = markWrongAnswer || false;

            // check if all tiles for this answer are solve
            try {
                for (var pos=0; pos<play.thwords.tls[idx].length; pos++) {
                    if (!play.thwords.tls[idx][pos].s) {

                        if (markWrongAnswer) {
                            $("#answer-"+idx).removeClass("solved").addClass("wrong");
                        }

                        return false;
                    }
                }
            } catch (e) {
                console.log(e);
                settings.ga("Error", "allTilesSolved", e.toString());
            }


            // mark answer as solved
            if (!$("#answer-"+idx).hasClass("solved")) {
                $("#answer-"+idx).addClass("solved");
                play.addToCount("thword", 1, true);
            }

            // show aux2 field (for Foreign Thwords these hold the English character translations)
            $("#answer-"+idx+" > .aux2").removeClass("hide").addClass("show");

            return true;
        }

        function bindGameEvents() {

            window.onbeforeunload = function() {
                if (!$.isEmptyObject(game) && (typeof game.status !== "undefined") && game.status) {
                    return "If you leave this page you will lose your current game?";
                }
            }

            $(".quit-game").on("click", function(elem) {
                elem.preventDefault();
                quitGame();
            });

            $(".save-and-exit-game").on("click", function(elem) {
                elem.preventDefault();
                saveAndExitGame();
            });

            $(".select-foreign-thword").on("click", function(elem) {
                elem.preventDefault();
                selectTopic(this);
            });

            $(".start-game").on("click", function(elem) {
                elem.preventDefault();
                if (updateInitialSettings(this)) {
                    startGame();
                }
            });

            // set next-round link onclick event
            setNextRoundLink()
        }

        function bindPageEventsAfterLoad() {

            $(".close-ad").on("click", function(elem) {
                elem.preventDefault();
                hideAdOverlay();
            });

            switch (parseInt(settings.getProperty("showAds"))) {
                case 1: // pre-load ads
                    $(".next-round-link").on("click", function (elem) {
                        elem.preventDefault();
                        showAdOverlay();
                        startRound();
                    });
                    break;
                case 2: // use Next Round link
                    // remove onbeforeunload event so we can go to "next" page
                    $(".next-round-link").on("click", function (elem) {
                        window.onbeforeunload = function () {
                        };
                    });
                    break;
                case 0: // no ads - don't show ads (ie. don't load next page)
                default:
                    $(".next-round-link").on("click", function (elem) {
                        elem.preventDefault();
                        startRound();
                    });
                    break;
            }
        }

        function bindPageEventsBeforeLoad() {

            $("#btn-topic-feedback-cancel").on("click", function(elem) {
                elem.preventDefault();
                $("#overlay-background").removeClass("show").addClass("hide");
                $("#overlay-topic-feedback-container").removeClass("show").addClass("hide");
            });

            $("#btn-topic-feedback-submit-comment").on("click", function(elem) {
                elem.preventDefault();
                try {
                    play.ga(play.id+": "+play.name, "topic-comment", play.topic.id+": "+$("#topic-feedback-text").val());
                    $("#btn-topic-comment").addClass("disabled");
                    $("#overlay-background").removeClass("show").addClass("hide");
                    $("#overlay-topic-feedback-container").removeClass("show").addClass("hide");
                } catch (e) {
                }
            });

            $("#btn-topic-feedback-submit-problem").on("click", function(elem) {
                elem.preventDefault();
                try {
                    play.ga(play.id+": "+play.name, "topic-problem", play.topic.id+": "+$("#topic-feedback-text").val());
                    $("#btn-topic-problem").addClass("disabled");
                    $("#overlay-background").removeClass("show").addClass("hide");
                    $("#overlay-topic-feedback-container").removeClass("show").addClass("hide");
                } catch (e) {
                }
            });

            $("#btn-topic-dislike").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You already said you liked this topic.", {type: "fail", timeout: 2000})
                    } else if ($(this).hasClass("clicked")) {
                        overlayButton("You already said you dislike this topic.", {type: "fail", timeout: 2000})
                    } else {
                        if ((typeof play.topic.id !== "undefined") && (play.topic.id > 0)) {
                            play.ga(play.id+": "+play.name, "topic-dislike", play.topic.id+": "+play.topic.name)
                            overlayButton("Thank you for your feedback.", {type: "success", timeout: 2000})
                        }
                        $(this).addClass("clicked");
                        $("#btn-topic-like").addClass("disabled");
                    }
                } catch (e) {
                }
            });

            $("#btn-topic-like").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You already said you disliked this topic.", {type: "fail", timeout: 2000})
                    } else if ($(this).hasClass("clicked")) {
                        overlayButton("You already said you like this topic.", {type: "fail", timeout: 2000})
                    } else {
                        if ((typeof play.topic.id !== "undefined") && (play.topic.id > 0)) {
                            play.ga(play.id+": "+play.name, "topic-like", play.topic.id+": "+play.topic.name)
                            overlayButton("Thank you for your feedback.", {type: "success", timeout: 2000})
                        }
                        $(this).addClass("clicked");
                        $("#btn-topic-dislike").addClass("disabled");
                    }
                } catch (e) {
                }
            });

            $("#btn-topic-too-easy").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You already said this topic was too hard.", {type: "fail", timeout: 2000})
                        alert("You already said this topic was too hard.");
                    } else if ($(this).hasClass("clicked")) {
                        overlayButton("You already said this topic was too easy.", {type: "fail", timeout: 2000})
                    } else {
                        if ((typeof play.topic.id !== "undefined") && (play.topic.id > 0)) {
                            play.ga(play.id+": "+play.name, "topic-too-easy", play.topic.id+": "+play.topic.name)
                            overlayButton("Thank you for your feedback.", {type: "success", timeout: 2000})
                        }
                        $(this).addClass("clicked");
                        $("#btn-topic-too-hard").addClass("disabled");
                    }
                } catch (e) {
                }
            });

            $("#btn-topic-too-hard").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You already said this topic was too easy.", {type: "fail", timeout: 2000})
                    } else if ($(this).hasClass("clicked")) {
                        overlayButton("You already said this topic was too hard.", {type: "fail", timeout: 2000})
                    } else {
                        if ((typeof play.topic.id !== "undefined") && (play.topic.id > 0)) {
                            play.ga(play.id+": "+play.name, "topic-too-hard", play.topic.id+": "+play.topic.name)
                            overlayButton("Thank you for your feedback.", {type: "success", timeout: 2000})
                        }
                        $(this).addClass("clicked");
                        $("#btn-topic-too-easy").addClass("disabled");
                    }
                } catch (e) {
                }
            });

            $("#btn-topic-comment").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You have already submitted a comment on this topic.", {type: "fail", timeout: 2000})
                    } else {
                        $("#topic-feedback-text").val("");
                        $("#topic-feedback-instr-comment").removeClass("hide").addClass("show");
                        $("#topic-feedback-instr-problem").removeClass("show").addClass("hide");
                        $("#btn-topic-feedback-submit-comment").removeClass("hide").addClass("show");
                        $("#btn-topic-feedback-submit-problem").removeClass("show").addClass("hide");
                        $("#overlay-topic-feedback-container").removeClass("hide").addClass("show");
                        $("#overlay-background").removeClass("hide").addClass("show");
                        $("#topic-feedback-text").select();
                    }
                } catch (e) {
                }
            });

            $("#btn-topic-problem").on("click", function(elem) {
                elem.preventDefault();
                try {
                    if ($(this).hasClass("disabled")) {
                        overlayButton("You have already reported a problem on this topic.", {type: "fail", timeout: 2000})
                    } else {
                        $("#topic-feedback-text").val("");
                        $("#topic-feedback-instr-comment").removeClass("show").addClass("hide");
                        $("#topic-feedback-instr-problem").removeClass("hide").addClass("show");
                        $("#btn-topic-feedback-submit-comment").removeClass("show").addClass("hide");
                        $("#btn-topic-feedback-submit-problem").removeClass("hide").addClass("show");
                        $("#overlay-topic-feedback-container").removeClass("hide").addClass("show");
                        $("#overlay-background").removeClass("hide").addClass("show");
                        $("#topic-feedback-text").select();
                    }
                } catch (e) {
                }
            });

            $("#hamburger").on("click", function(elem) {
                elem.preventDefault();
                openMenu();
            });

            $("#menuContentLayer").on("click", function(elem) {
                elem.preventDefault();
                closeMenu();
            });

            $(".overlay-continue-btn").on("click", function(elem) {
                elem.preventDefault();
                processOverlayDiv();
            });

            $(".play-topic-again").on("click", function(elem) {
                elem.preventDefault();
                playTopicAgain();
            });

            $(".process-char").on("click", function(elem) {
                elem.preventDefault();
                if ($(this).data("idx")) {
                    processChar($(this).data("idx"));
                }
            });

            $(".show-about-overlay").on("click", function(elem) {
                elem.preventDefault();
                showAboutOverlay();
            });

            $(".show-bonus").on("click", function(elem) {
                elem.preventDefault();
                nextBonus();
            });

            $(".show-debug-data-overlay").on("click", function(elem) {
                elem.preventDefault();
                showDebugDataOverlay();
            });

            $(".show-game-stats-overlay").on("click", function(elem) {
                elem.preventDefault();
                showGameStatsOverlay();
            });

            $(".show-general-feedback-overlay").on("click", function(elem) {
                elem.preventDefault();
                showGeneralFeedbackOverlay();
            });

            $(".show-help-overlay").on("click", function(elem) {
                elem.preventDefault();
                showHelpOverlay();
            });

            $(".show-high-scores-overlay").on("click", function(elem) {
                elem.preventDefault();
                var params = {};
                if ((typeof play !== "undefined") && !$.isEmptyObject(play)) {
                    params.gameId     = play.getProperty("id");
                    params.lang       = play.getProperty("lang");
                    params.skillLevel = play.getProperty("skillLevel");
                    params.knowledgeLevel = play.getProperty("knowledgeLevel");
                    params.categoryId = play.getProperty("category_id");
                }
                showHighScoresOverlay(params);
            });

            $(".show-round-stats-overlay").on("click", function(elem) {
                elem.preventDefault();
                showPlayStatsOverlay();
            });

            $(".show-settings-overlay").on("click", function(elem) {
                elem.preventDefault();
                showSettingsOverlay();
            });

            $(".show-tile-values-overlay").on("click", function(elem) {
                elem.preventDefault();
                showTileValuesOverlay();
            });

            $(".visit-thwords-com").on("click", function(elem) {
                elem.preventDefault();
                window.open("http://thwords.com");
                closeMenu();
            });
        }

        function bonusQuestionCount() {
            if ((typeof play.bonusQuestions === "undefined") || (typeof play.bonusQuestions.questions === "undefined")) {
                return 0;
            } else {
                return play.bonusQuestions.questions.length
            }
        }

        function checkForPlayOver() {
            if (allAnswersSolved()) {
                winPlay();
            } else if (play.move.total >= play.move.max) {
                losePlay();
            }
        }

        function clearGameCookies() {
            // delete game and round cookies
            var date = new Date();
            date.setTime(date.getTime() - (8 * 60 * 60 * 1000));

            $.cookie("Woggle-play", null, {path: '/', expires: date});
            $.cookie("Woggle-round", null, {path: '/', expires: date});
            $.cookie("Woggle-game", null, {path: '/', expires: date});
        }

        function hideOverlayDiv() {
            $("#overlay-div-content-top").html("")
            $("#overlay-div-content").html("")
            $("#overlay-div-container").removeClass().addClass("standard").addClass("hide");
            $("#overlay-background").removeClass("show").addClass("hide");
            $("#overlay-background").css("opacity", defaults.overlayBackgroundOpacity);
        }

        function closeMenu() {
            //enable all scrolling on mobile devices when menu is closed
            $('#container').unbind('touchmove');

            //set margin for the whole container back to original state with a jquery UI animation
            $("#container").animate({"marginLeft": ["-1", 'easeOutExpo']}, {
                duration: 700,
                complete: function () {
                    $("#content").css("width", "auto");
                    $("#menuContentLayer").css("display", "none");
                    $("nav").css("opacity", 0);
                    $("#content").css("min-height", "auto");
                    $("nav").css("display", "none");
                }
            });
        }

        function createCategorySelectList() {
            overlayButton("Loading Categories ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});

            var categoryUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/category/get?callback=?"
                + "&rn=1"
                + "&mx=3"
                + "&gi=" + play.id
                + "&al=" + play.lang
                + "&sl=" + play.adjustedSkillLevel()
                + "&kl=" + play.adjustedKnowledgeLevel();

            settings.ga("API", settings.getApiDomain(), categoryUrl);
            play.ga(play.id+": "+play.name, "fetch-categories", "url: "+categoryUrl);

            // add random integer to break browser cache
            categoryUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: 'GET',
                url: categoryUrl,
                async: false,
                jsonpCallback: "jsonCallback1",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(categories) {
                    console.log(categories);

                    // create category buttons
                    var html = renderChooseCategoryHtml(categories);
                    $("#game-panel-choose").html(html);

                    // bind click event to category buttons
                    $(".select-category").bind("click", function(event) {
                        event.preventDefault();
                        selectCategory(this);
                    });

                    showGamePanel("choose", true);
                    if (game.status > 0) {
                        showGamePanel("score", false);
                    }
                    processOverlayButton();
                },
                error: function(e) {
                    try {settings.ga("Error", "createCategorySelectList", "url: "+categoryUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error createCategorySelectList:\nurl: "+categoryUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch categories. Try again?")) {
                        settings.nextApiDomain();
                        createCategorySelectList();
                    }
                }
            });
        }

        function createLessonSelectList() {
            overlayButton("Loading Lessons ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});

            var lessonUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/lesson/get?callback=?"
                + "&rn=1"
                + "&mx=3"
                + "&gi=" + play.id
                + "&al=" + play.lang
                + "&sl=" + play.adjustedSkillLevel()
                + "&kl=" + play.adjustedKnowledgeLevel();

            settings.ga("API", settings.getApiDomain(), lessonUrl);
            play.ga(play.id+": "+play.name, "fetch-lessons", "url: "+lessonUrl);

            // add random integer to break browser cache
            lessonUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: lessonUrl,
                async: false,
                jsonpCallback: "jsonCallback2",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(lessons) {
                    console.log(lessons);

                    // create lesson buttons
                    var html = renderChooseLessonHtml(lessons);
                    $("#game-panel-choose").html(html);

                    // bind click event to subject buttons
                    $(".select-subject").bind("click", function(event) {
                        event.preventDefault();
                        selectLesson(this);
                    });

                    showGamePanel("choose", true);
                    if (game.status > 0) {
                        showGamePanel("score", false);
                    }
                    processOverlayButton();
                },
                error: function(e) {
                    try {settings.ga("Error", "createLessonSelectList", "url: "+lessonUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error createLessonSelectList:\nurl: "+lessonUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch lessons. Try again?")) {
                        settings.nextApiDomain();
                        createLessonSelectList();
                    }
                }
            });
        }

        function createSubjectSelectList() {
            overlayButton("Loading Subjects ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});

            var subjectUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/subject/get?callback=?"
                + "rn=1"
                + "&mx=3"
                + "&gi=" + play.id
                + "&al=" + play.lang
                + "&sl=" + play.adjustedSkillLevel()
                + "&kl=" + play.adjustedKnowledgeLevel()
                + '&ci=' + ((play.category.choose === 0) ? 0 : play.category.id);

            settings.ga("API", settings.getApiDomain(), subjectUrl);
            play.ga(play.id+": "+play.name, "fetch-subjects", "url: "+subjectUrl);

            // add random integer to break browser cache
            subjectUrl += "?" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: subjectUrl,
                async: false,
                jsonpCallback: "jsonCallback3",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(subjects) {
                    console.log(subjects);

                    if ($.isEmptyObject(subjects) && (play.category.choose > 0)) {

                        play.ga("Warning", "no-subjects-found-for-category", "url: "+subjectUrl);
                        alert("No subjects found.\n\nPlease select another category.");
                        createCategorySelectList();

                    } else if ($.isEmptyObject(subjects)) {

                        if (confirm("No subjects found.\n\nTry again?")) {
                            settings.nextApiDomain();
                            createSubjectSelectList();
                        }

                    } else {

                        // create subject buttons
                        var html = renderChooseSubjectHtml(subjects);
                        $("#game-panel-choose").html(html);

                        // bind click event to subject buttons
                        $(".select-subject").bind("click", function(event) {
                            event.preventDefault();
                            selectSubject(this);
                        });

                        showGamePanel("choose", true);
                        if (game.status > 0) {
                            showGamePanel("score", false);
                        }

                        processOverlayButton();
                    }
                },
                error: function(e) {
                    try {settings.ga("Error", "createSubjectSelectList", "url: "+subjectUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error createSubjectSelectList:\nurl: "+subjectUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch subjects. Try again?")) {
                        settings.nextApiDomain();
                        createSubjectSelectList();
                    }
                }
            });
        }

        function createTopicSelectList() {
            overlayButton("Loading Topics ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});

            var topicUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/topic/get?callback=?"
                + "&rn=1"
                + "&mx=3"
                + "&gi=" + play.id
                + "&al=" + play.lang
                + "&sl=" + play.adjustedSkillLevel()
                + "&kl=" + play.adjustedKnowledgeLevel()
                + "&ci=" + ((play.category.choose === 0) ? 0 : play.category.id)
                + "&ui=" + ((play.subject.choose === 0) ? 0 : play.subject.id);

            settings.ga("API", settings.getApiDomain(), topicUrl);
            play.ga(play.id+": "+play.name, "fetch-topics", "url: "+topicUrl);

            // add random integer to break browser cache
            topicUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: topicUrl,
                async: false,
                jsonpCallback: "jsonCallback4",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(topics) {
                    console.log(topics);

                    if ($.isEmptyObject(topics) && (play.subject.choose > 0)) {

                        play.ga("Warning", "no-topic-found-for-subject", "url: "+topicUrl);
                        alert("No topics found.\n\nPlease select another subject.");
                        createSubjectSelectList();

                    } else if ($.isEmptyObject(topics) && (play.subject.choose > 0)) {

                        play.ga("Warning", "no-topic-found-for-category", "url: "+topicUrl);
                        alert("No topics found.\n\nPlease select another category.");
                        createCategorySelectList();

                    } else if ($.isEmptyObject(topics)) {

                        if (confirm("No topics found.\n\nTry again?")) {
                            settings.nextApiDomain();
                            createTopicSelectList();
                        }

                    } else {

                        // create topic buttons
                        var html = renderChooseTopicHtml(topics);
                        $("#game-panel-choose").html(html);

                        // bind click event to topic buttons
                        $(".select-topic").bind("click", function(event) {
                            event.preventDefault();
                            selectTopic(this);
                        });

                        showGamePanel("choose", true);
                        if (game.status > 0) {
                            showGamePanel("score", false);
                        }
                        processOverlayButton();
                    }
                },
                error: function(e) {
                    try {settings.ga("Error", "createTopicSelectList", "url: "+topicUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error createTopicSelectList:\nurl: "+topicUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch topics. Try again?")) {
                        settings.nextApiDomain();
                        createTopicSelectList();
                    }
                }
            });
        }

        /**
         * Does array have duplicate values?
         *
         * @returns {boolean}
         */
        function duplicateArrayValues(theArray) {
            // check for duplicate answers
            var sortedArray = theArray.slice(0).sort();  // note that we are making a copy of the array

            // JS by default uses a crappy string compare.
            var results = [];
            for (var i = 0; i < theArray.length - 1; i++) {
                if (sortedArray[i + 1] == sortedArray[i]) {
                    results.push(sortedArray[i]);
                }
            }

            return (results.length > 0) ? true : false;
        }

        function fetchPlay(options) {

            options = options || {};

            overlayButton("Loading Thwords ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});

            var playUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/game-play/get?callback=?"
                + "&gi=" + play.id
                + "&sl=" + play.skillLevel
                + "&kl=" + play.knowledgeLevel
                + "&ci=" + ((play.getProperty("category-choose") < 0) ?  play.getProperty("category-id") : (options.category_id || 0))
                + "&ui=" + ((play.getProperty("subject-choose") < 0) ?  play.getProperty("subject-id") : (options.subject_id || 0))
                + "&ti=" + ((play.getProperty("topic-choose") < 0) ?  play.getProperty("topic-id") : (options.topic_id || 0))
                + "&li=" + ((play.getProperty("lesson-choose") < 0) ?  play.getProperty("lesson-id") : (options.lesson_id || 0))
                + "&al=" + play.lang;

            settings.ga("API", settings.getApiDomain(), playUrl);
            play.ga(play.id+": "+play.name, "fetch-play", "url: "+playUrl);

            // add random integer to break browser cache
            playUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: playUrl,
                async: false,
                jsonpCallback: "jsonCallback5",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(playData) {
                    overlayButton("Creating Tiles ...", {type: "loading", class: "loading-msg", clickable: false, timeout: 0});
                    loadPlay(playData);
                    processOverlayButton();
                },
                error: function(e) {
                    try {settings.ga("Error", "fetchPlay", "url: "+playUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error fetchPlay:\nurl: "+playUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch Thwords. Try again?")) {
                        settings.nextApiDomain();
                        fetchPlay(options);
                    }
                }
            });
        }

        function flipFreeTiles() {
            var delay = settings.tileFlipDelay;

            for (var idx=0; idx<play.thwords.tls.length; idx++) {
                for (var pos=0; pos<play.thwords.tls[idx].length; pos++) {

                    if (play.thwords.tls[idx][pos].f) {

                        if (settings.tileFlipDelay) {
                            // use tile flip delay
                            flipTileStack.push([idx, pos]);
                            setTimeout(function(){
                                shiftFromFlipTileStack();
                            }, delay);
                            delay += settings.tileFlipDelay;
                        } else {
                            // flip tile immediately
                            flipTile(idx, pos);
                        }

                    }
                }
            }
        }

        function flipTile(idx, pos) {

            // get the tile label
            var label = play.thwords.tls[idx][pos].l || "??";
            var points = play.thwords.tls[idx][pos].v || 0;

            // flip the tile
            $("#tile-"+idx+"-"+pos).addClass("solved");

            // add the tile to the array of tiles flipped
            play.push("tile-flipped", [idx, pos], false);

            tileSolved(idx, pos);
            addPoints(points);
        }

        function gameOver() {
            game.ga(game.id+": "+game.name, "game-over", "points: "+game.point.count+", rounds: "+round.count+", plays: "+play.count);

            // mark game over
            game.setProperty("status", 0);
            game.setProperty("save-status", 0);

            // record game
            recordFinalStats();

            // show new game button
            showButton("new-game", true);

            //overlayDiv("<h1 class=\"game-over-message\">Game Over</h1>" + renderGameStatsHtml(), {type: "fail"});
            // @TODO: remove this
            overlayDiv(Mustache.render(endOfGameOverlayTemplate, {title: "Game Over", details: ""}) + renderGameStatsHtml(), {type: "fail"});
        }

        /**
         * The method on only generates and returns a session id, but it also saves it in a cookie.
         * @returns {string}
         */
        function generateSessionId() {
            var sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

            // set the session cookie
            var date = new Date();
            date.setTime(date.getTime() + (730 * 24 * 60 * 60 * 1000));
            $.cookie("Thwords-Session", sessionId, {path: '/', expires: date});

            return sessionId;
        }

        function getEmbedIframe() {
            return '<iframe height="440" width="420" src="'+getShareUrl({e:1})+'" frameborder="0" allowfullscreen></iframe>';
        }

            /**
         * Returns the current game. If you want to get the current round game use getRoundGame().
         * @returns {*}
         */
        function getGame() {
            if ((typeof game === "undefined")
                || $.isEmptyObject(game)
                || (typeof game.id === "undefined")) {
                return {};
            } else {
                return game.game;
            }
        }

        function getGameById(id) {
            var newGame = {};

            $.each(games, function(idx, thisGame) {
                if (thisGame.id == id) {
                    for (var prop in thisGame) {
                        if (thisGame.hasOwnProperty(prop)) {
                            newGame[prop] = thisGame[prop];
                        }
                    }
                }
            });

            return newGame;
        }

        function getGameBySlug(slug) {
            var theGame = {};

            $.each(games, function(idx, thisGame) {
                if (thisGame.slug == slug) {
                    theGame = thisGame;
                }
            });

            return theGame;
        }

        function getKnowledgeLevelAbbrev(value) {
            for (var i=0; i<knowledgeLevels.length; i++) {
                if (value == knowledgeLevels[i].value) {
                    return knowledgeLevels[i].abbrev;
                }
            }

            return "?";
        }

        function getKnowledgeLevelName(value) {
            for (var i=0; i<knowledgeLevels.length; i++) {
                if (value == knowledgeLevels[i].value) {
                    return knowledgeLevels[i].name;
                }
            }

            return "?";
        }

        function getLanguageName(abbrev) {
            if (typeof languages[abbrev] !== "undefined") {
                return languages[abbrev];
            } else {
                return false;
            }
        }

        function getLanguageOptions() {
            var lo = [];
            $.each(languages, function(value, name) {
                if (value != "en") {
                    lo[lo.length] = {value: value, name: name};
                }
            });

            return lo;
        }

        function getRandomGame(parentGameId) {
            parentGameId = parentGameId || 7;  // default to Totally Random Thwords

            var randomGameId = getRandomGameId(parentGameId);

            return getGameById(randomGameId)
        }

        function getRandomGameId(parentGameId) {
            parentGameId = parentGameId || 7;

            if (parentGameId == 5) {
                // Random Thwords only includes Thwords, Anti-thwords and Thword Plays
                return standardGameIds[Math.floor(Math.random()*standardGameIds.length)];
            } else if ([6, 8].indexOf(parentGameId) > -1) {
                // Random Foreign Thwords and Language Drills only include Foreign Thwords
                return 4;
            } else {
                // Totally Random Thwords all games
                return allGameIds[Math.floor(Math.random()*allGameIds.length)];
            }
        }

        function getRandomGameName() {
            if (play.getProperty("id") == 4) {
                // Foreign Thwords
                return game.getProperty("abbrev")+": "+getLanguageName(play.getProperty("lang"))+" Thwords";
            } else {
                return game.getProperty("abbrev")+": "+play.getProperty("name");
            }
        }

        function getRandomGameShortName() {
            if (play.getProperty("id") == 4) {
                // Foreign Thwords
                return game.getProperty("abbrev")+": "+getLanguageName(play.getProperty("lang"));
            } else {
                return game.getProperty("abbrev")+": "+play.getProperty("shortName");
            }
        }

        /**
         * Returns a random lang from the users preferred langs if they have any specified, or it
         * will return one of any of the langs available.
         * @TODO: weight the different langs
         *
         * @returns {*}
         */
        function getRandomLang(langArray) {
            // default to all foerign langs
            langArray = langArray || foreignLangs;

            return langArray[Math.floor(Math.random()*langArray.length)];
        }

        function getRandomInt(minInt, maxInt) {
            return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        }

        function getShareUrl(params) {
            parms = params || {};

            if ((typeof game !== "undefined") && !$.isEmptyObject(game)) {
                if ((typeof game.lang !== "undefined") && (game.lang.length > 0)) {
                    params.al = game.lang;
                }
                if ((typeof game.skillLevel !== "undefined") && (parseInt(game.skillLevel) >0)) {
                    params.sl = game.skillLevel;
                }
                if ((typeof game.knowledgeLevel !== "undefined") && (parseInt(game.knowledgeLevel) >0)) {
                    params.kl = game.knowledgeLevel;
                }
                if ((typeof game.category.choose !== "undefined") && (parseInt(game.category.choose) < 0) && (parseInt(game.category.id) > 0)) {
                    params.cc = -1;
                    params.ci = game.category.id;
                }
                if ((typeof game.subject.choose !== "undefined") && (parseInt(game.subject.choose) < 0) && (parseInt(game.subject.id) > 0)) {
                    params.uc = -1;
                    params.ui = game.subject.id;
                }
                if ((typeof game.topic.choose !== "undefined") && (parseInt(game.topic.choose) < 0) && (parseInt(game.topic.id) > 0)) {
                    params.tc = -1;
                    params.ti = game.topic.id;
                }
                if ((typeof game.lesson.choose !== "undefined") && (parseInt(game.lesson.choose) < 0) && (parseInt(game.lesson.id) > 0)) {
                    params.lc = -1;
                    params.li = game.lesson.id;
                }
                if ((multilanguageGameIds.indexOf(game.id) > -1) && (typeof user.langs !== "undefined")) {
                    params.ap = user.langs.join("|");
                }
            }

            // strip parameters and hash off of the current url
            var shareUrl = document.location.toString().split(/[?#]/)[0];
            shareUrl = shareUrl.replace("/next/", "/play/");  // always use the "play" url instead of the "next" url

            if (!$.isEmptyObject(params)) {

                var paramStr = "";
                $.each(params, function(name, value) {
                    paramStr += "&"+name+"="+encodeURIComponent(value);
                });

                if (paramStr.length > 0) {
                    shareUrl += ((shareUrl.indexOf("?") < 0) ? "?" : "&") + paramStr.substr(1);
                }
            }

            return shareUrl;
        }

        function getSkillLevelAbbrev(value) {
            for (var i=0; i<skillLevels.length; i++) {
                if (value == skillLevels[i].value) {
                    return skillLevels[i].abbrev;
                }
            }

            return "?";
        }

        function getSkillLevelName(value) {
            for (var i=0; i<skillLevels.length; i++) {
                if (value == skillLevels[i].value) {
                    return skillLevels[i].name;
                }
            }

            return "?";
        }

        function getUrlParameter(sParam) {
            var sPageUrl = window.location.search.substring(1);
            var sUrlVariables = sPageUrl.split('&');

            for (var i = 0; i < sUrlVariables.length; i++)
            {
                var sParameterName = sUrlVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                    return decodeURIComponent(sParameterName[1]);
                }
            }
            return null;
        }

        function getUrlParameters(json) {
            json = json || false;

            var sPageUrl = window.location.search.substring(1);
            var sUrlVariables = sPageUrl.split('&');
            var paramsArray = [];
            var paramsJson = {};

            for (var i = 0; i < sUrlVariables.length; i++)
            {
                var sParameterName = sUrlVariables[i].split('=');
                if ((typeof sParameterName[0] !== "undefined") && (sParameterName[0].length > 0)) {

                    if (sParameterName[0] == "ap") {
                        // langs are separated by a vertical bar
                        var value = decodeURIComponent(sParameterName[1]).split("|");
                    } else {
                        var value = decodeURIComponent(sParameterName[1]);
                    }

                    paramsArray[paramsArray.length] = {
                        name: sParameterName[0],
                        value: value
                    }
                    paramsJson[sParameterName[0]] = value;
                }
            }

            return json ? paramsJson : paramsArray;
        }

        function hideAdOverlay() {
            $("#overlay-ad").removeClass("show").addClass("hide");

            // pre-load next ad
            loadAdOverlay();
        }

        function hideGamePanel(name) {
            $("#game-panel-"+name).removeClass("show").addClass("hide");
        }

        function loadAdOverlay() {

            if (parseInt(settings.getProperty("showAds")) !== 1) {
                // ads are only preloaded for 1
                return false;
            }

            var adUrl = settings.getProperty("adUrl")+"?callback=?";

            // add random integer to break browser cache
            adUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: adUrl,
                async: false,
                jsonpCallback: "jsonCallback6",
                contentType: "application/json",
                dataType: "jsonp",
                data: {},
                success: function(data) {
                    $("#ad-content").html(data);
                    $("#ad-content").find('a').each(function() {
                        $(this).on("click", function(event) {
                            settings.ga("Ad", "click", $(this).data("client") + ": " + $(this).attr("href"));
                            hideAdOverlay();
                            return true;
                        });
                    });
                },
                error: function(e) {
                    try {settings.ga("Error", "loadAdOverlay", "url: "+adUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error loadAdOverlay:\nurl: "+adUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                }
            });
        }

        function loadPlay(data) {

            if (!$.isEmptyObject(data)) {

                try {
                    // record topic, subject, category and lesson
                    if ((typeof data.ti !== "undefined") && (parseInt(data.ti) > 0)) {
                        play.ga(play.id+": "+play.name, "load-topic", data.ti+": "+((typeof data.tn !== "undefined") ? data.tn : ""));
                    }
                    if ((typeof data.ui !== "undefined") && (parseInt(data.ui) > 0)) {
                        play.ga(play.id+": "+play.name, "load-subject", data.ui+": "+((typeof data.un !== "undefined") ? data.un : ""));
                    }
                    if ((typeof data.ci !== "undefined") && (parseInt(data.ci) > 0)) {
                        play.ga(play.id+": "+play.name, "load-category", data.ci+": "+((typeof data.cn !== "undefined") ? data.cn : ""));
                    }
                    if ((typeof data.li !== "undefined") && (parseInt(data.li) > 0)) {
                        play.ga(play.id+": "+play.name, "load-lesson", data.li+": "+((typeof data.ln !== "undefined") ? data.ln : ""));
                    }
                } catch (e) {
                    try {play.ga(play.id+": "+play.name, "loadPlay", e.toString()+", data: "+JSON.stringify(data)); } catch (e) {}
                }

                if ((typeof data.tz !== "undefined") && !$.isEmptyObject(data.tz)) {

                }

                if ((typeof data.qz !== "undefined") && !$.isEmptyObject(data.qz)) {

                }

                if ((typeof data.su !== "undefined") && !$.isEmptyObject(data.su)) {

                }


                // get the current topic id and count before we update the play
                var current = {
                    category: {id: play.category.id, count: play.category.count},
                    lesson: {id: play.lesson.id, count: play.lesson.count},
                    subject: {id: play.subject.id, count: play.subject.count},
                    topic: {id: play.topic.id, count: play.topic.count}
                };

                for (var prop in data) {
                    if (data.hasOwnProperty(prop)) {
                        switch (prop) {
                            case "pt":  // Maximum Points
                                play.setProperty("point-total", 0, false, false);
                                play.addToTotal("point", data[prop], true, false);
                                break;
                            case "zt":  // Thword total
                                play.setProperty("thword-total", 0, false, false);
                                play.addToTotal("thword", data[prop], true, false);
                                break;
                            default:
                                play.setProperty(prop, data[prop], false, false);
                                break;
                        }
                    }
                }

                // update category/lesson/subject/topic counts and played arrays
                if ((current.category.id > 0) && (play.category.id == current.category.id)) {
                    play.addToCount("category", 1);
                } else {
                    play.setProperty("category-count", 1);
                    if (play.category.played.indexOf(play.category.id) < 0) {
                        play.push("category-played", play.category.id);
                    }
                }
                if ((current.lesson.id > 0) && (play.lesson.id == current.lesson.id)) {
                    play.addToCount("lesson", 1);
                } else {
                    play.setProperty("lesson-count", 1);
                    if (play.lesson.played.indexOf(play.lesson.id) < 0) {
                        play.push("lesson-played", play.lesson.id);
                    }
                }
                if ((current.subject.id > 0) && (play.subject.id == current.subject.id)) {
                    play.addToCount("subject", 1);
                } else {
                    play.setProperty("subject-count", 1);
                    if (play.subject.played.indexOf(play.subject.id) < 0) {
                        play.push("subject-played", play.subject.id);
                    }
                }
                if ((current.topic.id > 0) && (play.topic.id == current.topic.id)) {
                    play.addToCount("topic", 1);
                } else {
                    play.setProperty("topic-count", 1);
                    if (play.topic.played.indexOf(play.topic.id) < 0) {
                        play.push("topic-played", play.topic.id);
                    }
                }

                // store the updated data
                game.store();
                round.store();
                play.store();
            }

            // set topic name
            showGamePanel("topic", true);
            showGamePanel("score");

            if (!$.isEmptyObject(play.thwords)) {
                if (play.adjustedBonusOn() && (
                    $.isEmptyObject(play.bonusQuestions)
                        || (typeof play.bonusQuestions.q === "undefined")
                        || (play.bonusQuestions.q.length === 0))
                    ) {

                    // try to automatically generate bonus question(s)
                    play.generateBonusQuestions();
                }

                setCharRack();
                showGamePanel("chars");
                setAnswers();
                showGamePanel("answers");
                flipFreeTiles();

            } else if (!$.isEmptyObject(play.quiz))  {
                alert("QUIZ - these have not been implemented yet.");
            } else {
                alert("No Thwords or quizzes found.")
            }

            // save game and round data
            game.store();
            round.store();
            play.store();
        }

        function losePlay() {
            play.ga(play.id+": "+play.name, "play-lose", "topic "+play.topic.id+": "+play.topic.name);
            play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-play-lose", "topic "+play.topic.id+": "+play.topic.name);

            // mark unsolved thwords
            $(".thw-rack").not(".solved-thword").addClass("wrong-thword");

            // show all tiles
            revealUnsolvedTiles();

            // show all aux2 fields (for Foreign Thwords these hold the English character translations)
            for (var idx=0; idx<play.thwords.ans.length; idx++) {
                $("#answer-" + idx + " > .aux2").removeClass("hide").addClass("show");
            }

            // hide char rack
            hideGamePanel("chars");

            if ((play.bonus.on > 0) && (bonusQuestionCount() > 0) && (play.save.status < 0)) {

                // there are bonus questions

                play.setProperty("status", 0);

                // bonus question(s) so we have a save attempt
                play.setProperty("save-status", 1, true);
                play.addToTotal("save", 1, true);

                if (bonusQuestionCount() > 1) {
                    $("#btn-show-bonus").html("BONUS QUESTIONS");
                    var title = "Game Over";
                    var details = "However, you can continue your game if you answer all of the following bonus questions correctly.";
                } else {
                    $("#btn-show-bonus").html("BONUS QUESTION");
                    var title = "Game Over";
                    var details = "However, you can continue your game if you answer the following bonus question correctly.";
                }

                var msg = Mustache.render(endOfGameOverlayTemplate, {title: title, details: details});
                overlayDiv(msg, {type: "fail", position: "top"});

                showButton("show-bonus", true);

            } else {

                // round is over
                showGamePanel("feedback", false);
                roundOver();
            }

            // show game panel
            showGamePanel("start");
        }

        function matchingTileCount(idx, includeFreeTiles) {

            includeFreeTiles = includeFreeTiles || false;

            var tileCnt = play.thwords.chs[idx].m.length;

            if (!includeFreeTiles) {
                // subtract free tiles
                for (var i=0; i<play.thwords.chs[idx].m.length; i++) {
                    var ans = play.thwords.chs[idx].m[i][0];
                    var pos = play.thwords.chs[idx].m[i][1];
                    if (play.thwords.tls[ans][pos].f) {
                        tileCnt--;
                    }
                }
            }

            return tileCnt;
        }

        function nextBonus() {
            play.addToTotal("bonus", 1, true);

            var bonusQuestion = popNextBonusQuestion();

            if (bonusQuestion) {

                // get the next bonus question

                // render the bonus question HTML
                switch (bonusQuestion.type) {
                    case "mc":  // multiple choice
                    case "tf":  // True/False
                    case "yn":  // Yes/No

                        var html = Mustache.render(questionMultipleChoiceTemplate, bonusQuestion);
                        break;

                    case "tx":  // text

                        var pos = bonusQuestion.answer.indexOf(" ");
                        if (pos < 0) {
                            bonusQuestion.prefix = "";
                        } else {
                            var prefix = bonusQuestion.answer.slice(0, pos + 1);
                            if ((play.thwords.px.indexOf(prefix) > -1) && (play.adjustedSkillLevel() < 3)) {
                                // only separate out prefix out for novice and amateur
                                bonusQuestion.prefix = prefix;
                                bonusQuestion.answer = bonusQuestion.answer.slice(pos + 1);
                            } else {
                                bonusQuestion.prefix = "";
                            }
                        }

                        var html = Mustache.render(questionTextTemplate, bonusQuestion);
                        break;

                    default:

                        alert("Invalid question type")
                        break;
                }

                $("#game-panel-bonus").html(html);
                $.each($(".question-answer"), function() {
                    $(this).removeClass("hide").addClass("show");
                });

                /**
                 * These are for multiple choice, True/False and Yes/No
                 */
                // bind click event to the answers
                $(".question-answer").bind("click", function(event) {
                    if (!$(this).hasClass("done")) {
                        event.preventDefault();
                        selectBonusAnswerOption(this);
                    }
                });

                /**
                 * These are for text input.
                 */
                $("#submit-question-answer").on("click", function(elem) {
                    elem.preventDefault();
                    submitBonusAnswer(this);
                });
                $("#question-response").on("keypress", function(elem) {
                    if (elem.which == 13) {
                        elem.preventDefault();
                        submitBonusAnswer($("#submit-question-answer"));
                    }
                });


                // bind click event to Next Question button
                $(".next-question").on("click", function(elem) {
                    elem.preventDefault();
                    nextBonus();
                });

                if (bonusQuestion.type == "tx") {
                    $("#question-response").focus();
                }

                showGamePanel("score", true);
                showGamePanel("bonus", false);

            } else {

                // all bonus questions have been answered so start next play
                startPlay();
            }
        }

        function openMenu() {
            $("nav").css("display", "block");
            $("#content").css("min-height", $(window).height());

            $("nav").css("opacity", 1);

            //set the width of primary content container -> content should not scale while animating
            var contentWidth = $("#content").width();

            //set the content with the width that it has originally
            $("#content").css("width", contentWidth);

            //display a layer to disable clicking and scrolling on the content while menu is shown
            $("#menuContentLayer").css("display", "block");

            //disable all scrolling on mobile devices while menu is shown
            $("#container").bind("touchmove", function (e) {
                e.preventDefault()
            });

            //set margin for the whole container with a jquery UI animation
            $("#container").animate({"marginLeft": ["30%", 'easeOutExpo']}, {
                duration: 700
            });
        }

        function overlayButton(msg, params) {

            if ($("#overlay-btn-container").hasClass("show")) {
                // remove existing overlay msg
                processOverlayButton();
            }

            params = params || {};
            var msgType = params.type || "standard";
            var cssClass = params.class || '';
            var dataValues = params.data || {};
            var clickable = params.clickable || true;
            var timeout = (typeof params.timeout !== "undefined") ? params.timeout : settings.overlayButtonDelay;
            var opacity = (typeof params.opacity !== "undefined") ? params.opacity : defaults.overlayBackgroundOpacity;

            // create button
            var button = document.createElement('button');
            $(button).attr("id", "overlay-btn");

            // add button classes
            $(button).addClass("btn").addClass("thw-btn").addClass("overlay-btn").addClass(msgType).addClass("show");
            if (cssClass) {
                $(button).addClass(cssClass);
            }

            // add button text
            $(button).html(msg);

            // set the message button data attributes
            $.each(dataValues, function(name, value) {
                $(button).attr("data-"+name, value);
            });

            // add click event to process message
            if (clickable) {
                $(button).on("click", function(elem) {
                    processOverlayButton();
                });
            }

            // display overlay background
            if (opacity !== false) {
                $("#overlay-background").css("opacity", opacity);
                $("#overlay-background").removeClass("hide").addClass("show");
            }

            // add the button to the overlay and display it
            $("#overlay-btn-container").html("").append(button).removeClass("hide").addClass("show");

            // set the message timeout
            if (timeout) {
                overlayButtonTimeout = setTimeout(function(){
                    processOverlayButton();
                }, timeout);
            }
        }

        function overlayDiv(msg, params) {

            params = params || {};
            settings = settings || {};
            defaults = defaults || {};

            var msgType = params.type || "standard";
            var timeout = (typeof params.timeout !== "undefined") ? params.timeout : (settings.overlayDivDelay || 0);
            var cssClass = params.class || '';
            var dataValues = params.data || {};
            var btnLabel = params.label || "Continue";
            var position = params.position || "bottom";
            var bindAction = params.bindAction || false;
            var hideNav = params.hideNav || false;
            var opacity = (typeof params.opacity !== "undefined") ? params.opacity : (defaults.overlayBackgroundOpacity || 0.5);

            if (hideNav) {
                $("#overlay-div-nav").addClass("hide");
            }

            // set the message
            $("#overlay-div-content-top").html("");
            $("#overlay-div-content").html("");
            if (position == "top") {
                $("#overlay-div-content-top").html(msg);
            } else {
                $("#overlay-div-content").html(msg);
            }

            // set the continue button label and styles
            $("#overlay-continue-btn").text(btnLabel);
            $("#overlay-continue-btn").removeClass().addClass("btn").addClass("thw-btn").addClass("overlay-continue-btn").addClass("show");
            if (cssClass) {
                $("#overlay-continue-btn").addClass(cssClass);
            }

            // set the continue button data values
            $.each(dataValues, function(name, value) {
                $("#overlay-continue-btn").attr("data-"+name, value);
            });

            // make sure main overlay background is hidden
            if (opacity !== false) {
                $("#overlay-background").css("opacity", opacity);
                $("#overlay-background").removeClass("hide").addClass("show");
            }

            // set the overlay div container style(s) and show it
            $("#overlay-div-container").removeClass().addClass(msgType).addClass("show");
            if (cssClass) {
                $("#overlay-div-container").addClass(cssClass);
            }

            // bind any requested actions to elements
            if (bindAction) {
                switch (bindAction) {
                    default:
                        break;
                }
            }

            // set the message timeout
            if (timeout) {
                overlayDivTimeout = setTimeout(function(){
                    processOverlayDiv();
                }, timeout);
            }
        }

        function playTopicAgain() {
            play.ga(play.id+": "+play.name, "topic-repeat", "topic "+play.topic.id+": "+play.topic.name);

            // update status
            play.setProperties({status: 1, save_status: 0});
            play.setProperty("count", play.count + 1);

            // reset game board
            $(".strike-xs").html("");

            fetchPlay({topic_id: play.topic.id})
        }

        function popNextBonusQuestion() {
            try {
                if (bonusQuestionCount() < 0) {
                    // no bonus question
                    return false;

                } else if ((typeof play.bonusQuestions !== "undefined") || (typeof play.bonusQuestions.questions !== "undefined")) {

                    if (typeof play.bonusQuestions.idx === "undefined") {
                        // problem with bonus question array structure
                        play.bonusQuestions.idx = 99999;   // define the pointer but move it passed the end of the bonus questions
                        return false;

                    } else if ((typeof play.bonusQuestions.questions[play.bonusQuestions.idx] !== "undefined")
                        && (play.bonusQuestions.idx <= play.bonus.total)) {

                        // generate the bonus question
                        var bonusQuestion = {
                            idx: play.bonusQuestions.idx,
                            title: play.bonusQuestions.title ? play.bonusQuestions.title : ((play.bonusQuestions.questions.length > 0) ? "Bonus Questions" : "Bonus Question"),
                            instructions: play.bonusQuestions.label  ? play.bonusQuestions.label : "Select the answer that best matches."
                        };

                        bonusQuestion.type = (typeof play.bonusQuestions.questions[play.bonusQuestions.idx].t !== "undefined") ? play.bonusQuestions.questions[play.bonusQuestions.idx].t : false;
                        bonusQuestion.question = (typeof play.bonusQuestions.questions[play.bonusQuestions.idx].q !== "undefined") ? play.bonusQuestions.questions[play.bonusQuestions.idx].q : "";
                        bonusQuestion.answer = (typeof play.bonusQuestions.questions[play.bonusQuestions.idx].a !== "undefined") ? play.bonusQuestions.questions[play.bonusQuestions.idx].a : "";
                        bonusQuestion.points = (typeof play.bonusQuestions.questions[play.bonusQuestions.idx].p !== "undefined") ? play.bonusQuestions.questions[play.bonusQuestions.idx].p : 1;
                        bonusQuestion.options = [];

                        if (typeof play.bonusQuestions.questions[play.bonusQuestions.idx].o !== "undefined") {
                            for (var i=0; i<play.bonusQuestions.questions[play.bonusQuestions.idx].o.length; i++) {
                                bonusQuestion.options[bonusQuestion.options.length] = {
                                    text: play.bonusQuestions.questions[play.bonusQuestions.idx].o[i],
                                    option: i
                                }
                            }
                        }

                        // increment bonus question pointer
                        play.bonusQuestions.idx = play.bonusQuestions.idx + 1;

                        return bonusQuestion;

                    } else {

                        play.bonus.idx = 99999;   // define the pointer but move it passed the end of the bonus questions
                        return false;
                    }
                } else {

                    return false;
                }
            } catch (e) {
                console.log(e);
                settings.ga("Error", "popNextBonusQuestion", e.toString());
                return false;
            }
        }

        function processBonus(params) {

            params == params || {};

            if ((typeof params.idx === "undefined") || (typeof params.option === "undefined") || (typeof params.correct === "undefined")) {
                // we don't know what question and option was selected or which option is correct so we can't process
                play.ga("Error", "bonus-processing-problem", JSON.stringify(params));
                alert("Can't process bonus.")
                return false;
            }

            idx = params.idx || 0;
            option = params.option || 0;
            correct = params.correct || 0;

            switch (play.bonusQuestions.questions[idx].t) {
                case "tx":  // text response
                    break;

                case "mc":  // multiple choice
                case "tf":  // True/False
                case "yn":  // Yes/No
                default:
                    // did they answer the answer right
                    var answeredCorrectly = (option == correct) ? true : false;

                    if (answeredCorrectly) {
                        // mark correct option
                        $("#question-answer-"+idx+"-"+correct).addClass("correct");
                    } else {
                        // mark the selected option wrong and the correct selection
                        $("#question-answer-"+idx+"-"+option).addClass("wrong");
                        $("#question-answer-"+idx+"-"+correct).addClass("correct");
                    }
                    break;
            }

            $.each($(".question-answer"), function() {
                $(this).addClass("done");
            });
            $("#question-title").addClass("hide");
            $("#question-instructions").addClass("hide");

            // go to next bonus question or next round
            if (play.bonusQuestions.idx < play.bonusQuestions.questions.length) {

                // go to next bonus question
                showButton("next-question", true);

            } else {

                // all bonus questions have been answered
                $("#btn-next-question").removeClass("show").addClass("hide");

                if (play.bonus.count == play.bonus.total) {

                    // correct
                    play.ga(play.id+": "+play.name, "bonus-win", "topic "+play.topic.id+": "+play.topic.name);
                    play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-bonus-win", "topic "+play.topic.id+": "+play.topic.name);

                    if (play.save.status > 0) {

                        // Hooray! saved your game so you get to continue
                        play.ga(play.id+": "+play.name, "save-win", "topic "+play.topic.id+": "+play.topic.name);
                        play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-save-win", "topic "+play.topic.id+": "+play.topic.name);

                        play.addToCount("save", 1, true);
                        play.setProperty("save-status", -1, true);

                        var msg = Mustache.render(gameSaveTemplate, {});
                        overlayDiv(msg, {msgType: "success", class: "show-start-panel", timeout: 0, position: "top"});
                    }

                    // continue your game
                    showButton("next-round", true);
                    showPlayTopicAgainButton();

                } else {

                    // incorrect
                    play.ga(play.id+": "+play.name, "bonus-lose", "topic "+play.topic.id+": "+play.topic.name);
                    play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-bonus-lose", "topic "+play.topic.id+": "+play.topic.name);


                    if (play.save.status > 0) {

                        // your attempt to save the game failed so  your game is over
                        play.ga(play.id+": "+play.name, "save-lose", "topic "+play.topic.id+": "+play.topic.name);
                        play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-save-lose", "topic "+play.topic.id+": "+play.topic.name);

                        play.setProperty("save-status", 0, true);

                        roundOver();

                    } else {

                        showButton("next-round", true);
                        showPlayTopicAgainButton();

                    }
                }
            }

            showGamePanel("start");
            showGamePanel("feedback", false);
        }

        function processChar(idx) {

            if (typeof idx === "undefined") {
                return false;
            }

            processingFlag = true;

            // add to array of characters played
            play.push("char-played", idx, false);

            var delay = settings.tileFlipDelay;

            if (matchingTileCount(idx) > 0) {
                // char found in answer tiles

                addHit();

                // flip all matching tiles
                for (var i=0; i<play.thwords.chs[idx].m.length; i++) {
                    if (settings.tileFlipDelay) {
                        flipTileStack.push([play.thwords.chs[idx].m[i][0], play.thwords.chs[idx].m[i][1]]);
                        setTimeout(function(){
                            shiftFromFlipTileStack();
                        }, delay);
                        delay += settings.tileFlipDelay;
                    } else {
                        flipTile(play.thwords.chs[idx].m[i][0], play.thwords.chs[idx].m[i][1]);
                    }
                }

            } else {
                // char not found in answer tiles

                strike();

                // subtract from 1 to 10 points (inverse or char point value)
                var valLost = wrongValue(play.thwords.chs[idx].v);
                addPoints(valLost);
            }

            // check for winner or game over (don't check until the flip tile stack is empty)
            if ((flipTileStack.length == 0) && (play.status > 0)) {
                checkForPlayOver();
            }

            processingFlag = false;
        }

        function processOverlayButton() {

            clearTimeout(overlayButtonTimeout);

            // hide the overlay
            $("#overlay-btn-container").removeClass("show").addClass("hide");
            $("#overlay-background").removeClass("show").addClass("hide");
            $("#overlay-background").css("opacity", defaults.overlayBackgroundOpacity);

            var btn = $("#overlay-btn");
            if ($(btn).hasClass("process-char") && (typeof $(btn).attr("data-idx") !== "undefined")) {
                processChar($(btn).data("idx"));
            } else if ($(btn).hasClass("process-bonus") && (typeof $(btn).attr("data-correct") !== "undefined")) {
                processBonus({
                    idx: $(btn).data("idx"),
                    option: $(btn).data("option"),
                    correct: $(btn).data("correct")
                });
            } else {
                //alert("No character idx found.")
            }
        }

        function processOverlayDiv() {

            clearTimeout(overlayDivTimeout);

            // hide the overlay div
            $("#overlay-background").removeClass("show").addClass("hide");
            $("#overlay-div-container").removeClass("show").addClass("hide");
            $("#overlay-div-nav").removeClass("hide");

            // perform any processing (based on classes)
            if ($("#overlay-continue-btn").hasClass("process-char") && (typeof $("#overlay-continue").attr("data-idx") !== "undefined")) {
                processChar($("#overlay-continue-btn").data("idx"));
            } else if ($("#overlay-continue-btn").hasClass("next-round")) {
                startPlay();
            } else if ($("#overlay-continue-btn").hasClass("show-start-panel")) {
                showGamePanel("start");
            }

            // clear content and hide div
            hideOverlayDiv();
        }

        function processUrlParameters() {
            var urlParams = getUrlParameters();

            if (urlParams.length > 0) {

                settings.validationOff();
                game.validationOff();
                round.validationOff();
                play.validationOff();

                for (var i=0; i<urlParams.length; i++) {
                    settings.setProperty(urlParams[i].name, urlParams[i].value, true);
                    play.setProperty(urlParams[i].name, urlParams[i].value, true);
                }

                settings.validationOn();
                game.validationOn();
                round.validationOn();
                play.validationOn();
            }
        }

        function quitGame() {
            closeMenu();
            if (confirm("If you quit you will lose your current game.\n\nIf you want to keep your game use the Save and Exit option. \n\nAre you sure you want to quit?")) {
                play.ga(play.id+": "+play.name, "game-quit", "points: "+game.point.total+", rounds: "+round.count+", plays: "+play.count);
                recordFinalStats();  // @TODO: do we want to record stats when people quit?
                play.setProperty("status", 0, true);
                play.setProperty("save-status", 0, true);
                clearGameCookies();
                document.location.href = "/play";
            }
        }

        function revealTile(idx, pos) {

            // get the tile label
            var label = play.thwords.tls[idx][pos].l || "??";
            var val = play.thwords.tls[idx][pos].v || 0;

            // reveal the value by setting the front
            $("#tile-"+idx+"-"+pos).first().html(label);

        }

        function revealUnsolvedTiles() {

            var delay = settings.tileFlipDelay;

            for (var idx=0; idx<play.thwords.tls.length; idx++) {
                for (var pos=0; pos<play.thwords.tls[idx].length; pos++) {

                    if (play.thwords.tls[idx][pos].s == 0) {
                        revealTile(idx, pos);
                    }
                }

                // mark the answer wrong
                allTilesSolved(idx, true);
            }

        }

        function recordFinalStats() {
            try {
                var postData = {
                    "gi": game.id,
                    "gg": game.slug,
                    "gr": game.random,
                    "sa": game.status,
                    "cc": game.category.choose,
                    "ci": (game.category.choose < 0) ? game.category.id : 0,
                    "uc": game.subject.choose,
                    "ui": (game.subject.choose < 0) ? game.subject.id : 0,
                    "tc": game.topic.choose,
                    "ti": (game.lesson.choose < 0) ? game.topic.id : 0,
                    "lc": game.lesson.choose,
                    "li": (game.lesson.choose < 0) ? game.lesson.id : 0,
                    "pb": game.bonus.on,
                    "rd": play.count,
                    "al": game.lang,
                    "sl": game.skillLevel,
                    "kl": game.knowledgeLevel,
                    "zt": game.thword.total,
                    "zc": game.thword.count,
                    "zp": game.thword.percent,
                    "mm": game.move.max,
                    "mt": game.move.total,
                    "mc": game.move.count,
                    "mp": game.move.percent,
                    "pt": game.point.total,
                    "pc": game.point.count,
                    "pp": game.point.percent,
                    "bt": game.bonus.total,
                    "bc": game.bonus.count,
                    "bp": game.bonus.percent,
                    "ps": game.save.on,
                    "st": game.save.total,
                    "sc": game.save.count,
                    "sp": game.save.percent,
                    "hc": game.hitStreak.current,
                    "hl": game.hitStreak.long,
                    "uid": user.id,
                    "uun": user.username,
                    "una": user.name,
                    "uem": user.email,
                    "sid": user.sessionId,
                    "gid": group.id,
                    "gna": group.name
                }

                try {play.ga(play.id+": "+play.name, "record-stats", "data: "+JSON.stringify(postData))} catch (e) {};

                statsDomain = settings.getStatsDomain();
                var finalStatsUrl = "http://" + statsDomain + apiRoot.replace(/\/$/, '') + "/results/save?callback=?";

                settings.ga("API", statsDomain, finalStatsUrl);

                $.ajax({
                    type: "POST",
                    url: finalStatsUrl,
                    async: false,
                    jsonpCallback: "jsonCallback7",
                    contentType: "application/json",
                    dataType: "jsonp",
                    data: postData,
                    success: function(categories) {
                        console.log("Game successfully recorded.");
                    },
                    error: function(e) {
                        try {settings.ga("Error", "recordFinalStats", "url: "+finalStatsUrl+", "+JSON.stringify(e)+", data: "+JSON.stringify(postData))} catch (e) {};
                        try {console.log("Error recordFinalStats:\ndata: "+JSON.stringify(postData)+"\nurl: "+finalStatsUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    }
                });

            } catch (e) {
                console.log(e);
                settings.ga("Error", "recordFinalStats", e.toString());
            }
        }

        function reflowStyles() {
            // update point fields
            // @TODO: need to do this for all objects - play, round, etc.
            if (game.point.count < 0) {
                $(".game-point-count").each(function() {
                    $(this).addClass("negative");
                });
            } else {
                $(".game-point-count").each(function() {
                    $(this).removeClass("negative");
                });
            }

            // update move fields
            $("#moves-left").removeClass("txt-fail").removeClass("txt-danger");
            if (parseInt(play.move.remaining) < 2) {
                $("#moves-left").addClass("txt-fail");
            } else if (parseInt(play.move.remaining) < 3) {
                $("#moves-left").addClass("txt-danger");
            }
            $(".round-moves-left-text").text((parseInt(play.move.remaining) == 1) ? "move left" : "moves left");

            // update strike styles
            var str = "";
            for (i=0; i <play.move.strikes; i++) {
                str += "X";
            }
            $(".strike-xs").html(str);
        }

        function renderAboutHtml() {
            var data = {
                version: version,
                copyright: copyright
            }

            return Mustache.render(aboutTemplate, data);
        }

        function renderAnswersHtml() {
            if ($.isEmptyObject(play) || $.isEmptyObject(play.thwords) || (typeof play.thwords.ans === "undefined")) {
                alert("Thword answers not found.");
            } else {

                // create answer character tiles
                var data = {
                    answers: []
                };

                for (var idx=0; idx<play.thwords.ans.length; idx++) {

                    data.answers[data.answers.length] = {
                        idx: idx,
                        answer: play.thwords.ans[idx],
                        aux1: play.thwords.aux1[idx],
                        aux2: play.thwords.aux2[idx],
                        tileRack: renderTileRackHtml(idx)
                    };
                }
            }

            return Mustache.render(answersTemplate, data);
        }

        function renderCharRackHtml() {

            var data = {
                chars: []
            }

            if (!$.isEmptyObject(play) && !$.isEmptyObject(play.thwords.chs)) {
                $.each(play.thwords.chs, function(idx, char) {
                    data.chars[data.chars.length] = {
                        idx: idx,
                        label: char.l,
                        class: (char.f == 1) ? " chosen" : ""
                    }

                    if (char.f == 1) {
                        play.push("char-played", idx, false);
                    }
                });
            }

            return Mustache.render(charRackTemplate, data);
        }

        function renderChooseCategoryHtml(categories) {
            var idx = 0;
            var data = {
                categories: categories,
                lang: play.lang,
                idx: function() {
                    return idx++;
                }
            };
            return Mustache.render(chooseCategoryTemplate, data);
        }

        function renderChooseLessonHtml(lessons) {
            var idx = 0;
            var data = {
                lessons: lessons,
                lang: play.lang,
                idx: function() {
                    return idx++;
                }
            };
            return Mustache.render(chooseLessonTemplate, data);
        }

        function renderChooseSubjectHtml(subjects) {
            var idx = 0;
            var data = {
                subjects: subjects,
                lang: play.lang,
                idx: function() {
                    return idx++;
                }
            };
            return Mustache.render(chooseSubjectTemplate, data);
        }

        function renderChooseTopicHtml(topics) {
            var idx = 0;
            var data = {
                topics: topics,
                lang: play.lang,
                idx: function() {
                    return idx++;
                }
            };
            return Mustache.render(chooseTopicTemplate, data);
        }

        function renderGameStatsHtml() {
            var data = {
                rounds: round.count,
                plays: play.count,
                thword: {
                    total: game.thword.total,
                    count: game.thword.count,
                    percent: (game.thword.total != 0) ? parseFloat(game.thword.percent).toFixed(2) : ""
                },
                move: {
                    total: game.move.total,
                    count: game.move.count,
                    percent: (game.move.total != 0) ? parseFloat(game.move.percent).toFixed(2) : "",
                    strikes: game.move.strikes
                },
                point: {
                    total: game.point.total,
                    count: game.point.count,
                    percent: (game.point.percent != 0) ? parseFloat(game.point.percent).toFixed(2) : ""
                },
                hitStreak: {
                    long: game.hitStreak.long,
                    current: game.hitStreak.current
                },
                bonus: {
                    total: game.bonus.total,
                    count: game.bonus.count,
                    percent: game.bonus.total != 0 ? parseFloat(game.bonus.percent).toFixed(2) : ""
                },
                save: {
                    total: game.save.total,
                    count: game.save.count,
                    percent: game.save.total != 0 ? parseFloat(game.save.percent).toFixed(2) : ""
                }
            }

            return Mustache.render(gameStatsTemplate, data);
        }

        function renderGeneralFeedbackHtml() {

            return Mustache.render(generalFeedbackTemplate, {});
        }

        function renderHelpHtml() {

            return Mustache.render(helpTemplate, {});
        }

        function renderRoundStatsHtml() {
            var data = {
                plays: play.count,
                thword: {
                    total: play.thword.total,
                    count: play.thword.count,
                    percent: (play.thword.total != 0) ? parseFloat(play.thword.percent).toFixed(2) : ""
                },
                move: {
                    total: play.move.total,
                    count: play.move.count,
                    percent: (play.move.total != 0) ? parseFloat(play.move.percent).toFixed(2) : "",
                    strikes: play.move.strikes,
                    remaining: play.move.remaining
                },
                point: {
                    total: play.point.total,
                    count: play.point.count,
                    percent: (play.point.total != 0) ? parseFloat(play.point.percent).toFixed(2) : ""
                },
                hitStreak: {
                    long: play.hitStreak.long,
                    current: play.hitStreak.current
                },
                bonus: {
                    total: play.bonus.total,
                    count: play.bonus.count,
                    percent: play.bonus.total != 0 ? parseFloat(play.bonus.percent).toFixed(2) : ''
                },
                save: {
                    total: play.save.total,
                    count: play.save.count,
                    percent: play.save.total != 0 ? parseFloat(play.save.percent).toFixed(2) : ''
                }
            }

            return Mustache.render(roundStatsTemplate, data);
        }

        function renderSettingsHtml() {
            return Mustache.render(settingsTemplate, {
                skillLevelOptions: skillLevels,
                knowledgeLevelOptions: knowledgeLevels,
                settings: settings,
                game: game,
                user: user,
                skillLevel: getSkillLevelName(play.skillLevel),
                knowledgeLevel: getKnowledgeLevelName(play.knowledgeLevel),
                chooseCategory: (game.category.choose > 0) ? "Yes" : "No",
                chooseSubject: (game.subject.choose > 0) ? "Yes" : "No",
                chooseTopic: (game.topic.choose  > 0) ? "Yes" : "No",
                chooseLesson: (game.lesson.choose  > 0) ? "Yes" : "No",
                bonusOnOptions: (game.bonus.on > 0) ? "Yes" : "No"
            });
        }

        function renderTileRackHtml(idx) {

            var rowClass = (idx % 2) ? "odd-row" : "even-row";

            var data = {
                idx: idx,
                class: rowClass,
                tiles: []
            };

            for (var pos=0; pos<play.thwords.tls[idx].length; pos++) {
                data.tiles[data.tiles.length] = {
                    pos: pos,
                    label: play.thwords.tls[idx][pos].l
                }
            }

            return Mustache.render(tileRackTemplate, data);
        }

        function renderTileValuesHtml() {
            var data = {
                options: []
            };

            $.each(languages, function(name, value) {
                data.options[data.options.length] = {
                    name: name,
                    value: value
                };
            });

            return Mustache.render(tileValuesTemplate, data);
        }

        function resetFeedbackButtons() {
            $("#btn-topic-like").removeClass("clicked").removeClass("disabled");
            $("#btn-topic-dislike").removeClass("clicked").removeClass("disabled");
            $("#btn-topic-too-easy").removeClass("clicked").removeClass("disabled");
            $("#btn-topic-too-hard").removeClass("clicked").removeClass("disabled");
            $("#btn-topic-comment").removeClass("clicked").removeClass("disabled");
            $("#btn-topic-problem").removeClass("clicked").removeClass("disabled");
        }

        function roundOver() {
            game.ga(round.id+": "+round.name, "round-over", "points: "+round.point.count+", plays: "+play.count);

            round.setProperty("status", 0);
            round.setProperty("save-status", 0);

            // @TODO: note that we don't really have rounds implemented yet
            // set game over
            gameOver();
        }

        function saveAndExitGame() {
            window.onbeforeunload = function() {};

            closeMenu();

            play.ga(play.id+": "+play.name, "game-exit", "points: "+game.point.total+", rounds: "+round.count+", plays: "+play.count);

            // just leave the game state as is
            //recordFinalStats();  // @TODO: do we want to record stats when people quit?
            //play.setProperty("status", 0, true);
            //play.setProperty("save-status", 0, true);
            //clearGameCookies();

            document.location.href = "/play";
        }

        var selectChar = function(elem) {

            var idx = $(elem).data("idx") || false;

            try {
                if (!idx) {
                    alert("No index.");
                } else if ($(elem).hasClass("chosen")) {
                    //alert("You have already selected character "+idx+".");
                } else {
                    $(elem).addClass("chosen");

                    var val = play.thwords.chs[idx].v;
                    var matchCnt = matchingTileCount(idx);

                    if (matchCnt > 0) {
                        var val = val * matchCnt;
                        var msg = matchCnt + ((matchCnt==1) ? " match!" : " matches!");
                        msg += "<br>" + val + ((val==1) ? " point." : " points.");

                        overlayButton(msg,
                            {
                                type: "success",
                                class: "process-char",
                                data: {idx: idx},
                                timeout: settings.overlayButtonDelay,
                                opacity: false
                            });

                    } else {
                        var valLost = Math.abs(wrongValue(val));
                        var msg = "Strike!"
                        msg += "<br>You lose " + valLost + ((valLost == 1) ? " point" : " points.");

                        overlayButton(msg,
                            {
                                type: "fail",
                                class: "process-char",
                                data: {idx: idx},
                                timeout: settings.overlayButtonDelay,
                                opacity: false
                            });
                    }

                }
            } catch (e) {
                console.log(e);
                settings.ga("Error", "selectChar", e.toString());
            }
        };

        function setAnswers() {
            if ($.isEmptyObject(play) || (typeof play.thwords.ans === "undefined")) {
                try {play.ga(play.id+": "+play.name, "thword-answers-not-found", ((typeof play.thwords !== "undefined") ? JSON.stringify(play.thwords) : "url"+document.location.href)); } catch (e) {};
                alert("No answers found.");
            } else {

                // create answers
                var html = renderAnswersHtml();
                $("#game-panel-answers").html($.parseHTML(html));
            }
        }

        function setCharRack() {

            // create the char rack
            var html = renderCharRackHtml();
            $("#game-panel-chars").html(html);

            // bind click event to the chars
            $(".char").bind("click", function(event) {
                event.preventDefault();
                if (processingFlag || (flipTileStack.length > 0)) {
                    // still processin tiles
                    return false;
                }
                selectChar(this);
            });
        }

        function setNextRoundLink() {

            var nextRoundUrl = document.location.toString().split(/[?#]/)[0];
            if (nextRoundUrl.slice(-1) === "/") {
                // remove trailing backslash
                nextRoundUrl = nextRoundUrl.substring(0, nextRoundUrl.length - 1);
            }

            // add random integer to break browser cache
            $(".next-round-link").attr("href", nextRoundUrl.toString().replace("/play/", "/next/")+"?" + Math.floor((Math.random() * 100000000) + 1));
        }

        function setPlay() {
            if (round.random) {

                // select a random game
                var randomPlay = getRandomGame(round.id);

                if ((randomPlay.id == 4) && (round.random || (play.lang == "en"))) {
                    // Foreign Thwords
                    randomPlay.lang = getRandomLang(play.langs.length ? play.langs : foreignLangs);
                } else {
                    randomPlay.lang = "en";
                }

                // update the play
                play.setProperties(randomPlay, false);

                // update game name title
                $(".game-name").html(getRandomGameName());
                $(".game-shortName").html(getRandomGameShortName());
            }
        }

        function shiftFromFlipTileStack() {
            var tileToProcess = flipTileStack.shift();
            flipTile(tileToProcess[0], tileToProcess[1]);

            // check for winner or game over
            if (flipTileStack.length == 0) {
                checkForPlayOver();
            }
        }

        function showAboutOverlay() {
            ga("send", "event", "Global", "panel-view", "About");

            closeMenu();

            overlayDiv(renderAboutHtml(), {type: "standard"});
        }

        function showAdOverlay() {
            try {
                if ($("#ad-content").length) {
                    // pre-loaded ad
                    if (!$("#ad-content").html().replace(/^\s+|\s+$/gm,'').length) {
                        // ad content is empty so load an ad
                        loadAdOverlay();
                    }
                }
            } catch (e) {
                try {settings.ga("Error", "showAdOverlay", JSON.stringify(e))} catch (e) {};
                try {console.log("Error showAdOverlay: "+JSON.stringify(e))} catch (e) {};
            }
            $("#overlay-ad").removeClass("hide").addClass("show");
        }

        function showButton(name, resetButtons) {
            if (resetButtons) {
                $(".btn").removeClass("show").addClass("hide");
            }

            // show the button
            $("#btn-"+name).removeClass("hide").addClass("show");
        }

        function showDebugDataOverlay() {
            closeMenu();
            overlayDiv($("#debug-data").html(), {type: "standard"});
        }

        function showGameElements() {
            // show elements that only appear during an active game
            $(".in-game-only").each(function() {
                $(this).removeClass("hide").addClass("show");
            });
        }

        function showGamePanel(name, hideOthers) {
            hideOthers = hideOthers || false;

            if (hideOthers) {
                // hide all of the game panels
                $(".game-panel").each(function() {
                    $(this).removeClass("show").addClass("hide");
                });
            }

            // show the specified game panel
            $("#game-panel-"+name).removeClass("hide").addClass("show");

            if (isDebugOn()) {
                $("#game-panel-stats").removeClass("hide").addClass("show");
                $("#game-panel-debug").removeClass("hide").addClass("show");
            }
        }

        function showGeneralFeedbackOverlay() {
            ga("send", "event", "Global", "panel-view", "Feedback");

            closeMenu();

            overlayDiv(renderGeneralFeedbackHtml(), {type: "standard", label: "Cancel"});

            // bind change events to button
            $("#btn-general-feedback-cancel").on("click", function(elem) {
                elem.preventDefault();
                hideOverlayDiv();
            });
            $("#btn-general-feedback-submit").on("click", function(elem) {
                elem.preventDefault();
                if ($("#general-feedback-text").val().length > 0) {
                    settings.ga("Feedback", $("#general-feedback-subject").val(), $("#general-feedback-text").val());
                }
                hideOverlayDiv();
            });

        }

        function showHelpOverlay() {
            ga("send", "event", "Global", "panel-view", "Help");

            closeMenu();

            overlayDiv(renderHelpHtml(), {type: "standard"});
        }

        function showHighScoresOverlay(params) {
            ga("send", "event", "Global", "panel-view", "High Scores");

            params = params || {};

            params.gameId = (typeof params.gameId !== "undefined") ? params.gameId : game.id;
            params.lang = (typeof params.lang !== "undefined") ? params.lang : (game.lang ? game.lang : "en");
            params.knowledgeLevel = (typeof params.knowledgeLevel !== "undefined") ? params.knowledgeLevel : game.knowledgeLevel;
            params.skillLevel = (typeof params.skillLevel !== "undefined") ? params.skillLevel : play.skillLevel;
            params.categoryId = (typeof params.categoryId !== "undefined") ? params.categoryId : 0;
            params.group = (typeof params.group !== "undefined") ? params.group : group.id;

            closeMenu();

            // show loading message
            overlayDiv(Mustache.render(loadingTemplate, {}), {type: "standard"});

            var paramStr = '';

            if (params.gameId ) {
                paramStr += '&gi=' + params.gameId;
            }
            if (params.knowledgeLevel) {
                paramStr += '&kl=' + params.knowledgeLevel;
            }
            if (params.skillLevel) {
                paramStr += '&sl=' + params.skillLevel;
            }
            if (params.lang) {
                paramStr += '&al=' + params.lang;
            }
            if (typeof params.categoryId !== "undefined") {
                paramStr += '&ci=' + params.categoryId;
            }
            if (params.group) {
                paramStr += '&grp=' + params.group;
            }

            paramStr.replace(/^&/, '');

            // get high score url
            var statsDomain = settings.getStatsDomain();
            var highScoreUrl = "http://" + statsDomain + apiRoot.replace(/\/$/, '') + "/high-scores/get?callback=?" + paramStr;

            settings.ga("API", statsDomain, highScoreUrl);
            play.ga(play.id+": "+play.name, "high-scores-get", "url: "+highScoreUrl);

            // add random integer to break browser cache
            highScoreUrl += "&" + Math.floor((Math.random() * 100000000) + 1);

            $.ajax({
                type: "GET",
                url: highScoreUrl,
                async: false,
                jsonpCallback: "jsonCallback8",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(data) {
                    if ($.isEmptyObject(data)) {
                        var html = "<h2>No scores found.</h2>";
                    } else {
                        var scores = [];
                        $.each(data, function(idx, row) {
                            row.tp = row.tp ? parseFloat(row.tp).toFixed(2) : "";
                            row.mp = row.mp ? parseFloat(row.mp).toFixed(2) : "";
                            row.pp = row.pp ? parseFloat(row.pp).toFixed(2) : "";
                            row.bp = row.bp ? parseFloat(row.bp).toFixed(2) : null;
                            row.sp = row.sp ? parseFloat(row.sp).toFixed(2) : null;
                            row.sla = getSkillLevelAbbrev(row.sl);
                            row.kla = getKnowledgeLevelAbbrev(row.kl);
                            //row.gd.cca = (row.cc > 0) ? "Y" : "N";
                            //row.gd.uca = (row.uc > 0) ? "Y" : "N";
                            row.tca = (row.tc > 0) ? "Y" : "N";
                            //row.gd.lca = (row.lc > 0) ? "Y" : "N";
                            row.pba = (row.pb > 0) ? "Y" : "N";

                            scores[scores.length] = row;
                        });
                    }

                    var html = Mustache.render(highScoresTemplate, {scores: scores});

                    overlayDiv(html, {type: "standard"});

                    // select chosen dropdown list options
                    $("#high-score-game").val(params.gameId+"-"+params.lang+"-"+params.categoryId);
                    $("#high-score-skill-level").val(params.skillLevel);

                    // bind change events to selection lists
                    $("#high-score-game").on("change", function(elem) {
                        var tmp = $("#high-score-game").val().split("-");
                        var params = {
                            gameId: parseInt(tmp[0]),
                            lang: tmp[1],
                            skillLevel: parseInt($("#high-score-skill-level").val()),
                            categoryId: tmp[2]
                        }
                        showHighScoresOverlay(params)
                    });

                    $("#high-score-skill-level").on("change", function(elem) {
                        var tmp = $("#high-score-game").val().split("-");
                        var params = {
                            gameId: parseInt(tmp[0]),
                            lang: tmp[1],
                            skillLevel: parseInt($("#high-score-skill-level").val()),
                            categoryId: tmp[2]
                        }
                        showHighScoresOverlay(params)
                    });
                },
                error: function(e) {
                    try {settings.ga("Error", "fetchHighScores", "url: "+highScoreUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error fetchHighScores:\nurl: "+highScoreUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    overlayDiv("<p>There was a problem retrieving the high scores.</p><p>Try again later</p>", {type: "standard"});
                }
            });
        }

        function showPlayTopicAgainButton() {
            // only show play topic again button if user gets to choose topic and less than the maximum number of plays for the topic
            if ((play.topic.choose) && (play.topic.count < play.topic.max)) {
                showButton("play-topic-again");
            }
        }

        function showSettingsOverlay() {
            ga("send", "event", "Global", "panel-view", "Settings");

            closeMenu();

            // bind buttons
            overlayDiv(renderSettingsHtml(), {hideNav: true, type: "standard"});
            $("#save-settings").on("click", function(elem) {
                try {
                    play.ga("Settings", "save", "");
                    user.name = $("#settings-user-name").val();
                    user.store();
                } catch (e) {}
                processOverlayDiv();
            });
            $("#cancel-settings").on("click", function(elem) {
                processOverlayDiv();
            });
        }

        function showGameStatsOverlay() {
            ga("send", "event", "Global", "panel-view", "Game Stats");

            closeMenu();

            overlayDiv(renderGameStatsHtml(), {type: "standard"});
        }

        function showPlayStatsOverlay() {
            ga("send", "event", "Global", "panel-view", "Round Stats");

            closeMenu();

            overlayDiv(renderRoundStatsHtml(), {type: "standard"});
        }

        function showPregameSettingsForm() {

            // display initial settings form
            var html = Mustache.render(startSettingsTemplate, {
                user: user,
                skillLevelOptions: skillLevels,
                knowledgeLevelOptions: knowledgeLevels,
                chooseCategoryOptions: [{value: 1, name: "Yes"}, {value: 0, name: "No"}],
                chooseSubjectOptions: [{value: 1, name: "Yes"}, {value: 0, name: "No"}],
                chooseTopicOptions: [{value: 1, name: "Yes"}, {value: 0, name: "No"}],
                chooseLessonOptions: [{value: 1, name: "Yes"}, {value: 0, name: "No"}],
                bonusOnOptions: [{value: 1, name: "Yes"}, {value: 0, name: "No"}],
                langOptions: getLanguageOptions()
            });
            $("#start-game-settings").html(html);

            // does the game support multiple languages?
            if (multilanguageGameIds.indexOf(game.id) < 0) {
                $("#start-settings-langs").remove();
            } else {
                // mark preferred langs
                if ((user.langs !== "undefined") && (user.langs.constructor === Array)) {
                    for (var i=0; i<user.langs.length; i++) {
                        $("#start-langs option[value="+user.langs[i]+"]").attr("selected", true);
                    }
                }
            }

            // skill level
            $("#start-skill-level").val(game.skillLevel);

            // knowledge level
            $("#start-knowledge-level").val(game.knowledgeLevel);
            $("#start-settings-knowledge-level").remove();  // @TODO: we aren't using knowledge level yet so don't display it

            // are categories pre-selected?
            if (game.category.choose <= 0) {
                $("#start-settings-category").remove();
            }
            $("#start-settings-category").remove();  // @TODO: let's not show category select (except maybe in debug)

            // are subjects pre-selected?
            if (game.subject.choose <= 0) {
                $("#start-settings-subject").remove();
            }
            $("#start-settings-subject").remove();  // @TODO: let's not show subject select (except maybe in debug)

            // are topics pre-selected?
            if (game.topic.choose <= 0) {
                $("#start-settings-topic").remove();
            }
            $("#start-settings-topic").remove();  // @TODO: let's not show topic select (except maybe in debug)

            // are lessons pre-selected?
            if (game.lesson.choose <= 0) {
                $("#start-settings-lesson").remove();
            }
            $("#start-settings-lesson").remove();  // @TODO:  let's not show lesson select (except maybe in debug)

            // do we play bonus questions?
            if (game.bonus.on > 0) {
                $("#start-bonus-on").val(game.bonus.on);
            } else {
                $("#start-settings-bonus-on").remove();
            }
            $("#start-settings-bonus-on").remove(); // @TODO:  let's not show bonus-on select (except maybe in debug)

            // adjust for presets that were from a shared link
            if (!$.isEmptyObject(presets) && (typeof presets.s !== "undefined") && (parseInt(presets.s) > 0)) {

                if (typeof presets.la !== "undefined") {
                    // hide all lang buttons, except the preset lang (@TODO: this is not the most elegant way to do this
                    var langFound = false;
                    $.each($(".lang-btn"), function() {
                        if ($(this).data("lang") !== "undefined") {
                            if ($(this).data("lang") == game.lang) {
                                $(this).removeClass("hide").addClass("show");
                                langFound = true;
                            } else {
                                $(this).removeClass("show").addClass("hide");
                            }
                        }
                    });
                    if (!langFound) {
                        // language not found so display all of the languages
                        $.each($(".lang-btn"), function() {
                            if ($(this).data("lang") !== "undefined") {
                                $(this).removeClass("hide").addClass("show");
                            }
                        });
                    } else {
                        // hide language explanation text
                        $.each($(".lang-explanation-text"), function() {
                            $(this).removeClass("show").addClass("hide");
                        });
                    }
                }

                // langs
                if ((typeof presets.ap !== "undefined") && (presets.ap.length > 0)) {
                    var languages = [];
                    for (var i=0; i<presets.ap.length; i++) {
                        var thisLang = getLanguageName(presets.ap[i]);
                        if (thisLang !== false) {
                            // only take valid langs
                            languages[languages.length] = getLanguageName(presets.ap[i]);
                        }
                    }
                    if (languages.length > 1) {
                        // must have at least 2 langs
                        $("#start-settings-langs").html("<p class=\"label\">Languages</p><p style=\"margin-bottom: 16px;\">" + languages.join(", ") + "</p>");
                    }
                }

                // skill level
                if (typeof presets.gs !== "undefined") {
                    $("#start-settings-skillLevel").html('<p class="label">Skill Level: '+getSkillLevelName(game.skillLevel)+"</p>");
                }

                // knowledge level
                if (typeof presets.gk !== "undefined") {
                    $("#start-settings-knowledgeLevel").html('<p class="label">Knowledge Level: '+getKnowledgeLevelName(game.knowledgeLevel)+"</p>");
                }

                // choose category
                if (typeof presets.cc !== "undefined") {
                    $("#start-settings-category").html('<p class="label">Category: '+((game.category.choose > 0) ? "Yes" : "No")+"</p>");
                }

                // choose subject
                if (typeof presets.uc !== "undefined") {
                    $("#start-settings-subject").html('<p class="label">Subject: '+((game.subject.choose > 0) ? "Yes" : "No")+"</p>");
                }

                // choose topic
                if (typeof presets.tc !== "undefined") {
                    $("#start-settings-topic").html('<p class="label">Topic: '+((game.topic.choose > 0) ? "Yes" : "No")+"</p>");
                }

                // choose lesson
                if (typeof presets.lc !== "undefined") {
                    $("#start-settings-lesson").html('<p class="label">Lesson: '+((game.lesson.choose > 0) ? "Yes" : "No")+"</p>");
                }

                // bonus on/off
                if (typeof presets.pb !== "undefined") {
                    $("#start-settings-bonus-on").html('<p class="label">Bonus Questions: '+((game.bonus.om > 0) ? "Yes" : "No")+"</p>");
                }
            }
        }

        function showTileValuesOverlay() {
            try {
                play.ga(play.id+": "+play.name, "panel-view", "Tile Values");
            } catch (e) {}

            closeMenu();

            // render tile values overlay
            overlayDiv(renderTileValuesHtml(), {type: "standard"});

            // set current language in lang select list
            $("#tile-values-lang").val((typeof play !== "undefined") ? play.getProperty("lang") : defaultLang)

            // bind click event to language select list
            $("#tile-values-lang").on("change", function() {
                loadTileValuesTable($(this).val())
            });

            loadTileValuesTable((typeof play !== "undefined") ? play.getProperty("lang") : defaultLang)
        }

        function loadTileValuesTable(lang) {

            // display loading ...
            $("#tile-value-table-container").html(Mustache.render(loadingTemplate, {}));

            // fetch the tile values
            var tilesUrl = "http://" + settings.getApiDomain() + apiRoot.replace(/\/$/, '') + "/tiles/get?"
                + "&al=" + lang;

            settings.ga("API", settings.getApiDomain(), tilesUrl);

            $.ajax({
                type: "GET",
                url: tilesUrl,
                async: false,
                jsonpCallback: "jsonCallback9",
                contentType: "application/json",
                dataType: "jsonp",
                success: function(tileData) {
                    console.log(tileData);

                    // append the tile values to the display
                    var data = {
                        tiles: []
                    };

                    $.each(tileData.values, function(name, value) {
                        data.tiles[data.tiles.length] = {
                            label: name === " " ? "<i>blank</i>" : name.toLowerCase(),
                            right: value,
                            wrong: wrongValue(value)
                        };
                    });

                    $("#tile-value-table-container").html(Mustache.render(tileValuesTableTemplate, data));

                },
                error: function(e) {
                    try {settings.ga("Error", "loadTileValuesTable", "url: "+tilesUrl+", "+JSON.stringify(e))} catch (e) {};
                    try {console.log("Error loadTileValuesTable:\nurl: "+tilesUrl+"\nerror: "+JSON.stringify(e))} catch (e) {};
                    if (confirm("Could not fetch tile values. Try again?")) {
                        settings.nextApiDomain();
                        showTileValuesOverlay();
                    }
                }
            });
        }

        function shuffle(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        function startGame() {
            game.ga(game.id+": "+game.name, "game-start", "user: "+user.name);

            // update statuses
            play.setProperties({status: 0, save_status: 0});
            game.setProperties({status: 1}, false);
            game.setProperty("count", game.count + 1);
            game.ga(game.id+": "+game.name, "game-count", game.count);
            game.ga(game.id+": "+game.name, "game-count-"+game.skillLevel+"-knowledge-"+game.knowledgeLevel, game.count);

            showGamePanel("start", true);
            startRound();
        }

        function startPlay() {
            // reset game board
            $(".strike-xs").html("");

            // update status
            play.setProperties({status: 1, save_status: 0});
            play.setProperty("count", play.count + 1);

            setPlay();
            play.ga(play.id+": "+play.name, "play-start", "user: "+user.name);
            play.ga(play.id+": "+play.name, "play-count", play.count);
            play.ga(play.id+": "+play.name, "play-count-"+play.skillLevel+"-knowledge-"+play.knowledgeLevel, play.count);

            // start play
            if (play.adjustedChooseCategory() > 0) {
                createCategorySelectList();
            } else if (play.adjustedChooseSubject() > 0) {
                createSubjectSelectList();
            } else if (play.adjustedChooseTopic() > 0) {
                createTopicSelectList();
            } else if (play.adjustedChooseLesson() > 0) {
                createLessonSelectList();
            } else {
                fetchPlay({});
            }
        }

        function startRound() {
            round.ga(round.id+": "+round.name,  "round-start", "user: "+user.name);

            // update status
            round.setProperties({status: 1, save_status: 0});
            round.setProperty("count", round.count + 1);
            round.ga(round.id+": "+round.name, "round-count", round.count);
            round.ga(round.id+": "+round.name, "round-count-"+round.skillLevel+"-knowledge-"+round.knowledgeLevel, round.count);

            // @TODO: right now we only have a single round

            startPlay();
        }

        function strike() {
            // add move
            play.addToTotal("move", 1);

            // add strike
            play.setProperty("move-strikes", play.move.strikes + 1, true);

            // set remaining
            play.setProperty("move-remaining", play.move.max - play.move.total);
            play.store();

            // end hit streak
            play.setProperty("hitStreak-current", 0, true);

            // update strike styles
            reflowStyles();
        }

        function submitBonusAnswer(btn) {

            if (!$("#question-response").length) {
                alert("question-response field not found.");
                try {ga.play("Error", "bonus-input-missing", "question-response input text field not found. : "+JSON.stringify(play.bonusQuestions)); } catch (e) {}
            } else {
                var idx = parseInt($(btn).data("idx"));
                var option = parseInt($(btn).data("option"));

                var correct = compareTextStrings(
                    $("#question-response-prefix").text() + $("#question-response").val(),
                    play.bonusQuestions.questions[idx].a,
                    true
                );
                var points = play.bonusQuestions.questions[idx].p;

                // disable the input text box
                $("#question-response").attr("disabled", "disabled");

                if (correct) {
                    $("#question-response").addClass("success");

                    // show actual answer so all accented characters are displayed
                    $("#question-response").html(play.bonusQuestions.questions[idx].a);

                    overlayButton("Correct",
                        {
                            type: "success",
                            class: "process-bonus",
                            data: {idx: idx, option: option, correct: correct, points: points},
                            timeout: settings.overlayButtonDelay
                        });
                } else {
                    $("#question-response").addClass("fail");
                    $("#text-question-answer").html("Answer: "+play.bonusQuestions.questions[idx].a).removeClass("hide").addClass("show");

                    overlayButton(Mustache.render(wrongAnswerTemplate, {correctAnswer: play.bonusQuestions.questions[idx].a}),
                        {
                            type: "error",
                            class: "process-bonus",
                            data: {idx: idx, option: option, correct: correct, points: points},
                            timeout: 5000
                        });
                }
            }
        }

        function compareTextStrings(str1, str2, useAccentFolding) {
            var s1 = str1;
            var s2 = str2;
            useAccentFolding = (typeof useAccentFolding !== "undefined") ? useAccentFolding : false;

            // trim white space
            s1 = s1.trim();
            s2 = s2.trim();

            // convert the strings to lower case
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();

            if (useAccentFolding) {
                s1 = accentFold(s1);
                s2 = accentFold(s2);
            }

            return (s1.localeCompare(s2) === 0) ? 1 : 0;
        }

        function tileSolved(idx, pos, solved) {

            solved = solved || true;

            play.thwords.tls[idx][pos].s = (solved) ? 1 : 0;
        }

        function updateDebug() {

            if (isDebugOn()) {
                $("#game-panel-debug").css("background-color", "#e8e8e8").css("color", "#000").css("border","solid 1px #000").css("padding", "12px");
                $("#game-panel-debug").html("<b>Play</b><hr>"+JSON.stringify(play, null, 4)
                    + "<br><br><b>Round</b><hr>"+JSON.stringify(round, null, 4)
                    + "<br><br><b>Game</b><hr>" + JSON.stringify(game, null, 4)
                    + "<br><br><b>Settings</b><hr>" + JSON.stringify(settings, null, 4)
                    + "<br><br><b>Group</b><hr>" + JSON.stringify(group, null, 4)
                    + "<br><br><b>User</b><hr>" + JSON.stringify(user, null, 4)
                    + "<br><br><b>Session</b>: " + sessionId
                );
            }
        }

        function updateInitialSettings(elem) {
            elem = elem || {};
            var errorMsgs = [];

            var userOptions = {};
            var gameOptions = {};

            if (!$.isEmptyObject(elem)) {
                gameOptions.id = (typeof $(elem).data("id") !== "undefined") ? $(elem).data("id") : game.id;
                gameOptions.name = (typeof $(elem).data("name") !== "undefined") ? $(elem).data("name") : game.name;
                gameOptions.lang = (typeof $(elem).data("lang") !== "undefined") ? $(elem).data("lang") : game.lang;

                if (typeof languages[gameOptions.lang] === "undefined") {
                    errorMsgs[errorMsgs.length] = "Invalid lang "+gameOptions.lang+".";
                }
            }

            // set preferred langs
            if ($("#start-langs").length) {
                gameOptions.langs = $("#start-langs").val();
                if (!$("#start-langs").val()
                    || (([5, 6, 7, 8].indexOf(game.id) > -1) && ($("#start-langs").val().length <2))
                    ) {
                    errorMsgs[errorMsgs.length] = "Please select at least two langs";
                } else {
                    gameOptions.langs = $("#start-langs").val();
                    userOptions.langs = gameOptions.langs;
                }
            }

            // set user name
            if ($("#start-user-name").length) {
                userOptions.name = $("#start-user-name").val();
            }

            // set skill level
            if ($("#start-skill-level").length) {
                gameOptions.skillLevel = parseInt($("#start-skill-level").val());
            }

            // set knowledge level
            if ($("#start-knowledge-level").length) {
                gameOptions.knowledgeLevel = parseInt($("#start-knowledge-level").val());
            }

            // set choose category
            if ($("#start-choose-category").length) {
                gameOptions["category-choose"] = validateChooseCategory(parseInt($("#start-choose-category").val()), game.id);
            }

            // set choose subject
            if ($("#start-choose-subject").length) {
                gameOptions["subject-choose"] = validateChooseSubject(parseInt($("#start-choose-subject").val()), game.id);
            }

            // set choose topic
            if ($("#start-choose-topic").length) {
                gameOptions["topic-choose"] = validateChooseTopic(parseInt($("#start-choose-topic").val()), game.id);
            }

            // set choose lesson
            if ($("#start-choose-lesson").length) {
                gameOptions["lesson-choose"] = validateChooseLesson(parseInt($("#start-choose-lesson").val()), game.id);
            }

            // set bonus
            if ($("#start-bonus-on").length) {
                gameOptions["bonus-on"] = parseInt($("#start-bonus-on").val());
            }

            if (errorMsgs.length) {
                alert(errorMsgs.join("\n\n"));
                return false;
            } else {
                if (!$.isEmptyObject(userOptions)) {
                    user.setProperties(userOptions);
                    user.ga("User", "start", "user:"+user.name);
                }
                if (!$.isEmptyObject(gameOptions)) {
                    play.setProperties(gameOptions, true);
                    if (typeof gameOptions.id !== "undefined") {
                        game.ga(game.id+": "+game.name, "game-user", "user: "+user.name);
                    }
                }
            }

            // update share links
            updateShareLinks();

            updateDebug();

            return true;
        }

        function updateShareLinks() {
            // update embed iframe
            $("#embed-link").val(getEmbedIframe());

            // update share link
            $("#link-link").val(getShareUrl({s:1}));
        }

        function validateChooseCategory(chooseCategory, gameId) {
            chooseCategory = parseInt(chooseCategory);
            gameId = gameId || false;

            if (gameId && chooseCategory && ([1, 3].indexOf(gameId) >= 0)) {
                // you cannot choose categories for Thwords and Anti-Thwords (because they don't have categories)
                return chooseCategory;
            } else {
                return chooseCategory;
            }
        }

        function validateChooseLesson(chooseLesson, gameId) {
            chooseLesson = parseInt(chooseLesson);
            gameId = gameId || false;

            // lessons have not yet been implemented
            return 0;
        }

        function validateChooseSubject(chooseSubject, gameId) {
            chooseSubject = parseInt(chooseSubject);
            gameId = gameId || false;

            if (gameId && chooseSubject && ([1, 3].indexOf(gameId) >= 0)) {
                // you cannot choose subjects for Thwords and Anti-Thwords (because they don't have subjects)
                return chooseSubject;
            } else {
                return chooseSubject;
            }
        }

        function validateChooseTopic(chooseTopic, gameId) {
            chooseTopic = parseInt(chooseTopic);
            gameId = gameId || false;

            // you can choose chooseTopic for all games
            return chooseTopic;
        }

        function winPlay() {
            play.ga(play.id+": "+play.name, "play-win", play.topic.id+": "+play.topic.name);
            play.ga(play.id+": "+play.name, "skill"+play.skillLevel+"-knowledge"+play.knowledgeLevel+"-play-win", play.topic.id+": "+play.topic.name);

            // show all aux2 fields (for Foreign Thwords these hold the English character translations)
            for (var idx=0; idx<play.thwords.ans.length; idx++) {
                $("#answer-" + idx + " > .aux2").removeClass("hide").addClass("show");
            }

            // hide chars rack
            hideGamePanel("chars");

            // display congratulations message
            var data = {
                msg: "Congratulations",
                score: play.point.count,
                perfectScore: (play.point.count == play.point.total) ?  1 : 0
            }
            var msg = Mustache.render(congratsMsgTemplate, data) + renderGameStatsHtml();
            overlayDiv(msg, {type: "success"})

            if ((play.bonus.on > 0) && (bonusQuestionCount() > 0)) {
                $("#btn-show-bonus").html((bonusQuestionCount() > 1) ? "BONUS QUESTIONS" : "BONUS QUESTION");
                showButton("show-bonus", true);
                showGamePanel("start");
            } else {
                showButton("next-round", true);
                showPlayTopicAgainButton()
                showGamePanel("start");
                showGamePanel("feedback", false);
            }
        }

        function wrongValue(rightValue) {
            return parseInt(rightValue) - 11;
        }

        /** *********************************************************************************************************
         *  The following are for debugging.
         ************************************************************************************************************ */

        function callerName() {
            try {
                var myCallee = arguments.callee;
                var hisCallee = myCallee.caller.arguments.callee;
                var hisCallerName = hisCallee.caller.name;

                if (isNoE(hisCallerName)) {
                    var hisCallersFunction = hisCallee.caller.toString();
                    if (!isNoE(hisCallersFunction)) {
                        hisCallerName = fBetween(hisCallersFunction, "function", "(");
                    }
                }
                hisCallerName = trim(hisCallerName);
            }
            catch (ex) {
                hisCallerName = "";
            }

            if (isNoE(hisCallerName)) {
                return "(anonymous)";
            }

            return hisCallerName;
        }

        function debugMsg(args) {
            if (isDebugOn()) {
                try {
                    console.log(callerName());
                    console.log(args);
                } catch (e) {
                    settings.ga("Error", "debugMsg", e.toString());
                    console.log("Error in debugMsg");
                    console.log(e);
                }
            }
        }

        function fBetween(inText, delimLeft, delimRight) {
            return fLeft(fRight(inText, delimLeft), delimRight);
        }

        function fLeft(inText, delim) {
            inText = getStringValue(inText);
            delim = getStringValue(delim);
            var outText = "";
            var theSpot = inText.indexOf(delim);
            if (theSpot > -1) {
                outText = inText.substring(0, theSpot);
            }
            return outText;
        }

        function fLeftBack(inText, delim) {
            inText = getStringValue(inText);
            delim = getStringValue(delim);
            var outText = "";
            var theSpot = inText.lastIndexOf(delim);
            if (theSpot > -1) outText = inText.substring(0, theSpot);
            return outText;
        }

        function fRight(inText, delim) {
            inText = getStringValue(inText);
            delim = getStringValue(delim);
            var outText = "";
            var theSpot = inText.indexOf(delim);
            if (theSpot > -1) {
                outText = inText.substring(theSpot + delim.length, inText.length);
            }
            return outText;
        }

        function fRightBack(inText, delim) {
            inText = getStringValue(inText);
            delim = getStringValue(delim);
            var outText = "";
            var theSpot = inText.lastIndexOf(delim);
            if (theSpot > -1) outText = inText.substring(theSpot + delim.length, inText.length);
            return outText;
        }

        function getStringValue(inString) {
            if (inString == null || inString == "undefined" || inString == "null" || inString == "[object]" || inString == "[object NodeList]") {
                return "";
            }

            try {
                var tString = new String(inString);
                return tString.toString();
            } catch (e) {
                return "";
            }
        }

        function isDebugOn() {
            var debug = $.cookie("debug") || 0;
            return (parseInt(debug)) ? true : false;
        }

        function isNoE(obj) {
            // must test type of base object first
            if (typeof obj == "undefined") {
                return true;
            }

            // immediate
            if (obj == undefined || obj == null) {
                return true;
            }

            // STRING
            return getStringValue(obj) == "";
        }

        function setDebug(value) {
            if (value) {
                if (value == 0) {
                    $.removeCookie("debug");
                    $("#show-debug-data").addClass("hide").removeClass("show");
                } else {
                    // set debug cookie"
                    $.cookie.json;
                    $.cookie("debug", 1);
                    $("#show-debug-data").addClass("show").removeClass("hide");
                }
            }
        }

        function trim(inString) {
            return inString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        function Woggle(name, settings, properties, options) {

            "use strict";

            settings = settings || {};
            properties = properties || {};

            this._initialized = false;
            this._name = name;                                        // object name
            this._cookie = settings.cookie || "Woggle-" + this._name; // cookie name
            this._cookie.replace(/\W/g, '');                          // remove non-alphanumeric characters from cookie name
            this._parent = settings.parent || {};                     // parent object
            this._autoStore = settings.autoStore || 1;                // automatically store object after every change
            this._initialProperties = properties || {};               // save the initial properties so we can reset the object
            this._validation = 1;                                     // if on then an alert is displayed for invalid properties; btw: invalid properties are always ignored
            this._ts = Date.now();

            this.addToCount = function(prop, points, propagate, storeChanges) {

                if (typeof points === "undefined") {
                    alert("No points specified for "+this._name+" property "+prop+" in addToCount method.");
                    return false;
                }

                if (typeof propagate === "undefined") {
                    propagate = true;
                }
                if (typeof storeChanges === "undefined") {
                    storeChanges = true;
                }

                // validate property
                var theProp = this.getPropertyName(prop+"-count");
                if (theProp === false) {
                    alert("Invalid "+this._name+" property "+prop+" in addToCount method.");
                    return false;
                }

                // update the property
                var props = theProp.split("-");
                if (props.length > 2) {
                    alert("Invalid "+this._name+" property "+prop+" in addToCount method.");
                    return false;
                }

                this[props[0]][props[1]] = this[props[0]][props[1]] + points;
                this.reflowProperty(theProp);
                if (this[props[0]].hasOwnProperty("total") && this[props[0]].hasOwnProperty("percent")) {
                    this[props[0]].percent = 100 * (this[props[0]].count / this[props[0]].total);
                    this.reflowProperty(theProp.replace("-count", "-percent"));
                }

                if (this._autoStore && storeChanges) {
                    this.store();
                }

                // update parent
                if (propagate && !$.isEmptyObject(this._parent)) {
                    this._parent.addToCount(prop, points, propagate, storeChanges);
                }

                this.updateTimeStamp();

                return true;
            },
            this.addToTotal = function(prop, points, propagate, storeChanges) {

                if (typeof points === "undefined") {
                    alert("No points specified for "+this._name+" property "+prop+" in addToTotal method.");
                    return false;
                }

                if (typeof propagate === "undefined") {
                    propagate = true;
                }
                if (typeof storeChanges === "undefined") {
                    storeChanges = true;
                }

                // validate property
                var theProp = this.getPropertyName(prop+"-total");
                if (theProp === false) {
                    alert("Invalid "+this._name+" property "+prop+" in addToTotal method.");
                    return false;
                }

                // update the property
                var props = theProp.split("-");
                if (props.length > 2) {
                    alert("Invalid "+this._name+" property "+prop+" in addToTotal method.");
                    return false;
                }

                this[props[0]][props[1]] = this[props[0]][props[1]] + points;
                this.reflowProperty(theProp);
                if (this[props[0]].hasOwnProperty("count") && this[props[0]].hasOwnProperty("percent")) {
                    this[props[0]].percent = 100 * (this[props[0]].count / this[props[0]].total);
                    this.reflowProperty(theProp.replace("-total", "-percent"));
                }

                if (this._autoStore && storeChanges) {
                    this.store();
                }

                // update parent
                if (propagate && !$.isEmptyObject(this._parent)) {
                    this._parent.addToTotal(prop, points, propagate, storeChanges);
                }

                this.updateTimeStamp();

                return true;
            },
            this.autoStore = function(value) {
                if (typeof value !== "undefined") {
                    this._autoStore = value;
                    return this;
                } else {
                    return this._autoStore;
                }
            };
            this.ga = function(category, action, label) {
                try {
                    ga(
                        "send",
                        "event",
                        category || this._name,
                        action,
                        label
                    );
                } catch (e) {}
            };
            this.getCookie = function() {
                return $.cookie(this._cookie);
            };
            this.getProperty = function(prop) {
                if (prop.indexOf("-") >= 0) {
                    var props = prop.split("-");
                } else {
                    var props = prop.split("_");
                }

                if (!this.hasOwnProperty(props[0])) {
                    alert("Invalid "+this._name+" property "+prop+".");
                    return null;
                }
                if (props.length === 2) {
                    if (!this[props[0]].hasOwnProperty(props[1])) {
                        alert("2. Invalid "+this._name+" property "+prop+".");
                        return null;
                    } else {
                        return this[props[0]][props[1]];
                    }
                } else {
                    return this[prop];
                }
            };
            this.getPropertyName = function(name, verifyProperty) {
                if (typeof verifyProperty === "undefined") {
                    verifyProperty = true;
                }
                var name = name.replace("_", "-");

                // find the property name
                var prop = false;
                for (var i=0; i<this._initialProperties.length; i++) {
                    if ((name === this._initialProperties[i][0])
                    || ((typeof this._initialProperties[i][2] !== "undefined") && (name === this._initialProperties[i][2]))) {
                        prop = this._initialProperties[i][0];
                        break;
                    }
                }

                // validate the property name
                if (prop !== false) {
                    if (verifyProperty) {
                        var props = prop.split("-");
                        if (props.length === 2) {
                            if (!this.hasOwnProperty(props[0]) || !this[props[0]].hasOwnProperty(props[1])) {
                                return false;
                            }
                        } else {
                            if (!this.hasOwnProperty(props[0])) {
                                return false;
                            }
                        }
                    }
                }

                return prop;
            };
            this.load = function(options) {
                options = options || [];

                if (!$.isEmptyObject(options)) {

                    for (var prop in options) {

                        if (options.hasOwnProperty(prop)) {
                            this.setProperty(prop, options[prop], false, false);
                        }
                    }
                }

                if (this._autoStore) {
                    this.store();
                }
            };
            this.name = function(value) {
                if (typeof value !== "undefined") {
                    this._name = value;
                    return this;
                } else {
                    return this._name;
                }
            };
            this.parseJSON = function(minify) {
                minify = minify || false;
                var jsonObj = {};
                for (var i=0; i<this._initialProperties.length; i++) {
                    jsonObj[minify ? this._initialProperties[i][2] : this._initialProperties[i][0]] = this.getProperty(this._initialProperties[i][0]);
                }
                return jsonObj;
            };
            this.push = function(prop, value, propagate) {

                propagate = propagate || false;

                // validate property
                var theProp = this.getPropertyName(prop);
                if (theProp === false) {
                    alert("Invalid "+this._name+" property "+prop+" in append method.");
                    return false;
                }

                // update the property
                var props = theProp.split("-");
                if (props.length === 2) {
                    if (this[props[0]][props[1]].constructor !== Array) {
                        alert(this._name+" property "+prop+" in append method is not an array.");
                        return false;
                    }
                    this[props[0]][props[1]][this[props[0]][props[1]].length] = value;
                    if (this[props[0]][props[1]].length > 100) this[props[0]][props[1]].length.shift(); // don't let the array get bigger than 100 elements
                    this.reflowProperty(theProp);
                } else {
                    if (this[props[0]].constructor !== Array) {
                        alert(this._name+" property "+prop+" in append method is not an array.");
                        return false;
                    }
                    this[props[0]][this[props[0]].length] = value;
                    if (this[props[0]].length > 100) this[props[0]].length.shift(); // don't let the array get bigger than 100 elements
                    this.reflowProperty(theProp);
                }

                if (this._autoStore) {
                    this.store();
                }

                // update parent
                if (propagate && !$.isEmptyObject(this._parent)) {
                    this._parent.push(prop, value, propagate);
                }

                this.updateTimeStamp();

                return true;
            };
            this.reflow = function() {
                for (var i=0; i<this._initialProperties.length; i++) {
                    this.reflowProperty(this._initialProperties[i][0]);
                }
            };
            this.reflowProperty = function(prop) {
                var theProp = this.getPropertyName(prop);
                if (theProp !== false) {
                    var value = this.getProperty(theProp);
                    $("."+this._name+"-"+theProp).text(value);
                }
            };
            this.setProperties = function(properties, propagate) {
                if (typeof propagate === "undefined") {
                    propagate = true;
                }

                var changed = false;
                for (var prop in properties) {
                    if (properties.hasOwnProperty(prop)) {
                        changed = this.setProperty(prop, properties[prop], propagate, false) || changed;
                    }
                }

                if (changed && this._autoStore) {
                    this.store();
                }

                this.updateTimeStamp();

                return changed;
            };
            this.setProperty = function(prop, value, propagate, storeChanges) {

                if (typeof propagate === "undefined") {
                    propagate = false;
                }
                if (typeof storeChanges === "undefined") {
                    storeChanges = true;
                }

                var changed = false;

                // set the property
                var theProp = this.getPropertyName(prop, false);
                if (theProp === false) {
                    if (this._validation > 0) {
                        alert("3. Invalid "+this._name+" property "+prop+".");
                    }
                    return changed;
                }

                if (theProp.indexOf("-") < 0) {
                    var props = theProp.split("_");
                } else {
                    var props = theProp.split("-");
                }

                if (props.length === 2) {

                    if (!this.hasOwnProperty(props[0])) {
                        if (!this._initialized) {
                            this[props[0]] = {};
                        } else {
                            alert("4. Invalid "+this._name+" property "+prop+".");
                            return changed;
                        }
                    } else if (!this[props[0]].hasOwnProperty(props[1]) && this.initialized) {
                        alert("5. Invalid "+this._name+" property "+prop+".");
                        return changed;
                    }

                    if (this[props[0]][props[1]] !== value) {
                        changed = true;
                    }

                    this[props[0]][props[1]] = value;

                } else {

                    if (!this.hasOwnProperty(props[0]) && this.initialized) {
                        alert("6. Invalid "+this._name+" property "+prop+".");
                        return false;
                    }

                    if (this[props[0]] !== value) {
                        changed = true;
                    }

                    this[props[0]] = value;
                }

                if (changed) {

                    this.reflowProperty(prop, value);
                    if (storeChanges && this._autoStore) {
                        this.store();
                    }
                }

                if (propagate && this.hasOwnProperty("_parent") && (typeof this._parent.setProperty !== "undefined")) {
                    this._parent.setProperty(prop, value, propagate, storeChanges);
                }

                this.updateTimeStamp();

                return changed;
            };
            this.store = function() {
                var date = new Date();
                date.setTime(date.getTime() + (730 * 24 * 60 * 60 * 1000));

                $.cookie.json;
                $.cookie(this._cookie, this.stringify(true), {path: '/', expires: date});
            };
            this.stringify = function(minify) {
                return JSON.stringify(this.parseJSON(minify || false));
            };
            this.updateTimeStamp = function() {
                this._ts = Date.now();
                if (typeof this.timeStamp !== "undefined") {
                    this.timeStamp = this._ts;
                }
            };
            this.validationOff = function() {
                this._validation = 0;
            };
            this.validationOn = function() {
                this._validation = 1;
            };

            // initialize properties
            for (var i=0; i<this._initialProperties.length; i++) {
                this.setProperty(this._initialProperties[i][0], this._initialProperties[i][1], false, false);
            }

            // load options
            if (typeof options !== "undefined") {
                this.load(options);
            } else if (this._autoStore) {
                this.store();
            }

            this._initialized = true;
            this.updateTimeStamp();
        }

   })();

});
