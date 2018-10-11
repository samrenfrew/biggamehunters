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

function fight_length( s ) {
      var fm = [
            Math.floor(s/60)%60,
            s%60
      ];
      return $.map(fm,function(v,i) { return ( (v < 10) ? '0' : '' ) + v; }).join( ':' );
}

function nFormatter(num, size) {
     if (size == 'M') {
        return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
     }
     if (size == 'K') {
        return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
     } else {
        return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
     }
     return num;
}

function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

var enemies;
var players_array = [];
var death_array = [];
var tanks_array = ['Druid-Guardian','Paladin-Protection', 'Monk-Brewmaster', 'Warrior-Protection','DeathKnight-Blood','DemonHunter-Vengeance'];
var heals_array = ['Druid-Restoration','Shaman-Restoration','Monk-Mistweaver','Priest-Holy','Paladin-Holy','Priest-Discipline'];
var pots_array = [188028,229206,188027,188017];
var flasks_array = [188033,188031,188034,188035];
var food_array = [225602,225603,225604,225605];
var fight_len;
var dps_array=[];
var dps_name_array=[]

//Fetch Recent Log Data
var reports;

var saved_reports;
if(localStorage.getItem('reportsArray') != null){
    saved_reports = JSON.parse(localStorage.getItem('reportsArray'));
    // console.log(saved_reports)
}

function latest_reports(data){
    console.log(data)
    reports = data.reverse();

    $.each(reports, function(i, v){
        if(v.zone == '11'){
        var btn_text = '<button class="btn btn-primary load_report" data-toggle="modal" data-target="#latest_reports" data-id="' + v.id + '">Load report</button>';

        var r_start = timeConverter(v.start);
        $('.modal-body').append('<div class="row"><div class="col-xs-12 col-sm-9 report" id="' + v.id + '"><h4>' + v.title + '</h4><p class="report_info">' + r_start + ' -  uploaded by ' + v.owner + '</p></div><div class="col-xs-12 col-sm-3">' + btn_text + '</div></div>')
        }
    })
}

function load_fights(data){
    console.log(data.fights)
    $.each(data.fights, function(i, v){
        console.log(v.name)
    })
}

// fetch report
function fetch_report(data){
    console.log('fetching report')
    enemies = data.enemies;
    var report_id = $('#reportid').val();
    $('.report_select').html('');
    var date = timeConverter(data.start);
    $('.report_select').prepend('<h2>' + data.title + '<small> &ndash; ' + date + '</small></h2><p class="full_report text-muted">View the full report: <a href="https://www.warcraftlogs.com/reports/' + report_id + '">www.warcraftlogs.com/reports/' + report_id + '</a></p>');
    $('.report_select').append('<div class="col-xs-12 col-md-6 col-lg-4 list_bosses"><table class="report table"><caption>Select the boss below to view the fights</caption><tbody><tr class="boss view_all active"><td>View All Kills</td></tr></tbody></table></div><div class="col-xs-12 col-md-6 col-lg-8 list_fights"></div>')
    console.log(data);

    var total_kills = 0;
    $.each(data.fights, function(i, v){
        if(v.boss != 0){
        if(v.kill == true){total_kills = total_kills+1}
        if(v.difficulty == 3){ var diff = "(N)"} else if(v.difficulty == 4){ diff = "(H)"} else if(v.difficulty == 5){ diff = "(M)"}
        if($('tr#' + v.boss).length != 1){
            $('table.report tbody').append('<tr class="boss" id="' + v.boss + '"><td>' + diff + ' ' + v.name + '</td>')
            $('.list_fights').append('<div class="row fight" id="' + v.boss + '" style="display:block;"><div class="wipes" style="display:none;"></div><div class="kills"></div></div>')
        }
        if(i == $(data.fights).length-1){
            $('.view_all td').append(' (' + total_kills + ')')
        }
    }
    });

    $.each(data.fights, function(i, v){
        if(v.boss != 0){

        if(1==v.kill)var kill="Kill",progress_class="";else kill="Wipe", progress_class="progress-bar-danger";
        var percentage = 100 - (v.bossPercentage / 100);
        percentage = percentage.toFixed(2)
        if(percentage == 100){
            var progress_class = 'progress-bar-success';
        } else if (percentage < 100 && percentage >= 80){
            var progress_class = ''
        } else if (percentage < 80 && percentage >= 50){
            var progress_class = 'progress-bar-warning'
        } else if (percentage < 50){
            var progress_class = 'progress-bar-danger'
        }
        var total_time = ((v.end_time - v.start_time) / 60000) * 60;
        var time = fight_length(total_time).match(/\d{2}:\d{2}/gi)[0];
        var insertData = '<div class="col-xs-9">' + v.name + '<small> &ndash; ' + time + ' / ' + percentage + '%</small><div class="progress"><div class="progress-bar ' + progress_class + '" role="progressbar" aria-valuenow="' + percentage + '" aria-valuemin="0" ariavaluemax="100" style="width: ' + percentage + '%;"></div></div></div><div class="col-xs-3 text-center"><button class="btn btn-primary process_fight ladda-button" data-style="zoom-out" data-boss="' + v.boss + '" data-boss_name="' + v.name + '" data-time="' + time + '" data-report="' + report_id + '" data-start="' + v.start_time + '" data-end="' + v.end_time + '" data-size="' + v.size + '" data-diff="' + v.difficulty + '">View fight</button></div>'
        if(1==v.kill){
         $('.row#' + v.boss + ' div.kills').append(insertData)
        } else {
            $('.row#' + v.boss + ' div.wipes').append(insertData)
        }
    }
    });
    $('.report_select').fadeIn(300);
}

// function to create the entry
function report_entry(id, type, col, name, desc, table, pbar, pdetail){
    console.log('report entry')
    //size
    if(col==3){
        var cols="col-xs-12 col-md-4 result triple"
    } else if(col==2){
        cols="col-xs-12 col-md-6 result double"
    } else if(col==1){
        cols="col-xs-12 result single"
    }

    //vars
    var open='<div class="' + cols + '"><h4>' + type + ' &ndash; ' + name + '</h4><p>' + desc + '</p><div class="results text-center" id="' + id + '">';
    var progress='<h5>' + pdetail + '</h5><div class="progress" id="' + id + '"><div class="progress-bar" role="progressbar" aria-valuenow=""aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div></div>';
    var pinfo='<p class="info"></p>';
    var btn='<button class="btn btn-default view_details" data-ability="' + id + '" data-toggled="off">Show details</button>';
    var tab='<div class="player_results" id="' + id + '" style="display:none;"></div>';
    var inter='<table class="table interrupts"><tr><td class="casts_missed text-right">0</td><td class="casts info">casts were missed. Good job!</td></tr></table>'
    var close='</div>';

    //write
    var info = open;
    if (type == 'Interrupts'){
       info = info + inter + close + close;
    } else {
        if(pbar==true){info = info + progress + pinfo};
        if(table == true){info = info + btn};
        info = info + close;
        if(table == true){info = info + tab};
        info = info + close;
    }
    // console.log(info)
    $('.chosen_report').append(info);
}

