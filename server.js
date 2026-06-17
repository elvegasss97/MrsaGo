#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const orders = new Map();
const clients = new Set();
const demand = { active:false, waitMinutes:0, updatedAt:null };

function sendJson(res, code, data){
  res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
  res.end(JSON.stringify(data));
}
function snapshot(){
  return {orders:[...orders.values()].sort((a,b)=>(b.ts||0)-(a.ts||0)), demand};
}
function broadcast(){
  const data = JSON.stringify(snapshot());
  for(const res of clients){
    try{ res.write(`event: orders\ndata: ${data}\n\n`); }catch{}
  }
}
function body(req){
  return new Promise((resolve,reject)=>{
    let raw='';
    req.on('data', c=>{ raw+=c; if(raw.length>1e6){ req.destroy(); reject(new Error('too-large')); }});
    req.on('end', ()=>{ try{ resolve(raw ? JSON.parse(raw) : {}); }catch(e){ reject(e); }});
  });
}
function fileType(file){
  if(file.endsWith('.html')) return 'text/html; charset=utf-8';
  if(file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if(file.endsWith('.css')) return 'text/css; charset=utf-8';
  if(file.endsWith('.md')) return 'text/markdown; charset=utf-8';
  return 'application/octet-stream';
}
function lanUrls(){
  const nets = os.networkInterfaces();
  const ips=[];
  for(const list of Object.values(nets)) for(const n of list || []){
    if(n.family === 'IPv4' && !n.internal) ips.push(n.address);
  }
  return ips.map(ip=>`http://${ip}:${PORT}`);
}

const server = http.createServer(async (req,res)=>{
  try{
    const url = new URL(req.url, `http://${req.headers.host}`);
    if(req.method === 'OPTIONS'){
      res.writeHead(204, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}); return res.end();
    }
    if(req.method === 'GET' && url.pathname === '/api/orders') return sendJson(res,200,{orders:[...orders.values()].sort((a,b)=>(b.ts||0)-(a.ts||0))});
    if(req.method === 'GET' && url.pathname === '/api/demand') return sendJson(res,200,{demand});
    if(req.method === 'POST' && url.pathname === '/api/demand'){
      const data = await body(req);
      demand.active = !!data.active;
      demand.waitMinutes = demand.active ? Math.max(1, Math.min(240, Number(data.waitMinutes || 0) || 15)) : 0;
      demand.updatedAt = Date.now();
      broadcast();
      return sendJson(res,200,{ok:true,demand});
    }
    if(req.method === 'GET' && url.pathname === '/api/events'){
      res.writeHead(200, {'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','Access-Control-Allow-Origin':'*'});
      clients.add(res);
      res.write('retry: 1000\n\n');
      res.write(`event: orders\ndata: ${JSON.stringify(snapshot())}\n\n`);
      req.on('close',()=>clients.delete(res));
      return;
    }
    if(req.method === 'POST' && url.pathname === '/api/orders'){
      const order = await body(req);
      if(!order.id) order.id = Date.now()+'-'+Math.floor(Math.random()*999);
      if(!order.ts) order.ts = Date.now();
      if(!order.status) order.status = 'pending';
      orders.set(order.id, order); broadcast(); return sendJson(res,200,{ok:true,order});
    }
    const statusMatch = url.pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
    if(req.method === 'POST' && statusMatch){
      const id = decodeURIComponent(statusMatch[1]);
      const data = await body(req);
      const order = orders.get(id);
      if(!order) return sendJson(res,404,{ok:false,error:'not-found'});
      order.status = data.status || order.status;
      order.updatedAt = Date.now();
      orders.set(id, order); broadcast(); return sendJson(res,200,{ok:true,order});
    }
    const delMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
    if(req.method === 'DELETE' && delMatch){
      orders.delete(decodeURIComponent(delMatch[1])); broadcast(); return sendJson(res,200,{ok:true});
    }

    let file = url.pathname === '/' ? '/mesago-boraz-local.html' : url.pathname;
    file = path.normalize(file).replace(/^\.\.(\/|\\|$)/,'');
    const full = path.join(ROOT, file);
    if(!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()){
      res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('No encontrado');
    }
    res.writeHead(200, {'Content-Type':fileType(full)});
    fs.createReadStream(full).pipe(res);
  }catch(e){
    console.error(e);
    sendJson(res,500,{ok:false,error:e.message});
  }
});

server.listen(PORT, '0.0.0.0', ()=>{
  console.log('\nMesaGo demo local lista ✅');
  console.log(`\nEn este ordenador:`);
  console.log(`  Cliente: http://localhost:${PORT}/mesago-boraz-local.html`);
  console.log(`  Cocina:  http://localhost:${PORT}/mesago-cocina-local.html`);
  console.log('\nEn móvil/tablet conectados a la misma WiFi:');
  for(const base of lanUrls()){
    console.log(`  Cliente: ${base}/mesago-boraz-local.html`);
    console.log(`  Cocina:  ${base}/mesago-cocina-local.html`);
  }
  console.log('\nDeja esta ventana abierta mientras haces la demo.\n');
});
