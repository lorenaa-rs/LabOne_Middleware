$( document ).ready(function() {
    
    $.get("http://192.168.189.26:3000/",
                function(datos){
                    $('#ip-server1').text(datos.ips1)
                    $('#ip-server2').text(datos.ips2)
                    for (let i = 0; i < 5; i++) {
                        var data = '<tr>'+
                                    '<td><h1>Tiempo: '+datos['time'+(i+1)]+'</h1></td>'
                                    +'<td><h1>'+datos['s1'+(i+1)]+'</h1></td>'
                                    +'<td><h1>'+datos['s2'+(i+1)]+'</h1></td>'
                                    +'</tr>'   
                        $('#data-table').append(data)
                    }
                    if((datos['s15']==='Off')||(datos['s15']==='NA')){
                        $('#btn-serv1').css('visibility', 'visible')
                    }
                    if((datos['s25']==='Off')||(datos['s25']==='NA')){
                        $('#btn-serv2').css('visibility', 'visible')
                    }
                }
            )
    
    $('#btn-serv1').click(function(){
        $.get("http://192.168.189.26:3000/server1",
                function(datos){
                }
            )
    })

    $('#btn-serv2').click(function(){
        $.get("http://192.168.189.26:3000/server2",
                function(datos){
                }
            )
    })

})  