// function to write the table
function write_table(id, name, columns, headers){
    console.log('writing table')
    var loc = $('#' + id + '.results').next('.player_results');

    //vars
    var open = '<table id="' + id + '" class="table" data-ability="' + name + '"><thead>'
    var head = '';
    $.each(headers, function(i,v){
        if(i==0){
            head = head + '<th>' + v + '</th>';
        } else {
            head = head + '<th class="text-center">' + v + '</th>';
        }
    });
    var body = '<tbody></tbody>';
    var close = '<tfoot><tr class="active"></tr></tfoot></table>'

    info = open + head + body + close;

    // console.log(info)

    $('#' + id + '.results').next('.player_results').append(info);

}

// function to request API data
function data_request(report, start, end, type, id, ability, metrics, options, hostility, table, tank, data_complete){
    console.log('data_request start')

    //vars
    if(options != false){ var opt = '&options=' + options; } else { opt = ''; }
    if(hostility != false){ var host = '&hostility=' + hostility } else { host='' }
    var data_len = 0;
    var data_count = 0;
    var ab_len = $(ability).length
    var array=[];

    //cycle
    $.each(ability, function(a, b){
         $.ajax({
            url: "https://www.warcraftlogs.com:443/v1/report/tables/" + type + "/" + report + "?start=" + start + "&end=" + end + "&abilityid=" + ability[a] + opt + host + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
            type: 'GET',
            success: function(data){
                if (type=='buffs' || type=='debuffs'){ cycle = data.auras  } else { cycle = data.entries }
                data_len = data_len + $(cycle).length;

                console.log('ajax success start - ' + ability[a])
                // console.log('total data is: ' + data_len)
                // console.log('total count is: ' + data_count)

                function callback(count, array){
                    data_count = data_count + count;
                    // console.log('callback complete - count is now: ' + data_count)
                    if(data_count == data_len){
                        // console.log('hooray the count is finished')
                        if(a == ab_len-1){
                            console.log('hooray its the last one do some shit')
                            console.log(array)
                            if(table==true){
                                fill_table(id, array)
                            }
                            data_complete(array)
                        }
                    }
                }

                data_array(data, type, metrics, callback, array, tank);
                console.log('ajax success complete')
            }
        })
    })
    console.log('data_request complete')
}

// function to request API events
function event_request(report, start, end, type, id, query, time, table, data_complete){
    console.log('data_request start')

    //vars
    var data_len = 0;
    var data_count = 0;
    var array=[];

    //cycle
     $.ajax({
        url: "https://www.warcraftlogs.com:443/v1/report/events/" + report + "?start=" + start + "&end=" + end + "&filter=" + query + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
        type: 'GET',
        success: function(data){
            // if (type=='buffs' || type=='debuffs'){ cycle = data.auras  } else { cycle = data.entries }
            // data_len = data_len + $(cycle).length;

            console.log('ajax success start - event' )
            console.log(data)
            var x_array = []
            var y_array =[]
            var array=[]

            console.log('first pass')
            $.each(data.events, function(i,v){
                if(v.type == 'cast'){
                    x_array.push(v.timestamp)
                } else if (v.type == 'applydebuff'){
                    y_array.push({
                        'id': v.targetID,
                        'timestamp': v.timestamp
                    })
                }
            })
            // console.log(x_array)
            // console.log(y_array)
            $.each(y_array, function(i,v){
                var time = v.timestamp
                $.grep(x_array, function(e){
                    var new_time=e + 100
                    if(time >= e && time < new_time){
                        console.log('player hit:' + v.id)
                        var search_data = $.grep(array, function(c){ return c.id == v.id; });
                        if (search_data.length == 0) {
                            console.log('not in array')
                            array.push({
                                'id': v.id,
                                'hitCount': 1,
                                'name': ''
                            })
                        } else {
                            console.log('in array')
                            var update = search_data[0].hitCount + 1;
                            search_data[0].hitCount = update;
                        }
                    }
                });
            })

            $.each(array, function(i,v){
                var search = $.grep(players_array, function(e){ return e.id == v.id; });
                if (search.length == 1) {
                    v.name = search[0].name
                }
            })
            console.log(array)

            if(table==true){
                fill_table(id, array)
            }
            data_complete(array)

            console.log('ajax success complete')
        }
    })
    console.log('data_request complete')
}

// function to parse data and write to array
function data_array(data, type, metrics, callback, array, tank){

    console.log('data_array started')
    console.log(data)
    var count = 0;
    if (type=='buffs' || type=='debuffs'){ cycle = data.auras  } else if (type=='cast_debuff'){ cycle = data.events } else { cycle = data.entries }
    $.each(cycle, function(a, b){
        count = count + 1;
        // console.log('count is now: ' + count)

        var search_data = $.grep(array, function(e){ return e.name == b.name; });
        if (search_data.length == 0) {
            //is not in array
            // console.log('not in array, adding')

            if(tank==true){
                if($.inArray(b.icon, tanks_array) != -1){
                    // console.log('skip tank')
                } else {
                    continue_data()
                }
            } else {
                continue_data()
            }

            function continue_data(){
                var temp = new Object();
                var skip = false;
                $.each(metrics, function(i, v){
                    if(b[v] != 0){
                        temp[v] = b[v];
                    } else {
                        skip = true;
                    }
                })
                // console.log(temp)
                if(0==skip){
                    array.push(temp)
                }
            }


        } else if (search_data.length == 1) {
            // is already in array
            // console.log('already in array, updating')
            var obj = search_data[0];
            console.log(obj)
            $.each(metrics, function(i, v){
                if(v == 'name' || v == 'id'){
                } else {
                    var update = obj[v] + b[v]
                    obj[v] = update;
                }
            })
            console.log(obj)

        }

    })
    if(callback) callback(count, array);
    console.log('data_array complete')

}

