/// uldir = 9389
// battle-of-dazaralor = 8670

var currentRealm = 0;
var currentRegion = 0;

// fetch data about raid from bnet
function fetchRaid(zone, name){
    // fetch the raid data from bnet
      $.ajax({
        url: 'https://eu.api.blizzard.com/wow/zone/' + zone + '?locale=en_GB&access_token='+token,
        // dataType: "jsonp",
        type: 'GET',
        success: function(data){
          renderRaid(data, zone, name)
        },
        error: handleAjaxError
    })
}

// fetch raider.io progress data
function fetchRaiderIO(name, difficulty, callback){
  $.ajax({
        url: 'https://raider.io/api/v1/raiding/raid-rankings?raid=' + name + '&difficulty=' + difficulty + '&region=eu&realm=connected-alonsus',
        type: 'GET',
        success: function(data){
          var w = $.grep(data.raidRankings, function(n,i){
            return n.guild.id == 48482
          })
          if(w && w.length != 0){
            callback(w[0], difficulty)
          }
        }
    })
}

// render the data into  empty containers
function renderRaid(data, zone, name){
 if (zone == '9389'){
    slugs = [
  {"slug":"taloc","full_slug":"taloc","img_slug":"taloc"},
  {"slug":"mother","full_slug":"mother","img_slug":"mother"},
  {"slug":"fetid-devourer","full_slug":"fetid-devourer","img_slug":"fetiddevourer"},
  {"slug":"zekvoz","full_slug":"zekvoz-herald-of-nzoth","img_slug":"zekvozheraldofnzoth"},
  {"slug":"vectis","full_slug":"vectis","img_slug":"vectis"},
  {"slug":"zul","full_slug":"zul-reborn","img_slug":"zulreborn"},
  {"slug":"mythrax","full_slug":"mythrax-the-unraveler","img_slug":"mythraxtheunraveler"},
  {"slug":"ghuun","full_slug":"ghuun","img_slug":"ghuun"}
]
  } else if (zone == '8670'){
        slugs = [
  {"slug":"champion-of-the-light","full_slug":"champion-of-the-light","img_slug":"rawani-kanae"},
  {"slug":"jadefire-masters","full_slug":"jadefire-masters","img_slug":"mara-grimfang"},
  {"slug":"grong-the-revenant","full_slug":"grong","img_slug":"grong-the-revenant"},
  {"slug":"opulence","full_slug":"opulence","img_slug":"treasure-guardian"},
  {"slug":"conclave-of-the-chosen","full_slug":"conclave-of-the-chosen","img_slug":"gonks-aspect"},
  {"slug":"king-rastakhan","full_slug":"king-rastakhan","img_slug":"king-rastakhan"},
  {"slug":"mekkatorque","full_slug":"high-tinker-mekkatorque","img_slug":"mekkatorque"},
  {"slug":"stormwall-blockade","full_slug":"laminaria","img_slug":"laminaria"},
  {"slug":"lady-jaina-proudmoore","full_slug":"lady-jaina-proudmoore","img_slug":"lady-jaina-proudmoore"}
]
  }

  var target = $('.progress_data[data-zoneid="'+ zone +'"]')
  var loader = $('.loading[data-zoneid="'+ zone +'"]')

  // insert raid description
  target.prepend('<p class="hidden-xs col-xs-12 col-lg-10 col-lg-offset-1 text-center">' + data.description + '</p>')

  // fill with the bosses
  var total = 0;
  $.each(data.bosses, function(i, v){
    // console.log(v.id + ' - ' + v.urlSlug)
    if(v.id == '144680' || v.id == '144637' || v.id == '144690'){
    } else {
      // console.log('yes')

    total = total + 1;
    var slug = v.urlSlug
    var w = $.grep(slugs, function(n,i){
      return n.slug == slug
    })
    var imgSlug, fullSlug
    if(w && w.length != 0){
      fullSlug = w[0].full_slug;
      imgSlug = w[0].img_slug;
    }
    target.append('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><div class="boss" style="background-image:url(http://wow.zamimg.com/images/wow/journal/ui-ej-boss-' + imgSlug + '.png)" id="' + v.id + '" data-slug="'+ fullSlug +'"><h3 class="center-block"><a href="https://www.wowhead.com/npc=' + v.id + '">' + v.name + '</a></h3><div class="text-center mode"></div><div class="text-center date"></div></div></div>');

    }
  })

  // update prog bar count
  $('.prog_bar[data-zoneid="'+ zone +'"]').attr('data-total', total)

  // fetch data for progress
  fillRaid(zone, name);
}

