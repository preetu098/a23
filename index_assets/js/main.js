function openMobileMenu(){$("#leftMenuid").show()}function closeMobileMenu(){$("#leftMenuid").hide()}function downloadMyapp(a){$("#" + a + "App .downloading_app_btn").show(), $("#" + a + "App .download_app_btn").hide(), setTimeout(function(){$("#" + a + "App .downloading_app_btn").hide(), $("#" + a + "App .download_app_btn").show()}, 3e3)}function downloadPFApk(){var a; null != getUrlParams()._branch_match_id?window.location.href = "https://pf.a23.in/pfappdownload?$deeplink_no_attribution=true":window.location.href = "https://pf.a23.in/pfappdownload"}function downloadRummyApk(){var a; null != getUrlParams()._branch_match_id?window.locatiZon.href = "https://a.a23.in/VwZA5P8y9mb?$deeplink_no_attribution=true":window.location.href = "https://a.a23.in/VwZA5P8y9mb"}function getUrlParams(){let b = {}; var a = window.location.search.substring(1).split("&"); if (console.log(a), !a)return b; for (var c = 0; c < a.length; c++){var d = a[c].split("="); b[d[0]] = d[1]}return b}$(".main-carousel").owlCarousel({loop:!0, autoplay:!0, nav:!1, responsive:{0:{items:1}, 1e3:{items:1}}}), $(".owl-carousel").owlCarousel({loop:!0, margin:12, autoplay:!0, nav:!1, responsive:{0:{items:2.2}, 1e3:{items:3}}}), $(document).ready(function(){function a(){document.body.scrollTop > 460 || document.documentElement.scrollTop > 460?$(".sticky-footer").fadeIn():$(".sticky-footer").fadeOut()}$(".collapse.show").each(function(){$(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus")}), $(".collapse").on("show.bs.collapse", function(){$(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus")}).on("hide.bs.collapse", function(){$(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus")}), $(".pushy-submenu").on("click", function(a){if ($(this).hasClass("pushy-innermenu"))return!1; $(this).hasClass("pushy-submenu-open") || ($(".pushy-submenu").addClass("pushy-submenu-closed"), $(".pushy-submenu").removeClass("pushy-submenu-open")), $(this).hasClass("pushy-submenu-open")?($(this).addClass("pushy-submenu-closed"), $(this).removeClass("pushy-submenu-open")):$(this).hasClass("pushy-submenu-closed") && ($(this).removeClass("pushy-submenu-closed"), $(this).addClass("pushy-submenu-open"))}), $(".pushy-innermenu").on("click", function(a){if (void 0 !== a.target.href)return window.location = a.target.href, !0; $(this).hasClass("pushy-innermenu-open") || ($(".pushy-innermenu").addClass("pushy-innermenu-closed"), $(".pushy-innermenu").removeClass("pushy-innermenu-open")), $(this).hasClass("pushy-innermenu-closed")?$(this).hasClass("pushy-innermenu-open") || ($(this).removeClass("pushy-innermenu-closed"), $(this).addClass("pushy-innermenu-open")):($(this).addClass("pushy-innermenu-closed"), $(this).removeClass("pushy-innermenu-open"))}), window.onscroll = function(){a()}, a()}); var trigger = document.getElementById("dropdownMenuLink"), element = trigger.nextElementSibling; trigger.addEventListener("click", function(a){a.preventDefault(), element.classList.toggle("show")}), window.addEventListener("mouseup", function(a){a.target != trigger && a.target.parentNode != trigger && element.classList.remove("show")});
//Read More/Less
$('.moreless-button').click(function() {$('.moretext').slideToggle();if ($('.moreless-button').text() == "Read more") {$(this).text("Read less")} else {$(this).text("Read more")}});
//////////////// START QUICK LINKS COLLAPSE //////////////////

            // When one accordian will open, so other all accordians will be closed
            function closeOtherAccordians(currPanel, accordianSize, prefixId) {
                let btnTriggerDesktop = document.querySelectorAll('[data-accordian-trigger]');
                let btnTriggerMobile = document.querySelectorAll('[data-accordian-trigger-mobile]');

                for(let i = 1; i <= accordianSize; i++) {
                    if(currPanel != prefixId+i) {
                        let accordianPanel = document.getElementById(prefixId + i);
                        if(accordianPanel == null) {
                            break;
                        }

                        accordianPanel.style.maxHeight = null;
                        
                        let currTrigger = btnTriggerDesktop[i-1].getAttribute("data-accordian-trigger");
                        let currTriggerMobile = btnTriggerMobile[i-1].getAttribute("data-accordian-trigger-mobile");

                        if(currPanel != currTrigger) {
                            btnTriggerDesktop[i-1].classList.remove("my-accordion-active");
                        }

                        if(currPanel != currTriggerMobile) {
                            btnTriggerMobile[i-1].classList.remove("my-accordion-active");
                        }
                    }
                }
            }

            // Store all accordians desktop trigger in variable 'desktopTriggerAccordians' and Open accordianPanel by clicking it each
            let desktopTriggerAccordians = document.getElementsByClassName("my-accordion-trigger");

            for(let i = 0; i < desktopTriggerAccordians.length; i++) {
                desktopTriggerAccordians[i].addEventListener("click", function() {
                    this.classList.toggle("my-accordion-active");
                    const panel = this.getAttribute("data-accordian-trigger");
                    const el = document.getElementById(panel);

                    const mobileTriggerAccordians = document.getElementById(panel+"-trigger-mobile");

                    if(el.style.maxHeight) {
                        el.style.maxHeight = null;
                        mobileTriggerAccordians.classList.remove("my-accordion-active");
                    } 
                    else {
                        // Function for close other opened accordianPanel
                        closeOtherAccordians(panel, desktopTriggerAccordians.length, "my-accordion-pannel-");
                        el.style.maxHeight = el.scrollHeight * 2 + "px";

                        mobileTriggerAccordians.classList.add("my-accordion-active");
                    } 
                });
            }

            // Store all accordians mobile trigger in variable mobileTriggerAccordians and Open accordianPanel by clicking it each
            let mobileTriggerAccordians = document.getElementsByClassName("my-accordion-trigger-mobile");

            for(let i = 0; i < mobileTriggerAccordians.length; i++) {
                mobileTriggerAccordians[i].addEventListener("click", function() {
                    this.classList.toggle("my-accordion-active");
                    const panel = this.getAttribute("data-accordian-trigger-mobile");
                    const el = document.getElementById(panel);
                    const desktopTrigger = document.getElementById(panel+"-trigger-desktop");

                    if(el.style.maxHeight) {
                        el.style.maxHeight = null;
                        desktopTrigger.classList.remove("my-accordion-active");
                    } 
                    else {
                        // Function for close other opened accordianPanel
                        closeOtherAccordians(panel, mobileTriggerAccordians.length, "my-accordion-pannel-");
                        el.style.maxHeight = el.scrollHeight + "px";
                        desktopTrigger.classList.add("my-accordion-active");
                    } 
                });
            }
            //////////////// END OF QUICK LINKS COLLAPSE //////////////////

            ////// START COLLAPSE ABOUT A23 GAMES ///////
            const triggerAboutA23Games = document.getElementById('aboutA23Games'); // Clicking trigger
            const collapseFooter = document.getElementById('collapseFooter'); // Dropdown content
            
            triggerAboutA23Games.addEventListener('click', function(e) {
                e.preventDefault();
                collapseFooter.classList.toggle('show'); // Hide and Show by toggeling the class 'show'
                triggerAboutA23Games.classList.toggle('collapsed'); // Hide Show plus and minus button
            });
            ////// END OF COLLAPSE ABOUT A23 GAMES ///////