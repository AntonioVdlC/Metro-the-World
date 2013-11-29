var app = {
    list: null,
    lang: null,

    initialize: function () {
        var self = this;

        $("body").on("click", ".back-button", function (e) {
            e.preventDefault();
            window.history.back();
        });

        this.langDetection();

        console.log(this.lang);

        //Load JSON Data
        $.getJSON("lang/" + this.lang + ".json")
        .done(function(json) {
            console.log(json);
            self.list = json;

            self.homeView();
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
    },

    langDetection: function (){
        if(navigator.language == "es")
            thi.lang = "es";
        else if(navigator.language == "fr")
            this.lang = "fr";
        else
            this.lang = "en";
    },

    homeView: function () {
        var self = this;

        //Load Template
        $("body").empty();
        $("body").load("tpl/homePage.html", function() {
            console.log( "Load was performed." );

            //Render Template
            var template = $(".countries"); 

            var directives = {
                'li.country-el': {
                    'country <- data': {
                        'img.country-flag@src+': 'country.flag',
                        'span.country-name': 'country.name',
                        'li.city-el': {
                            'city <- context.country.cities': {
                                'span.city-name': 'city.name',
                                '.@onclick': 'app.metroView({"city-name": \"#{city.name}\", "country-name": \"#{country.name}\", "metro-map": \"#{city.metro-map}\", "metro-logo": \"#{city.metro-logo}\"});'
                            }
                        }
                    }
                }
            };

            template.render(self.list, directives);

            //Search
            var $countries = $(".country-el");
            var $cities = $(".city-el");

            $(".search-input").keyup(function() {
                var val = $.trim(this.value);

                if (val === ""){
                    $countries.show();
                    $cities.show();
                }
                else {
                    $countries.hide();
                    $cities.hide();

                    $countries.has("li:contains(" + val + ")").show();
                    $cities.has("span:contains(" + val + ")").show();
                }
            });
        });
    },

    metroView: function (data) {
        var self = this;

        console.log(data);

        //Load Template
        $("body").empty();
        $("body").load("tpl/metroPage.html", function() {
            console.log( "Load was performed." );

            //Zoomable Metro Map
            //myScroll = new iScroll('metro-map-container', {zoom:true, zoomMax: 4});

            //Render Template
            var template = $("body"); 

            var directives = {
                'h1.navigation-bar-map-title': '#{city-name}, #{country-name}',
                'img.metro-logo@src+': 'metro-logo',
                'img.metro-map@src+': 'metro-map'
            };

            template.render(data, directives);
        });
    }
};

$(document).ready(function() {
    app.initialize();
});