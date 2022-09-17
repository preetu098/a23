/* 
 * 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function () {

    var app = angular.module('utilsmodule', []);
    var controller = function (browserServices,clientUrls) {
        var vm = this;
        vm.current_year = '2016';
        vm.years = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'];
        vm.pressReleaseYears = ['2012', '2013', '2014', '2015', '2016'];

        vm.isWebView = browserServices.isWebView();
        vm.queryParams = browserServices.getQueryParams();
        vm.enableBankButton = vm.queryParams && vm.queryParams.enableback;
        //USE this method for redirecting to different static pages WEB, MWEB, MAPP.
         var queryParams = browserServices.getQueryParams();         
        vm.redirect = function (newPage, id, enableback) {
            vm.appHeader = queryParams.header || "Y";

            function newPageUrl(source) {
                if (newPage.indexOf('?') > 0) {
                    newPage = newPage + "&src=" + source + "&header=" + vm.appHeader;
                } else {
                    newPage = newPage + "?src=" + source + "&header=" + vm.appHeader;
                }
                return newPage;
            }


            if (vm.isWebView) {
                var source = vm.queryParams.src || "";
                newPage = newPageUrl(source);
                newPage = newPage + (enableback ? "&enableback=true" : "");
            }

            window.location.href = newPage + (id ? "#" + id : "");
        };

        vm.scrollTo = function (divid) {
            var value = 0;
            value = (browserServices.determineChannel() === 'WEB' && !vm.isWebView) ? 120 : 80;
            $('html, body').animate({
                scrollTop: $('[name="' + divid + '"]').offset().top - value
            }, 500);
        };

        vm.getUrl = function (url) {
            if (vm.isWebView) {
                return "#";
            }
            return url;
        };
        vm.goBack = function () {
            var backLink = document.referrer;
            if (backLink === '') {
                window.history.back();
                return false;
            }
            window.location.href = document.referrer;
        };
        vm.initDownloadProcess = function(appName){
//            var channel = browserServices.determineChannel();
//            if (channel !== "WEB") {
//                launchGame();
//            }else {
//                downloadingApk(appName);                
//            }
                downloadingApk(appName);  
        }
         function downloadingApk(appName) {
            var channel = browserServices.determineChannel();
            appName = appName !== undefined ? appName : "APK";
            switch (appName) {
                case "rummy":
                    window.location.href = channel === "WEB" ? clientUrls["pages"]["download"]["rummy"] : clientUrls["pages"]["install"]["rummy"];
                    break;
                case "a23games":
                    window.location.href = channel === "WEB" ? clientUrls["appPages"]["download"]["a23games"] : clientUrls["appPages"]["install"]["a23games"];
                    break;
                case "rummyapk":
                     window.location.href = "https://upgrades.a23.com/a23rummy/APK/A23Rummy.apk";
                    break;
                case "a23gamesapk":
                     window.location.href = "https://downloads.a23.com/a23games/APK/A23Games.apk";
                    break;
                default:
                    window.location.href = "https://downloads.a23.com/a23games/APK/A23Games.apk";
            }
        }
        function launchGame() {
            function redirect(url) {
                console.log("redirect to " + url);
                window.location.href = url;
            }
            //If it is an IOS device(mobile, tabs...) take to playstore.
           // alert(browserServices.isAndroidPlatform());
            var channel = browserServices.determineChannel();
            if (channel === "WEB") { 
                redirect("https://downloads.a23.com/a23games/APK/A23Games.apk");
                return;
            } else if (browserServices.isIOS()) {
                redirect(clientUrls["stores"]["real"]["ios"]);
                return;
            } else if (browserServices.isAndroidPlatform()) {
                redirect(clientUrls["stores"]["dl"]["android"]);
                return;
            }

        }
    };
    


    var appViewBackbutton = function ($window) {
        return{
            restrict: "E",
            template: '<div id="back_btn" class="back_btn justhide">' +
                    '<img src="images/lp_new/leftarrow.png" onclick="window.history.go(-1); cursor:pointer;">' +
                    '</div>'
        };
    };
    


    var headerNavigation = function (browserServices) {

        return {
            restrict: "E",
            templateUrl: browserServices.getRootPath().suburlpath + "headerNavigation.html",
            scope: {
                pageTitle: "@",
                breadcumb: "@",
                activeCard: '@',
                patterajIcon: '@'
            },
            link: function (scope, element, attr) {

                var queryParams = browserServices.getQueryParams();
                scope.gotohome = function () {
//                    window.location.href = ""
                };
                scope.appHeader = queryParams.header || 'Y';
                scope.rootPath = browserServices.getRootPath().suburlpath;
                scope.gameName = browserServices.getRootPath().gameName;
                scope.openHeaderLink = function (link) {
                    console.log(link.indexOf(scope.gameName + "/"));
                    if (link.indexOf(scope.gameName + "/") === 0) {
                        window.location.href = link.replace(scope.gameName + "/", "");
                    } else {
                        window.location.href = scope.rootPath + link;
                    }
                }
                scope.openWrenchMenu = function () {
                    scope.$root.$emit("open-wrench-menu");
                };

                scope.backToPfLobby = function () {
                    let data = JSON.stringify({type: "closeClient"});
                    console.log(data);
                    let userAgent = window.navigator.userAgent.toLocaleLowerCase();
                    if (userAgent.indexOf("android") === -1) {
                        if (window.webkit !== undefined) {
                            window.webkit.messageHandlers.RedirectTo.postMessage(data);
                        }
                    } else {
                        if (userAgent.toString().includes("wv")) {
                            if (window.android !== undefined) {
                                window.android.redirectTo(data);
                            }
                        }
                    }
                }
                scope.rootPath = browserServices.getRootPath().suburlpath;
                scope.pathName = window.location.pathname;
                scope.webView = browserServices.isWebView();
                scope.enableback = queryParams && (queryParams.enableback === "true" ? true : false);
                scope.platformapp = browserServices.isPlatformApp(queryParams.platformapp !== undefined && queryParams.platformapp === 'Y' ? 'PLATFORMAPP' : 'NA');
                if(scope.webView){
                     browserServices.hideContentsinApp(scope.appHeader);  
                }               
            }
        };
    };
    


    var leftMenu = function (browserServices, LeftMenuJSON) {

        var argArr = arguments;
        return {
            restrict: "E",
            replace: true,
            scope: {
                activePage: "@page" // page name from leftmenu to show active
            },
            templateUrl: browserServices.getRootPath().suburlpath + 'leftMenu.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                    $scope.isWrenchMenuHidden = true;
                    $scope.openMenu = null;
                    $scope.menuItems = [];
                    $scope.currentActiveItem = null;
                    $scope.currentActiveItemMenu = null;
                    $scope.openInnerMenu = null;
                    $scope.currentActiveSubItem = null;
                    $scope.rootPath = browserServices.getRootPath().suburlpath;
                    $scope.gameName = browserServices.getRootPath().gameName;
                    $scope.backToHome = function (link) { 
                            window.location.href = $scope.rootPath + "index.html"; 
                    }
                    $scope.createMenuLink = function (item) {
                        if (item.link !== null && $scope.gameName !== '') {
                            if (item.link.indexOf($scope.gameName + "/") === -1) {
                                item.link = $scope.rootPath + item.link
                                // console.log("append", item.link,$scope.gameName);
                            } else if (item.link.indexOf($scope.gameName + "/") === 0) {
                                item.link = item.link.replace($scope.gameName + "/", "");
                                console.log("making ", item.link, $scope.gameName);
                            }
                        }
                    }
                    $scope.menuClick = function (item, isInnerMenu = false) {
                        if (hasSubmenu(item)) {
                            if (isInnerMenu) {
                                $scope.openInnerMenu = $scope.openInnerMenu === item.name ? null : item.name;
                            } else {
                                $scope.openMenu = $scope.openMenu === item.name ? null : item.name;
                            }
                        }
                        if (!item.validations) {
                            return typeof item.onclick === "function" && item.onclick.apply($scope, argArr);
                        }
                        item.onclick === "function" && item.onclick.apply($scope, argArr)
                    };
                    $scope.activeInnerMenu = function(innerMenu,currentMenu,menuGame){
                        var currentPageGame = $scope.gameName === '' ? 'Rummy' : ($scope.gameName==='fantasysports' ? 'Fantasy':$scope.gameName);
                        if(currentPageGame.toLowerCase()===menuGame.toLowerCase()){
                            return innerMenu===currentMenu
                        } else if(innerMenu===currentMenu){
                            return true;
                        }
                    }
                    function filterItemsAndSubitems(items) {
                        var filteredItems = [];
                        items.forEach(function (item) {
                            var tempObj = item;
                            if (!hasSubmenu(item) && isActivePage(item)) { // Active menu check if no submenu
                                $scope.currentActiveItemMenu = item;
                            }

                            tempObj.submenu = item.submenu.filter(function (subitem) {
                                if (subitem.submenu !== undefined) {
                                    subitem.submenu.filter(function (inneritem) {
                                        if (isActivePage(inneritem)) {
                                            var currentPageGame = $scope.gameName === '' ? 'Rummy' : $scope.gameName;
                                            var innerGame = currentPageGame === 'fantasysports' ? 'Fantasy' : currentPageGame;
                                            if (innerGame.toLowerCase() === subitem.name.toLowerCase() || inneritem.name==='A23 Fantasy' || inneritem.name==='A23 Poker' || inneritem.name==='A23 Carrom' || inneritem.name==='A23 Pool') {
                                                $scope.currentActiveItem = inneritem;
                                                $scope.currentActiveSubItem = subitem;
                                                $scope.currentActiveItemMenu = item;
                                                $scope.menuClick(subitem, true);
                                                $scope.menuClick(item);
                                            }
                                        }
                                        $scope.createMenuLink(inneritem);
                                    })
                                } else if (isActivePage(subitem)) { // Active menu and submenu and open menu
                                    $scope.currentActiveItem = subitem;
                                    $scope.currentActiveItemMenu = item;
                                    $scope.menuClick(item);
                                }
                                $scope.createMenuLink(subitem);
                                return true;
                            });
                            filteredItems.push(tempObj);
                            $scope.createMenuLink(item);
                        });
                        return filteredItems;
                    }

                    $scope.menuItems = filterItemsAndSubitems(LeftMenuJSON);

                    $scope.bandIcon = function (item) {
                        if ((item.name === "AcePoints") && !$scope.acepointsPromo) {
                            return '';
                        }
                        if (item.name === "Rewards" && $scope.gvFlag === 'Y') {
                            return '';
                        }
                        return item.bandicon;
                    };

                    function hasSubmenu(item) {
                        return item.submenu && item.submenu.length;
                    }

                    function isActivePage(item) {
                        return $scope.activePage && $scope.activePage.toUpperCase() === item.name.toUpperCase();
                    }

                    $scope.closeWrenchMenu = function () {
                        $scope.isWrenchMenuHidden = true;
                    };

                    $scope.hasSubmenu = hasSubmenu;

                    $scope.isActivePage = function (item) {
                        if (isActivePage(item))
                            return true;
                        if (hasSubmenu(item)) { // If any child is active
                            for (var i = 0; i < item.submenu.length; i++) {
                                if (isActivePage(item.submenu[i]))
                                    return true;
                            }
                        }
                        return false;
                    };



                    $rootScope.$on('open-wrench-menu', function () {
                        $scope.isWrenchMenuHidden = false;
                    });

                    $rootScope.$on('close-wrench-menu', function () {
                        $scope.isWrenchMenuHidden = true;
                    });

                    $scope.load = function () {
                        $scope.webView = browserServices.isWebView();
                    };
                    $scope.load();
                }]
        };
    };
    

    function leftmenuJson() {

        return [
            
            {
                "name": "Download Apps",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_getmobileapp",
                "bandicon": "icon_getmobileapp",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": [
                    
                    {
                        "name": "A23 Games App",
                        "iconclass": "icon_org_dot",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": "downloads.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },
                    {
                        "name": "A23 Rummy App",
                        "iconclass": "icon_org_dot",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": "download-rummy.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    }
                ]
            },
            {
                "name": "Bonus & Offers",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_rewards",
                "bandicon": "icon_rewards",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": [
                    {
                        "name": "PSEUDO Bonus",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "regular_player_bonus.html",
                        "onclick": null,
                        "userSpecificProperty": null,

                    },
                    {
                        "name": "Welcome Bonus",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "rummy-welcome-bonus.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },
                    {
                        "name": "VIP Club",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "vipclub.html",
                        "onclick": null,
                        "userSpecificProperty": null
                    },
                    {
                        "name": "Loyalty Program",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "acepoints.html",
                        "onclick": null,
                        "userSpecificProperty": null
                    },
                    {
                        "name": "Refer & Earn",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "referAndEarn.html",
                        "onclick": null,
                        "userSpecificProperty": null
                    }
                ]
            },
            
            
            {
                "name": "Games",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_games",
                "bandicon": "icon_games",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": [
                    {
                        "name": "Rummy",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": null,
                        "iconclass": "icon_org_dot",
                        "bandicon": "icon_org_dot",
                        "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                        "userSpecificProperty": null,
                        "submenu": [
//                            {
//                                "name": "Rummy Rules",
////                                "iconclass": "icon_org_dot",
//                                "loginRequired": null,
//                                "userTypes": [],
//                                "link": "rules.html",
//                                "onclick": null,
//                                "userSpecificProperty": null,
//                            },
{
                                "name": "A23 Rummy",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": null,
                                "userTypes": [],
                                "link": "rummy.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },  
                            {
                                "name": "Rummy Rules",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": null,
                                "userTypes": [],
                                "link": "rules.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },  
                            {
                                "name": "About Rummy",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": null,
                                "userTypes": [],
                                "link": "aboutrummy.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                            
                            {
                                "name": "Rummy Variants",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": null,
                                "userTypes": [],
                                "link": "rummyvariants.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                            
                            {
                                "name": "Lobby and Table",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": null,
                                "userTypes": [],
                                "link": "lobbyandtable.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                        ]
                    },
                    {
                        "name": "Fantasy",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": null,
                        "iconclass": "icon_org_dot",
                        "bandicon": "icon_org_dot",
                        "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                        "userSpecificProperty": null,
                        "submenu": [
                            {
                                "name": "A23 Fantasy",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "fantasysports.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "How to Play",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "fantasysports/howtoplay.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "About Fantasy",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "fantasysports/about.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                            {
                                "name": "Points System",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "fantasysports/pointssystem.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                        ]
                    },

                    {
                        "name": "Poker",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": null,
                        "iconclass": "icon_org_dot",
                        "bandicon": "icon_org_dot",
                        "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                        "userSpecificProperty": null,
                        "submenu": [
                            {
                                "name": "A23 Poker",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "poker.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "How to Play",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "poker/howtoplay.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
//                            {
//                                "name": "Poker FAQs",
////                                "iconclass": "icon_org_dot",
//                                "loginRequired": false,
//                                "userTypes": [],
//                                "link": "poker/faqs.html",
//                                "onclick": null,
//                                "userSpecificProperty": null,
//                            },
                            
                        ]
                    },

                    {
                        "name": "Carrom",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": null,
                        "iconclass": "icon_org_dot",
                        "bandicon": "icon_org_dot",
                        "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                        "userSpecificProperty": null,
                        "submenu": [
                            {
                                "name": "A23 Carrom",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "carrom.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "How to Play",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "carrom/howtoplay.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                            {
                                "name": "Carrom FAQs",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "carrom/faqs.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                        ]
                    },
                    {
                        "name": "Pool",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": null,
                        "iconclass": "icon_org_dot",
                        "bandicon": "icon_org_dot",
                        "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                        "userSpecificProperty": null,
                        "submenu": [
                            {
                                "name": "A23 Pool",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "pool.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "How to Play",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "pool/howtoplay.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            {
                                "name": "Pool FAQs",
//                                "iconclass": "icon_org_dot",
                                "loginRequired": false,
                                "userTypes": [],
                                "link": "pool/faqs.html",
                                "onclick": null,
                                "userSpecificProperty": null,
                            },
                            
                        ]
                    }
                ]
            },
            {
                "name": "Play Responsibly",
                "loginRequired": false,
                "userTypes": [],
                "link": "responsiblegaming.html",
                "iconclass": "icon_responsible",
                "bandicon": "icon_responsible",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": []
            },
            {
                "name": "VIP Club",
                "loginRequired": null,
                "userTypes": [],
                "link": "vipclub.html",
                "iconclass": "icon_vipcorner",
                "bandicon": "icon_vipcorner",
//                "onclick": function () {
//                    window.open("https://www.a23.com/rummynews/cms/vip-corner/", '_blank');
//                }, 
                // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": []
            },
            {
                "name": "Rewards & Promotions",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_rewards",
                "bandicon": "icon_rewards",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": [
                    {
                        "name": "Bonus Offers",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "rummybonus.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },
                    {
                        "name": "Tourney Info",
                        "iconclass": "icon_org_dot",
                        "loginRequired": null,
                        "userTypes": [],
                        "link": "tourneyInfo.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },

                    {
                        "name": "Rewards",
                        "iconclass": "icon_org_dot",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": "gift.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },
                    {
                        "name": "Achievements",
                        "iconclass": "icon_org_dot",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": "rummy_achievements.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    },
                    {
                        "name": "Leaderboards",
                        "iconclass": "icon_org_dot",
                        "loginRequired": false,
                        "userTypes": [],
                        "link": "skillpointsleaderboard.html",
                        "onclick": null,
                        "userSpecificProperty": null,
                    }
                ]
            },
            
            
            {
                "name": "Testimonials",
                "loginRequired": null,
                "userTypes": [],
                "link":  null,
                "onclick": function () {
                    window.open("a23-rummy-champions.html", '_blank');
                },
                "iconclass": "icon_testimonials",
                "bandicon": "icon_testimonials",
                "userSpecificProperty": null,
                "submenu": []
            },
            {
                "name": "Contact Us",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_contactus",
                "bandicon": "icon_contactus",
                "link": "contactus.html",
//                "onclick": function () {
//                    window.location.href = 'contactus.html';
//                }, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": []
            },
            {
                "name": "FAQs",
                "loginRequired": null,
                "userTypes": [],
                "link": "faqs.html",
                "iconclass": "icon_faqs",
                "bandicon": "icon_faqs",
                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
                "userSpecificProperty": null,
                "submenu": []
            },
            {
                "name": "Blog",
                "loginRequired": null,
                "userTypes": [],
                "link": null,
                "iconclass": "icon_media",
                "bandicon": "icon_media",
                "onclick": function () {
                    window.open("https://www.a23.com/rummynews/cms/blog/", '_blank');
                },
                "userSpecificProperty": null,
                "submenu": []
            },
            
//            {
//                "name": "Media",
//                "loginRequired": null,
//                "userTypes": [],
//                "link": null,
//                "iconclass": "icon_media",
//                "bandicon": "icon_media",
//                "onclick": null, // This is binded with the scope of directive and having the same argument as wrenchMenu directive function
//                "userSpecificProperty": null,
//                "submenu": [
//                    {
//                        "name": "Blog",
//                        "iconclass": "icon_org_dot",
//                        "loginRequired": null,
//                        "userTypes": [],
//                        "link": null,
//                        "onclick": function () {
//                            window.open("rummynews/cms/blog?rtime=" + parseInt(new Date().getTime() / 100), '_blank');
//                        }
//                    },
//                    {
//                        "name": "What's New",
//                        "iconclass": "icon_org_dot",
//                        "loginRequired": null,
//                        "userTypes": [],
//                        "link": "newFeatures.html",
//                        "onclick": null,
//                        "userSpecificProperty": null,
//                    },
//                    {
//                        "name": "Press Releases",
//                        "iconclass": "icon_org_dot",
//                        "loginRequired": null,
//                        "userTypes": [],
//                        "link": "pressreleases.html",
//                        "onclick": null,
//                        "userSpecificProperty": null
//                    }
//                ]
//            }
        ];
    }
    

    function clientUrls() {
        return {
             a23plservice: {
                "qaweb.qapfgames.com": "https://qaffint.playerummy.com/PlatformServiceQA/support/sendApkLink",
                "localhost": "http://localhost:8090/PlatformService/support/sendApkLink",
                "a23.com": "https://pla23api.a23.com/PlatformService/support/sendApkLink"
            },
            pages: {
                download: {
                    "rummy": "download-rummy.html",
                    "a23games": "downloads.html",
                },
                install: {
                    "rummy": "https://a.a23.in/VwZA5P8y9mb",
                    "a23games": "https://pf.a23.in/pfappdownload",
                }                
            },
            stores: {
               dl:{
                   "android":"https://pf.a23.in/pfappdownload"
               },
                fun: {
                    "ios": "https://itunes.apple.com/in/app/ace2three-rummy/id789603425?mt=8",
                    "android": "https://play.google.com/store/apps/details?id=air.com.ace2three.mobile&hl=en"
                },
                real: {
                    "ios": "https://itunes.apple.com/in/app/ace2three-rummy-plus/id1027731385?mt=8"
                }
            }
        }
    }
    
    
    var footer = function (browserServices) {
        return {
            templateUrl: browserServices.getRootPath().suburlpath + 'footer.html',
            link: function (scope, ele, attr) {
                
                 /\.html/.test(location.href) && browserServices.initScrollToTop();
                 
                scope.webView = browserServices.isWebView();
                scope.rootPath = browserServices.getRootPath().suburlpath;
                scope.gameName = browserServices.getRootPath().gameName;
                scope.openHeaderLink = function (link) {
                    console.log(link.indexOf(scope.gameName + "/"));
                    if (link.indexOf(scope.gameName + "/") === 0) {
                        window.location.href = link.replace(scope.gameName + "/", "");
                    } else {
                        window.location.href = scope.rootPath + link;
                    }
                }
            }
        };
    };
    


    const browserServices = function ($rootScope,$compile) {
        var platform = navigator.platform;
        var ua = navigator.userAgent;
        var vendor = navigator.vendor;

        function iosPlatform() {
            return /(iPad|iPhone|iPod|iMac)/.test(platform);
        }

        function isAndroidNative() {
            return /Mozilla\/5\.0/.test(ua) && /Android/.test(ua) && /AppleWebKit/.test(ua) && /Version/.test(ua);
        }
        
        function isAndroidPlatform() {  
            return /Android/.test(ua);            
        }

        function isChrome() {
            return /Chrome/.test(ua) && /Google Inc/.test(vendor);
        }

        function isSafari() {
            return /Safari/i.test(ua);
        }

        function getQueryParams() {
            const queryParams = {};
            var parts = window.location.search.substring(1).split('&');
            if (!parts) {
                return queryParams;
            }
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].split('=');
                queryParams[part[0]] = part[1];
            }
            return queryParams;
        }

        function loadScript(scriptUrl) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            document.body.appendChild(script);

            return new Promise((resolve, reject) => {
                script.onload = function () {
                    resolve();
                };
                script.onerror = function () {
                    reject();
                };
            });
        }

        function isSourcePlatform() {
            var source = getQueryParams() && getQueryParams().src;
            if ((source && source.toUpperCase().trim().includes("PLATFORMAPP"))) {
                return true; //static pages.
            }
        }
        ;

        function getA23Games() {
            var gamefoders = ['fantasysports', 'fantasycricket', 'poker', 'pool', 'carrom', 'rummy'];
            return gamefoders;
        }
        function getRootPath() {
            var suburlpath = "";
            var gameName = "";
            getA23Games().forEach((item) => {
                if (window.location.href.indexOf("/" + item + "/") > 0) {
                    suburlpath = "../";
                    gameName = item;
                }
            });
            return {suburlpath: suburlpath, gameName: gameName};
        }

        return{
            getRootPath: getRootPath,
            getA23Games: getA23Games,
            isIOS: iosPlatform,
            isAndroidNative:isAndroidNative,
            isAndroidPlatform:isAndroidPlatform,
            loadScript: loadScript,
            expireCookie: function (cname) {
                document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
            },
            getCookie: function (cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            },
            getQueryParams: getQueryParams,
            isSourcePlatform: isSourcePlatform,
            isWebView: function () {

                const isAndroidWebView = window.hasOwnProperty('Android')
                        || window.hasOwnProperty('Android ')
                        || typeof Android !== "undefined"
                var isIosWebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

                var params = getQueryParams();
                var src = params.src;
                return isAndroidWebView
                        || isIosWebview
                        || (src && src.toUpperCase().trim().includes("MAPP"))
                        || isSourcePlatform();
            },
            isPlatformApp: function (source) {
                return ((source && source.toUpperCase().trim().includes("PLATFORMAPP")));
            },
            determineChannel: function () {
                return (iosPlatform() || /(Android|Windows Phone)/.test(ua) || /BlackBerry/.test(platform)) ? 'MWEB' : 'WEB';
            },
            hideContentsinApp: function (appHeader) {
                $("body").addClass("app_main_body");
                if (/header=N/.test(location.search) || 'N' === appHeader) { //If app header is not present in page.
                    $("#wrapper").addClass("margin-top-0");
                }
            },
              initScrollToTop: function () {
                $rootScope.scrolltoTop = function () {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);
                };

                window.onscroll = function () {
                    if ($(this).scrollTop() > 100) {
                        $('.static-back-to-top').fadeIn('slow');
                    } else {
                        $('.static-back-to-top').fadeOut('slow');
                    }
                };

                var ele = $compile('<span class="static-back-to-top" ng-click=scrolltoTop()><i class="static-bx static-bxs-up-arrow-alt"></i></span>')($rootScope);
                angular.element(document.body).append(ele);
            },
        };
    };
    
    function appLinkBox($http,clientUrls) {//app-link-box
        return {
            restrict: "E",
            scope: {
                result: "=?",
                gametype:"@"
            },
            template: '<div class="mobile_enter_tb"> <div class="number_text" id="basic-addon1"> <div class="bg_plusnumber">+91</div></div> <div class="mobile_enter_text"> <input type="text" placeholder="Enter Mobile Number" maxlength="10" name="phone" ng-model="phoneNo" ng-change="resetVars()" /> </div><div class="mblverifybtn" ><a class="btn btn-success  get_applink" for="phone" ng-click="sendAppLink()">Get App Link</a></div> </div>',
            link: function (scope) {
                var phoneRegEx = /[4-9]{1}[0-9]{9}/;
                scope.phoneNo = null;
                if (!scope.result)
                    scope.result = {};
                var token = null;

                scope.sendAppLink = function () {
                    if (!phoneRegEx.test(scope.phoneNo)) {
                        console.error("Invalid mobile number");
                        scope.result.success = false;
                        scope.result.errorMsg = scope.phoneNo ? "Please provide valid mobile number" : "Please enter mobile number";
                        return;
                    } 
                    
                  var serviceUrl = (location.host.indexOf('localhost') > -1) ? clientUrls["a23plservice"][location.host] : clientUrls["a23plservice"]["a23.com"];
                    var dw_ap_name = scope.gametype;
                    var  data= {channelFor: "APK", mobileNumber: scope.phoneNo,gameType:dw_ap_name}//, token: token
                   $http.post(serviceUrl, data).then(function (res) {
                       console.log("res ",res);
                        var status = res.data && res.data.replace(/^\s+|\s+$/g, "");
                        if (!status || status.toUpperCase() !== "SUCCESS") {
                            throw new Error(res.data);
                        }
                        scope.result.success = true;
                        scope.result.errorMsg = null;
                    }).catch(function (err) {
                        console.error(err);
                        scope.result.success = false;
                        scope.result.errorMsg = err.message;
                    });
                }

                scope.resetVars = function () {
                    scope.result = {success: null, errorMsg: null};
                    scope.phoneNo = scope.phoneNo && scope.phoneNo.replace(/\D/g, "");
                }
            }
        }
    };
   
    var anchorTag = function (browserServices) {
        return{
            restrict: "E",
            transclude: true,
            scope: {
                link: "@",
                class:"@"
            },
            template: function () {
                if(browserServices.isWebView()){
                    return "<a class='{{class}}' href='#!'><ng-transclude></ng-transclude></a>"
                } else{
                    return "<a class='{{class}}' href='{{link}}'><ng-transclude></ng-transclude></a>"
                }
               
            }
        };
    };

    
    app.service('browserServices', ['$rootScope','$compile',browserServices])
       .controller('controller', ['browserServices','clientUrls', controller])
       .directive('appViewBackbutton', appViewBackbutton)
       .directive('anchorTag',['browserServices', anchorTag])
       .directive("headerNavigation", ['browserServices', headerNavigation])
       .directive("leftMenu", ['browserServices', 'LeftMenuJSON', leftMenu])
       .constant("LeftMenuJSON", leftmenuJson())
       .constant('clientUrls', clientUrls())
       .directive('footer', ['browserServices', footer])
       .directive('appLinkBox', ['$http','clientUrls',  appLinkBox]);



})();