var config = {
    license: '00088',
    usercontext: 'E7ccaQ0x27RmMup2rQ7eXLw2tsl3BB0YpKZKOv%2fjpCv5psBOTcgxu%2bvQtE6MhOXa0thdhVhSm7CN1FInb5s5GTVlkRqGynJBacLohcM%2b9sLtgupFYeDpgqqpqJQDH62yRY1HZazJIohAiHv2P3Suq8y2zLrL6ygeKJGf1HeyHbipXUYZAtHpnsMf6LnFxq6us0yKu%2fPQCi%2bjtMHE530Kcu4x6nneRKalPVOdoJr5YECqn2eqNAtHSBe5iPM3eXrwaBFlptqdfd6jtOFUpg4Ge7wCR1cJJ%2bEMgmw5biz8Sf%2b%2fW5vZthnu%2ff6ZvEoxDZjf47WAunQkZEsfPjsa4FH%2fPtKQiV7pt7eJ6XQjIWz8m00kiXANjrA69vnUZJptO7XfRjwU3co%2b7%2ffVHhhwuTivj7E0swZfMsn%2bajljculmUCOs5QLZfveu2gTvU9tjR4H%2f3Ksshq15NlWBSSNC5t7abYx8XHoIV3tBPQt4DNe9WjiJ30MCXs%2f66pZmpxdqLiXIbU4ncEGyNzcoIJcWcP2CIkBcTpRscDWAgCZDnxM0g1F0TxNjxjlCNv%2fyM0NZn5mltDARe%2fhGJQ8MHod5oZ4n9oKfVsYGdJyGLcoKFsEwfYVlP981HPdFW7%2bn7xHBj2fAAIDVNYEagYXtzQelnTzwPYJLXTSlqMypY5%2fIA7wWZptp2btu6m5UiQEwWvUDkFAPFtSLFpAkNvmrrY3dOZlTgiJ%2bBNkrysGEYfii4K5rZrQbVMOIMSw0IMk4xcRbi6PM80bAZwgfKe9UpwEZlAvYyN%2fR47GkiuNBuPYvvyMhd5YB%2bvVJEHJMcSbo3c%2bkvR67McqNNFZIMZhzX2FGdJqWy0QRxZepwEu05URNBlq0IvNGnfQtCckzmrg9PbgUSvqPlKo9%2bs8WHr8WiawamspyyJl5uHXMigehR9FbvqFdhZfg1l4y0nWmXm8FlPtk34EBsJlDJJP1BISW8UQIrv6tv0aAZl%2b8vl1ArkIHnUM1V%2fjFIfjd5RewwQL%2f5dq2xz5W',
    absentSigns: [
        'u', 'ns', '-'
    ],
    lessons: [
        'j.pol', 'utk', 'progr', 'mat', 'ob', 'soisk', 'wf', 'j.ang', 'j.niem', 'gw', 'aplikacje', 'hist', 'p.prze', 'fiz'
    ],
    schedule: [
        [null, 0, 0, null, 1, 2, 3, 4, 4, null],
        [6, 6, null, 1, 7, 5, 8, 8, null, null],
        [null, null, 6, 9, 2, 2, 4, 4, null, null],
        [null, 10, 10, 0, 1, 10, 5, 11, 12, null],
        [5, 13, 0, 3, 5, 5, 7, 12, null, null]
    ]
};


var http = require('http');

function getContent(license, usercontext, callback) {
    var req = http.request({
        host: 'aplikacje.vulcan.pl',
        port: 80,
        path: '/dziennik/' + license + '/dzienniczek.aspx?view=Frekwencja',
        method: 'GET',
        headers: {
            Cookie: 'USERCONTEXT=' + usercontext
        }
    }, function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        callback(str);
      });
    });
    req.end();
}

function matchAll(re, s, callback, done) {
    var re = (typeof re === RegExp) ? re : new RegExp(re);
    var n = 0;
    while(m = re.exec(s))
        callback(m, n++);
    if(done)
        done();
}

function present(s) {
    for(var i = 0; i < config.absentSigns.length; i++)
        if(s.search(config.absentSigns[i]) > -1)
            return false;
    return true;
}

function lessonIndex(date, n) {
    return config.schedule[(date.getDay() + 6) % 7][n];
}

function lessonName(index) {
    return config.lessons[index];
}

function attendance(callback) {
    getContent(config.license, config.usercontext, function(content) {
        content = content.match(/tabelka_dane(.*?)\<\/TABLE\>/)[1];
        lessons = {};
        overall = { all: 0, present: 0 };
        
        matchAll(/\<TR (.*?)\<\/TR\>/g, content, function(row, n) {
            if(n == 0) return;
            row = row[1];
            var date = row.match(/\;(\d\d)\-(\d\d)\-(\d\d\d\d)\,/);
            date = new Date(parseInt(date[3]), parseInt(date[2])-1, parseInt(date[1]));
    
            matchAll(/\<TD .*?\>(.*?)\<\/TD\>/g, row, function(info, n) {
                if(n == 0) return;
                info = info[1]; --n;
                index = lessonIndex(date, n);
                if(index === null) return;
                lessons[index] ? lessons[index].all++ : lessons[index] = { all: 1, present: 0 };
                overall.all++;
                if(present(info)) {
                    lessons[index].present++;
                    overall.present++;
                }
            });
        }, function() {
            callback(lessons, overall);
        });
    });
}

attendance(function(lessons, overall) {
    for(i in lessons)
        console.log(lessonName(i) + ': ' + lessons[i].present + '/' + lessons[i].all + ' = ' + lessons[i].present / lessons[i].all * 100 + '%');
    console.log('OVERALL: ' + overall.present + '/' + overall.all + ' = ' + overall.present / overall.all * 100 + '%');
});
