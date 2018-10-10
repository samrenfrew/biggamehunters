function timeConverter(e){var t=new Date(e),a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],s=t.getFullYear(),r=a[t.getMonth()],o=t.getDate(),n=(t.getHours(),t.getMinutes(),t.getSeconds(),[1,21,31]),i=[2,22],l=[3,23],d=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,24,25,26,27,28,29,30];n.indexOf(o)!=-1?o+="st":i.indexOf(o)!=-1?o+="nd":l.indexOf(o)!=-1?o+="rd":d.indexOf(o)!=-1&&(o+="th");var c=o+" "+r+" "+s;return c}function fight_length(e){var t=[Math.floor(e/60)%60,e%60];return $.map(t,function(e,t){return(e<10?"0":"")+e}).join(":")}function nFormatter(e,t){return"M"==t?(e/1e6).toFixed(2).replace(/\.0$/,"")+"M":"K"==t?(e/1e3).toFixed(0).replace(/\.0$/,"")+"K":(e/1e6).toFixed(2).replace(/\.0$/,"")+"M"}function standardDeviation(e){var t=average(e),a=e.map(function(e){var a=e-t,s=a*a;return s}),s=average(a),r=Math.sqrt(s);return r}function average(e){var t=e.reduce(function(e,t){return e+t},0),a=t/e.length;return a}function latest_reports(e){console.log(e),reports=e.reverse(),$.each(reports,function(e,t){if("11"==t.zone){var a='<button class="btn btn-primary load_report" data-toggle="modal" data-target="#latest_reports" data-id="'+t.id+'">Load report</button>',s=timeConverter(t.start);$(".modal-body").append('<div class="row"><div class="col-xs-12 col-sm-9 report" id="'+t.id+'"><h4>'+t.title+'</h4><p class="report_info">'+s+" -  uploaded by "+t.owner+'</p></div><div class="col-xs-12 col-sm-3">'+a+"</div></div>")}})}function load_fights(e){console.log(e.fights),$.each(e.fights,function(e,t){console.log(t.name)})}function fetch_report(e){console.log("fetching report"),enemies=e.enemies;var t=$("#reportid").val();$(".report_select").html("");var a=timeConverter(e.start);$(".report_select").prepend("<h2>"+e.title+"<small> &ndash; "+a+'</small></h2><p class="full_report text-muted">View the full report: <a href="https://www.warcraftlogs.com/reports/'+t+'">www.warcraftlogs.com/reports/'+t+"</a></p>"),$(".report_select").append('<div class="col-xs-12 col-md-6 col-lg-4 list_bosses"><table class="report table"><caption>Select the boss below to view the fights</caption><tbody><tr class="boss view_all active"><td>View All Kills</td></tr></tbody></table></div><div class="col-xs-12 col-md-6 col-lg-8 list_fights"></div>'),console.log(e);var s=0;$.each(e.fights,function(t,a){if(0!=a.boss){if(1==a.kill&&(s+=1),3==a.difficulty)var r="(N)";else 4==a.difficulty?r="(H)":5==a.difficulty&&(r="(M)");1!=$("tr#"+a.boss).length&&($("table.report tbody").append('<tr class="boss" id="'+a.boss+'"><td>'+r+" "+a.name+"</td>"),$(".list_fights").append('<div class="row fight" id="'+a.boss+'" style="display:block;"><div class="wipes" style="display:none;"></div><div class="kills"></div></div>')),t==$(e.fights).length-1&&$(".view_all td").append(" ("+s+")")}}),$.each(e.fights,function(e,a){if(0!=a.boss){if(1==a.kill)var s="Kill",r="";else s="Wipe",r="progress-bar-danger";var o=100-a.bossPercentage/100;if(o=o.toFixed(2),100==o)var r="progress-bar-success";else if(o<100&&o>=80)var r="";else if(o<80&&o>=50)var r="progress-bar-warning";else if(o<50)var r="progress-bar-danger";var n=(a.end_time-a.start_time)/6e4*60,i=fight_length(n).match(/\d{2}:\d{2}/gi)[0],l='<div class="col-xs-9">'+a.name+"<small> &ndash; "+i+" / "+o+'%</small><div class="progress"><div class="progress-bar '+r+'" role="progressbar" aria-valuenow="'+o+'" aria-valuemin="0" ariavaluemax="100" style="width: '+o+'%;"></div></div></div><div class="col-xs-3 text-center"><button class="btn btn-primary process_fight ladda-button" data-style="zoom-out" data-boss="'+a.boss+'" data-boss_name="'+a.name+'" data-time="'+i+'" data-report="'+t+'" data-start="'+a.start_time+'" data-end="'+a.end_time+'" data-size="'+a.size+'" data-diff="'+a.difficulty+'">View fight</button></div>';1==a.kill?$(".row#"+a.boss+" div.kills").append(l):$(".row#"+a.boss+" div.wipes").append(l)}}),$(".report_select").fadeIn(300)}function report_entry(e,t,a,s,r,o,n,i){if(console.log("report entry"),3==a)var l="col-xs-12 col-md-4 result triple";else 2==a?l="col-xs-12 col-md-6 result double":1==a&&(l="col-xs-12 result single");var d='<div class="'+l+'"><h4>'+t+" &ndash; "+s+"</h4><p>"+r+'</p><div class="results text-center" id="'+e+'">',c="<h5>"+i+'</h5><div class="progress" id="'+e+'"><div class="progress-bar" role="progressbar" aria-valuenow=""aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div></div>',g='<p class="info"></p>',h='<button class="btn btn-default view_details" data-ability="'+e+'" data-toggled="off">Show details</button>',f='<div class="player_results" id="'+e+'" style="display:none;"></div>',p='<table class="table interrupts"><tr><td class="casts_missed text-right">0</td><td class="casts info">casts were missed. Good job!</td></tr></table>',u="</div>",m=d;"Interrupts"==t?m=m+p+u+u:(1==n&&(m=m+c+g),1==o&&(m+=h),m+=u,1==o&&(m+=f),m+=u),$(".chosen_report").append(m)}function write_table(e,t,a,s){console.log("writing table");var r=($("#"+e+".results").next(".player_results"),'<table id="'+e+'" class="table" data-ability="'+t+'"><thead>'),o="";$.each(s,function(e,t){o=0==e?o+"<th>"+t+"</th>":o+'<th class="text-center">'+t+"</th>"});var n="<tbody></tbody>",i='<tfoot><tr class="active"></tr></tfoot></table>';info=r+o+n+i,$("#"+e+".results").next(".player_results").append(info)}function data_request(e,t,a,s,r,o,n,i,l,d,c,g){if(console.log("data_request start"),0!=i)var h="&options="+i;else h="";if(0!=l)var f="&hostility="+l;else f="";var p=0,u=0,m=$(o).length,v=[];$.each(o,function(i,l){$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/"+s+"/"+e+"?start="+t+"&end="+a+"&abilityid="+o[i]+h+f+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){function t(e,t){u+=e,u==p&&i==m-1&&(console.log("hooray its the last one do some shit"),console.log(t),1==d&&fill_table(r,t),g(t))}"buffs"==s||"debuffs"==s?cycle=e.auras:cycle=e.entries,p+=$(cycle).length,console.log("ajax success start - "+o[i]),data_array(e,s,n,t,v,c),console.log("ajax success complete")}})}),console.log("data_request complete")}function event_request(e,t,a,s,r,o,n,i,l){console.log("data_request start");$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/events/"+e+"?start="+t+"&end="+a+"&filter="+o+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){console.log("ajax success start - event"),console.log(e);var t=[],a=[],s=[];console.log("first pass"),$.each(e.events,function(e,s){"cast"==s.type?t.push(s.timestamp):"applydebuff"==s.type&&a.push({id:s.targetID,timestamp:s.timestamp})}),$.each(a,function(e,a){var r=a.timestamp;$.grep(t,function(e){var t=e+100;if(r>=e&&r<t){console.log("player hit:"+a.id);var o=$.grep(s,function(e){return e.id==a.id});if(0==o.length)console.log("not in array"),s.push({id:a.id,hitCount:1,name:""});else{console.log("in array");var n=o[0].hitCount+1;o[0].hitCount=n}}})}),$.each(s,function(e,t){var a=$.grep(players_array,function(e){return e.id==t.id});1==a.length&&(t.name=a[0].name)}),console.log(s),1==i&&fill_table(r,s),l(s),console.log("ajax success complete")}}),console.log("data_request complete")}function data_array(e,t,a,s,r,o){console.log("data_array started"),console.log(e);var n=0;"buffs"==t||"debuffs"==t?cycle=e.auras:"cast_debuff"==t?cycle=e.events:cycle=e.entries,$.each(cycle,function(e,t){function s(){var e=new Object,s=!1;$.each(a,function(a,r){0!=t[r]?e[r]=t[r]:s=!0}),0==s&&r.push(e)}n+=1;var i=$.grep(r,function(e){return e.name==t.name});if(0==i.length)1==o?$.inArray(t.icon,tanks_array)!=-1||s():s();else if(1==i.length){var l=i[0];console.log(l),$.each(a,function(e,a){if("name"==a||"id"==a);else{var s=l[a]+t[a];l[a]=s}}),console.log(l)}}),s&&s(n,r),console.log("data_array complete")}function fill_table(e,t){console.log("fill_table started - "+e);var a=$("#"+e+".table"),s=a.find("th").length;$.each(t,function(t,s){var r;a.find("tbody").append('<tr id="'+s.id+'"></tr>'),a.find("th").each(function(e,t){var o,n=!0,i=$(this).html(),l="";if("Name"==i?(o=s.name,n=!1):"DPS"==i?(o=s.dps+"K",r=s.rating>=5?"success":s.rating>=4&&s.rating<5?"info":s.rating>=3&&s.rating<4?"warning":"danger"):"Hits"==i?(s.hitCount?o=s.hitCount:s.tickCount?o=s.tickCount:s.totalUses&&(o=s.totalUses),r=o>=4?"danger":o>=2&&o<4?"warning":"success"):"Damage"==i?o=nFormatter(s.total,"M"):"Uses"==i?(o=s.totalUses,r=0==o?"danger":1==o?"warning":"success"):"Active Time"==i&&(o=s.activeTime,6==s.rating&&(l=" winner"),1==s.rating&&(l=" loser")),1==n)var d="text-center";else d="";a.find("tr#"+s.id).append('<td class="'+d+l+'">'+o+"</td>")}),a.find("tr#"+s.id).addClass(r);var o=$("#"+e+".table").attr("data-ability"),n="",i=$.grep(players_array,function(e){return e.name==s.name});1==i.length&&i[0].deaths&&(n=i[0].deaths.ability==o?" death":""),a.find("tr#"+s.id+" td:last-of-type").addClass(n)});var r=[[1,"desc"]];3==s?r=[[1,"desc"],[2,"desc"]]:4==s&&(r=[[1,"desc"],[2,"desc"]]),$("#"+e+".table").DataTable({paging:!1,info:!1,searching:!1,order:r}),console.log("fill_table complete")}function progress_bar(e,t,a,s,r,o,n){console.log("progress_bar start");var i;total_percentage=t/a*100,total_percentage=total_percentage.toFixed(0),console.log(total_percentage),"asc"==s?i=total_percentage>=r?"success":total_percentage>=o&&total_percentage<r?"warning":"danger":"desc"==s&&(i=total_percentage<=r?"success":total_percentage<=o&&total_percentage>r?"warning":"danger"),$("#"+e+".progress").find(".progress-bar").addClass("progress-bar-"+i),$("#"+e+".progress").find(".progress-bar").attr("aria-valuenow",total_percentage),$("#"+e+".progress").find(".progress-bar").html(total_percentage+"%"),$("#"+e+".progress").find(".progress-bar").animate({width:total_percentage+"%"},50),$("#"+e+".results").find(".info").html(n)}function sort_dps_array(e,t,a,s,r,o,n){$.each(e,function(e,n){if($.inArray(n.icon,heals_array)!=-1);else if($.inArray(n.icon,tanks_array)!=-1);else{var i=n.name,l=n.id;1==a&&(n=n.damage_done);var d=n.activeTime,c=(d/fight_len*100).toFixed(2)+"%",g=n.total;if(1==s)var h=g/d;else h=g/fight_len;h>r&&(r=h),h<o&&(o=h),t.push({name:i,id:l,dps:h.toFixed(0),total:g,activeTime:c,rating:""})}}),n(t,r,o)}function add_prio(e,t,a,s,r,o,n,i,l,d,c){function g(e){function t(e,t,a){var s=[],o=[],n=[];console.log(e),$.each(e,function(e,t){s.push(Number(t.dps)),o.push(t.total),n.push(t.activeTime)}),console.log(s);var i=average(s);console.log(i);var l=standardDeviation(s),d=i+l,c=i-l,g=i+2*l,h=i-2*l,f=0;if($.each(e,function(e,t){var a=t.dps;f+=t.total,a>g?t.rating=6:a>=d&&a<g?t.rating=5:a>=i&&a<d?t.rating=4:a>=c&&a<i?t.rating=3:a>=h&&a<c?t.rating=2:a<h&&(t.rating=1)}),fill_table(r,e),0==$(e).length){var p="This add did not spawn";$("#"+r+".results").find(".view_details").hide()}else var p="This add took a total of <strong>"+nFormatter(f)+"</strong> damage from <strong>"+$(s).length+"</strong> players<br>The average active DPS was <strong>"+i.toFixed(0)+"K</strong> with a high of <strong>"+t.toFixed(0)+"K</strong> and a low of <strong>"+a.toFixed(0)+"K</strong>";$("#"+r+".results").prepend('<div class="info">'+p+"</div><br>")}console.log(e);var a=e,s=[],o=!1,n=!0,i=0,l=1e5;sort_dps_array(a,s,o,n,i,l,t)}report_entry(r,"Damage Done",2,o,n,!0,!1,""),write_table(r,o,4,["Name","DPS","Damage","Active Time"]);var h=["name","id","icon","total","activeTime"],f="damage-done",p=0,u=0,m=[];$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/"+f+"/"+e+"?start="+t+"&end="+a+"&targetid="+c+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){function t(e,t){u+=e,u==p&&(console.log("hooray its the last one do some shit"),console.log(t),g(t))}cycle=e.entries,p+=$(cycle).length,console.log("ajax success start - target: "+c),data_array(e,f,h,t,m,d),console.log("ajax success complete")}}),console.log("data_request complete"),loadFinished()}function avoidable_damage(e,t,a,s,r,o,n,i,l,d,c,g,h,f,p){function u(e){var t=$(e).length,a=0,s=0,o=0;$.each(e,function(e,t){t.hitCount?a+=t.hitCount:t.tickCount&&(a+=t.tickCount),s+=t.total;var r=$.grep(players_array,function(e){return e.name==t.name});1==r.length&&r[0].deaths&&r[0].deaths.ability==n&&(o+=1)}),console.log(o);var i="";if(o>0){if(1==o)var d="player";else d="players";i='<span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <strong>'+o+"</strong> "+d+" died to this"}if(1==c){var g="non-tank ";$.each(players_array,function(e,t){$.inArray(t.icon,tanks_array)!=-1&&(l-=1)})}else g="";if(0==t){var h="<strong>0/"+l+"</strong> "+g+" players were hit &ndash; good job!";$("#"+r+".results button").hide()}else{if(1==t)var d="player";else d="players";h="<strong>"+t+"/"+l+"</strong> "+g+d+" were hit a total of <strong>"+a+"</strong> times for <strong>"+nFormatter(s)+"</strong> damage<br>"+i}progress_bar(r,t,l,"desc",50,25,h),$("#"+r+".table tfoot tr").append('<td>TOTAL</td><td class="text-center">'+a+'</td><td class="text-center">'+nFormatter(s)+"</td></tr>")}if(report_entry(r,"Avoidable Damage",2,n,i,!0,!0,"Players Hit - lower is better"),write_table(r,n,3,["Name","Hits","Damage"]),1==g)var m=["name","id","tickCount","total"];else m=["name","id","hitCount","total"];var v="damage-taken",y=!0;data_request(e,t,a,v,r,o,m,h,f,y,c,u),loadFinished()}function interrupts(e,t,a,s,r,o,n,i,l){function d(e){$.each(e,function(e,t){h+=t.total}),g()}function c(e){console.log("total damage = "+h),$.each(e,function(e,t){f+=t.total}),$("#"+r+".results").find(".casts_missed").html(f),g()}function g(){0==f?$("#"+r+".results").find(".info").html("casts were missed &ndash; good job!"):$("#"+r+".results").find(".info").html("casts were missed leading to <strong>"+nFormatter(h)+"</strong> additional damage"),loadFinished()}var h=0,f=0,p=["total"],u=!1,m=!1,v=!1,y=!1,b=!1,_="";report_entry(r,"Interrupts",2,n,i,u,b,_),data_request(e,t,a,"damage-taken",r,o,p,v,y,u,m,d),data_request(e,t,a,"casts",r,o,p,v,1,u,m,c)}function check_buffs(e,t,a,s,r,o,n,i,l){function d(t){console.log("get buff");var a=n,s=0,r=0;$("#"+e+".table");if($.each(t,function(e,t){2==t.totalUses&&(s+=1)}),$.each(players_array,function(a,s){var o=$.grep(t,function(e){return e.name==s.name});0==o.length&&($("#"+e+".table tbody").append('<tr id="'+s.id+'" class="danger"><td>'+s.name+'</td><td class="text-center">0</td>'),r+=1)}),r>0)var o=r+" players used no pots at all";else o="";var i="<strong>"+s+"/"+n+"</strong> players used <strong>2</strong> pots during this fight<br><strong>"+o+"</strong>";progress_bar(e,s,a,"asc",60,40,i),$("#"+e+".table tfoot tr").append("<td></td><td></td>")}var c=["Name","Uses"],g="Potions Used - higher is better",h=!0,f=!0;report_entry(e,"Consumables",2,i,l,h,f,g),write_table(e,i,2,c);var p=["name","id","totalUses"],u=!1,m=!1,h=!0,v=!1;data_request(t,a,s,"buffs",e,o,p,u,m,h,v,d),loadFinished()}function check_debuffs(e,t,a,s,r,o,n,i,l){function d(t){console.log("get debuff");var a=n,s=0,r=0,o=($("#"+e+".table"),0);$.each(t,function(e,t){r+=t.totalUses,s+=1});var i="";if(o>0){if(1==o)var l="player";else l="players";i='<span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <strong>'+o+"</strong> "+l+" died to this"}if(0==s){var d="<strong>Nobody was hit by this ability - good job!</strong><br>";$("#"+e+".results button").hide()}else d="<strong>"+s+"/"+n+"</strong> players were hit a total of <strong>"+r+"</strong> times during this fight<br>"+i;progress_bar(e,s,a,"desc",50,25,d)}var c=["Name","Hits"],g="Players hit - lower is better",h=!0,f=!0;report_entry(e,"Debuffs",2,i,l,h,f,g),write_table(e,i,2,c);var p=["name","id","totalUses"],u=!1,m=!1,h=!0,v=!1;data_request(t,a,s,"debuffs",e,o,p,u,m,h,v,d),loadFinished()}function check_cast_debuffs(e,t,a,s,r,o,n,i,l,d){function c(t){console.log("EVENT CHECK COMPLETE"),console.log(t);var a=o,s=0,r=0;$("#"+e+".table");if($.each(t,function(e,t){r+=t.hitCount,s+=1}),0==s){var n="<strong>Nobody was hit by this ability - good job!</strong><br>";$("#"+e+".results button").hide()}else n="<strong>"+s+"/"+o+"</strong> players were hit <strong>"+r+"</strong> times during this fight<br>";progress_bar(e,s,a,"desc",50,25,n)}var g=["Name","Hits"],h="Players hit - lower is better",f=!0,p=!0;report_entry(e,"Debuffs",2,n,i,f,p,h),write_table(e,n,2,g);var f=!0;event_request(t,a,s,"cast_debuff",e,l,d,!0,c),loadFinished()}function loadFinished(){$(".spinner").hide(),$("html,body").animate({scrollTop:$(".chosen_report").offset().top},"fast"),$(".chosen_report").fadeIn(500)}var enemies,players_array=[],death_array=[],tanks_array=["Druid-Guardian","Paladin-Protection","Monk-Brewmaster","Warrior-Protection","DeathKnight-Blood","DemonHunter-Vengeance"],heals_array=["Druid-Restoration","Shaman-Restoration","Monk-Mistweaver","Priest-Holy","Paladin-Holy","Priest-Discipline"],pots_array=[188028,229206,188027,188017],flasks_array=[188033,188031,188034,188035],food_array=[225602,225603,225604,225605],fight_len,dps_array=[],dps_name_array=[],reports,saved_reports;null!=localStorage.getItem("reportsArray")&&(saved_reports=JSON.parse(localStorage.getItem("reportsArray"))),$(function(){$("#fetch").click(function(){var e=$("#reportid").val();history.pushState&&history.pushState({},null,"https://biggamehunters.net/logs#"+e);var t=Ladda.create(this);t.start(),$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/fights/"+e+"?api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:fetch_report,statusCode:{404:function(){helper_text(),$("#bnet_auth").addClass("bg-danger"),$("#bnet_fetch .help-block").hide(),$("#match_not_found").show(),t.stop()},200:function(){t.stop()},504:function(){t.stop()}}})}),$("body").on("click",".process_fight",function(){function e(){dps_array=[],dps_name_array=[],$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/damage-done/"+l+"?start="+d+"&end="+c+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){console.log("damage-done"),console.log(e),$.each(e.entries,function(e,t){if($.inArray(t.icon,heals_array)!=-1);else if($.inArray(t.icon,tanks_array)!=-1);else{var a=t.activeTime,s=.01*fight_len,r=t.total/fight_len;a>s&&(dps_array.push(r),dps_name_array.push(t.name))}var o=$.grep(players_array,function(e){return e.name==t.name});if(1==o.length){var r={damage_done:{total:t.total,activeTime:t.activeTime}};$.extend(!0,o[0],r)}}),a(),t()}})}function t(){function e(e,l,d){$.each(e,function(e,a){var i=a.dps;i>o?a.rating=6:i>=s&&i<o?a.rating=5:i>=t&&i<s?a.rating=4:i>=r&&i<t?a.rating=3:i>=n&&i<r?a.rating=2:i<n&&(a.rating=1)}),fill_table("DPS",e);var c="The raids average DPS was <strong>"+t.toFixed(0)+"K</strong> with a high of <strong>"+l.toFixed(0)+"K</strong> and a low of <strong>"+d.toFixed(0)+"K</strong><br>The standard deviation is <strong>"+a.toFixed(0)+"K</strong> with a co-efficient of <strong>"+i.toFixed(0)+"%</strong>";$("#DPS.results").prepend('<div class="info">'+c+"</div><br>");var g=(t+a).toFixed(0),h=(t+a+a).toFixed(0),f=(t+a+a+a).toFixed(0),p=(t-a).toFixed(0),u=(t-a-a).toFixed(0),m=(t-a-a-a).toFixed(0),v="canvas_dps"+$("canvas").length;$("<canvas>").attr({id:v}).css({width:"400px",height:"200px"}).prependTo("#DPS.results");var y=document.getElementById(v),b=y.getContext("2d");console.log(b);for(var _={labels:[m,u,p,t.toFixed(0),g,h,f],xBegin:-3,xEnd:3,datasets:[{strokeColor:"rgba(220,220,220,1)",data:[],xPos:[]}]},w=a/t,x=0,k=800,F=0;F<k;F++)_.datasets[0].xPos[F]=_.xBegin+F*(_.xEnd-_.xBegin)/k,_.datasets[0].data[F]=1/(w*Math.sqrt(2*Math.PI))*Math.exp(-((_.datasets[0].xPos[F]-x)*(_.datasets[0].xPos[F]-x))/(2*w));var T={datasetFill:!1,pointDot:!1,animationLeftToRight:!0,animationEasing:"linear",yAxisMinimumInterval:.2,responsive:!0,responsiveMaxHeight:200,responsiveMaxWidth:400,showYLabels:!1};new Chart(b).Line(_,T)}report_entry("DPS","Damage Done",1,"Overall DPS","",!0,!1,""),write_table("DPS","DPS",4,["Name","DPS","Damage","Active Time"]);var t=average(dps_array),a=standardDeviation(dps_array),s=t+a,r=t-a,o=t+2*a,n=t-2*a,i=a/t*100,l=[],d=0,c=1e5;console.log("Standard Deviation: "+nFormatter(a)),console.log("Average Raid Damage: "+nFormatter(t)),console.log("Standard Deviation: "+nFormatter(a)),console.log("Co-efficient: "+i.toFixed(0)+"%");var g=players_array,h=l,f=!0,p=!1;sort_dps_array(g,h,f,p,d,c,e)}function a(){$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/deaths/"+l+"?start="+d+"&end="+c+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){console.log("deaths"),console.log(e),$.each(e.entries,function(e,t){var a=$.grep(players_array,function(e){return e.name==t.name});if(1==a.length){var s=t.damage.abilities.length-1;if(s==-1)var r="",o="";else var r=t.damage.abilities[s].name,o=t.damage.abilities[s].total;var n={deaths:{ability:r,damage:o,timestamp:t.timestamp}};$.extend(!0,a[0],n)}}),s()}})}function s(){function e(){$.each(pots_array,function(e,a){ability_count=$(pots_array).length,$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/buffs/"+l+"?start="+d+"&end="+c+"&abilityid="+pots_array[e]+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(e){$.each(e.auras,function(e,t){var a={consumables:{pots:{totalUses:t.totalUses}}},s=$.grep(players_array,function(e){return e.name==t.name});1==s.length&&$.extend(!0,s[0],a)}),t()}})})}function t(){}e(),setTimeout(function(){r()},1e3)}function r(){var e,t,a,s,r=!1,o=!1,i=!1,u=!1;if("1849"==n)e=[204483],t=204483,a="Focused Blast",s="Skorpyron faces a targeted direction, discharging arcane energy, inflicting 1,125,000 Arcane damage and <strong>stunning targets hit for 4 secs</strong>, increasing in duration for subsequent hits.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[204275],t=204275,a="Arcanoslash",s="Skorpyron Slashes all targets in a frontal 18 yard hemisphere, inflicting 581,900 Arcane damage. Tank-specialization players are afflicted by Arcane Tethers.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,!0,o,i,u);else if("1865"==n)e=[206612],t=206612,a="Burst Of Time",s="The caster hurls an orb of temporal energies that explodes when hitting the ground. The explosion inflicts 321,500 Arcane damage to all enemies within 6 yards of the target location.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[207228,228335],t=207228,a="Warp Nightwell",s="The caster warps the Nightwell, inflicting 35,000 Arcane damage to all players. Each cast of this spell increases the damage of caster's <strong>successive Warps by 5%.</strong>",interrupts(l,d,c,n,t,e,a,s);else if("1867"==n)e=[206488],t=206488,a="Arcane Seepage",s="Bile seeps from the construct as it is struck, creating arcane pools at random locations that inflict 250,500 Arcane damage every 1 sec.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,!0,i,u),e=[207631],t=207631,a="Annihilation",s="Enemies caught in Annihilation suffer 357,000 Arcane damage every 0.25 sec.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,!0,i,u);else if("1871"==n)e=[213281],t=213281,a="Pyroblast",s="Fiery Enchantments blast a random enemy for 2,812,500 Fire damage. This effect is <strong>interruptible.</strong>",interrupts(l,d,c,n,t,e,a,s);else if("1842"==n)e=[205391],t=205391,a="Fel Beam",s="Krosus emits a beam of fel energy from one of his hands inflicting 1,965,000 Fire damage to <strong>all enemies within the effect.</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[206352],t=206352,a="Felburst",s="Burning Embers fire a bolt of felfire at a random target that explodes upon impact inflicting 522,500 to 545,600 Fire damage to all enemies within 5 yards of the detonation.<br><strong>Stand in pools to stop Burning Embers spawning, and kill off any that spawn quickly.</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u);else if("1862"==n){var m='ability.id="213238" AND type="cast" OR ability.id="206480" AND type="applydebuff"',t=213238,a="Carrion Plague <small>(from Seeker Swarm)</small>",s="Tichondrius unleashes a wave of chaotic magic at all players afflicted with Carrion Plague. This effect inflicts 630,000 Shadow damage to all players in a line towards each target. <strong>In addition, this effect applies Carrion Plague to all players hit.</strong>";check_cast_debuffs(t,l,d,c,n,g,a,s,m,""),t="sightless_watcher",a="Sightless Watcher",s="";var v;$.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v),e=[216027],t=216027,a="Nether Zone",s="A chaotic void of Arcane magic that inflicts 393,000 Arcane damage every second to all players <strong>within the targeted area.</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,!0,i,u)}else if("1863"==n){t="thing_that_should_not_be",a="Thing That Should Not Be",s="";var v;$.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v),e=[207720],t=207720,a="Witness The Void",s="Shows the horror of the void to players, inflicting 396,000 to 461,000 Shadow damage to all players and <strong>fearing any players</strong> looking towards the caster for 8 sec.",check_debuffs(t,l,d,c,n,e,g,a,s),e=[206938],t=206938,a="Shatter",s="The affected player shatters, causing 1,068,987 Frost damage to them and any other players <strong>within 8 yards.</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,3,u)}else if("1886"==n)e=[218155],t=218155,a="Solar Collapse",s="High Botanist Tel'arn summons 12 points of solar energy around a player that collapse in towards them. As each point moves it explodes, inflicting 1,503,360 Fire damage to all players within 4 yards.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[218466,218470,218463],t=218463,a="Controlled Chaos",s="High Botanist Tel'arn unleashes several explosions in quick succession at a player's location. Each explosion inflicts 2,240,000 Arcane damage to all players within a <strong>10 yard</strong> radius and increases in size to a <strong>20 and 30 yard</strong> radius with each successive explosion. In addition, each explosion inflicts 460,992 Arcane damage to all players.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u);else if("1872"==n){t="recursive_elemental",a="Recursive Elemental",s="";var v;$.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v),t="expedient_elemental",a="Expedient Elemental",s="";var v;$.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v),e=[208659],t=208659,a="Arcanetic Ring",s="The caster summons an Arcanetic Ring that slowly collapses inwards, inflicting 1,070,000 Arcane damage to all in its path.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,!0,i,u),e=[209248],t=209248,a="Delphuric Beam",s="The caster periodically targets players and fires a burst of Arcane energy at them. Any players caught in the path of this Arcane energy suffer 714,500 Arcane damage.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[221864],t=221864,a="Blast",s="Inflicts 529,000 to 614,000 Arcane damage to the target. Each successful cast of Blast increases the damage of <strong>successive Blasts by 5%.</strong>",interrupts(l,d,c,n,t,e,a,s),e=[209568],t=209568,a="Exothermic Release",s="Inflicts 217,000 Arcane damage to all enemies. The caster deals <strong>10% more damage</strong> with this ability <strong>each time</strong> they use it.<br><i>Killing this add quickly will reduce raid-wide damage.</i>",interrupts(l,d,c,n,t,e,a,s),e=[209971],t=209971,a="Ablative Pulse",s="Inflicts 600,000 Arcane damage to the target. Each cast of Ablative Pulse <strong>increases the damage of further Ablative Pulses against the victim by 10%.</strong>",interrupts(l,d,c,n,t,e,a,s)}else if("1866"==n){t="vethriz",a="Inquisitor Vethriz",s="";var v;if($.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v),e=[217770],t=217770,a="Gaze of Vethriz",s="Summons in a Gaze of Vethriz at a targeted location which channels a beam of magic, inflicting 300,000 Shadow damage to any players struck by the beam.<br><strong>Killing Inquisitor Vethriz quickly will not spawn eyes</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[206515],t=206515,a="Fel Efflux",s="Pours out fel energy in a focused channel, inflicting 214,000 Fire damage every half-second to <strong>all targets within the energy.</strong>",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,!0,i,u),e=[212262],t=212262,a="Hand of Gul'dan",s="Calls down a demonic meteor, inflicting 1,430,000 Shadow damage to anyone <strong>within 10 yards</strong> of the meteors impact location and summons a powerful demon at that location.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[167819,152987,167935,177380],t=167819,a="Storm of the Destroyer",s="Calls upon the power of the Destroyer, sequentially inflicting 500,000 Shadow damage to enemies within <strong>10 yards</strong>, then 643,000 Shadow damage to enemies within <strong>20 yards</strong>, then 643,000 Shadow damage to enemies within <strong>30 yards</strong>, and finally 2,145,000 Shadow damage to enemies within <strong>60 yards</strong>.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,r,o,i,u),e=[227550],t=227550,a="Fel Scythe",s="Fel Scythe cleaves at targets for 1,070,000 Fire damage, divided amongst targets within <strong>2 yards</strong>, consuming all of Gul'dan's Fel Energy, increasing in damage by 5% for every point of Fel Energy consumed.<br><br>Gul'dan's keen eye allows him to cast Fel Scythe when <strong>any additional target stands within 2 yards of his primary target</strong> when attacking. Each successful cast of Fel Scythe grant's Gul'dan Fury of the Fel.",avoidable_damage(l,d,c,n,t,e,a,s,g,h,!0,o,i,u),4==f){e=[208672];var t=208672,a="Carrion Wave",s="The Dreadlord causes a wave of chaotic explosions to wash over enemies in front of them, inflicting 714,500 Shadow damage and putting targets to <strongsleep for 5 sec.</strong>";interrupts(l,d,c,n,t,e,a,s)}t="empowered_eye",a="Empowered Eye of Gul'dan",s="";var v;$.each(enemies,function(e,t){t.name==a&&(v=t.id)}),add_prio(l,d,c,n,t,a,s,g,h,r,v)}var a="Potion Use",t="pots",s="Glug glug glug!";check_buffs(t,l,d,c,n,pots_array,g,a,s),p.stop()}players_array=[],$(".chosen_report").hide(),$(".process_fight").removeClass("active"),$(this).addClass("active");var o=$(this).attr("data-time"),n=$(this).attr("data-boss"),i=$(this).attr("data-boss_name"),l=$(this).attr("data-report"),d=$(this).attr("data-start"),c=$(this).attr("data-end"),g=$(this).attr("data-size"),h=0,f=$(this).attr("data-diff");fight_len=c-d;var p=Ladda.create(this);p.start(),$(".chosen_report").html("<h2>"+i+" <small> ("+o+")</small></h2>"),$.ajax({url:"https://www.warcraftlogs.com:443/v1/report/tables/damage-taken/"+l+"?start="+d+"&end="+c+"&api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:function(t){console.log("damage-taken"),console.log(t),$.each(t.entries,function(e,t){"NPC"!=t.icon&&(h+=t.total,players_array.push({name:t.name,id:t.id,itemLevel:t.itemLevel,icon:t.icon,damage_taken:{total:t.total,totalReduced:t.totalReduced,activeTime:t.activetime,activeTimeReduced:t.activeTimeReduced}}))}),e()}})}),$.ajax({url:"https://www.warcraftlogs.com:443/v1/reports/guild/Big%20Game%20Hunters/Alonsus/EU?api_key=d03b91a36aeb8df46cb6b22e705ee917",type:"GET",success:latest_reports}),$("body").on("click",".boss",function(){var e=$(this).attr("id");$(".boss").removeClass("active"),$(this).addClass("active"),$(".row.fight").each(function(){$(this).attr("id")==e?($(this).find(".wipes").show(),$(this).fadeIn(200)):$(this).hide()})}),$("body").on("click",".view_all",function(){$(".row.fight").fadeIn(300),$(".row.fight").find(".wipes").hide()}),$("body").on("click",".view_details",function(){var e=$(this).attr("data-ability");$("#"+e+".player_results").stop().fadeToggle(500),$(this).attr("data-toggled")&&"off"!=$(this).attr("data-toggled")?"on"==$(this).attr("data-toggled")&&($(this).attr("data-toggled","off"),$(this).text("Show details")):($(this).attr("data-toggled","on"),$(this).text("Hide details"))}),$("body").on("click",".load_report",function(){var e=$(this).attr("data-id");$("#reportid").val(e),$("#fetch").click()});var e=window.location.hash;if(0!=e.length){var t=e.replace(/#/gi,"");$("input#reportid").val(t),$("#fetch").click()}});