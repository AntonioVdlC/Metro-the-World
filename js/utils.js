var utils = {
    toTitleCase: function (str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    hyphenize: function (str) {
    	return str.replace(/\s+/g, '-');
    }
};