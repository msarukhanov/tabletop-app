/**
 * Created by xgharibyan on 5/25/15.
 */

var moment = require('moment');
var helpers = {
    clearVariable : function(variable){
        var parsedVariable = variable.substring(0, variable.length - 3);
        return parsedVariable;
    }
};

//var today = moment().add(currHour < 6 ? 0 : 1).format("YYYY-MM-DD");
//var tomorrow = moment().add(currHour < 6 ? 0 : 1, 'days').format("YYYY-MM-DD");
var rowNames = ['keno','horses','dogs','kaboom','live','five','sports','other','total'];
module.exports = function (knex) {
    var common = {
        today: null,
        tomorrow: null,
        result: {},
        totalRows: null,
        finalRows:null,
        output: 'in',
        isAll: false,
        ufilter_in: null,
        ufilter_out: null,
        queries: {},
        debtArr:null,
        finalBets:null,
        finalArchive:null,
        //"SELECT dt,amount,type,user_id FROM s_acc_transactions WHERE deleted=0 AND dt BETWEEN '$df 06:00:00' AND '$dt 05:59:59' $ufilter ORDER BY dt DESC"
        initQuery: function () {
            this.queries = {
                in: {
                    kenoQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_k WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",// ORDER BY dt DESC",
                    horsesQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_h WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",// ORDER BY dt DESC",
                    dogsQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_d WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",// ORDER BY dt DESC",
                    kaboomQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_kb WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",// ORDER BY dt DESC",
                    fiveQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_fv WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",
                    wofQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id FROM s_stakes_wof WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " AND is_header=1",// " GROUP BY package_id",
                    sportsQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id,evnt_src FROM s_prestakes WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " GROUP BY package_id HAVING evnt_src<1",// ORDER BY dt DESC",
                    liveQry: "SELECT dt,package_id,package_sum,wsum,ststatus,cr,user_id,evnt_src FROM s_prestakes WHERE dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " GROUP BY package_id HAVING evnt_src>0",// ORDER BY dt DESC"
                    otherQry: "SELECT dt,amount,type,user_id FROM s_acc_transactions WHERE deleted=0 AND type < 100 AND dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " " //ORDER BY dt DESC"
                },
                out: {
                    kenoQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_k WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    horsesQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_h WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    dogsQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_d WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    kaboomQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_kb WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    fiveQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_fv WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    wofQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id FROM s_stakes_wof WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " AND is_header=1",//  " GROUP BY package_id",// ORDER BY dt DESC",
                    sportsQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id,evnt_src FROM s_prestakes WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " GROUP BY package_id HAVING evnt_src<1",// ORDER BY dt DESC",
                    liveQry: "SELECT dt,package_id,package_sum,paid_sum as wsum,ststatus,cr,paid_user_id,evnt_src FROM s_prestakes WHERE vdt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' AND paid_sum>0 AND vyd=1 " + this.ufilter_out + " GROUP BY package_id HAVING evnt_src>0",//  ORDER BY dt DESC"
                    otherQry: "SELECT dt,amount,type,user_id FROM s_acc_transactions WHERE deleted=0 AND type >= 100 AND dt BETWEEN '" + this.today + " 06:00:00' AND '" + this.tomorrow + " 05:59:59' " + this.ufilter_in + " " //ORDER BY dt DESC"
                }
            }
        },

        init: function (reqs, rows, allow_date_filter, user_info, callback) {
            var self = this;
            var currHour = moment().hour();
            this.today =    moment().subtract(currHour < 6 ? 1 : 0, 'days').format("YYYY-MM-DD");
            this.tomorrow = moment().add(currHour < 6 ? 0 : 1, 'days').format("YYYY-MM-DD");
            var date_from = allow_date_filter == true ? reqs.dt_from : this.today;
            var date_till = allow_date_filter == true ? reqs.dt_till : this.today;
            var userIds = _.map(rows, function (val, key) { return val.user_id }).join(",");
            this.totalRows = mapRows(rows);
            this.finalRows = mapRows(rows);

            this.debtArr = null;
            this.finalBets = null;
            this.finalArchive = null;
            this.ufilter_in = user_info.user_level == 1 || user_info.user_type == 'ADMIN_RDNLY' || user_info.user_type == 'FRANCHISE_OWNER' || user_info.user_type == 'FRANCHISE_MANAGER' || user_info.user_type == 'FIELD-TERMINAL-MANAGER' || user_info.user_type == 'TERMINAL_MANAGER' || user_info.user_type == 'REGION_MANAGER' || user_info.user_type == 'COUNTRY_MANAGER' ? "AND user_id IN (" + userIds + ")" : "AND user_id='" + user_info.user_id + "'";
            this.ufilter_out = user_info.user_level == 1 || user_info.user_type == 'ADMIN_RDNLY' || user_info.user_type == 'FRANCHISE_OWNER' || user_info.user_type == 'FRANCHISE_MANAGER' || user_info.user_type == 'FIELD-TERMINAL-MANAGER' || user_info.user_type == 'TERMINAL_MANAGER' || user_info.user_type == 'REGION_MANAGER' || user_info.user_type == 'COUNTRY_MANAGER' ? "AND paid_user_id IN (" + userIds + ")" : "AND paid_user_id='" + user_info.user_id + "'";
            this.initQuery();
            var startDate = moment(date_from).add(1, 'days').format("YYYY-MM-DD");
            var endDate = moment(date_till).add(1, 'days').format("YYYY-MM-DD");
            //console.log(this.queries);

            //console.log('date_from',date_from);
            //console.log('today', today);

            var maxDate = "SELECT MAX(DATE) as maxdate FROM s_report_daily LIMIT 1";
            this.queryHandler(maxDate, function(response){
                var formatedDate = moment(response[0].maxdate).format("YYYY-MM-DD");
                var debtQuery = "SELECT user_id, total_debt, debt_sport_count, debt_keno_count, debt_kaboom_count, debt_live_count, " +
                    "debt_dogs_count, debt_horses_count, debt_five_count, debt_wof_count FROM s_report_daily WHERE date = '" + formatedDate + "' " + self.ufilter_in;
                self.queryHandler(debtQuery, function(debt){
                    self.finalCleared(debt, 'debt', allow_date_filter, reqs.list, function(final_resp){
                        if(final_resp != false) callback(final_resp);

                        //console.log('final', final);
                        //callback(final, 'debt');
                    })
                });
            });

            if(date_from < this.today){
                //collect archive data
                //console.log("bets - archive data");
                var mainQuery = "SELECT * FROM s_report_daily WHERE date BETWEEN  '" + startDate + "' AND '" + endDate + "' " + this.ufilter_in + " ORDER BY date DESC";
                this.queryHandler(mainQuery, function (response) {
                    if(response){
                        self.archivedQueryMapper(response, function(result){
                            if(result){
                                //clearResults(result, allow_date_filter, reqs.list, function(final){
                                self.finalCleared(result, 'archive', allow_date_filter, reqs.list,  function(final_resp){
                                    if(final_resp != false) callback(final_resp);
                                    //console.log('final', final);
                                    //callback(final, 'debt');
                                });
                                //})
                            }
                        })
                    }
                });
            }
            else{
                this.finalArchive = {};
            }

            if(date_till >= this.today) {
                // console.log("bets - today data");
                // console.log('in',self.totalRows[1]['in'].total,'out',self.totalRows[1]['in'].total);

                _.each(self.queries.in, function (field, index) {
                    //console.log(field);

                    var cleared = helpers.clearVariable(index);
                    self.queryHandler(field, function (res) {
                        if (res.error != true) {
                            self.result[cleared] = res;
                            //console.log('check in', self.checkResultObject());
                            if (self.checkResultObject()) {
                                self.mapAllResults('in', function (response) {
                                    if (response) {
                                        self.result = {};
                                        _.each(self.queries.out, function (field, index) {
                                            var cleared = helpers.clearVariable(index);
                                            self.queryHandler(field, function (result) {
                                                if (res.error != true) {
                                                    self.result[cleared] = result;
                                                    //console.log('check out', self.checkResultObject());
                                                    if (self.checkResultObject()) {
                                                        self.mapAllResults('out', function (resp) {
                                                            self.result = {};
                                                            //clearResults(resp, allow_date_filter, reqs.list, function(final){
                                                            self.finalCleared(resp, 'bets', allow_date_filter, reqs.list, function (final_resp) {
                                                                if (final_resp != false) callback(final_resp);
                                                            });

                                                            //});
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    });
                });
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                // console.log(this.totalRows);

            }
            else{
                this.finalBets = {};
            }
        },

        mapAllResults:function(output, callback){
            var self = this;
            var mapper = {};

            // console.log(output)
            // console.log(self.totalRows[1][output].total,' => ');

            _.each(['keno','horses','dogs','kaboom','live','five','wof','sports'], function (rowName, ind) {
                mapper[rowName] = objMapper(self.result[rowName], output);
            });
            mapper['other'] = objMapper(self.result['other'], output, 'other');

            _.each(self.totalRows, function (row, index) {
                self.totalRows[index][output].total = 0;
                _.each(['keno','horses','dogs','kaboom','live','five','wof','sports','other'], function (rowName, ind) {
                    if(mapper[rowName][output][row.user_id])
                        self.totalRows[index][output][rowName] += mapper[rowName][output][row.user_id];
                    self.totalRows[index][output].total += self.totalRows[index][output][rowName];
                });
            });

            callback(self.totalRows);
        },

        archive: function (reqs, rows, allow_date_filter, user_info, callback) {
            var self = this;
            var date_from = allow_date_filter == true ? reqs.dt_from : this.today;
            var date_till = allow_date_filter == true ? reqs.dt_till : this.today;
            var userIds = _.map(rows, function (val, key) { return val.user_id }).join(",");
            this.totalRows = mapRows(rows);
            this.ufilter_in = user_info.user_level == 1 ? "AND user_id IN (" + userIds + ")" : "AND user_id='" + user_info.user_id + "'";
            this.ufilter_out = user_info.user_level == 1 ? "AND paid_user_id IN (" + userIds + ")" : "AND paid_user_id='" + user_info.user_id + "'";
            this.totalRows = rows;
            var startDate = moment(date_from).add(1, 'days').format("YYYY-MM-DD");
            var endDate = moment(date_till).add(1, 'days').format("YYYY-MM-DD");

            var mainQuery = "SELECT * FROM s_report WHERE date BETWEEN  '" + date_till + "' AND '" + date_from + "' " + this.ufilter_in + " ORDER BY date DESC";
            this.queryHandler(mainQuery, function (response) {
                if(response){
                    self.archivedQueryMapper(response, function(result){
                        if(result){
                            clearResults(result, allow_date_filter, reqs.list, function(final){
                                callback(final);
                            });
                        }
                    })
                }
            });

        },

        checkResultObject: function () {
            var self = this;
            if(this.result['keno'] != undefined && this.result['horses'] != undefined && this.result['dogs'] != undefined &&
                this.result['kaboom'] != undefined && this.result['sports'] != undefined && this.result['live'] != undefined &&
                this.result['five'] != undefined && this.result['wof'] != undefined && this.result['other'] != undefined){
                return true;
            }
            else{
                return false;
            }
        },

        queryHandler: function (queryString, callback) {
            //console.log(queryString);
            var query = knex.raw(queryString).catch(function (error) {
                callback({
                    error: true,
                    message: 'Query Error',
                    data: error,
                    error_code: 'err_' + error.code
                });
                return;
            }).then(function (response) {
                if (response) callback(response[0]);
            });
        },

        archivedQueryMapper:function(response, callback){
            var self = this;
            _.each(self.totalRows, function (row, index) {
                var curReport = _.filter(response, function (data) {
                    return data.user_id == row.user_id;
                });
                if (!_.isEmpty(curReport)) {
                    _.each(curReport, function(val, key){
                        self.totalRows[index]['in'].keno    += val.keno_in;
                        self.totalRows[index]['in'].horses  += val.horses_in;
                        self.totalRows[index]['in'].dogs    += val.dogs_in;
                        self.totalRows[index]['in'].kaboom  += val.kboom_in;
                        self.totalRows[index]['in'].live    += val.live_in;
                        self.totalRows[index]['in'].five    += val.five_in;
                        self.totalRows[index]['in'].wof    += val.wof_in;
                        self.totalRows[index]['in'].sports  += val.sport_in;
                        self.totalRows[index]['in'].other   += val.other_in;
                        self.totalRows[index]['in'].total   += val.total_in;

                        self.totalRows[index]['out'].keno   += val.keno_out;
                        self.totalRows[index]['out'].horses += val.horses_out;
                        self.totalRows[index]['out'].dogs   += val.dogs_out;
                        self.totalRows[index]['out'].kaboom += val.kboom_out;
                        self.totalRows[index]['out'].live   += val.live_out;
                        self.totalRows[index]['out'].five   += val.five_out;
                        self.totalRows[index]['out'].wof   += val.wof_out;
                        self.totalRows[index]['out'].sports += val.sport_out;
                        self.totalRows[index]['out'].other  += val.other_out;
                        self.totalRows[index]['out'].total  += val.total_out;

                        self.totalRows[index]['debt_sport_count'] = val.debt_sport_count;
                        self.totalRows[index]['debt_keno_count'] = val.debt_keno_count;
                        self.totalRows[index]['debt'] = val.total_debt;
                    });
                }
            });
            callback(self.totalRows);
        },

        finalCleared:function(data, arg, allowFilter, type, callback){
            var self = this;
//            console.log('in',self.totalRows[1]['in'].total,'out',self.totalRows[1]['out'].total);

            if(arg == 'debt')    this.debtArr = data;
            if(arg == 'bets')    this.finalBets = data;
            if(arg == 'archive') this.finalArchive = data;
            //console.log('!___BETS___!', JSON.stringify(this.finalBets));
            //console.log('!archive!', JSON.stringify(this.finalBets));
            //console.log('!debt!', JSON.stringify(this.debtArr));
            if(this.debtArr != null && this.finalBets != null && this.finalArchive != null){
                _.each(self.totalRows, function(val, key){
                    var debt = _.find(self.debtArr, function(elems){
                        return elems.user_id == val.user_id
                    });
                    if(debt) {
                        val.debt = debt.total_debt;
                        val.debt_sport_count = debt.debt_sport_count;
                        val.debt_keno_count = debt.debt_keno_count;
                        val.debt_kaboom_count = debt.debt_kaboom_count;
                        val.debt_live_count = debt.debt_live_count;
                        val.debt_dogs_count = debt.debt_dogs_count;
                        val.debt_horses_count = debt.debt_horses_count;
                        val.debt_five_count = debt.debt_five_count;
                        val.debt_wof_count = debt.debt_wof_count;
                    }
                });

                clearResults(self.totalRows, allowFilter, type, function(final) {
                    callback(final);
                });
                //self.finalFlag = true;
            }
            else{
                callback(false);
            }
        }


    };

    return common;
};

function mapRows(rows) {
    _.each(rows, function (row, index) {
        //
        rows[index].in = {};
        rows[index].out = {};
        rows[index]['debt']         = 0;
        rows[index]['balance']      = 0;
        //in
        //_.each(rowNames, function (rowName, i) {
        //    rows[index]['in'][rowName] = 0;
        //    rows[index]['out'][rowName] = 0;
        //});
        rows[index]['in'].keno      = 0;
        rows[index]['in'].horses    = 0;
        rows[index]['in'].dogs      = 0;
        rows[index]['in'].kaboom    = 0;
        rows[index]['in'].live      = 0;
        rows[index]['in'].five      = 0;
        rows[index]['in'].wof      = 0;
        rows[index]['in'].sports    = 0;
        rows[index]['in'].other     = 0;
        rows[index]['in'].total     = 0;
        //out
        rows[index]['out'].keno     = 0;
        rows[index]['out'].horses   = 0;
        rows[index]['out'].dogs     = 0;
        rows[index]['out'].kaboom   = 0;
        rows[index]['out'].live     = 0;
        rows[index]['out'].five     = 0;
        rows[index]['out'].wof     = 0;
        rows[index]['out'].other    = 0;
        rows[index]['out'].sports   = 0;
        rows[index]['out'].total    = 0;

    });
    return rows;
}

function objMapper(object, output, additional) {
    var obj = {in: {}, out: {}};
    _.each(object, function (val, key) {
        if (val != undefined) {
            if (output == 'in'){
                if(additional != undefined && additional == 'other'){
                    obj.in[val.user_id] =  obj.in[val.user_id] == undefined ? val.amount : obj.in[val.user_id] + val.amount
                }
                else{
                    obj.in[val.user_id] = obj.in[val.user_id] == undefined ? val.package_sum : obj.in[val.user_id] + val.package_sum;
                }
            }

            if (output == 'out'){
                if(additional != undefined && additional == 'other'){
                    obj.out[val.user_id] =  obj.out[val.user_id] == undefined ? val.amount : obj.out[val.user_id] + val.amount
                }
                else{
                    obj.out[val.paid_user_id] = obj.out[val.paid_user_id] == undefined ? val.wsum : obj.out[val.paid_user_id] + val.wsum;
                }
            }
        }
    });
    return obj;
}

function clearResults(data, allowFilter, type, callback){
    var cleared = [];
    var total = {};
    var obj = {data:cleared, total:total};
    total['in']                     = {};
    total['out']                    = {};
    total['in'].keno_total_kassa    = 0;
    total['in'].horses_total_kassa  = 0;
    total['in'].dogs_total_kassa    = 0;
    total['in'].kaboom_total_kassa  = 0;
    total['in'].sports_total_kassa  = 0;
    total['in'].live_total_kassa    = 0;
    total['in'].five_total_kassa    = 0;
    total['in'].wof_total_kassa    = 0;
    total['in'].other_total_kassa   = 0;
    total['in'].total               = 0;
    total['out'].keno_total_kassa   = 0;
    total['out'].horses_total_kassa = 0;
    total['out'].dogs_total_kassa   = 0;
    total['out'].kaboom_total_kassa = 0;
    total['out'].sports_total_kassa = 0;
    total['out'].other_total_kassa  = 0;
    total['out'].five_total_kassa   = 0;
    total['out'].wof_total_kassa   = 0;
    total['out'].live_total_kassa   = 0;
    total['out'].total              = 0;
    total['total_debt']             = 0;
    _.each(data, function(val, index){
        if(val['in'].keno == 0 && val['in'].horses == 0 && val['in'].dogs == 0 && val['in'].kaboom == 0 && val['in'].live == 0 && val['in'].five == 0 && val['in'].wof == 0 && val['in'].sports == 0 &&
            val['in'].other == 0 && val['out'].keno == 0 && val['out'].horses == 0 && val['out'].dogs == 0 && val['out'].kaboom == 0 && val['out'].live == 0 && val['out'].five == 0 && val['out'].wof == 0 && val['out'].sports == 0 &&
            val['out'].other == 0  && val.e_summa == 0
        ){}
        // delete data[index];
        else{
            // if(val.user_type != 'TERMINAL')
            //     val.terminal_limit = 0;

            total['in'].keno_total_kassa    += val['in'].keno;
            total['in'].horses_total_kassa  += val['in'].horses;
            total['in'].dogs_total_kassa    += val['in'].dogs;
            total['in'].kaboom_total_kassa  += val['in'].kaboom;
            total['in'].sports_total_kassa  += val['in'].sports;
            total['in'].live_total_kassa    += val['in'].live;
            total['in'].five_total_kassa    += val['in'].five;
            total['in'].wof_total_kassa    += val['in'].wof;
            total['in'].other_total_kassa   += val['in'].other;
            total['in'].total               += val['in'].total;

            total['out'].keno_total_kassa   += val['out'].keno;
            total['out'].horses_total_kassa += val['out'].horses;
            total['out'].dogs_total_kassa   += val['out'].dogs;
            total['out'].kaboom_total_kassa += val['out'].kaboom;
            total['out'].sports_total_kassa += val['out'].sports;
            total['out'].five_total_kassa   += val['out'].five;
            total['out'].wof_total_kassa   += val['out'].wof;
            total['out'].live_total_kassa   += val['out'].live;
            total['out'].other_total_kassa  += val['out'].other;
            total['out'].total              += val['out'].total;
            total['total_debt']             += val['debt'];
            //total['balance']                += val['balance'];
            if(!allowFilter) delete val.debt;
            cleared.push(val);
        }
    });


    callback(obj);
}


