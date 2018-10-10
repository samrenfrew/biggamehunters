//Parse Data
var wow_guild;
var wow_achi;
var aComplete;
var aTime;
var itemLoc = ({"location":[
  {"id":"raid-finder","name":"Raid Finder"},
  {"id":"raid-normal","name":"Normal Raid"},
  {"id":"raid-heroic","name":"Heroic Raid"},
  {"id":"raid-mythic","name":"Mythic Raid"},
  {"id":"dungeon-normal","name":"Normal Dungeon"},
  {"id":"dungeon-heroic","name":"Heroic Dungeon"},
  {"id":"dungeon-mythic","name":"Mythic Dungeon"},
  {"id":"quest-reward","name":"Quest Reward"},
  {"id":"world-quest-6","name":"World Quest Reward"},
  {"id":"world-quest-7","name":"World Quest Reward"},
  {"id":"world-quest-8","name":"World Quest Reward"},
  {"id":"world-quest-9","name":"World Quest Reward"},
  {"id":"challenge-mode","name":"Mythic+ Dungeon"},
  {"id":"challenge-mode-2","name":"Mythic+ Dungeon - 2 chest"},
  {"id":"challenge-mode-3","name":"Mythic+ Dungeon - 3 chest"},
  {"id":"challenge-mode-jackpot","name":"Mythic+ Weekly Chest"}
  ]});

// Convert time to date
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var st = [1,21,31];
  var nd = [2,22];
  var rd = [3,23];
  var th = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,24,25,26,27,28,29,30];
  if (st.indexOf(date) != -1){
    date = date + 'st'
  } else if (nd.indexOf(date) != -1){
    date = date + 'nd'
  } else if (rd.indexOf(date) != -1){
    date = date + 'rd'
  } else if (th.indexOf(date) != -1){
    date = date + 'th'
  }
  var time = date + ' ' + month + ' ' + year;
  return time;
}

// Fetch Achievement Data
function fetchachi(data){

  wow_achi = data;
  console.log(data)

  var total = 0;
  var comp = 0;

//Recent Achievements
$.each(aComplete, function(i, v) {
  if(i == 10) {
      if($WowheadPower){$WowheadPower.refreshLinks();}
      return false;
  } else {

    var achi_details;
    var achi_title;
    var achi_points;
    $.each(wow_achi.achievements, function(x, p){
      $.each(p.achievements, function(a, b){
        if(b.id == v) {
          achi_details = b.description;
          achi_title = b.title;
          achi_points = b.points + ' <span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
        }
      })
      $.each(p.categories, function(a, b){
        $.each(b.achievements, function(c, d){
          if(d.id == v) {
            achi_details = d.description;
            achi_title = d.title;
            achi_points = d.points + ' <span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
          }
        })
      })
    })
    var date = timeConverter(aTime[i]);
    $('.recent_progress').append('<div class="row"><div class="col-xs-10"><a href="http://wowhead.com/achievement=' + v + '">' + achi_title + '</a> &ndash; ' + achi_points + '<br><span class="sub_achi">' + achi_details + '</span></div><div class="col-xs-2 text-right date"><i>' + date + '</i></div>')
  }
})


//Achievement Totals
$.each(data.achievements, function(i, v) {

  if(i == 6) {
    return false;
  } else {

  // Achievements
    var total_ach = 0;
    var comp_ach = 0;
    $.each(v.achievements, function(x, p){
      if(p.factionId != 1){
        total_ach = total_ach + 1;
      }
      if($.inArray(p.id, wow_guild.achievements.achievementsCompleted) != -1){
        comp_ach = comp_ach + 1;
        achi_details = p.description;
      }
    })
    $.each(v.categories, function(x, p){
      $.each(p.achievements, function(a, b){
        if(b.factionId != 1){
          total_ach = total_ach + 1;
        }
        if($.inArray(b.id, wow_guild.achievements.achievementsCompleted) != -1){
        comp_ach = comp_ach + 1;
        }
      })
    })
    total = total + total_ach;
    comp = comp + comp_ach;

    //Percentage
    var perc_ach = comp_ach / total_ach * 100;
    perc_ach = perc_ach.toFixed(0);
    if (perc_ach != 0){
      var perc_ach2 = perc_ach + '%';
    } else {
      var perc_ach2 = [];
    }

    $('.guild_progress').append('<div class="col-sm-4"><h5>' + v.name + '</h5><div class="progress" data-toggle="tooltip" data-placement="bottom" title="Completed ' + comp_ach + ' of ' + total_ach + '"><div class="progress-bar" role="progressbar" aria-valuenow="' + perc_ach + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + perc_ach + '%;">' + perc_ach2 + '</div></div></div>')

  }
    //console.log(v.name + ' - Total: ' + total_ach)
})

//Total
var percent = comp / total * 100;
    percent = percent.toFixed(0);
var percent2 = percent + '%';

$('.guild_progress').prepend('<div class="col-md-12"><h5>Total Completed</h5><div class="progress" data-toggle="tooltip" data-placement="bottom" title="Completed ' + comp + ' of ' + total + '"><div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;">' + percent2 + '</div></div></div>')

$('[data-toggle="tooltip"]').tooltip()

}// End fetchachi


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

