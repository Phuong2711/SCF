odoo.define('shrimp_crab_fish.dashboard', function (require) {
    "use strict";
    const { Component } = owl;
    const { onMounted, onWillUnmount } = owl.hooks;
    var core = require('web.core');
    var rpc = require('web.rpc');
    var session = require('web.session');

    class SCFDashboard extends Component {
        static template = "shrimp_crab_fish.SCFDashboard";


        setup() {
            onMounted(() => {

                this.balanceRefreshInterval = setInterval(_refreshBalance, 2000);
                this.countDownRefreshInterval = setInterval(_refreshCountDown, 1000);
                this.userUid = session.uid;
                this.tableId = rpc.query({
                        model: 'scf.table',
                        method: 'get_scf_table_id',
                    }).then(result=>this.tableId=result);

                //Mount method
                function openBow(){
                    let change = 0;
                    const imgBow = document.getElementById("bow");
                    const id = setInterval(()=>{
                        if(change > 125){
                            clearInterval(id);}
                        else {
                            change += 1;
                            imgBow.style.left = change + "px";
                            imgBow.style.top = -change + "px";}
                    }, 20);}

                function shakeBow() {
                    const bowRef = document.getElementById("bow");
                    bowRef.classList.remove("bow-animation");
                    bowRef.style.left = "0px";
                    bowRef.style.top = "0px";
                    void bowRef.offsetWidth;
                    bowRef.classList.add("bow-animation");
                    // Restart animation
                    void bowRef.offsetWidth;
                    bowRef.classList.add("bow-animation");}
                function generateResult() {
                    rpc.query({
                        model: 'scf.table',
                        method: 'generate_result',
                    });
                }

                function _refreshCountDown(){
                    return rpc.query({
                        model: 'scf.table',
                        method: 'refresh_table_data',
                    }).then(result =>{
                        let countDownRef = document.getElementById("countdown");
                        countDownRef.value = result["current_time"];
                        if(result["current_time"] == "10") shakeBow();
                        if(result["current_time"] == "0") openBow();
                    });}

                 function _refreshBalance(){
                    return rpc.query({
                        model: 'res.users',
                        method: 'retrive_user_data',
                    }).then(result =>{
                        document.getElementById("employee_name").innerHTML = result['name'];
                        document.getElementById("employee_balance").innerHTML = result['balance'];});}
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
            /*
            0: deer
            1: gourd
            2: rooster
            3: fish
            4: crab
            5: shrimp
            */
           const imgSrc = ['deer', 'gourd', 'rooster', 'fish', 'crab', 'shrimp'];
           let betLst = {
               'uid': this.userUid,
               'bet': {}
           };
           for(let index=0; index< imgSrc.length; index++){
               let bet = parseInt(document.getElementById(imgSrc[index]).value);
               document.getElementById(imgSrc[index]).value = 0;
               if(bet==0)continue;
               betLst['bet'][index] = bet;
               rpc.query({
                    model: "scf.bet.line",
                    method: "create",
                    args: [{
                        "user_id": this.userUid,
                        "bet_result": index,
                        "bet_amount": bet,
                        "scf_table_id": this.tableId,
                    }],
                });

           }
           // let bowRef = document.getElementById("bow");
           // let betRef = document.getElementById("bet-button");
           // // Remove clickable bow for 2 seconds
           // bowRef.classList.remove("bow-animation");
           // bowRef.classList.add("no-pointer-event");
           // bowRef.style.left = "0px";
           // bowRef.style.top = "0px";
           // // Restart animation
           // void bowRef.offsetWidth;
           // bowRef.classList.add("bow-animation");
           // //Disable button 2 second after click
           //
           //  betRef.innerHTML = "Betting...";
           //  betRef.classList.add("no-pointer-event");
           //  setTimeout(()=>{
           //     betRef.classList.remove("no-pointer-event");
           //     bowRef.classList.remove("no-pointer-event");
           //     betRef.innerHTML = "Bet";
           //  }, 2000);

        }
    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});