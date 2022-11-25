odoo.define('shrimp_crab_fish.dashboard', function (require) {
    "use strict";
    const { Component } = owl;
    const { useRef, onMounted, onWillUnmount } = owl.hooks;
    var core = require('web.core');
    var rpc = require('web.rpc');

    class SCFDashboard extends Component {
        static template = "shrimp_crab_fish.SCFDashboard";


        setup() {
            onMounted(() => {
                 rpc.query({
                    model: 'res.users',
                    method: 'check_access_right'}).then(result=>{
                        document.getElementById("access").value = result;
                 });
                this.balanceRefreshInterval = setInterval(_refreshBalance, 2000);
                this.countDownRefreshInterval = setInterval(_refreshCountDown, 1000);
                function _refreshBalance(){
                    return rpc.query({
                        model: 'res.users',
                        method: 'retrive_user_data',
                    }).then(result =>{
                        document.getElementById("employee_name").innerHTML = result['name'];
                        document.getElementById("employee_balance").innerHTML = result['balance'];

                    });
                }
                function _refreshCountDown(){
                    return rpc.query({
                        model: 'scf.table',
                        method: 'refresh_table_data',
                    }).then(result =>{
                        let countDownRef = document.getElementById("countdown");
                        countDownRef.value = result["current_time"];
                        countDownRef.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                }
            });
            onWillUnmount(()=>{
                clearInterval(this.balanceRefreshInterval);
                clearInterval(this.countDownRefreshInterval);
            });
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
            let cancelRef = document.getElementById("cancel-button");
            cancelRef.innerHTML = "Canceling...";
            cancelRef.disabled = true;
            setTimeout(()=>{
               cancelRef.disabled = false;
               cancelRef.innerHTML = "Cancel";
            }, 1000);
        }



        _onClickBet() {
           const imgSrc = ['deer', 'gourd', 'rooster', 'fish', 'crab', 'shrimp'];
           [1, 2, 3].forEach(item =>{
               let result = Math.floor(Math.random() * 6);
               document.getElementById(`result-${item}`).src = `/shrimp_crab_fish/static/src/image/result_${imgSrc[result]}.png`;
           });
           let bowRef = document.getElementById("bow");
           let betRef = document.getElementById("bet-button");
           // Remove clickable bow for 2 seconds
           bowRef.classList.remove("bow-animation");
           bowRef.classList.add("no-pointer-event");
           bowRef.style.left = "0px";
           bowRef.style.top = "0px";
           // Restart animation
           void bowRef.offsetWidth;
           bowRef.classList.add("bow-animation");
           //Disable button 2 second after click

            betRef.innerHTML = "Betting...";
            betRef.classList.add("no-pointer-event");
            setTimeout(()=>{
               betRef.classList.remove("no-pointer-event");
               bowRef.classList.remove("no-pointer-event");
               betRef.innerHTML = "Bet";
            }, 2000);

        }

        _onClickBow(){
            let change = 0;
            const imgBow = document.getElementById("bow");
            const betRef = document.getElementById("bet-button");
            imgBow.classList.add("no-pointer-event");
            betRef.classList.add("no-pointer-event");
            const id = setInterval(openBow, 20);
            function openBow(){
                if(change > 125){
                    imgBow.classList.remove("no-pointer-event");
                    betRef.classList.remove("no-pointer-event");
                    clearInterval(id);
                } else {
                    change += 1;
                    imgBow.style.left = change + "px";
                    imgBow.style.top = -change + "px";
                }
            }
            }
         _onchangeCountDown(){
            console.log(document.getElementById("countdown").value);
         }

    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});