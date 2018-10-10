var wow_data;

function cLass(data){
    wow_class = data;
}

function rAce(data){
    wow_race = data;
}

function fetchuser(data){

console.log(data);
wow_data = data;

if (data.name != null){

helper_text();
$('#bnet_auth').addClass('bg-success');
$('#bnet_fetch .help-block').hide();
$('#match_found').show();

var cur_Class;
var cur_Race;


//Name
$('#cName').val(data.name);

//Class
$.each(wow_class.classes, function(i, v) {
    if(data.class == v.id){
        cur_Class = v.name;
        $("#cClass").val(v.name);
    }
});

//Race
$.each(wow_race.races, function(i, v) {
    if(data.race == v.id){
        cur_Race = v.name;
        $("#cRace").val(v.name);
    }
});

//Match found
$('#match_name').html(data.name + ', ' + cur_Class + ' (Level ' + data.level + ')')

//iLevel
$('#cIlevel').val(data.items.averageItemLevel)

//Faction
if (data.faction == 0){
    $("#user_faction").html('Alliance');
} else {
    $("#user_faction").html('Horde');
}

//Achievement Points
$("#cAchi").val(data.achievementPoints);

//Professions
$('#cProfPri').val(data.professions.primary[0].name + ' (' + data.professions.primary[0].rank + ')');
$('#cProfSec').val(data.professions.primary[1].name + ' (' + data.professions.primary[1].rank + ')');

//Armory
$('#cArmory').val('http://eu.battle.net/wow/en/character/' + data.realm + '/' + data.name + '/simple')

//Progression
if($.inArray(11194, data.achievements.achievementsCompleted) != -1){
    $('#cAOTC_en').val('Yes')
} else {
    $('#cAOTC_en').val('No')
}
if($.inArray(11581, data.achievements.achievementsCompleted) != -1){
    $('#cAOTC_tov').val('Yes')
} else {
    $('#cAOTC_tov').val('No')
}
if($.inArray(11195, data.achievements.achievementsCompleted) != -1){
    $('#cAOTC_nh').val('Yes')
} else {
    $('#cAOTC_nh').val('No')
}

//Guild
if($(data.guild).length != 0){
    $('#cGuild').val(data.guild.name + ' - ' + data.guild.realm);
} else {
    $('#cGuild').val('None');
}

// Validate
$('#form_character').validator('validate');

} else if(data.code == 504) {
    helper_text();
    $('#bnet_auth').addClass('bg-warning');
    $('#bnet_fetch .help-block').hide();
    $('#error_504').show();
} else if(data.code == 503) {
    helper_text();
    $('#bnet_auth').addClass('bg-warning');
    $('#bnet_fetch .help-block').hide();
    $('#error_503').show();
}


}

function helper_text(){
    $('#bnet_auth').removeClass('bg-success');
    $('#bnet_auth').removeClass('bg-warning');
    $('#bnet_auth').removeClass('bg-danger');
}

//Fetch User Profile
$(function() {

// $.ajax({
//     url: 'https://eu.api.battle.net/wow/data/character/classes?jsonp=cLass&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db',
//     dataType: "jsonp",
//     type: 'GET'
// })



$('#fetch').click(function(){
    var cName = $('#name').val();
    var rEalm = $('#realm').val();
    var l = Ladda.create(this);
    l.start();
    $.ajax({
        url: "https://eu.api.battle.net/wow/character/" + rEalm + "/" + cName + "?jsonp=fetchuser&fields=guild+professions+progression+items+achievements&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db",
        dataType: "jsonp",
        type: 'GET',
        success: function (data) {
        },
        statusCode: {
            404: function() {
                helper_text();
                $('#bnet_auth').addClass('bg-danger');
                $('#bnet_fetch .help-block').hide();
                $('#match_not_found').show();
                l.stop();
            },
            200: function(){
                l.stop();
            },
            504: function(){
                l.stop();
            }
          }
    });
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  Ladda.bind( 'input[type=submit]' );
})


})
