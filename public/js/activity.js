var LPO = LPO || {};
LPO.Activity = function() {

    var init = function() {
        $('#id_date').pickadate();
    };

    var oPublic = {
        init: init
    };

    return oPublic;
}();

$(document).ready(function() {
    LPO.Activity.init();
});