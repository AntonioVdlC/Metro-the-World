var app = {
    history: [],
    list: {},
    lang: "",
    favs: [],
    favorites: false,
    $favCountries: [],
    $favCities: [],

    initialize: function () {
        var self = this;

        this.langDetection();

        //Load JSON Data
        $.getJSON("lang/" + this.lang + ".json")
        .done(function(json) {
            console.log(json);
            self.list = json;

            //Retrieve the list of favorites
            if(window.localStorage.getItem("favs"))
                self.favs = JSON.parse(window.localStorage.getItem("favs"));

            //Trigger Home View
            self.homeView();
        })
        .fail(function(jqxhr, textStatus, error) {
            console.log("Request Failed: " + textStatus + ", " + error);
        });
    },

    langDetection: function (){
        if(navigator.language === "ar")
            this.lang = "ar";
        else if(navigator.language === "de")
            this.lang = "de";
        else if(navigator.language === "es")
            this.lang = "es";
        else if(navigator.language ==="fr")
            this.lang = "fr";
        else if(navigator.language === "pt")
            this.lang = "pt";
        else
            this.lang = "en";

        //console.log(this.lang);
    },

    homeView: function () {
        var self = this;

        //Load Template
        $("#content").empty();
        $("#content").load("tpl/homePage.html", function() {

            //Render Template
            var directives = {
                'input.search-input@placeholder': 'search', 
                'li.country-el': {
                    'country <- data': {
                        'img.country-flag@src+': '#{country.flag}' + '.svg',
                        'span.country-name': 'country.name',
                        'li.city-el': {
                            'city <- context.country.cities': {
                                'img.fav-icon@id': function (city){
                                    return utils.hyphenize(city.item.name) + '-fav';
                                },
                                'img.fav-icon@onclick': 'app.favoriteCity(\"#{city.name}\")',
                                'span.city-name': 'city.name',
                                'span.city-name@onclick': 'app.metroView({"city-name": \"#{city.name}\", "country-name": \"#{country.name}\", "country-flag": \"#{country.flag}\", "metro": \"#{city.metro}\"});'
                            }
                        }
                    }
                }
            };

            $("#content").render(self.list, directives);

            //Display favorite icon next to favs
            var favs = app.favs;
            for (var i = 0; i < favs.length; i++) {
                $("#" + utils.hyphenize(favs[i]) + "-fav").attr("src", "css/img/fav.png"); //TO-DO ERASE " " IN FAVORITES
            }

            //Back button
            $(".back-button").css("visibility", "hidden");
            $(".nav-bar").off("touchend");

            //Show favorites icon
            $("#favorites").show();
            $("#favorites").on("touchend", function (e) {
                if(app.favorites){
                    //No-fav star
                    $("#favorites").attr("src", "css/img/no-fav.png");
                    app.favorites = false;

                    //Show all
                    $countries.show();
                    $cities.show();
                }
                else{
                    //Fav star
                    $("#favorites").attr("src", "css/img/fav.png");
                    app.favorites = true;

                    //Show only the favorites
                    $countries.hide();
                    $cities.hide();

                    for (var i = 0; i < favs.length; i++) {
                        $countries.has("li:contains(" + favs[i] + ")").show();
                        $cities.has("span:contains(" + favs[i] + ")").show();
                    }
                }
            });

            //Search - TO CHANGE FOR FAVORITES
            var $countries = $(".country-el");
            var $cities = $(".city-el");

            //var $favCountries = [];
            //var $favCities = [];

            for (var i = 0; i < favs.length; i++) {
                app.$favCountries.push($countries.has("li:contains(" + favs[i] + ")"));
                app.$favCities.push($cities.has("span:contains(" + favs[i] + ")"));
            }


            $(".search-input").keyup(function() {
                var val = utils.toTitleCase($.trim(this.value));

                if (val === ""){
                    if(!app.favorites){
                        //Show all
                        $countries.show();
                        $cities.show();
                    }
                    else{
                        //Show only the favorites
                        $countries.hide();
                        $cities.hide();

                        for (var i = 0; i < favs.length; i++) {
                            $countries.has("li:contains(" + favs[i] + ")").show();
                            $cities.has("span:contains(" + favs[i] + ")").show();
                        }
                    }
                }
                else {
                    $countries.hide();
                    $cities.hide();

                    if(!app.favorites){
                        $countries.has("li:contains(" + val + ")").show();
                        $cities.has("span:contains(" + val + ")").show();
                    }
                    else{
                        for (var i = 0; i < app.$favCountries.length; i++)
                            app.$favCountries[i].has("li:contains(" + val + ")").show();

                        for (var i = 0; i < app.$favCities.length; i++)
                            app.$favCities[i].has("span:contains(" + val + ")").show(); 
                    }
                }
            });
        });
    },

    favoriteCity: function (city) {
        console.log(city);

        var removed = false;
        var favs = app.favs;

        for (var i = 0; i < favs.length; i++) {
            if(favs[i] === city){
                //Remove from favorites
                console.log("Remove city " + city);
                favs.splice(i, 1);

                //Flag the removal
                removed = true;
            
                //Display empty star - no-fav icon
                $("#" + utils.hyphenize(city) + "-fav").attr("src", "css/img/no-fav.png");

                break;
            }
        }

        if(!removed){
            //Add to favorites
            console.log("Add city " + city);
            favs.push(city);

            //Display full star - fav icon
            $("#" + utils.hyphenize(city) + "-fav").attr("src", "css/img/fav.png");
        }

        //Save on LocalStorage
        app.favs = favs;
        console.log(app.favs);
        window.localStorage.setItem("favs", JSON.stringify(app.favs));

        //Update the list of fav elements
        var $countries = $(".country-el");
        var $cities = $(".city-el");

        app.$favCountries = [];
        app.$favCities = [];

        for (var i = 0; i < favs.length; i++) {
            app.$favCountries.push($countries.has("li:contains(" + favs[i] + ")"));
            app.$favCities.push($cities.has("span:contains(" + favs[i] + ")"));
        }
    },

    metroView: function (data) {
        var self = this;

        //console.log(data);

        //Load Template
        $("#content").empty();
        $("#content").load("tpl/metroPage.html", function() {

            //Render Template
            var directives = {
                'p.navigation-bar-map-title': '#{city-name}', //#{country-name}',
                'img.country-flag-map@src+': '#{country-flag}' + '.svg',
                'img.metro-logo@src+': '#{metro}' + '.png',
                'img.metro-map@src+': '#{metro}' + '.png'
            };

            $("#content").render(data, directives);

            //Back button
            $(".back-button").css("visibility", "visible");
            $(".nav-bar").on("touchend", function (e) {
                e.preventDefault();
                app.homeView();
            });

            //Hide favorites icon
            $("#favorites").hide();
            $("#favorites").off("touchend");
        });
    }
};

$(document).ready(function() {
    app.initialize();
});