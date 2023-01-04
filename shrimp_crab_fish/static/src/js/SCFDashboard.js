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
                tableId: 0,
                employeeName : session.name,
                balance: 0,
                userUid: session.uid,
                valuePerClick: 1000,
                currentTime: "Stop",
                bet: {
                    deerBet: 0,
                    gourdBet: 0,
                    roosterBet: 0,
                    fishBet: 0,
                    crabBet: 0,
                    shrimpBet: 0
                },
                result: {
                    result1: "",
                    result2: "",
                    result3: ""
                },
                allBet: []
            });
            this.getTableId()
            this.refreshBalanceInterval = setInterval(this.getUserBalance.bind(this), 5000);
            this.refreshCurrentTimeInterval = setInterval(this.getCurrentTableTime.bind(this), 1000);
            this.refreshAllBetInterval = setInterval(this.getAllBet.bind(this), 5000),

            onWillUnmount(()=>{
                clearInterval(this.refreshBalanceInterval);
                clearInterval(this.refreshCurrentTimeInterval);
                clearInterval(this.refreshAllBetInterval);
            });
        }
        getUserBalance(){
            rpc.query({
                model: 'res.users',
                method: 'retrive_balance'
            }).then(res=>this.state.balance = res);
        }
        getCurrentTableTime() {
            rpc.query({
                model: 'scf.table',
                method: 'refresh_table_data'
            }).then(result=> this.state.currentTime = result);
        }
        getTableId() {
            rpc.query({
                model: 'scf.table',
                method: 'get_scf_table_id'
            }).then(result=> this.state.tableId = result);
        }
        getAllBet() {
            return rpc.query({
                model: "scf.table",
                method: "refresh_all_bet",
            }).then(result => this.state.allBet = result);
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
            this.clearBet()
        }
        _onClickBet() {
            console.log(this.state.tableId)
            let i = 0;
            let betLst = this.state.bet;
            for(let item in betLst) {
                if(betLst[item] == 0) {
                    i++;
                    continue}

                rpc.query({
                    model: "scf.bet.line",
                    method: "create",
                    args: [{
                        "user_id": this.state.userUid,
                        "bet_result": i,
                        "bet_amount": betLst[item],
                        "scf_table_id": this.state.tableId, }],
                });
                i++;
            }
            this.clearBet()

        }
        clearBet() {
            let bet = this.state.bet;
            for(let item in bet)bet[item] = 0;
        }
    }

    core.action_registry.add('shrimp_crab_fish.shrimp_crab_fish', SCFDashboard);
});