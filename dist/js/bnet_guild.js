function timeConverter(e){var a=new Date(e),t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],i=a.getFullYear(),n=t[a.getMonth()],o=a.getDate(),r=(a.getHours(),a.getMinutes(),a.getSeconds(),[1,21,31]),c=[2,22],d=[3,23],s=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,24,25,26,27,28,29,30];return-1!=r.indexOf(o)?o+="st":-1!=c.indexOf(o)?o+="nd":-1!=d.indexOf(o)?o+="rd":-1!=s.indexOf(o)&&(o+="th"),o+" "+n+" "+i}function fetchachi(e){wow_achi=e,console.log(e);var a=0,t=0;$.each(aComplete,function(e,a){if(10==e)return $WowheadPower&&$WowheadPower.refreshLinks(),!1;var t,i,n;$.each(wow_achi.achievements,function(e,o){$.each(o.achievements,function(e,o){o.id==a&&(t=o.description,i=o.title,n=o.points+' <span class="glyphicon glyphicon-star" aria-hidden="true"></span>')}),$.each(o.categories,function(e,o){$.each(o.achievements,function(e,o){o.id==a&&(t=o.description,i=o.title,n=o.points+' <span class="glyphicon glyphicon-star" aria-hidden="true"></span>')})})});var o=timeConverter(aTime[e]);$(".recent_progress").append('<div class="row"><div class="col-xs-10"><a href="http://wowhead.com/achievement='+a+'">'+i+"</a> &ndash; "+n+'<br><span class="sub_achi">'+t+'</span></div><div class="col-xs-2 text-right date"><i>'+o+"</i></div>")}),$.each(e.achievements,function(e,i){if(6==e)return!1;var n=0,o=0;$.each(i.achievements,function(e,a){1!=a.factionId&&(n+=1),-1!=$.inArray(a.id,wow_guild.achievements.achievementsCompleted)&&(o+=1,achi_details=a.description)}),$.each(i.categories,function(e,a){$.each(a.achievements,function(e,a){1!=a.factionId&&(n+=1),-1!=$.inArray(a.id,wow_guild.achievements.achievementsCompleted)&&(o+=1)})}),a+=n,t+=o;var r=o/n*100;if(0!=(r=r.toFixed(0)))var c=r+"%";else var c=[];$(".guild_progress").append('<div class="col-sm-4"><h5>'+i.name+'</h5><div class="progress" data-toggle="tooltip" data-placement="bottom" title="Completed '+o+" of "+n+'"><div class="progress-bar" role="progressbar" aria-valuenow="'+r+'" aria-valuemin="0" aria-valuemax="100" style="width: '+r+'%;">'+c+"</div></div></div>")});var i=t/a*100;i=i.toFixed(0);var n=i+"%";$(".guild_progress").prepend('<div class="col-md-12"><h5>Total Completed</h5><div class="progress" data-toggle="tooltip" data-placement="bottom" title="Completed '+t+" of "+a+'"><div class="progress-bar" role="progressbar" aria-valuenow="'+i+'" aria-valuemin="0" aria-valuemax="100" style="width: '+i+'%;">'+n+"</div></div></div>"),$('[data-toggle="tooltip"]').tooltip()}function fetchguild(e){503==e.code?(console.log("Maintenance"),$("#error_503").fadeIn(),$(".recent_activity").fadeIn(),$(".guild_progress").fadeIn()):504==e.code?(console.log("Timed Out"),$("#error_504").fadeIn(),$(".recent_activity").fadeIn(),$(".guild_progress").fadeIn()):$(".recent_activity").fadeIn(),wow_guild=e,console.log(e),aComplete=e.achievements.achievementsCompleted,aTime=e.achievements.achievementsCompletedTimestamp;var a=[];aTime.sort(function(e,t){var i=new Date(e),n=new Date(t),o=n-i;return a.push(o),o}),aComplete.sort(function(e,t){return a.shift()}),fetchnews(e,0,!1),$.ajax({url:"https://eu.api.blizzard.com/wow/data/guild/achievements?jsonp=fetchachi&locale=en_GB&access_token="+token,dataType:"jsonp",type:"GET"})}function fetchnews(e,a,t){1==t&&$("html, body").stop().animate({scrollTop:$(".recent_activity").offset().top}),wowhead_tooltips={colorlinks:!0,iconizelinks:!0,renamelinks:!0},$(".recent_loot").html("");$.each(e.news.slice(a),function(e,t){if(console.log(t),15==e){var i=a+15;return $(".recent_loot").append('<div class="row text-center"><a onclick="fetchnews(wow_guild, '+i+', true)" class="btn btn-default">View More</a></div>'),loadFinished(),!1}var n=timeConverter(t.timestamp);if("itemLoot"==t.type){var o,r;$.each(itemLoc.location,function(e,a){t.context==a.id&&(o=" ("+a.name+")")}),null==o&&(o=""),0!=$(t.bonusLists).length&&$.each(t.bonusLists,function(e,a){r=0!=e?r+":"+a:a});var c,d=$.grep(wow_guild.members,function(e,a){return e.character.name==t.character});d&&0!=d.length&&(c=d[0].character.realm.replace(" ","-")),$(".recent_loot").append('<div class="row"><a target="_blank" href="https://worldofwarcraft.com/en-gb/character/'+c+"/"+t.character+'">'+t.character+'</a> looted <a href="http://wowhead.com/item='+t.itemId+'" rel="bonus='+r+'">item</a><br><i>'+n+o+"</i></div>")}else"playerAchievement"==t.type?$(".recent_loot").append('<div class="row"><a target="_blank" href="https://worldofwarcraft.com/en-gb/character/'+c+"/"+t.character+'">'+t.character+'</a> earned <a href="http://wowhead.com/achievement='+t.achievement.id+'" rel="who='+t.character+"&amp;when="+t.timestamp+'">achievement</a> for '+t.achievement.points+" points<br><i>"+n+"</i></div>"):"itemPurchase"==t.type&&$(".recent_loot").append('<div class="row"><a target="_blank" href="https://worldofwarcraft.com/en-gb/character/'+c+"/"+t.character+'">'+t.character+'</a> purchased <a href="http://wowhead.com/item='+t.itemId+'">item</a><br><i>'+n+"</i></div>")})}function loadFinished(){$WowheadPower&&$WowheadPower.refreshLinks(),$(".spinner").hide(),$(".guild_feeds").fadeIn(1e3)}var wow_guild,wow_achi,aComplete,aTime,itemLoc={location:[{id:"raid-finder",name:"Raid Finder"},{id:"raid-normal",name:"Normal Raid"},{id:"raid-heroic",name:"Heroic Raid"},{id:"raid-mythic",name:"Mythic Raid"},{id:"dungeon-normal",name:"Normal Dungeon"},{id:"dungeon-heroic",name:"Heroic Dungeon"},{id:"dungeon-mythic",name:"Mythic Dungeon"},{id:"quest-reward",name:"Quest Reward"},{id:"world-quest-6",name:"World Quest Reward"},{id:"world-quest-7",name:"World Quest Reward"},{id:"world-quest-8",name:"World Quest Reward"},{id:"world-quest-9",name:"World Quest Reward"},{id:"challenge-mode",name:"Mythic+ Dungeon"},{id:"challenge-mode-2",name:"Mythic+ Dungeon - 2 chest"},{id:"challenge-mode-3",name:"Mythic+ Dungeon - 3 chest"},{id:"challenge-mode-jackpot",name:"Mythic+ Weekly Chest"}]};$(function(){function e(){$.ajax({url:"https://eu.api.blizzard.com/wow/guild/Alonsus/Big%20Game%20Hunters?jsonp=fetchguild&fields=achievements+news+challenge+members&locale=en_GB&access_token="+token,dataType:"jsonp",type:"GET"})}token(e)});