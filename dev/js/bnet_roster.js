//Parse Data
var wow_guild;
var charCount =
{
    "classes": [{
        "id": 3,
        "count": 0,
        "name": "Hunter"
    }, {
        "id": 4,
        "count": 0,
        "name": "Rogue"
    }, {
        "id": 1,
        "count": 0,
        "name": "Warrior"
    }, {
        "id": 2,
        "count": 0,
        "name": "Paladin"
    }, {
        "id": 7,
        "count": 0,
        "name": "Shaman"
    }, {
        "id": 8,
        "count": 0,
        "name": "Mage"
    }, {
        "id": 5,
        "count": 0,
        "name": "Priest"
    }, {
        "id": 6,
        "count": 0,
        "name": "Death Knight"
    }, {
        "id": 11,
        "count": 0,
        "name": "Druid"
    }, {
        "id": 12,
        "count": 0,
        "name": "Demon Hunter"
    }, {
        "id": 9,
        "count": 0,
        "name": "Warlock"
    }, {
        "id": 10,
        "count": 0,
        "name": "Monk"
    }]
}
var selectedFilters = [];

// Fetch BGH Stats
function fetchguild(data){

  if(data.code == 503){
    console.log('Maintenance')
    $('#error_503').fadeIn();
     $('.recent_activity').fadeIn();
    $('.guild_progress').fadeIn();
  } else if(data.code == 504){
    console.log('Timed Out')
    $('#error_504').fadeIn();
     $('.recent_activity').fadeIn();
    $('.guild_progress').fadeIn();
  } else {
    $('.recent_activity').fadeIn();
  }

wow_guild = data;
console.log(data);

wow_guild.members.sort( function( a, b ) {
    a = a.character.name.toLowerCase();
    b = b.character.name.toLowerCase();

    return a < b ? -1 : a > b ? 1 : 0;
});

//Roster
$.each(wow_guild.members, function(i, v) {
  var x = v.character
  var loc = $('.rank' + v.rank);
  var spec = '-';
  if (x.spec != null){
    spec = x.spec.name
  }
  var bigImg = x.thumbnail.replace(/avatar/gi, 'inset')
  bigImg = "'http://render-eu.worldofwarcraft.com/character/" + bigImg + "?alt=/wow/static/images/2d/inset/race/" + x.race + "-" + x.gender + ".jpg'"
  if(loc != null && x.level > 100){
    loc.append('<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12"><div class="roster_member c' + x.class + '" style="background-image:url(' + bigImg + ')"><a href="https://worldofwarcraft.com/en-gb/character/' + x.realm + '/' + x.name + '" data-name="' + x.name + '" data-realm="' + x.realm + '"><div class="cName">' + x.name + '</div><div class="cLvl">' + x.level + '</div><div class="cSpec">' + spec + '</div></a></div></div>')
  }
  if(i == wow_guild.members.length - 1){
    loadFinished();
  }
})


} //End fetchguild

function guildStats(){
  characterCount();
}

function changeFilter(){
  selectedFilters = []
  $('.filter_roles input').each(function(){
    var filters = $(this)[0].checked;
    if(filters == true){
      var x = Number($(this).val());
      selectedFilters.push(x)
    }
  })
  characterCount();
}

function characterCount(ranks){
  $.each(wow_guild.members, function(i, v) {
    var x = v.character;
    $.each(charCount.classes, function(a, b){
    if(x.class == b.id && x.level > 100){
      if(v.rank == 0 || v.rank == 1 || v.rank == 2){
        this.count = this.count + 1
      }
    }
  })
  })
  $.each(charCount.classes, function(i,v){
    var classname = v.name.toLowerCase().replace(/\s/gi, '');
    $('.classes').append('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 c' + v.id + '" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + v.name + '"><div class="classCount"><img src="https://wow.zamimg.com/images/wow/icons/medium/class_' + classname + '.jpg"><div>' + v.count + '</div></div>')
  })
}

function loadFinished(){
  console.log('done');
  guildStats();
  $('[data-toggle="tooltip"]').tooltip()
  $('.spinner').hide()
  $('.roster_feeds').fadeIn(1000);
}


//Fetch Guild Data
$(function() {
    $.ajax({
        url: 'https://eu.api.battle.net/wow/guild/Alonsus/Big%20Game%20Hunters?jsonp=fetchguild&fields=members&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db',
        dataType: "jsonp",
        type: 'GET'
    })
})


function fetchUserProfile(name, realm){
  $.ajax({
        url: 'https://eu.api.battle.net/wow/character/' + realm + '/' + name + '?jsonp=fetchprofile&fields=achievements+appearance+feed+items+mounts+pets+professions+progression+pvp+reputation+statistics+stats+titles&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db',
        dataType: "jsonp",
        type: 'GET'
    })
}

function fetchprofile(data){
  console.log(data);
  var bigImg = data.thumbnail.replace(/avatar/gi, 'inset');
  bigImg = "http://render-eu.worldofwarcraft.com/character/" + bigImg + "?alt=/wow/static/images/2d/inset/race/" + data.race + "-" + data.gender + ".jpg";
  console.log(bigImg);
  $('#modal_bg').css({
    'background-image':'url(' + bigImg + ')',
    'background-size':'cover',
    'background-position':'center'
  });
  $('#modal_bg').css('min-height', '500px');
  var name;
  $.each(data.titles, function(i, v){
    if(v.selected && v.selected == true){
      name = v.name
    }
  })
  name = name.replace(/%s/gi, data.name);
  console.log(name)
  $('#myModalLabel').html(name + '<small> iLvl: ' + data.items.averageItemLevel + '</small>')

  $('#myModal').modal()
}

// $('body').on('click', '.roster_member a', function(event){
//   event.preventDefault();
//   fetchUserProfile($(this).attr('data-name'), $(this).attr('data-realm'));
// })

$('body').on('change', '.filter_roles input', function(){
  console.log('changed')
  changeFilter();
})
