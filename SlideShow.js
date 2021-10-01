/*
* Author: Kenji Shimizu
* Script: Flexible Slideshow
* Note: To adjust the Card size, u must explicitely adjust it in CSS
* using the class slideshow-item, and the Program will automatically
* Calculate the Width and number of Cards fitted in a container.
* 
* _________________________________________  
*               JQUERY CDN
* _________________________________________
* Jquery CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
*
* Format: 
*    className = your custom class which will be passed in the
*        Creation of the object.
*    active = which card should be marked active
*    callback = init has a callback parameter used for Cards Function
*    
*    eg: Slideshow = new slide(className,active)
*        Slideshow.init();
*       
*/
class slide {
    constructor(className, activeIndex, loop = false, delay = 2000, direction = "right") {
        this.className = className;
        this.page = 0;
        this.loop = loop;
        this.direction = direction;
        this.delay = delay;
        this.activeIndex = activeIndex + 1;
        this.disabled = false;
    }
    init(callback = null) {
        //remove any listeners with the given ID
        $("#next" + this.className).off();
        $("#prev" + this.className).off();
        $("#next" + this.className).show();
        $("#prev" + this.className).show();

        //Page Container if page is included
        let slideshowPage = $(".slideshow-page." + this.className);
        slideshowPage.html(this.page);

        //Cards
        let slideshowItem = $(".slideshow-item." + this.className);

        //Count the cards fitted inside the slideshow wrapper/card space (slideshow-inner)
        const cards = Math.floor($(".slideshow-inner." + this.className).width() / slideshowItem.width());
        let cloneEdge = false;
        let lessCards = false;
        let clones = 0;
        //set a reference for this object, to be used inside a functions
        let that = this;
        //Condition that determines the card count
        if (slideshowItem.length <= cards) {
            //If cards is not enough in the given card space

            $("#next" + this.className).hide();
            $("#prev" + this.className).hide();
            lessCards = true;
            slideshowItem.eq(Math.floor(slideshowItem.length / 2)).addClass("active");
        }
        else if (slideshowItem.length == cards + 1) {
            //If cards is more than the card space but lacks 1 card, clone the last edge to start edge
            $(".slideshow-inner." + this.className).prepend(slideshowItem.eq(slideshowItem.length - 1).clone(true));
            cloneEdge = true;
            clones = 1;
        }
        else {
            //If cards is more than enough and does not need to be cloned
            slideshowItem.eq(slideshowItem.length - 1).prependTo(".slideshow-inner." + this.className);
        }

        //Update the Slide Items reference
        slideshowItem = $(".slideshow-item." + this.className);

        //if cards are less than the given card space, then don't move to index 1
        //Note: Current page/active card is index 1 to give space for prev card
        if (!lessCards) {
            slideshowItem.eq(this.activeIndex).addClass("active");
            slideshowItem.css({
                "transform": "translateX(-" + (slideshowItem.width() +
                    parseFloat(slideshowItem.css("margin-left")) +
                    parseFloat(slideshowItem.css("margin-right"))) + "px)"
            });
        }
        //Start The Listeners for each Cards if callback is set
        if (typeof callback == "function" && callback(slideshowItem))
            callback(slideshowItem);

        //(Automatic Slideshow) Loop the next or prev event if enabled
        if (this.loop && this.direction == "right" && !lessCards)
            setInterval(function () {
                if (!that.disabled)
                    $("#next" + that.className).trigger("click");
            }, this.delay);
        else if (this.loop && this.direction == "left" && !lessCards)
            setInterval(function () {
                if (!that.disabled)
                    $("#prev" + that.className).trigger("click");
            }, this.delay);

        /*! 
        * logic: Note: Current page/active card is index 1 to give space for prev card
        * 1. translate/move to next page (given the width of the card)
        * 2. if next, move first edge to last edge and vice versa if prev
        * 3. then translate back to the current page, since the page is moved at step 2
        * *4. if Clone Edge is enabled, both edge should be the same card

        * Page are computed minus the clones, clones are just temporary
        * to fill the holes when moving the cards therefore not counted
        */

        $("#next" + this.className).click(function (e) {
            $(this).attr("disabled", true);
            that.disabled = true;

            that.page = ++that.page > slideshowItem.length - 1 - clones ? 0 : that.page;
            slideshowPage.html(that.page);

            const Slide = slideshowItem.width() +
                parseFloat(slideshowItem.css("margin-left")) +
                parseFloat(slideshowItem.css("margin-right"));

            slideshowItem.addClass("animation");
            slideshowItem.css({ "transform": "translateX(-" + (Slide * 2) + "px)" });

            setTimeout(() => {
                $(this).attr("disabled", false)
                that.disabled = false;
                slideshowItem.removeClass("animation");
                slideshowItem.css({ "transform": "translateX(-" + Slide + "px)" });

                slideshowItem.eq(that.activeIndex).removeClass("active");
                slideshowItem.eq(0).appendTo(".slideshow-inner." + that.className);

                slideshowItem = $(".slideshow-item." + that.className);
                slideshowItem.eq(that.activeIndex).addClass("active");

                //Cloning First Edge and insert at the other edge
                if (cloneEdge) {
                    slideshowItem.eq(slideshowItem.length - 1).remove();
                    $(".slideshow-inner." + that.className).append(slideshowItem.eq(0).clone(true));
                    slideshowItem = $(".slideshow-item." + that.className);
                }
            }, 600);
        });
        $("#prev" + this.className).click(function (e) {
            $(this).attr("disabled", true);
            that.disabled = true;
            that.page = --that.page < 0 ? slideshowItem.length - 1 - clones : that.page;
            slideshowPage.html(that.page);

            const Slide = slideshowItem.width() +
                parseFloat(slideshowItem.css("margin-left")) +
                parseFloat(slideshowItem.css("margin-right"));

            slideshowItem.addClass("animation");
            slideshowItem.css({
                "transform": "translateX(" + 0 + "px)"
            });


            setTimeout(() => {
                $(this).attr("disabled", false);
                that.disabled = false;
                slideshowItem.removeClass("animation");
                slideshowItem.css({ "transform": "translateX(-" + Slide + "px)" });

                slideshowItem.eq(that.activeIndex).removeClass("active");
                slideshowItem.eq(slideshowItem.length - 1).prependTo(".slideshow-inner." + that.className);

                slideshowItem = $(".slideshow-item." + that.className);
                slideshowItem.eq(that.activeIndex).addClass("active");

                //Cloning Last Edge and insert at the other edge
                if (cloneEdge) {
                    slideshowItem.eq(0).remove();
                    $(".slideshow-inner." + that.className).prepend(slideshowItem.eq(slideshowItem.length - 1).clone(true));
                    slideshowItem = $(".slideshow-item." + that.className);
                }
            }, 600);
        });

    }
    resetPage() {
        this.page = 0;
    }
}
