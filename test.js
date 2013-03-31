var VulcanClient = require('./lib/vulcanClient'), ScheduleClient = require('./lib/scheduleClient'), Analyzer = require('./lib/analyzer');

var vc = new VulcanClient('00088');
vc.userContext = 'E7ccaQ0x27RmMup2rQ7eXLw2tsl3BB0YpKZKOv%2fjpCv5psBOTcgxu%2bvQtE6MhOXa0thdhVhSm7CN1FInb5s5GTVlkRqGynJBacLohcM%2b9sLtgupFYeDpgqqpqJQDH62yRY1HZazJIohAiHv2P3Suq8y2zLrL6ygeKJGf1HeyHbipXUYZAtHpnsMf6LnFxq6us0yKu%2fPQCi%2bjtMHE530Kcu4x6nneRKalPVOdoJr5YECqn2eqNAtHSBe5iPM3eXrwaBFlptqdfd6jtOFUpg4Ge7wCR1cJJ%2bEMgmw5biz8Sf%2b%2fW5vZthnu%2ff6ZvEoxDZjf47WAunQkZEsfPjsa4FH%2fPtKQiV7pt7eJ6XQjIWz8m00kiXANjrA69vnUZJptO7XfRjwU3co%2b7%2ffVHhhwuTivj7E0swZfMsn%2bajljculmUCOs5QLZfveu2gTvU9tjR4H%2f3Ksshq15NlWBSSNC5t7abYx8XHoIV3tBPQt4DNe9WjiJ30MCXs%2f66pZmpxdqLiXIbU4ncEGyNzcoIJcWcP2CIkBcTpRscDWAgCZDnxM0g1F0TxNjxjlCNv%2fyM0NZn5mltDARe%2fhGJQ8MHod5oZ4n9oKfVsYGdJyGLcoKFsEwfYVlP981HPdFW7%2bn7xHBj2fAAIDVNYEagYXtzQelnTzwPYJLXTSlqMypY5%2fIA7wWZptp2btu6m5UiQEwWvUDkFAPFtSLFpAkNvmrrY3dOZlTgiJ%2bBNkrysGEYfii4K5rZrQbVMOIMSw0IMk4xcRbi6PM80bAZwgfKe9UpwEZlAvYyN%2fR47GkiuNBuPYvvyMhd5YB%2bvVJEHJMcSbo3c%2bkvR67McqNNFZIMZhzX2FGdJqWy0QRxZepwEu05URNBlq0IvNGnfQtCckzmrg9PbgUSvqPlKo9%2bs8WHr8WiawamspyyJl5uHXMigehR9FbvqFdhZfg1l4y0nWmXm8FlPtk34EBsJlDJJP1BISW8UQIrv6tv0aAZl%2b8vl1ArkIHnUM1V%2fjFIfjd5RewwQL%2f5dq2xz5W';

var sc = new ScheduleClient();

vc.attendance(function(att) {
    sc.schedule('3Tc', function(s) {
        var subjs = s.subjects;
        subjs.find('prog.str.').groups = [null, '2/2'];
        subjs.find('ob').groups = ['2/2'];
        subjs.find('soisk').groups = [null, '2/2'];
        subjs.find('wf').groups = ['#C31'];
        subjs.find('j.ang').groups = ['#T35'];
        subjs.find('j.niem').groups = ['#N32'];
        subjs.remove({
            name: 'aplikacje/s',
            group: '1/2'
        });
        subjs.remove('j.hisz');
        subjs.remove('j.fran');
        subjs.remove('j.ros');
        subjs.remove('religia');
        var a = new Analyzer(s.reduce(subjs), att);
        
        console.log(a.frequency);
    });
});
