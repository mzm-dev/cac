/**
 * jQuery Timer doesn't natively act like a stopwatch, it only
 * aids in building one.  You need to keep track of the current
 * time in a variable and increment it manually.  Then on each
 * incrementation, update the page.
 *
 * The increment time for jQuery Timer is in milliseconds. So an
 * input time of 1000 would equal 1 time per second.  In this
 * example we use an increment time of 70 which is roughly 14
 * times per second.  You can adjust your timer if you wish.
 *
 * The update function converts the current time to minutes,
 * seconds and hundredths of a second.  It then outputs that to
 * the stopwatch element, $stopwatch, and then increments. Since
 * the current time is stored in hundredths of a second so the
 * increment time must be divided by ten.
 */


var Example1 = new(function () {
    var $stopwatch, // Stopwatch element on the page
        incrementTime = 70, // Timer speed in milliseconds
        currentTime = 0, // Current time in hundredths of a second
        register = function () {
            $('#btnStart').on('click', function () {
                // get all the inputs into an array.
                var values = {};
                values['name'] = $("input[name=name]").val();
                values['email'] = $("input[name=email]").val();
                setStorage(values);
            });
        },
        getStorage = function () {
            return localStorage.getItem("players");
        },
        setStorage = function (val) {

            if (getStorage() != null) {
                console.log('Push setStorage');
                var data = getStorage();
                data = JSON.parse(data);

                var exists = data.filter(data => data.email === val.email);

                if (exists == 0) {
                    console.log('New Player');
                    data.push({
                        'email': val.email,
                        'name': val.name,
                        'time': 0
                    });
                    return localStorage.setItem("players", JSON.stringify(data));
                }

            } else {
                console.log('New setStorage');
                var data = [];
                data.push({
                    'email': val.email,
                    'name': val.name,
                    'time': 0
                });
                return localStorage.setItem("players", JSON.stringify(data));
            }
        },
        updateTimer = function () {
            $stopwatch.html(formatTime(currentTime));
            currentTime += incrementTime / 10;
            $('#btnStop').on('click', function () {
                $('#spinner').show();
                $('#btnStart').attr('disabled', true);
                console.log('currentTime', currentTime);
                var email = $("input[name=email]").val();
                console.log('stop email', email);
                var data = getStorage();
                data = JSON.parse(data);

                var playerData = data.filter(data => data.email === email);

                if (playerData[0].time == 0) {
                    data.filter(data => data.email === email)[0].time = currentTime;
                    localStorage.setItem("players", JSON.stringify(data));
                } else if (playerData[0].time > currentTime) {
                    data.filter(data => data.email === email)[0].time = currentTime;
                    localStorage.setItem("players", JSON.stringify(data));
                }

                setTimeout(()=>{
                    window.location.href = 'index.html'; //relative to domain
                },1000);
            });
        },
        listed = function () {
            var data = getStorage();
            if(data){
                data = JSON.parse(data);
                data.sort(function(a, b) {            
                    return a.time > b.time ? 1 : -1;
                });
                
                var players = $(".players");
                $.each(data, function (i, order) {            
                    players.append('<div class="card my-2"><div class="card-body"><span class="badge badge-secondary">'+formatTime(data[i].time)+ '</span> ' + data[i].name +'</div></div>');
                });
            }
        },
        input = function (){
            
            $("input[name=name], input[name=email]").keyup(function(){
                var name = $("input[name=name]").val();
                var email =  $("input[name=email]").val();
                if(name != '' && email != ''){
                    $('#btnStart').attr('disabled',false);
                    $('#btnStop').attr('disabled',false);
                }else{
                    $('#btnStart').attr('disabled',true);
                    $('#btnStop').attr('disabled',true);
                }
            })
        },
        init = function () {
            $stopwatch = $('#stopwatch');
            Example1.Timer = $.timer(updateTimer, incrementTime, false);
            
            $('#btnStart').attr('disabled',true);
            $('#btnStop').attr('disabled',true);
            $('#spinner').hide();
        };
    this.resetStopwatch = function () {
        currentTime = 0;
        this.Timer.stop().once();
    };
    $(init);
    $(register);
    $(listed);
    $(input);
});

/**
 * Example 4 is as simple as it gets.  Just a timer object and
 * a counter that is displayed as it updates.
 */
var count = 0,
    timer = $.timer(function () {
        count++;
        $('#counter').html(count);
    });
timer.set({
    time: 1000,
    autostart: true
});


window.setInterval(function(){

    var randomColor = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
    
    $('body').css({
      'background-color' : randomColor,
    });

  }, 2000);

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}