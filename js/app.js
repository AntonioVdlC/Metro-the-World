var app = {
    list: null,
    lang: null,

    initialize: function () {
        var self = this;

        this.langDetection();

        //Load JSON Data
        $.getJSON("lang/" + this.lang + ".json")
        .done(function(json) {
            console.log(json);
            self.list = json;

            self.homeView();
        })
        .fail(function(jqxhr, textStatus, error) {
            console.log("Request Failed: " + textStatus + ", " + error);
        });
    },

    langDetection: function (){
        if(navigator.language == "ar")
            thi.lang = "ar";
        else if(navigator.language == "de")
            this.lang = "de";
        else if(navigator.language == "es")
            this.lang = "es";
        else if(navigator.language == "fr")
            this.lang = "fr";
        else if(navigator.language == "pt")
            this.lang = "pt";
        else
            this.lang = "en";

        console.log(this.lang);
    },

    homeView: function () {
        var self = this;

        //Load Template
        $("body").empty();
        $("body").load("tpl/homePage.html", function() {
            console.log( "Load was performed." );

            //Render Template
            var directives = {
                'input.search-input@placeholder': 'search', 
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

            $("body").render(self.list, directives);

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

            //Render Template
            var directives = {
                'h1.navigation-bar-map-title': '#{city-name}, #{country-name}',
                'img.metro-logo@src+': 'metro-logo',
                'img.metro-map@src+': 'metro-map'
            };

            $("body").render(data, directives);
        });
    }
};

$(document).ready(function() {
    app.initialize();
});