var app = {
    list: null,
    initialize: function () {
        var self = this;

        //Load JSON Data
        $.getJSON("data/available_cities.json")
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