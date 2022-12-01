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
                this.allBetRefreshInterval = setInterval(_refreshAllBet, 5000);
                this.userUid = session.uid;
                this.valuePerClick = 1000;
                this.tableId = rpc.query({
                        model: 'scf.table',
                        method: 'get_scf_table_id',
                    }).then(result=>this.tableId=result);

                document.getElementById("1k").checked = true;
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

                function _refreshCountDown(){
                    return rpc.query({
                        model: 'scf.table',
                        method: 'refresh_table_data',
                    }).then(result =>{
                        let countDownRef = document.getElementById("countdown");
                        countDownRef.value = result["current_time"];
                        if(result["current_time"] == "10"){
                            shakeBow();
                            _refreshResultData();
                        }
                        if(result["current_time"] == "0") openBow();
                    });}

                 function _refreshBalance(){
                    return rpc.query({
                        model: 'res.users',
                        method: 'retrive_user_data',
                    }).then(result =>{
                        document.getElementById("employee_name").innerHTML = result['name'];
                        document.getElementById("employee_balance").innerHTML = result['balance'].toLocaleString();});}

                 function _refreshResultData() {
                    let srcImg = ['deer', 'gourd', 'rooster', 'fish', 'crab', 'shrimp'];
                    return rpc.query({
                        model: 'scf.table',
                        method: 'refresh_result_data'
                    }).then(result=>{
                        document.getElementById("result-1").src = `/shrimp_crab_fish/static/src/image/result_${srcImg[result['res1']]}.png`;
                        document.getElementById("result-2").src = `/shrimp_crab_fish/static/src/image/result_${srcImg[result['res2']]}.png`;
                        document.getElementById("result-3").src = `/shrimp_crab_fish/static/src/image/result_${srcImg[result['res3']]}.png`;
                    });
                 }

                 function _refreshAllBet(){
                    let srcImg = ['deer', 'gourd', 'rooster', 'fish', 'crab', 'shrimp'];
                    return rpc.query({
                        model: 'scf.table',
                        method: 'refresh_allbet'
                    }).then(result=>{
                        let tbody = document.getElementById("data-output");
                        let out = "";
                        for(let line of result){
                            out += `
                            <tr>
                                <td>${line['user_name']}</td>
                                <td><img src='/shrimp_crab_fish/static/src/image/result_${srcImg[line['bet_result']]}.png'</td>
                                <td>${line['bet_amount'].toLocaleString()}</td>                            
                            </tr>
                            `;
                        }
                        tbody.innerHTML = ``;
                        tbody.innerHTML = out;
                    });
                 }

                 document.addEventListener('input',(e)=>{
                     if(e.target.getAttribute('name')=="mn-options")
                         this.valuePerClick = parseInt(e.target.value);
                 })});


            onWillUnmount(()=>{
                clearInterval(this.balanceRefreshInterval);
                clearInterval(this.countDownRefreshInterval);
                clearInterval(this.allBetRefreshInterval);
            });
        }

        _onClickDeer() {
            let deerRef = document.getElementById("deer");
            deerRef.value = parseInt(deerRef.value) + this.valuePerClick;
        }
        _onClickGourd() {
            let gourdRef = document.getElementById("gourd");
            gourdRef.value = parseInt(gourdRef.value) + this.valuePerClick;
        }
        _onClickRooster() {
            let roosterRef = document.getElementById("rooster");
            roosterRef.value = parseInt(roosterRef.value) + this.valuePerClick;
        }
        _onClickFish() {
            let fishRef = document.getElementById("fish");
            fishRef.value = parseInt(fishRef.value) + this.valuePerClick;
        }
        _onClickShrimp() {
            let shrimpRef = document.getElementById("shrimp");;
            shrimpRef.value = parseInt(shrimpRef.value) + this.valuePerClick;
        }
        _onClickCrab() {
            let crabRef = document.getElementById("crab");
            crabRef.value = parseInt(crabRef.value) + this.valuePerClick;
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

        }
    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});