// fill the bosses with progress
function fillRaid(zone, name){
  var normal, heroic, mythic;

    // fetch normal data first
    fetchRaiderIO(name, 'normal', render)

  // fetch heroic data first
    fetchRaiderIO(name, 'heroic', render)

  // then fetch mythic
    fetchRaiderIO(name, 'mythic', render)

    function render(data, difficulty){
      console.log(data)
      var count = 0;
      $.each(data.encountersDefeated, function(i,v){
        count = count + 1;
        var target = $('.boss[data-slug="'+ v.slug +'"]');
        var mode = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span> '+ difficulty +' <span class="glyphicon glyphicon-star" aria-hidden="true"></span>'
        var date = new Date(v.firstDefeated)
        date = 'Defeated ' + timeConverter(date)
        if(difficulty == 'heroic' && target.hasClass('mythic') == true){
          target.removeClass('heroic')
        } else {
          target.addClass('complete ' + difficulty)
          target.find('.mode').html(mode)
          target.find('.date').html(date)
        }
      })
      renderRank(data, zone)
      if(difficulty != 'normal'){
        renderProgBar(difficulty, zone, count)
      }
      progComplete(zone)
    }

}

// render the progress bar with data
function renderProgBar(difficulty, zone, count){
  var target = $('.prog_bar.'+difficulty+'[data-zoneid="'+ zone +'"]');
  var total = target.attr('data-total')
  var percent = ((count / total)*100).toFixed(0)
  target.find('.progress').attr('data-original-title', 'Defeated '+count+' of '+total)
  target.find('.progress-bar').attr('aria-valuenow', percent).html(percent+'%').css('width',percent+'%')
  $('[data-toggle="tooltip"]').tooltip()
}

// hide loader and show progress when complete
function progComplete(zone){
  $('.loading[data-zoneid="'+ zone +'"]').hide();
  $('.progress_data[data-zoneid="'+ zone +'"]').fadeIn();
}

// render the realm/region rank
function renderRank(data, zone){
  console.log(zone + ' - ' + currentRealm)
  if(currentRealm == 0 || data.rank < currentRealm || data.rank != 0){
    console.log(data.rank)
    console.log(currentRealm)
    currentRealm = data.rank
    $('.progress_data[data-zoneid="'+ zone +'"]').find('.realm .rank_number').html(data.rank)
    $('.progress_data[data-zoneid="'+ zone +'"]').find('.rank').fadeIn();
  };
  if(currentRegion == 0 || data.regionRank < currentRegion || data.regionRank != 0){
    currentRegion = data.regionRank
    $('.progress_data[data-zoneid="'+ zone +'"]').find('.region .rank_number').html(data.regionRank)
    $('.progress_data[data-zoneid="'+ zone +'"]').find('.rank').fadeIn();
  }
}

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

//Fetch Emerald Nightmare
function handleAjaxError(jqXHR, textStatus, errorThrown) {
  if (jqXHR.status == 503) {
    $('#error_503').fadeIn();
    $('.progress_container').hide();
  } else if (jqXHR.status == 504) {
    $('#error_504').fadeIn();
    $('.progress_container').hide();
  }
}

//Fetch WowHead Tooltips
function loadFinished(){
  $.getScript('https://wow.zamimg.com/widgets/power.js');
  wowhead_tooltips = { "colorlinks": true, "iconizelinks": true, "renamelinks": false }
}

// Load token and begin
$(function() {
  // fetch the raids on page load - grab the zone id from wowhead, and enter the name of the raid
  token(token_success)
  function token_success(){
    fetchRaid(9389, 'uldir')
    fetchRaid(8670, 'battle-of-dazaralor')
  }
})