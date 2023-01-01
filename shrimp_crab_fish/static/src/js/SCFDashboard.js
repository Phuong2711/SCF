odoo.define('shrimp_crab_fish.dashboard', function (require) {
    "use strict";
    const { Component, useState } = owl;
    const { onMounted, onWillUnmount } = owl.hooks;
    var core = require('web.core');
    var rpc = require('web.rpc');
    var session = require('web.session');

    class SCFDashboard extends Component {
        static template = "shrimp_crab_fish.SCFDashboard";


        setup() {
            this.state = useState({
                employeeName : session.name,
                balance: 0,
                userUid: session.uid,
                valuePerClick: 1000,
                bet: {
                    deerBet: 0,
                    gourdBet: 0,
                    roosterBet: 0,
                    fishBet: 0,
                    shrimpBet: 0,
                    crabBet: 0
                }
            });
            this.refreshBalanceInterval = setInterval(this.getUserBalance.bind(this), 1000);

            onWillUnmount(()=>{
                clearInterval(this.refreshBalanceInterval);
            });
        }
        getUserBalance(){
            rpc.query({
                model: 'res.users',
                method: 'retrive_balance'
            }).then(res=>this.state.balance = res);
        }

        _onClickDeer() {
            this.state.bet.deerBet += parseInt(this.state.valuePerClick);
        }
        _onClickGourd() {
            this.state.bet.gourdBet += parseInt(this.state.valuePerClick);
        }
        _onClickRooster() {
            this.state.bet.roosterBet += parseInt(this.state.valuePerClick);
        }
        _onClickFish() {
            this.state.bet.fishBet += parseInt(this.state.valuePerClick);
        }
        _onClickShrimp() {
            this.state.bet.shrimpBet += parseInt(this.state.valuePerClick);
        }
        _onClickCrab() {
            this.state.bet.crabBet += parseInt(this.state.valuePerClick);
        }

        _onClickCancel() {
            let bet = this.state.bet;
            for(let item in bet)bet[item] = 0;
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
                        "bet_amount": Math.abs(bet),
                        "scf_table_id": this.tableId,
                    }],
                });

           }

        }
    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});