// function to fill in table
function fill_table(id, array){
    console.log('fill_table started - ' + id)

    //vars
    var loc = $('#' + id + '.table');
    var columns = loc.find('th').length;

    //fill table
    $.each(array, function(i, v){

        var highlight;

        // Add <tr>
        loc.find('tbody').append('<tr id="' + v.id + '"></tr>');

        // Cycle headers and match to data
       loc.find('th').each(function(a, b){
            var insert;
            var center = true;
            var th = $(this).html();
            var rating = '';

            if(th == 'Name'){
                insert = v.name;
                center = false;
            } else if (th == 'DPS'){
                insert = v.dps + 'K'
                if(v.rating >= 5){ highlight="success" }
                else if(v.rating >= 4 && v.rating < 5){ highlight="info" }
                else if(v.rating >= 3 && v.rating < 4){ highlight="warning" }
                else { highlight="danger" }
            } else if(th == 'Hits'){
                if(v.hitCount){
                    insert = v.hitCount
                } else if (v.tickCount){
                    insert = v.tickCount
                } else if (v.totalUses){
                    insert = v.totalUses;
                }
                if(insert >= 4){ highlight="danger" } else if(insert >= 2 && insert < 4){ highlight="warning" } else { highlight="success" }
            } else if(th == 'Damage'){
                insert = nFormatter(v.total, 'M');
            } else if(th == 'Uses'){
                insert = v.totalUses;
                if(insert == 0){ highlight="danger" } else if(insert == 1){ highlight="warning" } else { highlight="success" }
            } else if(th == 'Active Time'){
                insert = v.activeTime
                if(v.rating == 6){ rating=" winner" }
                if(v.rating == 1){ rating=" loser" }
            }
            if(center==true){ var align = 'text-center'} else {align = ''}

            // Add <td>
            loc.find('tr#' + v.id).append('<td class="' + align  + rating + '">' + insert + '</td>')

        })

        // Colour matching
        loc.find('tr#' + v.id).addClass(highlight)

        // Death match
        var ability = $('#' + id + '.table').attr('data-ability');
        var has_death = '';
        var search_deaths = $.grep(players_array, function(e){ return e.name == v.name });
        if (search_deaths.length == 1) {
            if(search_deaths[0].deaths){
                if(search_deaths[0].deaths.ability == ability){
                        has_death = ' death';
                    } else {
                        has_death = '';
                    }
                }
            }
        loc.find('tr#' + v.id + ' td:last-of-type').addClass(has_death)

    })

    //order the table
    var order = [[ 1 , 'desc']];
    if (columns == 3){
        order = [[ 1 , 'desc' ],[ 2 , 'desc' ]]
    } else if (columns == 4){
        order = [[ 1 , 'desc'],[ 2 , 'desc' ]];
    }
    $('#' + id + '.table').DataTable( {
        "paging":   false,
        "info":     false,
        "searching": false,
        "order": order // order
    } );

    console.log('fill_table complete')
}

// function to fill in the progress bar
function progress_bar(id, sub, max, order, lim1, lim2, info){
    console.log('progress_bar start')
    var highlight;
    total_percentage = (sub / max) * 100
    total_percentage = total_percentage.toFixed(0)
    console.log(total_percentage)

    // if order asc or desc then set limits
    if(order == 'asc'){
        if(total_percentage >= lim1){
            highlight="success"
        } else if (total_percentage >= lim2 && total_percentage < lim1){
            highlight="warning"
        } else {
            highlight="danger"
        }
    } else if(order=='desc'){
        if(total_percentage <= lim1){
            highlight="success"
        } else if (total_percentage <= lim2 && total_percentage > lim1){
            highlight="warning"
        } else {
            highlight="danger"
        }
    }

    // write bar
    $('#' + id + '.progress').find('.progress-bar').addClass('progress-bar-' + highlight);
    $('#' + id + '.progress').find('.progress-bar').attr('aria-valuenow', total_percentage);
    $('#' + id + '.progress').find('.progress-bar').html(total_percentage + '%');
    $('#' + id + '.progress').find('.progress-bar').animate({'width': total_percentage + '%'}, 50)
    $('#' + id + '.results').find('.info').html(info);
}

function sort_dps_array(old_array, new_array, is_players, active, top_dps, btm_dps, callback){
    $.each(old_array, function(i, v){

            if($.inArray(v.icon, heals_array) != -1){
            } else if($.inArray(v.icon, tanks_array) != -1){
            } else {

                var name = v.name
                var id = v.id

                if(is_players==true){ v = v.damage_done }

                var active_time = v.activeTime
                var active_perc = ((active_time / fight_len) * 100).toFixed(2) + '%'
                var dmg = v.total
                if(active==true){
                    var dps = dmg / active_time
                } else {
                    dps = dmg / fight_len
                }

                if(dps > top_dps){
                    top_dps = dps
                }
                if(dps < btm_dps){
                    btm_dps = dps
                }

                new_array.push({
                    'name' : name,
                    'id' : id,
                    'dps' : dps.toFixed(0),
                    'total' : dmg,
                    'activeTime' : active_perc,
                    'rating' : ''
                })
            }
        })
        callback(new_array, top_dps, btm_dps);
}
////////////////////////// BEGIN FIGHT FUNCTIONS /////////////////////////

// function to check add priority
function add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target){

    // build entry
    report_entry(id, 'Damage Done', 2, name, desc, true, false, '')

    write_table(id, name, 4, ['Name','DPS','Damage','Active Time']);

    var metrics = ['name','id','icon', 'total','activeTime']
    var type = 'damage-done';

    var data_len = 0;
    var data_count = 0;
    var array=[];

    //cycle
     $.ajax({
        url: "https://www.warcraftlogs.com:443/v1/report/tables/" + type + "/" + report + "?start=" + start + "&end=" + end + "&targetid=" + target + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
        type: 'GET',
        success: function(data){
            cycle = data.entries
            data_len = data_len + $(cycle).length;

            console.log('ajax success start - target: ' + target)

            function callback(count, array){
                data_count = data_count + count;
                // console.log('callback complete - count is now: ' + data_count)
                if(data_count == data_len){
                // console.log('hooray the count is finished')
                    console.log('hooray its the last one do some shit')
                    console.log(array)
                    data_complete(array)
                }
            }

            data_array(data, type, metrics, callback, array, tank);
            console.log('ajax success complete')
        }
    })
    console.log('data_request complete')

    function data_complete(array){
        console.log(array)

        var old_array = array
        var new_array=[]
        var is_players = false;
        var active = true;
        var top_dps = 0;
        var btm_dps = 100000;
        sort_dps_array(old_array, new_array, is_players, active, top_dps, btm_dps, sort_complete)

        function sort_complete(new_array, top_dps, btm_dps){
            var dps_array=[];
            var dmg_array=[];
            var active_array=[]
            console.log(new_array)

            $.each(new_array, function(i,v){
                dps_array.push(Number(v.dps));
                dmg_array.push(v.total);
                active_array.push(v.activeTime);
            })
            console.log(dps_array)
            var avg = average(dps_array);
            console.log(avg)
            var std = standardDeviation(dps_array);
            var plus1 = avg + std;
            var neg1 = avg - std;
            var plus2 = avg + (std * 2);
            var neg2 = avg - (std * 2);
            var dist = (std / avg) * 100
            var total_damage = 0;

            $.each(new_array, function(i,v){
                var dps = v.dps
                total_damage = total_damage + v.total
                if(dps > plus2){ v.rating = 6
                } else if (dps >= plus1 && dps < plus2){ v.rating = 5
                } else if (dps >= avg && dps < plus1){ v.rating = 4
                } else if (dps >= neg1 && dps < avg){ v.rating = 3
                } else if (dps >= neg2 && dps < neg1){ v.rating = 2
                } else if (dps < neg2){ v.rating = 1
                }
            })

            fill_table(id, new_array)
            if($(new_array).length == 0){
            var info = 'This add did not spawn';
            $('#' + id + '.results').find('.view_details').hide();
            } else {
            var info = 'This add took a total of <strong>' + nFormatter(total_damage) + '</strong> damage from <strong>' + $(dps_array).length + '</strong> players<br>The average active DPS was <strong>' + avg.toFixed(0) + 'K</strong> with a high of <strong>' + top_dps.toFixed(0) + 'K</strong> and a low of <strong>' + btm_dps.toFixed(0) + 'K</strong>'
            }

            $('#' + id + '.results').prepend('<div class="info">' + info + '</div><br>')
        }

    }

    loadFinished();

}

