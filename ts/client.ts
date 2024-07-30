import * as Bowser from 'bowser';
/**
 * Our main client entry point
 */
export class Client {

    private static _initializeOptions(): void {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-center",
            "preventDuplicates": true,
            "onclick": function (pEvt) {
                pEvt.stopPropagation();
            },
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 7000,
            "extendedTimeOut": 7000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "slideDown",
            "hideMethod": "fadeOut"
        }
    }

    /** initializes vars and starts the client */
    public static start(): void {

        Client._initializeOptions();

        const $window: JQuery<Window> = $(window);

        const $body: JQuery = $('body');
        const $wrapper: JQuery = $('.wrapper');
        const $header: JQuery = $('.header');
        const $footer: JQuery = $('.footer');
        const $main: JQuery = $('.main');
        const $main_articles: JQuery = $main.children('article');
        const browser: Bowser.Parser.Parser = Bowser.getParser(window.navigator.userAgent);

        // cookie window
        const $cookieWindow: JQuery = $('#cookies');
        const $closeBtn: JQuery = $cookieWindow.find('.close');
        const $closeX: JQuery = $cookieWindow.find('.thx');
        const _closeFc: (pEvt: JQuery.ClickEvent) => void = (pEvt) => {
            const $closeIcn = $(pEvt.currentTarget);

            pEvt.stopPropagation();
            pEvt.stopImmediatePropagation();

            $cookieWindow.addClass('animate');
            $closeIcn.addClass('animate');
            $closeIcn.addClass('active');

            $closeBtn.off();
            $closeX.off();
            window.setTimeout(() => {
                $cookieWindow.remove();
            }, 1000);
        };
        $closeBtn.on('click', _closeFc);
        $closeX.on('click', _closeFc);

        // contact form
        const $categoryBtn = $('#ct-category');
        const $datePicker = $('#date-picker');
        $categoryBtn.on('change', (pEvt) => {
            const currTrg = $(pEvt.currentTarget);
            const lValue = currTrg.val();
            if (lValue === 'booking') { // booking
                $datePicker.slideDown('fast');
            } else if (lValue === 'other') {
                $datePicker.slideUp('fast');
            }
        });

        // initially hide main and, articles.
        $main.hide();
        $main_articles.hide();

        // Fix: Flexbox min-height bug on IE.
        if (browser.getBrowserName(true) == 'internet explorer') {

            let flexboxFixTimeoutId: number = 0;

            $window.on('resize.flexbox-fix', function () {

                clearTimeout(flexboxFixTimeoutId);

                flexboxFixTimeoutId = window.setTimeout(function () {

                    if ($wrapper.prop('scrollHeight') > ($window.height() || 0))
                        $wrapper.css('height', 'auto');
                    else
                        $wrapper.css('height', '100vh');

                }, 250);

            }).triggerHandler('resize.flexbox-fix');
        }

        // Nav.
        const $nav: JQuery = $header.children('nav')
        const $nav_li: JQuery = $nav.find('li');

        // Add "middle" alignment class if we're dealing with an even number of items.
        if ($nav_li.length % 2 == 0) {
            $nav.addClass('use-middle');
            $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
        }

        // Main.
        const delay: number = 325;
        let locked: boolean = false;

        // Methods.
        const _show: (id: string, initial?: boolean) => void = (id, initial) => {

            let $article = $main_articles.filter('#' + id);

            // No such article? Bail.
            if ($article.length == 0)
                return;

            // Handle lock.

            // Already locked? Speed through "show" steps w/o delays.
            if (locked || (initial != null && initial === true)) {

                // Mark as switching
                $body.addClass('is-switching');

                // Mark as visible.
                $body.addClass('is-article-visible');

                // Deactivate all articles (just in case one's already active).
                $main_articles.removeClass('active');

                // Hide header, footer.
                $header.hide();
                $footer.hide();

                // Show main, article.
                $main.show();
                $article.show();

                // Activate article.
                $article.addClass('active');

                // Unlock.
                locked = false;

                // Unmark as switching.
                setTimeout(function () {
                    $body.removeClass('is-switching');
                }, (initial ? 1000 : 0));

                return;

            }

            // Lock.
            locked = true;

            // Article already visible? Just swap articles.
            if ($body.hasClass('is-article-visible')) {

                // Deactivate current article.
                let $currentArticle = $main_articles.filter('.active');

                $currentArticle.removeClass('active');

                // Show article.
                setTimeout(function () {

                    // Hide current article.
                    $currentArticle.hide();

                    // Show article.
                    $article.show();

                    // Activate article.
                    setTimeout(function () {

                        $article.addClass('active');

                        // Window stuff.
                        $window
                            .scrollTop(0)
                            .triggerHandler('resize.flexbox-fix');

                        // Unlock.
                        setTimeout(function () {
                            locked = false;
                        }, delay);

                    }, 25);

                }, delay);

            }
            // Otherwise, handle as normal.
            else {

                // Mark as visible.
                $body.addClass('is-article-visible');

                // Show article.
                window.setTimeout(function () {

                    // Hide header, footer.
                    $header.hide();
                    $footer.hide();

                    // Show main, article.
                    $main.show();
                    $article.show();

                    // Activate article.
                    window.setTimeout(function () {

                        $article.addClass('active');

                        // Window stuff.
                        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');

                        // Unlock.
                        setTimeout(function () {
                            locked = false;
                        }, delay);

                    }, 25);

                }, delay);

            }

        };

        const _hide: (addState?: boolean) => void = (addState) => {

            const $article = $main_articles.filter('.active');

            // Article not visible? Bail.
            if (!$body.hasClass('is-article-visible'))
                return;

            // Add state?
            if (addState != null && addState === true)
                history.pushState(null, '', '#');

            // Handle lock.

            // Already locked? Speed through "hide" steps w/o delays.
            if (locked) {

                // Mark as switching.
                $body.addClass('is-switching');

                // Deactivate article.
                $article.removeClass('active');

                // Hide article, main.
                $article.hide();
                $main.hide();

                // Show footer, header.
                $footer.show();
                $header.show();

                // Unmark as visible.
                $body.removeClass('is-article-visible');

                // Unlock.
                locked = false;

                // Unmark as switching.
                $body.removeClass('is-switching');

                // Window stuff.
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');

                return;
            }

            // Lock.
            locked = true;

            // Deactivate article.
            $article.removeClass('active');

            // Hide article.
            setTimeout(function () {

                // Hide article, main.
                $article.hide();
                $main.hide();

                // Show footer, header.
                $footer.show();
                $header.show();

                // Unmark as visible.
                setTimeout(function () {

                    $body.removeClass('is-article-visible');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);


        };

        // Articles.
        $main_articles.each((pIndex, pElem) => {

            const $this: JQuery = $(pElem);

            // Close.button
            $('.close').on('click', function (pEvt) {
                const $closeBtn = $(pEvt.currentTarget);
                location.hash = '';
                $closeBtn.addClass('animate');
                window.setTimeout(() => {
                    $closeBtn.removeClass('animate');
                }, 1000);
            });

            // Prevent clicks from inside article from bubbling.
            $this.on('click', function (event) {
                event.stopPropagation();
            });

        });

        // Events.
        $body.on('click', () => {
            // Article visible? Hide.
            if ($body.hasClass('is-article-visible'))
                _hide(true);
        });

        $window.on('keyup', (event) => {

            switch (event.keyCode) {

                case 27: // escape

                    // Article visible? Hide.
                    if ($body.hasClass('is-article-visible'))
                        _hide(true);
                    break;

                default:
                    break;
            }

        });

        $window.on('hashchange', function (event) {
            // Empty hash?
            if (location.hash == ''
                || location.hash == '#') {

                // Prevent default.
                event.preventDefault();
                event.stopPropagation();

                // Hide.
                _hide();

            }
            // Otherwise, check for a matching article.
            else if ($main_articles.filter(location.hash).length > 0) {
                // Prevent default.
                event.preventDefault();
                event.stopPropagation();
                // Show article.
                _show(location.hash.substring(1));
            }
        });

        // Scroll restoration.
        // This prevents the page from scrolling back to the top on a hashchange.
        if ('scrollRestoration' in history)
            history.scrollRestoration = 'manual';
        else {
            let oldScrollPos = 0,
                scrollPos = 0,
                $htmlbody = $('html,body');

            $window.on('scroll', () => {
                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop() ?? 0;
            }).on('hashchange', function () {
                $window.scrollTop(oldScrollPos);
            });
        }

        // Initialize.

        // Initial article if hash is set
        if (location.hash != ''
            && location.hash != '#')
            $window.on('load', function () {
                _show(location.hash.substring(1), true);
            });

        // show page (remove-overlay)
        $body.removeClass('is-preload');
    }
}

/**
 * make client visible for index.html
 */
(<any>window).Client = Client;