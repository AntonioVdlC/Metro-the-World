var app = {
    initialize: function () {
        var list = null;

        this.homeView(list);
    },

    homeView: function (list) {
        //Load JSON Data
        $.getJSON("data/available_cities.json")
            .done(
                function(json) {
                    console.log(json);
                    list = json;

                    //Load Template
                    $("body").empty();
                    $("body").load( "tpl/homePage.html", function() {
                        console.log( "Load was performed." );

                        //Render Template
                        var template = $(".countries"); 

                        var directives = {
                            'li.country-el': {
                                'country <- data': {
                                    'img.country-flag@src+': 'country.flag',
                                    'p.country-name': 'country.name',
                                    'li.city-el': {
                                        'city <- context.country.cities': {
                                            'p.city-name': 'city.name',
                                            '.@onclick': 'app.metroView({"city-name": \"#{city.name}\", "country-name": \"#{country.name}\", "country-flag": \"#{country.flag}\", "metro-map": \"#{city.metro}\"});'
                                        }
                                    }
                                }
                            }
                        };

                        template.render(list, directives);

                    });
                })
            .fail(
                function( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );
                });
    },

    metroView: function (data) {

        console.log(data);

        //Load Template
        $("body").empty();
        $("body").load("tpl/metroPage.html", function() {
            console.log( "Load was performed." );

            //Render Template
            var template = $("body"); 

            var directives = {
                'h1.navigation-bar-title': '#{city-name}, #{country-name}',
                'img.country-flag@src+': 'country-flag',
                'img.metro-map-img@src+': 'metro-map'
            };

            template.render(data, directives);
        });
    }
};

$(document).ready(function() {
    app.initialize();
});