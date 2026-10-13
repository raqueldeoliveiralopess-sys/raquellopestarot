// COB — cálculos astronômicos (Jean Meeus, "Astronomical Algorithms", caps. 27 e 49)
// Fases da Lua com precisão de minutos e equinócios/solstícios com precisão de minutos.
// Tudo em UTC; quem exibe converte para o fuso do aparelho.
(function(root){
  const RAD=Math.PI/180;
  const DELTA_T=70/86400; // TT − UTC, em dias (≈70 s nesta década)
  const jdParaData=jd=>new Date((jd-2440587.5)*86400000);
  const dataParaJd=d=>d.getTime()/86400000+2440587.5;
  const s=x=>Math.sin(x*RAD), c=x=>Math.cos(x*RAD);

  // Uma fase exata. k inteiro = Lua Nova; +0,25 quarto crescente; +0,5 cheia; +0,75 quarto minguante
  function faseExata(k){
    const T=k/1236.85, T2=T*T, T3=T2*T, T4=T3*T;
    let jde=2451550.09766+29.530588861*k+0.00015437*T2-0.000000150*T3+0.00000000073*T4;
    const E=1-0.002516*T-0.0000074*T2;
    const M=2.5534+29.10535670*k-0.0000014*T2-0.00000011*T3;
    const Mp=201.5643+385.81693528*k+0.0107582*T2+0.00001238*T3-0.000000058*T4;
    const F=160.7108+390.67050284*k-0.0016118*T2-0.00000227*T3+0.000000011*T4;
    const O=124.7746-1.56375588*k+0.0020672*T2+0.00000215*T3;
    const tipo=((k%1)+1)%1;
    let corr;
    if(tipo<0.01||tipo>0.99){
      corr=-0.40720*s(Mp)+0.17241*E*s(M)+0.01608*s(2*Mp)+0.01039*s(2*F)+0.00739*E*s(Mp-M)-0.00514*E*s(Mp+M)
        +0.00208*E*E*s(2*M)-0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)
        +0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)-0.00024*E*s(2*Mp-M)-0.00017*s(O);
    }else if(Math.abs(tipo-0.5)<0.01){
      corr=-0.40614*s(Mp)+0.17302*E*s(M)+0.01614*s(2*Mp)+0.01043*s(2*F)+0.00734*E*s(Mp-M)-0.00515*E*s(Mp+M)
        +0.00209*E*E*s(2*M)-0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)
        +0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)-0.00024*E*s(2*Mp-M)-0.00017*s(O);
    }else{
      corr=-0.62801*s(Mp)+0.17172*E*s(M)-0.01183*E*s(Mp+M)+0.00862*s(2*Mp)+0.00804*s(2*F)+0.00454*E*s(Mp-M)
        +0.00204*E*E*s(2*M)-0.00180*s(Mp-2*F)-0.00070*s(Mp+2*F)-0.00040*s(3*Mp)-0.00034*E*s(2*Mp-M)
        +0.00032*E*s(M+2*F)+0.00032*E*s(M-2*F)-0.00028*E*E*s(Mp+2*M)+0.00027*E*s(2*Mp+M)-0.00017*s(O);
      const W=0.00306-0.00038*E*c(M)+0.00026*c(Mp)-0.00002*c(Mp-M)+0.00002*c(Mp+M)+0.00002*c(2*F);
      corr+=tipo<0.5?W:-W;
    }
    return jdParaData(jde+corr-DELTA_T);
  }

  const PRINCIPAIS=['nova','quarto-crescente','cheia','quarto-minguante'];

  // Fases principais entre duas datas, em ordem
  function fasesEntre(ini,fim){
    const anos=(ini.getTime()/31557600000)+1970-2000;
    let k=Math.floor(anos*12.3685)-2;
    const out=[];
    for(let i=0;i<400;i++){
      for(let q=0;q<4;q++){
        const d=faseExata(k+q/4);
        if(d>fim)return out;
        if(d>=ini)out.push({fase:PRINCIPAIS[q],data:d});
      }
      k++;
    }
    return out;
  }

  // Fase de um instante: principal (no dia exato) ou intermediária
  function faseDoDia(d){
    const ini=new Date(d.getTime()-40*86400000), fim=new Date(d.getTime()+40*86400000);
    const fs=fasesEntre(ini,fim);
    const mesmoDia=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
    const exata=fs.find(f=>mesmoDia(f.data,d));
    let ant=null,prox=null;
    for(const f of fs){if(f.data<=d)ant=f;else if(!prox)prox=f;}
    const novas=fs.filter(f=>f.fase==='nova');
    let ultimaNova=null;for(const f of novas)if(f.data<=d)ultimaNova=f.data;
    const idade=ultimaNova?(d-ultimaNova)/86400000:0;
    const ilum=(1-Math.cos(2*Math.PI*idade/29.530588861))/2;
    let fase;
    if(exata)fase=exata.fase;
    else if(!ant)fase='crescente';
    else fase={nova:'crescente','quarto-crescente':'crescente-gibosa',cheia:'minguante-gibosa','quarto-minguante':'minguante'}[ant.fase];
    return {fase,idade,ilum,exata:exata||null,proxima:prox};
  }

  // Equinócios e solstícios (Meeus cap. 27), válidos de 2000 a 3000
  const TERMOS=[[485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],[156,73.14,45036.886],[136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],[70,243.58,9037.513],[58,119.81,33718.147],[52,297.17,150.678],[50,21.02,2281.226],[45,247.54,29929.562],[44,325.15,31555.956],[29,60.93,4443.417],[18,155.12,67555.328],[17,288.79,4562.452],[16,198.04,62894.029],[14,199.76,31436.921],[12,95.39,14577.848],[12,287.11,31931.756],[12,320.81,34777.259],[9,227.73,1222.114],[8,15.45,16859.074]];
  function estacao(ano,qual){ // 0 março, 1 junho, 2 setembro, 3 dezembro
    const Y=(ano-2000)/1000, Y2=Y*Y, Y3=Y2*Y, Y4=Y3*Y;
    const jde0=[
      2451623.80984+365242.37404*Y+0.05169*Y2-0.00411*Y3-0.00057*Y4,
      2451716.56767+365241.62603*Y+0.00325*Y2+0.00888*Y3-0.00030*Y4,
      2451810.21715+365242.01767*Y-0.11575*Y2+0.00337*Y3+0.00078*Y4,
      2451900.05952+365242.74049*Y-0.06223*Y2-0.00823*Y3+0.00032*Y4
    ][qual];
    const T=(jde0-2451545.0)/36525;
    const W=35999.373*T-2.47;
    const dl=1+0.0334*c(W)+0.0007*c(2*W);
    let S=0;for(const [A,B,C] of TERMOS)S+=A*c(B+C*T);
    return jdParaData(jde0+0.00001*S/dl-DELTA_T);
  }

  // Roda do Ano. Hemisfério sul: a roda gira ao contrário (Samhain no fim de abril, Yule em junho…)
  function sabas(ano,hemisferio){
    const sul=hemisferio!=='norte';
    const d=(m,dia)=>new Date(ano,m,dia,12);
    const fixos=sul
      ?[['lammas',d(1,1)],['samhain',d(3,30)],['imbolc',d(7,1)],['beltane',d(9,31)]]
      :[['imbolc',d(1,1)],['beltane',d(4,1)],['lammas',d(7,1)],['samhain',d(9,31)]];
    const est=[estacao(ano,0),estacao(ano,1),estacao(ano,2),estacao(ano,3)];
    const astro=sul
      ?[['mabon',est[0]],['yule',est[1]],['ostara',est[2]],['litha',est[3]]]
      :[['ostara',est[0]],['litha',est[1]],['mabon',est[2]],['yule',est[3]]];
    return fixos.concat(astro).map(([id,data])=>({id,data,astronomico:astro.some(a=>a[0]===id)})).sort((a,b)=>a.data-b.data);
  }

  function proximoSaba(d,hemisferio){
    const lista=sabas(d.getFullYear(),hemisferio).concat(sabas(d.getFullYear()+1,hemisferio));
    const hoje=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    return lista.find(x=>new Date(x.data.getFullYear(),x.data.getMonth(),x.data.getDate())>=hoje);
  }

  const api={faseExata,fasesEntre,faseDoDia,estacao,sabas,proximoSaba,dataParaJd,jdParaData};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LUA=api;
})(this);
