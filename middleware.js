const express = require('express')
const app = express()
const port = 3000
const ipS1 = '192.168.10.17'
const ipS2 = '192.168.56.101'
const cors = require('cors')
const fetch = require('node-fetch')
const shell = require('shelljs');
const cron = require('cron')

app.use(cors())

var cronJob = cron.job('* * * * * *', function(){

    fetch(`http://${ipS1}:3000/status`)
    .then(response => response.text())
    .then((response) => {
        if(response === 'OK'){
            statusOn(1) 
        }else{
            statusOff(1)
        }
    })
    .catch( error => statusOff(1)); 
    fetch(`http://${ipS2}:3000/status`)
    .then(response => response.text())
    .then((response) => {
        if(response === 'OK'){
            statusOn(2) 
        }else{
            statusOff(2)
        }
    })
    .catch( error => statusOff(2))

    var now = new Date();
    var date = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
    var hour = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
    var report = date+"-"+hour+"-"+"...S1:"+statuss1+"...S2:"+statuss2;
    shell.exec(`./write_report.sh ${report}`)
});

cronJob.start();

var statuss1 = "NA";
var statuss2 = "NA";

function statusOn(numberServer){
    if(numberServer == 1){
        statuss1 = "On";
    }else if(numberServer == 2){
        statuss2 = "On";
    }
}

function statusOff(numberServer){
    if(numberServer == 1){
        statuss1 = "Off";
    }else if(numberServer == 2){
        statuss2 = "Off";
    }
}

app.get('/server1', (req, res) => {
    console.log("entra aqui")
    startServer1()
    statusOn(1)
    console.log("ejecutando s1")
})

app.get('/server2', (req, res) => {
    startServer2()
    statusOn(2)
    console.log("ejecutando s2")
})

function readServerStatus(){
    return shell.exec("sh read_status.sh")
}

function startServer1(){
    console.log("entra aqui en start server1")
    shell.exec("sh resetServer1.sh")
    statusOn(1)
}

function startServer2(){
    shell.exec("sh resetServer2.sh")
    statusOn(2)
}

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

app.get('/', (req, res) => {
    var data = {"ips1" : ipS1, "ips2": ipS2}
    var lastLog = readServerStatus().toString()
    var lines = lastLog.split("\n")
    for (let i = 0; i < lines.length-1; i++) {
        var split = lines[i].split("...")
        data["time"+(i+1)] = split[0].substring(0, split[0].length-1)
        data["s1"+(i+1)] = split[1].substring(3, 6)
        data["s2"+(i+1)] = split[2].substring(3, 6)   
    }
    res.send(data)
})
