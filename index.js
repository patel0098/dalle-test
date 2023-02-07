const server = require('http').createServer;
const fs = require('fs');
const httpsRequest = require('https').request;
const url = require('url');

server((req, res)=>{
   let urlObj = url.parse(req.url, true);
   if(urlObj.pathname === '/'){
        fs.readFile("index.html", (err, data)=>{
            if(err){
                res.writeHead(500);
                res.end("Something went wrong!!");
            }
            res.writeHead(200, {
               "Content-Type":"text/html" 
            });
            res.end(data);
        });
   }
   if(urlObj.pathname === '/fetch'){
        if(req.method === 'POST'){
            let body = '';
            req.on('data', (data)=>{
                body += data;
            });
            req.on('end', ()=>{
                    let prompt = JSON.parse(body).prompt;
                    const openAIReq = httpsRequest('https://api.openai.com/v1/images/generations',{
                        'method':'POST',
                        'headers':{
                            'Content-Type':'application/json',
                            'Authorization':'Bearer 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'
                        }}, (resp)=>{
                        if(resp.statusCode !== 200){
                            console.log(resp.statusCode);
                        } else {
                            let body = '';
                            resp.on("data", (chunk)=>{
                                body += chunk
                            });
                            resp.on("end", ()=>{
                                let data = JSON.parse(body).data;
                                res.writeHead(200, {
                                    'Content-Type':'application/json'
                                });
                                res.end(JSON.stringify({'status':true, 'data':data}));
                                return;
                            });
                        }
                    });
                openAIReq.write(JSON.stringify({'prompt':prompt, 'n':2,'size':'256x256'}));
                openAIReq.end();
            });
        } else {
            res.writeHead(200, {
                "Content-Type":"application/json" 
             });
             res.end(JSON.stringify({'status':false, 'message':'Method not allowed!!'}));
             return;
        }
        
   }
})
.listen(8000);