// function to check avoidable damage, either hit or dot
function avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, options, hostility, cb){

    // build entry
    report_entry(id, 'Avoidable Damage', 2, name, desc, true, true, 'Players Hit - lower is better')

    write_table(id, name, 3, ['Name','Hits','Damage']);

    if(dot==true){
        var metrics = ['name','id','tickCount','total']
    } else {
        metrics = ['name','id','hitCount','total']
    }
    var type = 'damage-taken';
    var table = true;

    data_request(report, start, end, type, id, ability, metrics, options, hostility, table, tank, data_complete)

    function data_complete(array){
        // get totals
        var players_hit = $(array).length

        var total_hits = 0;
        var total_dmg = 0;
        var total_deaths = 0;

        $.each(array, function(i, v){
            if(v.hitCount){total_hits = total_hits + v.hitCount}else if (v.tickCount){total_hits = total_hits + v.tickCount}
            total_dmg = total_dmg + v.total
            var search_deaths = $.grep(players_array, function(e){ return e.name == v.name });
            if (search_deaths.length == 1) {
                if(search_deaths[0].deaths){
                    if(search_deaths[0].deaths.ability == name){
                        total_deaths = total_deaths + 1
                    }
                }
            }
        })

        console.log(total_deaths)
        // death note
        var death_note='';
        if(total_deaths>0){
            if(total_deaths==1){var plural='player'}else{plural='players'}
            death_note = '<span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <strong>' + total_deaths + '</strong> ' + plural + ' died to this';
        }

        // non-tank
        if(tank == true){
            var has_tank = 'non-tank '
            $.each(players_array, function(i, v){
                if($.inArray(v.icon, tanks_array) != -1){
                    size = size - 1
                }
            })
        } else {
            has_tank = '';
        }

        // set info
        if(players_hit==0){
            var info ='<strong>0/' + size + '</strong> ' + has_tank + ' players were hit &ndash; good job!'
            $('#' + id + '.results button').hide();
        } else {
        if(players_hit==1){var plural='player'}else{plural='players'}
            info='<strong>' + players_hit + '/' + size + '</strong> ' + has_tank + plural + ' were hit a total of <strong>' + total_hits + '</strong> times for <strong>' + nFormatter(total_dmg) + '</strong> damage<br>' + death_note
        }

        progress_bar(id, players_hit, size, 'desc', 50, 25, info);

        $('#' + id + '.table tfoot tr').append('<td>TOTAL</td><td class="text-center">' + total_hits + '</td><td class="text-center">' + nFormatter(total_dmg) + '</td></tr>')
    }

    loadFinished();

}

// function to check whether interrupts were missed - currently only supports showing casts missed + damage taken
function interrupts(report, start, end, boss, id, ability, name, desc, adds){

    //set vars
    var total_damage = 0;
    var missed_casts = 0;
    var ability_count;
    var metrics = ['total']
    var table = false;
    var tank = false;
    var options = false;
    var hostility = false;
    var pbar = false;
    var pdetail = '';

    report_entry(id, 'Interrupts', 2, name, desc, table, pbar, pdetail)

     // get damage
     data_request(report, start, end, 'damage-taken', id, ability, metrics, options, hostility, table, tank, dmg_complete)

     function dmg_complete(array){
        $.each(array, function(i, v){
            total_damage = total_damage + v.total
        })
        interrupts_complete()
     }

     // get casts
     data_request(report, start, end, 'casts', id, ability, metrics, options, 1, table, tank, casts_complete)

     function casts_complete(array){

        console.log('total damage = ' + total_damage)
        $.each(array, function(i, v){
            missed_casts = missed_casts + v.total
        })
        $('#' + id + '.results').find('.casts_missed').html(missed_casts);
        interrupts_complete()
     }

     function interrupts_complete(){
        if(missed_casts == 0){
             $('#' + id + '.results').find('.info').html('casts were missed &ndash; good job!');
         } else {
            $('#' + id + '.results').find('.info').html('casts were missed leading to <strong>' + nFormatter(total_damage) + '</strong> additional damage');
        }
        loadFinished();
     }

}

// check if buff exists
function check_buffs(id, report, start, end, boss, ability, size, name, desc){

    // console.log('checking ' + id);

    //set vars
    var headers = ['Name','Uses']
    var pdetail = 'Potions Used - higher is better'
    var table = true;
    var pbar = true;

    report_entry(id, 'Consumables', 2, name, desc, table, pbar, pdetail)
    write_table(id, name, 2, headers)

    var metrics = ['name','id','totalUses']
    var options = false;
    var hostility = false;
    var table = true;
    var tank = false;

    data_request(report, start, end, 'buffs', id, ability, metrics, options, hostility, table, tank, buffs_complete)

    function buffs_complete(data){
        console.log('get buff')
        var max = size
        var sub = 0;
        var pot_0 = 0;
        var loc =  $('#' + id + '.table');

        $.each(data, function(i, v){
            if(v.totalUses == 2){
                sub = sub + 1
            }
        })

        $.each(players_array, function(i,v){
            var search_data = $.grep(data, function(e){ return e.name == v.name; });
            if (search_data.length == 0) {
                $('#' + id + '.table tbody').append('<tr id="' + v.id + '" class="danger"><td>' + v.name + '</td><td class="text-center">0</td>')
                 pot_0 = pot_0 + 1;
            }
        })

        if(pot_0 > 0){
            var no_pot = pot_0 + ' players used no pots at all';
        } else {
            no_pot = '';
        }

        var info = '<strong>' + sub + '/' + size + '</strong> players used <strong>2</strong> pots during this fight<br><strong>' + no_pot + '</strong>'

        progress_bar(id, sub, max, 'asc', 60, 40, info)

        $('#' + id + '.table tfoot tr').append('<td></td><td></td>')

    }
    loadFinished();
}


