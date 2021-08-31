#!/bin/bash             
sshpass -p "analokas" ssh -tt serverone@192.168.56.101 'cd ~/documentos/LabOne_Server;git clone https://github.com:lorenaa-rs/LabOne_Server.git;pm2 delete index.js;pm2 start index.js'
exit
