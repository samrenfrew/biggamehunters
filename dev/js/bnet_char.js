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
var professions = ['Engineering','Herbalism','Mining','Leatherworking','Tailoring','Jewelcrafting','Inscription','Enchanting','Alchemy','Blacksmithing']
var prof1 = false;
var prof2;
$.each(data.professions.primary, function(i,v){
    if($.inArray(v.name, professions) != -1){
        if(prof1 == false){
            prof1 = v.name
        } else {
            prof2 = v.name
        }
    }
})
$('#cProfPri').val(prof1);
$('#cProfSec').val(prof2);

//Armory
$('#cArmory').val('https://worldofwarcraft.com/en-gb/character/' + data.realm + '/' + data.name)

//Progression
// if($.inArray(11194, data.achievements.achievementsCompleted) != -1){
//     $('#cAOTC_en').val('Yes')
// } else {
//     $('#cAOTC_en').val('No')
// }
// if($.inArray(11581, data.achievements.achievementsCompleted) != -1){
//     $('#cAOTC_tov').val('Yes')
// } else {
//     $('#cAOTC_tov').val('No')
// }
// if($.inArray(11195, data.achievements.achievementsCompleted) != -1){
//     $('#cAOTC_nh').val('Yes')
// } else {
//     $('#cAOTC_nh').val('No')
// }
if($.inArray(12536, data.achievements.achievementsCompleted) != -1){
    $('#cAOTC_u').val('Yes')
} else {
    $('#cAOTC_u').val('No')
}

//Guild
if($(data.guild).length != 0){
    $('#cGuild').val(data.guild.name + ' - ' + data.guild.realm);
} else {
    $('#cGuild').val('None');
}

// Validate
// $('#form_character').validator('validate');

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

// Bind on page load
$(function() {

$('#fetch').click(function(){
    var cName = $('#name').val();
    var rEalm = $('#realm').val();
    var l = Ladda.create(this);
    l.start();

    token(success)
    function success(){
        $.ajax({
            url: "https://eu.api.blizzard.com/wow/character/" + rEalm + "/" + cName + "?jsonp=fetchuser&fields=guild+professions+progression+items+achievements&locale=en_GB&access_token="+token,
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
    }
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  Ladda.bind( 'input[type=submit]' );
})


})