// check debuffs exist
function check_debuffs(id, report, start, end, boss, ability, size, name, desc){

    // console.log('checking ' + id);

    //set vars
    var headers = ['Name','Hits']
    var pdetail = 'Players hit - lower is better'
    var table = true;
    var pbar = true;

    report_entry(id, 'Debuffs', 2, name, desc, table, pbar, pdetail)
    write_table(id, name, 2, headers)

    var metrics = ['name','id','totalUses']
    var options = false;
    var hostility = false;
    var table = true;
    var tank = false;

    data_request(report, start, end, 'debuffs', id, ability, metrics, options, hostility, table, tank, debuffs_complete)

    function debuffs_complete(data){
        console.log('get debuff')
        var max = size
        var sub = 0;
        var tot = 0;
        var loc =  $('#' + id + '.table');
        var total_deaths = 0;

        $.each(data, function(i, v){
            tot = tot + v.totalUses;
            sub = sub + 1;
        })

        var death_note='';
        if(total_deaths>0){
            if(total_deaths==1){var plural='player'}else{plural='players'}
            death_note = '<span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <strong>' + total_deaths + '</strong> ' + plural + ' died to this';
        }

        if(sub==0){
            var info = '<strong>Nobody was hit by this ability - good job!</strong><br>';
            $('#' + id + '.results button').hide();
        } else {
            info = '<strong>' + sub + '/' + size + '</strong> players were hit a total of <strong>' + tot + '</strong> times during this fight<br>' + death_note
        }

        progress_bar(id, sub, max, 'desc', 50, 25, info)

    }
    loadFinished();
}

// check casts debuffs exist
function check_cast_debuffs(id, report, start, end, boss, size, name, desc, query, time){

    // console.log('checking ' + id);

    //set vars
    var headers = ['Name','Hits']
    var pdetail = 'Players hit - lower is better'
    var table = true;
    var pbar = true;

    report_entry(id, 'Debuffs', 2, name, desc, table, pbar, pdetail)
    write_table(id, name, 2, headers)

    var metrics = ['name','id','totalUses']
    var table = true;
    var tank = false;

    event_request(report, start, end, 'cast_debuff', id, query, time, true, data_complete)

    function data_complete(data){
        console.log('EVENT CHECK COMPLETE')
        console.log(data)
        var max = size
        var sub = 0;
        var tot = 0;
        var loc =  $('#' + id + '.table');

        $.each(data, function(i, v){
            tot = tot + v.hitCount;
            sub = sub + 1;
        })

        if(sub==0){
            var info = '<strong>Nobody was hit by this ability - good job!</strong><br>';
            $('#' + id + '.results button').hide();
        } else {
            info = '<strong>' + sub + '/' + size + '</strong> players were hit <strong>' + tot + '</strong> times during this fight<br>'
        }

        progress_bar(id, sub, max, 'desc', 50, 25, info)

    }
    loadFinished();
}


function loadFinished(){
    $('.spinner').hide()
    $('html,body').animate({scrollTop: $('.chosen_report').offset().top},'fast');
    $('.chosen_report').fadeIn(500);
    //$.getScript('https://wow.zamimg.com/widgets/power.js');
     // wowhead_tooltips = { "colorlinks": true, "iconizelinks": true, "renamelinks": false }
}