//Reorder Guild Achievement Data
aComplete = data.achievements.achievementsCompleted;
aTime = data.achievements.achievementsCompletedTimestamp;

var sorting = [];
aTime.sort(function(a, b){
    var d1 = new Date(a);
    var d2 = new Date(b);
    var d =  d2-d1; // d2-d1 for descending order
    sorting.push(d);
    return d;
});

aComplete.sort(function(a, b){
    return sorting.shift();
});

fetchnews(data, 0, false);

//Fetch Guild Achievement Data
$.ajax({
    url: 'https://eu.api.battle.net/wow/data/guild/achievements?jsonp=fetchachi&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db',
    dataType: "jsonp",
    type: 'GET'
})

} //End fetchguild
  //Recent News
function fetchnews(data, offset, scroll){
  if(scroll == true){
    $('html, body').stop().animate({
      'scrollTop': $('.recent_activity').offset().top
    })
  }
wowhead_tooltips = { "colorlinks": true, "iconizelinks": true, "renamelinks": true }
$('.recent_loot').html('');
var news_limit = 15;
$.each(data.news.slice( offset ), function(i, v) {
    if(i == news_limit) {
      var new_offset = offset + 15;
      $('.recent_loot').append('<div class="row text-center"><a onclick="fetchnews(wow_guild, ' + new_offset + ', true)" class="btn btn-default">View More</a></div>');
      loadFinished()
      return false;
    } else {
    var iDate = timeConverter(v.timestamp);
    if(v.type == 'itemLoot'){
        var iLoc;
        var iBonus;
        $.each(itemLoc.location, function(x, p) {
            if (v.context == p.id){
                iLoc = ' (' + p.name + ')';
            }
        });
        if (iLoc == null){iLoc = '';}
        if ($(v.bonusLists).length != 0){
          $.each(v.bonusLists, function(x, p){
              if (x != 0){
                iBonus = iBonus + ':' + p;
              } else {
                iBonus = p;
              }
          })
        }
        $('.recent_loot').append('<div class="row"><a href="http://eu.battle.net/wow/en/character/alonsus/' + v.character + '/simple">' + v.character + '</a> looted <a href="http://wowhead.com/item=' + v.itemId + '" rel="bonus=' + iBonus + '">item</a><br><i>' + iDate + iLoc + '</i></div>')
    } else if (v.type == 'playerAchievement') {
        $('.recent_loot').append('<div class="row"><a href="http://eu.battle.net/wow/en/character/alonsus/' + v.character + '/simple">' + v.character + '</a> earned <a href="http://wowhead.com/achievement=' + v.achievement.id + '" rel="who=' + v.character + '&amp;when=' + v.timestamp + '">achievement</a> for ' + v.achievement.points + ' points<br><i>' + iDate + '</i></div>')
    } else if (v.type == 'itemPurchase') {
        $('.recent_loot').append('<div class="row"><a href="http://eu.battle.net/wow/en/character/alonsus/' + v.character + '/simple">' + v.character + '</a> purchased <a href="http://wowhead.com/item=' + v.itemId + '">item</a><br><i>' + iDate + '</i></div>')
    }
  }
})
}

function loadFinished(){
  if($WowheadPower){$WowheadPower.refreshLinks();}
  $('.spinner').hide()
  $('.guild_feeds').fadeIn(1000);
}

//Fetch Guild Data
$(function() {

    $.ajax({
        url: 'https://eu.api.battle.net/wow/guild/Alonsus/Big%20Game%20Hunters?jsonp=fetchguild&fields=achievements+news+challenge&locale=en_GB&apikey=9tdd7cvwkq922fz7a6438wvvftpf35db',
        dataType: "jsonp",
        type: 'GET'
    })

})