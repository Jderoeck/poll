// gelinkt in www lijn 23
exports.kickstart = function(server){
    const Primus = require('primus');
    let primus = new Primus(server, {});
    
    /**
     * eenmaal gebruiken bij het opstellen app. daarna nooit meer.
     * primus.library();
     * primus.save(__dirname +'/../public/javascripts/primuslib.js');
     */

    //connectie zoeken
    primus.on('connection', function(spark){
       console.log('Spark connected');
        
        //doe iets als je data krijgt van client
        spark.on('data', function(data){
            console.log("data from spark", data);
           primus.write({data}); 
        });
    });
}