//////////// BUTTON BINDINGS ///////////////
$(function() {


$('#fetch').click(function(){
    var report = $('#reportid').val();
    if (history.pushState) {
        history.pushState({}, null, 'https://biggamehunters.net/logs#' + report);
    }
    var l = Ladda.create(this);
    l.start();
    $.ajax({
        url: "https://www.warcraftlogs.com:443/v1/report/fights/" + report + "?api_key=d03b91a36aeb8df46cb6b22e705ee917",
        type: 'GET',
        success: fetch_report,
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

$('body').on('click', '.process_fight', function(){
    players_array = [];
    $('.chosen_report').hide();
    $('.process_fight').removeClass('active')
    $(this).addClass('active');
    var time = $(this).attr('data-time');
    var boss = $(this).attr('data-boss');
    var boss_name = $(this).attr('data-boss_name');
    var report = $(this).attr('data-report');
    var start = $(this).attr('data-start');
    var end = $(this).attr('data-end');
    var size = $(this).attr('data-size');
    var dmg = 0;
    var diff = $(this).attr('data-diff');
    fight_len = end - start;
    var l = Ladda.create(this);
    l.start();

    $('.chosen_report').html('<h2>' + boss_name + ' <small> (' + time + ')</small></h2>');

    $.ajax({
        url: "https://www.warcraftlogs.com:443/v1/report/tables/damage-taken/" + report + "?start=" + start + "&end=" + end + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
        type: 'GET',
        success: function(data){
            console.log('damage-taken')
            console.log(data)
            $.each(data.entries, function(i, v){
                if(v.icon!='NPC'){
                dmg = dmg + v.total
                players_array.push({
                    'name': v.name,
                    'id': v.id,
                    'itemLevel':v.itemLevel,
                    'icon':v.icon,
                    'damage_taken':{
                        'total': v.total,
                        'totalReduced':v.totalReduced,
                        'activeTime':v.activetime,
                        'activeTimeReduced':v.activeTimeReduced,
                    }
                });
                }
            })
            get_dps();
        }
    })

    // Get DPS
    function get_dps(){
        dps_array=[];
        dps_name_array=[]
        $.ajax({
            url: "https://www.warcraftlogs.com:443/v1/report/tables/damage-done/" + report + "?start=" + start + "&end=" + end + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
            type: 'GET',
            success: function(data){
                console.log('damage-done')
                console.log(data)
                $.each(data.entries, function(i, v){
                    if($.inArray(v.icon, heals_array) != -1){
                    } else if($.inArray(v.icon, tanks_array) != -1){
                    } else {
                        var active = v.activeTime;
                        var active_len = fight_len * 0.01;
                        var dps = v.total / fight_len;
                        if(active > active_len){
                            dps_array.push(dps)
                            dps_name_array.push(v.name)
                        }
                    }
                    var search_data = $.grep(players_array, function(e){ return e.name == v.name; });
                    if (search_data.length == 1) {
                        var dps = {
                            'damage_done':{
                                'total':v.total,
                                'activeTime':v.activeTime
                            }
                        }
                        $.extend( true, search_data[0], dps );
                    }
                })
                get_deaths();
                check_average_dps();

            }
        })
    }

    function check_average_dps(){
        report_entry('DPS', 'Damage Done', 1, 'Overall DPS', '', true, false, '');
        write_table('DPS', 'DPS', 4, ['Name','DPS', 'Damage', 'Active Time']);

        //vars
        var avg = average(dps_array);
        var std = standardDeviation(dps_array);
        var plus1 = avg + std;
        var neg1 = avg - std;
        var plus2 = avg + (std * 2);
        var neg2 = avg - (std * 2);
        var dist = (std / avg) * 100
        var array=[];
        var new_dps_array=[]
        var total6 = 0;
        var total1 = 0;
        var top_dps = 0;
        var btm_dps = 100000;

        console.log('Standard Deviation: ' + nFormatter(std));
        console.log('Average Raid Damage: ' + nFormatter(avg));
        console.log('Standard Deviation: ' + nFormatter(std));
        console.log('Co-efficient: ' + dist.toFixed(0) + '%');


        //cycle
        var old_array = players_array
        var new_array= array
        var is_players = true;
        var active = false;
        sort_dps_array(old_array, new_array, is_players, active, top_dps, btm_dps, sort_complete)

        function sort_complete(array, top_dps, btm_dps){

            $.each(array, function(i,v){
                var dps = v.dps
                if(dps > plus2){ v.rating = 6
                } else if (dps >= plus1 && dps < plus2){ v.rating = 5
                } else if (dps >= avg && dps < plus1){ v.rating = 4
                } else if (dps >= neg1 && dps < avg){ v.rating = 3
                } else if (dps >= neg2 && dps < neg1){ v.rating = 2
                } else if (dps < neg2){ v.rating = 1
                }
            })

             fill_table('DPS', array)

        var info = 'The raids average DPS was <strong>' + avg.toFixed(0) + 'K</strong> with a high of <strong>' + top_dps.toFixed(0) + 'K</strong> and a low of <strong>' + btm_dps.toFixed(0) + 'K</strong><br>The standard deviation is <strong>' + std.toFixed(0) + 'K</strong> with a co-efficient of <strong>' + dist.toFixed(0) + '%</strong>'

        $('#DPS.results').prepend('<div class="info">' + info + '</div><br>')


        var n1p = (avg + std).toFixed(0)
        var n2p = (avg + std + std).toFixed(0)
        var n3p = (avg + std + std + std).toFixed(0)
        var n1n = (avg - std).toFixed(0)
        var n2n = (avg - std - std).toFixed(0)
        var n3n = (avg - std - std - std).toFixed(0)

        var elementID = 'canvas_dps' + $('canvas').length; // Unique ID
            $('<canvas>').attr({
                id: elementID
            }).css({
                width: '400px',
                height: '200px'
            }).prependTo('#DPS.results');

        var canvas = document.getElementById(elementID); // Use the created element
        var ctx = canvas.getContext("2d")

        console.log(ctx)
        var new_data = {
              labels : [n3n,n2n,n1n,avg.toFixed(0),n1p,n2p,n3p],
              xBegin : -3,
              xEnd :  3,
              datasets : [
                {
                  strokeColor : "rgba(220,220,220,1)",
                  data : [],
                  xPos : []
                }
              ]
        }
        var gauss_var=(std / avg)
        var gauss_mean=0;

        var nbiter=800;
        for(var i=0;i<nbiter;i++)
        {
        new_data.datasets[0].xPos[i]=new_data.xBegin+i*(new_data.xEnd-new_data.xBegin)/nbiter;
        new_data.datasets[0].data[i]=(1/(gauss_var*Math.sqrt(2*Math.PI))) * Math.exp(-((new_data.datasets[0].xPos[i]-gauss_mean)*(new_data.datasets[0].xPos[i]-gauss_mean))/(2*gauss_var));
        }
        var config = {
              datasetFill : false,
              pointDot :false,
              animationLeftToRight : true,
              animationEasing: "linear",
              yAxisMinimumInterval : 0.2,
              responsive : true,
              responsiveMaxHeight : 200,
              responsiveMaxWidth : 400,
              showYLabels: false
        }

        new Chart(ctx).Line(new_data,config);

        }


    }


    // Get Deaths
    function get_deaths(){
        $.ajax({
            url: "https://www.warcraftlogs.com:443/v1/report/tables/deaths/" + report + "?start=" + start + "&end=" + end + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
            type: 'GET',
            success: function(data){
                console.log('deaths')
                console.log(data)
                $.each(data.entries, function(i, v){
                    var search_data = $.grep(players_array, function(e){ return e.name == v.name; });
                    if (search_data.length == 1) {
                        var len = v.damage.abilities.length - 1
                        if(len == -1){
                            var death_ability = '';
                            var death_dmg = '';
                        } else {
                            var death_ability = v.damage.abilities[len].name;
                            var death_dmg = v.damage.abilities[len].total;
                        }
                        var deaths = {
                            'deaths':{
                                'ability':death_ability,
                                'damage':death_dmg,
                                'timestamp':v.timestamp,
                            }
                        }
                        // console.log(v.name + ' died to ' + death_ability)
                        $.extend( true, search_data[0], deaths );
                    }
                })
                get_buffs();
            }
        })
    }

    // Get Buffs
    function get_buffs(){
        get_pots();

        function get_pots(){
            $.each(pots_array, function(a, b){
                ability_count = $(pots_array).length;
                $.ajax({
                    url: "https://www.warcraftlogs.com:443/v1/report/tables/buffs/" + report + "?start=" + start + "&end=" + end + "&abilityid=" + pots_array[a] + "&api_key=d03b91a36aeb8df46cb6b22e705ee917",
                    type: 'GET',
                    success: function(data){
                        // console.log('get pots');
                        // console.log(data);
                        $.each(data.auras, function(i, v){
                            var pots = {'consumables':{
                                'pots':{'totalUses':v.totalUses}
                                }
                            }
                            var search_players = $.grep(players_array, function(e){ return e.name == v.name; });
                            if(search_players.length == 1){
                                $.extend( true, search_players[0], pots );
                            }

                        })
                         get_food();
                    }
                });
            });
        }

        function get_food(){
            // console.log('get food')
        }

        setTimeout(function(){
            check_bosses();
        }, 1e3)
    }


function check_bosses(){

    //avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)
    //check_debuffs(id, report, start, end, boss, ability, size, name, desc)

    var ability, id, name, desc;
    var tank = false;
    var dot = false;
    var opt = false;
    var host = false;

    //Skorpyron
    if(boss == '1849'){
        // Focused Blast
        ability = [204483];
        id = 204483
        name = 'Focused Blast';
        desc = 'Skorpyron faces a targeted direction, discharging arcane energy, inflicting 1,125,000 Arcane damage and <strong>stunning targets hit for 4 secs</strong>, increasing in duration for subsequent hits.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        //Arcanoslash
        ability = [204275];
        id = 204275
        name = 'Arcanoslash';
        desc = 'Skorpyron Slashes all targets in a frontal 18 yard hemisphere, inflicting 581,900 Arcane damage. Tank-specialization players are afflicted by Arcane Tethers.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, true, dot, opt, host)
    }

    //Chronomatic Anomaly
    else if(boss == '1865'){
        // Burst Of time
        ability = [206612];
        id = 206612
        name = 'Burst Of Time';
        desc = 'The caster hurls an orb of temporal energies that explodes when hitting the ground. The explosion inflicts 321,500 Arcane damage to all enemies within 6 yards of the target location.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Warp Nightwell
        ability = [207228,228335];
        id = 207228
        name = 'Warp Nightwell';
        desc = "The caster warps the Nightwell, inflicting 35,000 Arcane damage to all players. Each cast of this spell increases the damage of caster's <strong>successive Warps by 5%.</strong>";
        interrupts(report, start, end, boss, id, ability, name, desc);
    }

    //Trilliax
    else if(boss == '1867'){
        // Arcane Seepage
        ability = [206488];
        id = 206488
        name = 'Arcane Seepage';
        desc = 'Bile seeps from the construct as it is struck, creating arcane pools at random locations that inflict 250,500 Arcane damage every 1 sec.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, true, opt, host)

        // Annihilation
        ability = [207631];
        id = 207631
        name = 'Annihilation';
        desc = 'Enemies caught in Annihilation suffer 357,000 Arcane damage every 0.25 sec.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, true, opt, host)
    }

    //Spellblade Aluriel
    else if(boss == '1871'){
        // Pyroblast
        ability = [213281];
        id = 213281
        name = 'Pyroblast';
        desc = 'Fiery Enchantments blast a random enemy for 2,812,500 Fire damage. This effect is <strong>interruptible.</strong>';
        interrupts(report, start, end, boss, id, ability, name, desc);
    }

    //Krosus
    else if(boss == '1842'){
        // Fel Beam
        ability = [205391];
        id = 205391
        name = 'Fel Beam';
        desc = 'Krosus emits a beam of fel energy from one of his hands inflicting 1,965,000 Fire damage to <strong>all enemies within the effect.</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Fel Beam
        ability = [206352];
        id = 206352
        name = 'Felburst'
        desc = 'Burning Embers fire a bolt of felfire at a random target that explodes upon impact inflicting 522,500 to 545,600 Fire damage to all enemies within 5 yards of the detonation.<br><strong>Stand in pools to stop Burning Embers spawning, and kill off any that spawn quickly.</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)
    }

    //Tichondrius
    else if(boss == '1862'){

        // Seeker Swarm - check events to see if Carrion Plague was gotten from it
        var query = 'ability.id="213238" AND type="cast" OR ability.id="206480" AND type="applydebuff"'
        var id = 213238
        var name = 'Carrion Plague <small>(from Seeker Swarm)</small>';
        var desc = 'Tichondrius unleashes a wave of chaotic magic at all players afflicted with Carrion Plague. This effect inflicts 630,000 Shadow damage to all players in a line towards each target. <strong>In addition, this effect applies Carrion Plague to all players hit.</strong>';
        check_cast_debuffs(id, report, start, end, boss, size, name, desc, query, '')

        // Add Prio - Sightless Watcher
        id = 'sightless_watcher';
        name = "Sightless Watcher";
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

        // Nether Zone
        ability = [216027];
        id = 216027
        name = 'Nether Zone';
        desc = 'A chaotic void of Arcane magic that inflicts 393,000 Arcane damage every second to all players <strong>within the targeted area.</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, true, opt, host)
    }

    //Star Augur
    else if(boss == '1863'){

        // Add Prio - Thing
        id = 'thing_that_should_not_be';
        name = "Thing That Should Not Be";
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

        // Witness The Void
        ability = [207720];
        id = 207720
        name = 'Witness The Void';
        desc = 'Shows the horror of the void to players, inflicting 396,000 to 461,000 Shadow damage to all players and <strong>fearing any players</strong> looking towards the caster for 8 sec.';
        check_debuffs(id, report, start, end, boss, ability, size, name, desc);

        // Shatter
        ability = [206938];
        id = 206938
        name = 'Shatter';
        desc = 'The affected player shatters, causing 1,068,987 Frost damage to them and any other players <strong>within 8 yards.</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, 3, host)
    }

    //High Botanist
    else if(boss == '1886'){
        // Solar Collapse
        ability = [218155];
        id = 218155;
        name = 'Solar Collapse';
        desc = "High Botanist Tel'arn summons 12 points of solar energy around a player that collapse in towards them. As each point moves it explodes, inflicting 1,503,360 Fire damage to all players within 4 yards.";
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        //Controlled Chaos
        ability = [218466,218470,218463];
        id = 218463;
        name = 'Controlled Chaos';
        desc = "High Botanist Tel'arn unleashes several explosions in quick succession at a player's location. Each explosion inflicts 2,240,000 Arcane damage to all players within a <strong>10 yard</strong> radius and increases in size to a <strong>20 and 30 yard</strong> radius with each successive explosion. In addition, each explosion inflicts 460,992 Arcane damage to all players.";
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)
    }

    //Elisande
    else if(boss == '1872'){

        // Add Prio - Slow Add
        id = 'recursive_elemental';
        name = "Recursive Elemental";
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

        // Add Prio - Fast Add
        id = 'expedient_elemental';
        name = "Expedient Elemental";
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

        // Arcanetic Ring
        ability = [208659];
        id = 208659
        name = 'Arcanetic Ring';
        desc = 'The caster summons an Arcanetic Ring that slowly collapses inwards, inflicting 1,070,000 Arcane damage to all in its path.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, true, opt, host)

        // Delphuric Beam
        ability = [209248];
        id = 209248
        name = 'Delphuric Beam';
        desc = 'The caster periodically targets players and fires a burst of Arcane energy at them. Any players caught in the path of this Arcane energy suffer 714,500 Arcane damage.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Blast
        ability = [221864];
        id = 221864
        name = 'Blast';
        desc = 'Inflicts 529,000 to 614,000 Arcane damage to the target. Each successful cast of Blast increases the damage of <strong>successive Blasts by 5%.</strong>';
        interrupts(report, start, end, boss, id, ability, name, desc);

        // Exothermic Release
        ability = [209568];
        id = 209568
        name = 'Exothermic Release';
        desc = 'Inflicts 217,000 Arcane damage to all enemies. The caster deals <strong>10% more damage</strong> with this ability <strong>each time</strong> they use it.<br><i>Killing this add quickly will reduce raid-wide damage.</i>';
        interrupts(report, start, end, boss, id, ability, name, desc);

        // Ablative Pulse
        ability = [209971];
        id = 209971
        name = 'Ablative Pulse';
        desc = 'Inflicts 600,000 Arcane damage to the target. Each cast of Ablative Pulse <strong>increases the damage of further Ablative Pulses against the victim by 10%.</strong>';
        interrupts(report, start, end, boss, id, ability, name, desc);
    }

    //Guldan
    else if(boss == '1866'){
        // Add Prio - Inquisitor Vethriz
        id = 'vethriz';
        name = 'Inquisitor Vethriz';
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

        // Gaze of Vethriz
        ability = [217770];
        id = 217770
        name = 'Gaze of Vethriz';
        desc = 'Summons in a Gaze of Vethriz at a targeted location which channels a beam of magic, inflicting 300,000 Shadow damage to any players struck by the beam.<br><strong>Killing Inquisitor Vethriz quickly will not spawn eyes</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Fel Efflux
        ability = [206515];
        id = 206515
        name = 'Fel Efflux';
        desc = 'Pours out fel energy in a focused channel, inflicting 214,000 Fire damage every half-second to <strong>all targets within the energy.</strong>';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, true, opt, host)

        // Hand of Gul'dan
        ability = [212262];
        id = 212262
        name = "Hand of Gul'dan";
        desc = 'Calls down a demonic meteor, inflicting 1,430,000 Shadow damage to anyone <strong>within 10 yards</strong> of the meteors impact location and summons a powerful demon at that location.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Storm of the Destroyer
        ability = [167819,152987,167935,177380];
        id = 167819
        name = 'Storm of the Destroyer';
        desc = 'Calls upon the power of the Destroyer, sequentially inflicting 500,000 Shadow damage to enemies within <strong>10 yards</strong>, then 643,000 Shadow damage to enemies within <strong>20 yards</strong>, then 643,000 Shadow damage to enemies within <strong>30 yards</strong>, and finally 2,145,000 Shadow damage to enemies within <strong>60 yards</strong>.';
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, tank, dot, opt, host)

        // Fel Scythe
        ability = [227550];
        id = 227550
        name = "Fel Scythe";
        desc = "Fel Scythe cleaves at targets for 1,070,000 Fire damage, divided amongst targets within <strong>2 yards</strong>, consuming all of Gul'dan's Fel Energy, increasing in damage by 5% for every point of Fel Energy consumed.<br><br>Gul'dan's keen eye allows him to cast Fel Scythe when <strong>any additional target stands within 2 yards of his primary target</strong> when attacking. Each successful cast of Fel Scythe grant's Gul'dan Fury of the Fel.";
        avoidable_damage(report, start, end, boss, id, ability, name, desc, size, dmg, true, dot, opt, host)

        if(diff == 4){
        // Carrion Wave - HC only
            ability = [208672];
            var id = 208672
            var name = 'Carrion Wave';
            var desc = 'The Dreadlord causes a wave of chaotic explosions to wash over enemies in front of them, inflicting 714,500 Shadow damage and putting targets to <strongsleep for 5 sec.</strong>';
            interrupts(report, start, end, boss, id, ability, name, desc);
        }

        // Add Prio - Empowered Eye
        id = 'empowered_eye';
        name = "Empowered Eye of Gul'dan";
        desc = '';
        var target;
        $.each(enemies, function(i, v){if(v.name == name){target = v.id}})
        add_prio(report, start, end, boss, id, name, desc, size, dmg, tank, target)

    }

    //CONSUMABLES

    var name = 'Potion Use'
    var id = 'pots'
    var desc = 'Glug glug glug!'
    check_buffs(id, report, start, end, boss, pots_array, size, name, desc);

    // var name = 'Flask Use'
    // var desc = 'Glug glug glug!'
    // check_buffs(report, start, end, boss, size, name, desc, flasks);

l.stop();
} //end bosses

})

    $.ajax({
        url: 'https://www.warcraftlogs.com:443/v1/reports/guild/Big%20Game%20Hunters/Alonsus/EU?api_key=d03b91a36aeb8df46cb6b22e705ee917',
        type: 'GET',
        success: latest_reports
    })

    $('body').on('click', '.boss', function(){
        var boss = $(this).attr('id');
        $('.boss').removeClass('active');
        $(this).addClass('active');
        $('.row.fight').each(function(){
            if($(this).attr('id') == boss){
                $(this).find('.wipes').show();
                $(this).fadeIn(200);
            } else {
                $(this).hide();
            }
        })

    })

    $('body').on('click', '.view_all', function(){
        $('.row.fight').fadeIn(300);
        $('.row.fight').find('.wipes').hide();
    })

    $('body').on('click', '.view_details', function(){
        var ability = $(this).attr('data-ability');
        $('#' + ability + '.player_results').stop().fadeToggle(500);
        if (!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off'){
            /* currently it's not been toggled, or it's been toggled to the 'off' state,
               so now toggle to the 'on' state: */
               $(this).attr('data-toggled','on');
               $(this).text('Hide details');
               // and do something...
        }
        else if ($(this).attr('data-toggled') == 'on'){
            /* currently it has been toggled, and toggled to the 'on' state,
               so now turn off: */
               $(this).attr('data-toggled','off');
               $(this).text('Show details')
               // and do, or undo, something...
        }
    })

    $('body').on('click', '.load_report', function(){
        var report_id = $(this).attr('data-id');
        $('#reportid').val(report_id);
        $('#fetch').click();
    })

    // $('body').on('click', '.process', function(){
    //     var id = $(this).attr('data-id');
    //     console.log(id);

    //     $.ajax({
    //         url: 'https://www.warcraftlogs.com:443/v1/report/fights/' + id + '?api_key=d03b91a36aeb8df46cb6b22e705ee917',
    //         type: 'GET',
    //         success: function(data){
    //             console.log(data.fights);
    //             console.log(id);
    //             var loc = $('#' + id)
    //             $.each(data.fights, function(i, v){
    //                 console.log(v.name)
    //                 if(1==v.kill)var kill="KILL";else kill="wipe";
    //                 loc.append('<div class="col-xs-12">' + v.name + ' &ndash; ' + kill + '</div>')
    //             })
    //         }
    //     })

    //     // check local storage
    //     if(saved_reports != null){
    //         if($.inArray(id, saved_reports) != -1){
    //             // console.log('already in array')
    //         } else {
    //             var cur_reports = JSON.parse(localStorage.getItem('reportsArray'));
    //             var new_reports = id;
    //             cur_reports.push(new_reports);
    //             localStorage.setItem('reportsArray', JSON.stringify(cur_reports));
    //             // console.log('local storage updated')
    //         }
    //     } else {
    //         // console.log('local storage set');
    //         var reports = [];
    //         reports[0] = id;
    //         localStorage.setItem("reportsArray", JSON.stringify(reports));
    //     }


    // })

    var url_report = window.location.hash;

    if(url_report.length != 0){
        var hash = url_report.replace(/#/gi, '');
        $('input#reportid').val(hash);
        $('#fetch').click();
    }





})