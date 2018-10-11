function raidDesc(data, loc){

}

function progBar(data, loc){
    $.each(raid_data, function(i, v){
      var pTotal;
      var hProgress = 0;
      var mProgress = 0;
      var hPercent;
      var mPercent;
      if(i == data){
        pTotal = $(v).length;
        $.each(v, function(a, b){
          if(b.complete == 1 && b.mode != 'normal'){
            hProgress = hProgress + 1;
          }
          if(b.complete == 1 && b.mode == 'mythic'){
            mProgress = mProgress + 1;
          }
        })
        hPercent = hProgress / pTotal * 100;
        hPercent = hPercent.toFixed(0);
        if (hProgress == 0){
          hPercent = '';
        }
        mPercent = mProgress / pTotal * 100;
        mPercent = mPercent.toFixed(0);
        if (mProgress == 0){
          mPercent = '';
        }

   loc.prepend('<div class="col-xs-12 col-md-6"><h3>Heroic:</h3><div class="progress" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Defeated ' + hProgress + ' of ' + pTotal + '"><div class="progress-bar heroic" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:' + hPercent + '%;">' + hPercent + '%</div></div></div>');

   loc.prepend('<div class="col-xs-12 col-md-6"><h3>Mythic:</h3><div class="progress" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Defeated ' + mProgress + ' of ' + pTotal + '"><div class="progress-bar mythic" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:' + mPercent + '%;">' + mPercent + '%</div></div></div>');


      }
    })
}

function raidBoss(data, raid, loc, load){
    loc.prepend('<p class="col-xs-12 col-lg-10 col-lg-offset-1 text-center">' + data.description + '</p>')
    $.each(data.bosses, function(i, v){
        var imgSlug = v.urlSlug.replace(/-/,'');
        // if (v.urlSlug == 'ilgynoth-the-heart-of-corruption'){
        //     imgSlug = 'ilgynoth-heart-of-corruption'
        // } else if (v.urlSlug == 'high-botanist-telarn'){
        //     imgSlug = 'botanist'
        // }
        var rComplete;
        var rMode;
        var rDate;
        $.each(raid_data, function(x, p){
          if (x == raid){
            if(p[i].complete == 1 && p[i].mode == 'normal'){
              rComplete = ' complete normal';
              rMode = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span> Normal <span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
              // rDate = 'Defeated on <br>' + p[i].date;
              rDate = '';
            } else if (p[i].complete == 1 && p[i].mode == 'heroic'){
              rComplete = ' complete heroic';
              rMode = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span> Heroic <span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
              // rDate = 'Defeated on <br>' + p[i].date;
              rDate = '';
            } else if (p[i].complete == 1 && p[i].mode == 'mythic'){
              rComplete = ' complete mythic';
              rMode = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span> Mythic <span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
              // rDate = 'Defeated on <br>' + p[i].date;
              rDate = '';
            } else {
              rComplete = ' not_complete'
              rMode = '';
              rDate = '';
            }
          }
        })
        loc.append('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><div class="boss' + rComplete + '" style="background-image:url(http://wow.zamimg.com/images/wow/journal/ui-ej-boss-' + imgSlug + '.png)" id="' + v.id + '"><h3 class="center-block"><a href="https://www.wowhead.com/npc=' + v.id + '">' + v.name + '</a></h3><div class="text-center mode">' + rMode + '</div><div class="text-center date">' + rDate + '</div></div></div>');

    })

    load.hide();
    loc.fadeIn(1000);
}

//Fetch Emerald Nightmare
function raid_uldir(data){

  //emerald = data;
  // console.log(data);

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


progBar('uldir', $('#uldir'));

raidBoss(data, 'uldir', $('#uldir'), $('#uldir_loading'));

// raid_tov(tov);

}

// //Fetch TOV
// function raid_tov(data){

//   //nighthold = data;
//   console.log(data);

// progBar('tov', $('#tov'));

// raidBoss(data, 'tov', $('#tov'), $('#tov_loading'));

// raid_nighthold(nighthold);

// }

// //Fetch Nighthold
// function raid_nighthold(data){

//   //nighthold = data;
//   console.log(data);

// progBar('nighthold', $('#the_nighthold'));

// raidBoss(data, 'nighthold', $('#the_nighthold'), $('#nighthold_loading'));

// loadFinished();

// $('[data-toggle="tooltip"]').tooltip()

// }

//Fetch WowHead Tooltips
function loadFinished(){
  $.getScript('https://wow.zamimg.com/widgets/power.js');
  wowhead_tooltips = { "colorlinks": true, "iconizelinks": true, "renamelinks": false }
}

$(function() {

raid_uldir(uldir);

})