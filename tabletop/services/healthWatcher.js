/**
 * Created by GAZ on 2/4/17.
 */

module.exports = function () {
    return{
        ref:0,
        alert_threshold:3000,
        max_alerts:5,

        check:function(time){
            if(time > this.alert_threshold) {
                if(++this.ref > this.max_alerts)
                {
                    console.error('RESPAWNING DUE TO LATENCY ', new Date());
                    process.exit(-1);
                }
            }
            else
                this.ref = 0;

        }
    }
};