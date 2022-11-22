odoo.define('shrimp_crab_fish.dashboard', function (require) {
    "use strict";
    const { Component } = owl;
    const { useRef, onMounted } = owl.hooks;
    var core = require('web.core');
    var rpc = require('web.rpc');

    function get_random() {
        var image = document.querySelectorAll('td > img')
        var b = []
        b.splice(0, b.length)
        for (let i = 0; i < image.length; i++) {
            b.push(image[i])
        }
        // alert(b[Math.floor((Math.random()*b.length))])
        var p = document.createElement("img");

        p.src = b[Math.floor((Math.random() * b.length))].src
        document.querySelector('.plate').appendChild(p)

    }

    class SCFDashboard extends Component {
        static template = "shrimp_crab_fish.SCFDashboard";

        setup() {
            const nameRef = useRef("name");
            const balanceRef = useRef("balance");
            onMounted(() => {
                rpc.query({
                    model: 'res.users',
                    method: 'retrive_user_data',
                }).then(res => {
                    nameRef.el.outerText = res['name'];
                    balanceRef.el.outerText = res['balance'];
                });
            })
        }

        _onClickDeer() {
            let deerRef = document.getElementById("deer");
            deerRef.value = parseInt(deerRef.value) + 1000;
        }
        _onClickGourd() {
            let gourdRef = document.getElementById("gourd");
            gourdRef.value = parseInt(gourdRef.value) + 1000;
        }
        _onClickRooster() {
            let roosterRef = document.getElementById("rooster");
            roosterRef.value = parseInt(roosterRef.value) + 1000;
        }
        _onClickFish() {
            let fishRef = document.getElementById("fish");
            fishRef.value = parseInt(fishRef.value) + 1000;
        }
        _onClickShrimp() {
            let shrimpRef = document.getElementById("shrimp");;
            shrimpRef.value = parseInt(shrimpRef.value) + 1000;
        }
        _onClickCrab() {
            let crabRef = document.getElementById("crab");
            crabRef.value = parseInt(crabRef.value) + 1000;
        }

        _onClickCancel() {
            const betInput = ['deer', 'gourd', 'rooster', 'fish', 'crab', 'shrimp'];
            betInput.forEach(item => { document.getElementById(item).value = 0; });
            onMounted()
        }



        _onClickBet() {
            var child = document.querySelectorAll('.plate > img')
            for (let i = 0; i < child.length; i++) {
                document.querySelector('.plate').removeChild(child[i])
            }
            for (let i = 0; i < 3; i++) {

                get_random()
            }
        }


    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});