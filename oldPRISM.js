var mineflayer = require("mineflayer");
var mc = require("minecraft-protocol");
var mcparser = require("minecraft-chat-packet");
var db = require("quick.db");
var chalk = require("chalk");
var EventEmitter = require("events").EventEmitter;
var Vec3 = require("vec3");
var Discord = require("discord.js");
var dcbot = new Discord.Client();
var Services = require("./__prismServices.js");

var bot = null;
//Alesha_ TheGasoline

console.log("OK");

var inCreative = false;

var USERPASS = "";
var USERNAME = "Prism_"; // kullanıcı adını yazın
var USERIP = "play.legendcrafttr.net"; //IP'yi yazın





var NOTEDATAPRE = {
	"0": "-3264,55,-1126",
	"1": "-3266,55,-1126",
	"2": "-3264,54,-1126",
	"3": "-3266,54,-1126",
	"4": "-3268,54,-1126",
	"5": "",
	"6": "",
	"7": "",
	"8": "",
	"9": "",
	"10": "",
}



















var sendRepls = true;
var grupsEnabled = true;
var yptlEnabled = false;
var justJoined = true;
var monitorDC = true;

var botStatus = false;
var stackDelay = 1001;
var q = [];
var w = " ";
var globalStack = [];
var bladdieTimer1 = null;
var bladdieTimer2 = null;
var yazanaptlPCHAT = true;

var AFKLIST = {};
var CHATLIST = {};
var MUTECACHE = {};
var lastMsgs = {};

var BADWORDS = ["oç", "orspu", "orospu", "amk", "amq", "aq", "piç", "pic", "anan", "ananı", "göt", "got"];
var dmRanks = ["[Padawan", "[Destek", "[Clone", 
"[Senpai", "[Storm", "[Jedi", "[Sensei", "[Chosen", "[Asistan", "[VIP", "[LegendVIP",
"[Yönetici", "[MVIP+", "[MVIP", "[Victorious", "[Kurucu", "[Moderatör", "[Mimar", "[Lances", "[Wraith", "[Admin"];
var dmPowerRanks = ["[Destek",  "[Asistan", "[Yönetici", "[Kurucu", "[Moderatör", "[Mimar", "[Admin"];
var SHRUG = "¯\\_(ツ)_/¯";
var lookAt = null;


















if(USERPASS === "") {
	let f = "a";
	let x4 = "k";
	let b = "";
	let zd = ".".repeat(10).split(b);
	let zxc = USERPASS;
	zxc += "iam" + f + `leg${b}i` + "tb" + Buffer.from([111, 116]).toString();
	zxc = USERPASS + b;
}
USERPASS = Buffer.from(USERPASS);
function newBot(ip, dontLoop) {
  
  botStatus = false;
  
  console.log("Loading new bot...");
  
  
  mc.ping({
    host: ip,
    port: 25565
  }, function(res){
    console.log("Response: "+JSON.stringify(res));
  });
  
  bot = mineflayer.createBot({
    host: ip,
    port: 25565,
    username: USERNAME,
    version: "1.12.2",
    keepAlive: true,
    colorsEnabled: false,
  });
  
  injectTPSFunc(bot);
  
  
  // #chat
  
  bot.on("chat", function(u, m){
	  if(!lastMsgs[u]) {
		  lastMsgs[u] = [m];
	  } else {
		  if(lastMsgs[u].length == 5) {
			  lastMsgs[u].push(m);
			  lastMsgs[u].shift();
		  } else {
			  lastMsgs[u].push(m);
		  };
	  };
  });
  
  bot.on("chatCustom", function(u, m){
	  
	  if(q.includes(m.toLowerCase())) {
		  Msg.send("/m ByCooky "+u+" kazandı.");
		  q = [];
	  };
	  
	  let justMarkedAFK = false;
	  if(m.toLowerCase() == "afk" && !AFKLIST[u]) {
		  justMarkedAFK = true;
		  Msg.send("/m "+u+" Sizi AFK olarak işaretledim ^^");
		  AFKLIST[u] = true;
	  };
	  if(AFKLIST[u] && !justMarkedAFK) {
		  delete AFKLIST[u];
		  Msg.send("/m "+u+" Yeniden hoşgeldin! (AFK işareti kaldırıldı)");
	  };
	  let mentionedAFK = [];
	  Object.keys(AFKLIST).forEach(function(afku){
		  if(m.includes(afku)) mentionedAFK.push(afku);
	  });
	  if(mentionedAFK.length > 0) {
		  if(mentionedAFK.length == 1) {
			 if(AFKLIST[mentionedAFK[0]] === true) {
				 Msg.send("/m "+u+" Hey, "+mentionedAFK[0]+" şuan AFK."); 
			 } else {
				 Msg.send("/m "+u+" Hey, "+mentionedAFK[0]+" şuan '"+AFKLIST[mentionedAFK[0]]+"' nedeniyle AFK."); 
			 };
		  } else {
			  Msg.send("/m "+u+" Hey, "+mentionedAFK.join(", ")+" kişileri şuan AFK.");
		  };
	  };
	  
	  if(m== USERNAME) Msg.send("/m "+u+" Efendim? Ben bir botum! Neler yapabilceğimi öğrenmek istiyorsan tp at! :D");
	  
	  
	  
	  parseQuestion(u, m);
	  
	  
	  
	  if(!sendRepls) return;
	  let userRN = UserPref.getName(u);
	  if(userRN === null) userRN = u;
	  //console.log("Chat> ["+u+"] "+m);
	  //console.log(u+"> "+m);
	  if(m.toLowerCase() =="sa" || m.toLowerCase() =="selamun aleyküm" || m.toLowerCase() =="selamün aleyküm" || m.toLowerCase() =="selamun aleykum" || m.toLowerCase() =="sa bot"){
		  //bot.chat("/m "+u+" Aleyküm Selam! ^^");
		  //Msg.send("/m "+u+" Aleyküm Selam, Hoş geldin.");
		  Msg.send("Aleyküm Selam, Hoş geldin "+userRN+"! ^^");
	  }
	  if(m=="anan nasıl moruq") bot.chat("Anam iyi (artık komik değil)");
	  if(m=="bruh") bot.chat("moment");
	  if(m.toLowerCase() == "prism benimle çıkarmısın") Msg.send("olr ne bilm");
	  if(m.toLowerCase() == "prism botmu") Msg.send("eet");
	  if(m.toLowerCase() == "selamün hello") Msg.send("aleyküm hello uwu");
	  if(m == "OwO") Msg.send(u+" Whats dis?");
	  if(m.toLowerCase() == "prism bozul") Msg.send("nooooo");
	  if(m.toLowerCase() =="hoşbulduk") Msg.send("Nasılsın "+u+", iyimisin?");
	  if(m.toLowerCase() =="lctr") Msg.send("En iyi sunucuya geldin!");
	  if(m.toLowerCase() =="prism nasılsın" || m.toLowerCase() =="prism naber") Msg.send("İyiyim, sen? ^^");
	  if(m.toLowerCase().includes("başım ağrıyor") || m.toLowerCase().includes("kafam ağrıyor")) {
		  if(u==userRN) {
			  Msg.send("/m "+u+" Geçmiş olsun...");
		  } else {
			  Msg.send("/m "+u+" Geçmiş olsun, "+userRN+"...");
		  };
	  };
	  if(m == "!shrug") Msg.send(SHRUG);
  });
  
  
  
  
  
  
  
  
	// #message
	bot.on("message", function(JSONmessage) {
		let cleanMsg = mcparser.parse(JSONmessage).replace(/§[0-9a-fklmno]/g, "");
		console.log(cleanMsg);
		logDC(cleanMsg);
		if(cleanMsg=="LCTR Network » Hesabına giriş yap: /login <şifre>") {
			bot.chat("/login "+USERPASS.toString());
		}
		if(cleanMsg=="§A§t§i§M§i§i§p") {
			setTimeout(function(){
				bot.chat("/creative");
				setTimeout(function(){
					if(!dontLoop) loopMSG();
					console.log("Looping...");
					bot.chat("/p v");
					setTimeout(function(){
						justJoined = false;
						//newBotFacti();
					}, 2000);
				}, 1000);
			}, 1000)
		}
		
		if(cleanMsg == "Creative » 5 dakika susturuldun!") {
			logDCEvent("Bot Mute Yedi", "bruh", "GRAY");
		};
		
		
		
		if(!cleanMsg.startsWith("[") && !cleanMsg.startsWith("【") && cleanMsg.includes("»") 
			&& !cleanMsg.startsWith("SOHBET") && !cleanMsg.startsWith("LCTR") && !cleanMsg.startsWith("Creative")) {
			
			let sp = cleanMsg.split("»");
			let spA = sp[0].trim().split(" ");
			if(spA.length == 1) {
				let user = spA[0].trim();
				let msg = sp[1].trim();
				bot.emit("chatCustom", user, msg);
			} else if (spA.length == 2) {
				let user = spA[1].trim();
				let msg = sp[1].trim();
				bot.emit("chatCustom", user, msg);
			} else {
				logDCEvent("", "[HATA] Chat parselanamadı: " + cleanMsg);
			}
			
		};
		
		
		
		
		
		if(cleanMsg.startsWith("[")) {
			/*let user = cleanMsg.split('-')[0].slice(1, -1);
			let cmd = cleanMsg.split('-')[1].split(']')[1].slice(1);
			
			console.log("[CMD] <"+user+"> "+cmd);
			PrismCMD(user, cmd);*/
			let splitted = cleanMsg.split(" ");
			if(dmRanks.includes(splitted[0])) {
				//desteğk vb
				
				let user = splitted[1];
				let cmd = splitted.slice(4).join(" ");
				if(user == "->") {
					user = splitted[0].split("[")[1];
					cmd = splitted.slice(3).join(" ");
				};
				console.log(chalk.green("Özel - ") + chalk.blue(user) + chalk.red(cmd));
				PrismCMD(user, cmd);
				
				if(dmPowerRanks.includes(splitted[0]) || user == "Alan404") {
					PrismOPCMD(user, cmd);
				}
				
			} else {
				//normal
				
				let user = splitted[0].split("[")[1];
				if(user == "ADİGE") return;
				if(user == "Server") return;
				if(user == "ben") return;
				let cmd = splitted.slice(3).join(" ");
				console.log(chalk.green("Normal - ") + chalk.blue(user) + chalk.red(cmd));
				PrismCMD(user, cmd);
				if(user == "Alan404") {
					PrismOPCMD(user, cmd);
				};
			}
		}
	});
	
	
	
	
	
	bot.on("spawn", function() {
		console.log(`(i) Bot spawned`);
	});
	
	bot.on("login", function() {
		botStatus = true;
		console.log("Bot connected!");
		console.log(`(i) Logged in`);
		logDC(`(i) Logged in`);
	});
	
	bot.on("kicked", function(reason, loggedIn) {
		console.log(`(!) Kicked. R: ${mcparser.parse(reason)}`);
		logDC(`(!) Kicked. R: ${mcparser.parse(reason)}`);
	});
	
	bot.on("end", function() {
		botStatus = false;
		console.log(`(!) Bot ended`);
		console.log("Restarting in 10 seconds...");
		inCreative = false;
		setTimeout(function(){
			console.log("Restarting now...");
			logDC("Restarting now...");
			newBot(ip, true);
		}, 10 * 1000);
	});
	
	
	
	// #playerJoined
	bot.on("playerJoined", function(player){
		
		db.set(`last-seen_${player.username}`, Date.now());
		
		if(player.username == "Alesha_" || player.username == "TheGasoline") {
			// domates323 ve Oskar_Schindler
			let d = new Date(Date.now());
			let msgToSend = player.username + " oyuna "+d.toLocaleDateString()+" "+d.toLocaleTimeString()+" zamanında girdi.";
			Mail.sendMail("Prism-Sistem", "domates232", msgToSend);
			Mail.sendMail("Prism-Sistem", "Oskar_Schindler", msgToSend);
		};
		if(!inCreative || player.username == "xEgosMenSS") return;
		if( player.username == "xEgosMenSS" ) return;
		if(justJoined) return;
		if(player.username.toLowerCase().includes("amk") || player.username.toLowerCase().includes("legos")) {
			Msg.sendMods("[Uyarı] Reklam benzeri hesap görüldü: " + player.username);
		};
		setTimeout(function(){
			let hasMail = Mail.hasMail(player.username);
			if(hasMail){
				let mails = Mail.getMail(player.username);
				if(UserPref.getOpts(player.username).notifyMail) Msg.send("/m "+player.username+" Hoşgeldin! "+mails.length+" adet yeni mailiniz var. Okumak için '/m Prism mail list' yaz.");
			}
			if(UserPref.hasGreet(player.username)) {
				let gr = UserPref.getGreet(player.username);
				if(gr === null | gr == "sil") return;
				Msg.send("/m "+player.username+" "+gr);
			};
			if(!grupsEnabled) return;
			let gs = Groups.getGroups(player.username);
			gs.forEach(function(g){
				if(!g.settings.sendJoins) return;
				Groups.sendMsg(g, player.username + " oyuna katıldı.", "Sys", player.username);
			});
		}, 1000);
	});
  
	bot.on("playerLeft", function(player){
		
		db.set(`last-seen_${player.username}`, Date.now());
		
		if(!grupsEnabled) return;
		let gs = Groups.getGroups(player.username);
		gs.forEach(function(g){
			if(!g.settings.sendJoins) return;
			Groups.sendMsg(g, player.username + " oyundan çıktı.", "Sys", player.username);
		});
	});
  
  
  
  
  return bot;
}





// #parse
function parseQuestion(user, msg) {
	Services.parseChat(user, msg, dcModMail, Msg, dcbotModMail, Discord);
	
	
	
	/*
	// küfür
	let i = msg.split(" ").join("").toLowerCase();
	if(i.includes("sik") || (i.includes("göt") && !i.includes("götür")) || ((i.includes("amın") && !i.includes("devamını")) && !i.includes("selamın")) ||
	i.includes("amcık") || i.includes("oruspu") || i.includes("orospu") || i.includes("oç")) {
		// dc M o dMa il(title, desc, user, msg, defTime)
		dcModMail("Potansiyel Küfür", "", user, msg, "10m");
	}
	
	if(i.includes("aternos") || i.includes("craftrise") || i.includes("sonoyuncu") || i.includes("provanas") || i.includes("legos")) {
		dcModMail("Potansiyel Reklam", "", user, msg, "999y");
	};
	
	if(i.includes("discordgg") && i.includes("http")) {
		dcModMail("Potansiyel Discord Reklamı", "", user, msg, "2d");
	};
	
	
	// sorular
	
	if((msg.includes("nasıl")) && (msg.includes("arsa") || msg.includes("alan")) && (msg.includes("silmek") || msg.includes("silinir") || msg.includes("silebilirim"))) {
		Msg.send("/m "+user+" Arsanı temizlemek için '/p clear' ardından '/p confirm' yazabilirsin.");
	}
	if((msg.includes("nasıl")) && (msg.includes("arsa") || msg.includes("alan")) && (msg.includes("alabilir") || msg.includes("alaca"))) {
		Msg.send("/m "+user+" Arsa almak için '/p auto' yazabilirsin.");
	}*/
};



























// #cmd
function PrismCMD(user, cmd) {
	GameCMD(user, cmd);
	console.log("<-- PRISM CMD TRIGGER -->");
	let args = cmd.split(" ");
	let didC = false;
	
	
	
	
	
	
	
	
	
	
	
	if (args[0] == "mail") {
		MailCommands.cmd(user, args);
		didC = true;
	}
	
	
	
	if(args[0] == "transfer" || args[0] == "pay") {
		didC = true;
		const dontList = ["prism", "nick", "isim"];
		if(args.length !== 3) return Msg.send("/m "+user+" Kullanım: transfer nick #");
		if(isNaN(Number(args[2]))) return Msg.send("/m "+user+" "+args[2]+" bir sayı değil!");
		let myBal = Economy.getBal(user);
		if(myBal < args[2]) return Msg.send("/m "+user+" Yeterince paranız yok.");
		if(args[2] == 0) return Msg.send("/m "+user+" 0 PTL Gönderemezsin.");
		if(args[1] == user) return Msg.send("/m "+user+" Kendine para atma bugu yasaktır. (İptal edildi)");
		if(dontList.includes(args[1].toLowerCase())) return Msg.send("/m "+user+" Eminim ki "+args[1]+" 'kullanıcısına' PTL atmak istemiyorsun. (İptal Edildi)");
		if(args[1] == "*" || args[1] == "**") {
			if(args[1] == "*") {
				let total = bot.players.size * args[2];
				if(myBal < total) return Msg.send("/m "+user+" Herkeze para göndermek için yeterli paranız yok. (Bölüşmek için **)");
			} else {
				let amount = Math.floor(bot.players.size / Number(args[2]));
				if(myBal < total) return Msg.send("/m "+user+" Herkeze para göndermek için yeterli paranız yok.");
				bot.players.forEach(function(p){
					Economy.addBal(p.username, amount);
				});
				Economy.addBal(user, -Number(args[2]));
			}
			return;
		};
		let theirBal = Economy.getBal(args[1]);
		Economy.addBal(user, -Number(args[2]));
		Economy.addBal(args[1], Number(args[2]));
		Msg.send("/m "+user+" Başarıyla "+args[1]+" kişisine "+args[2]+" PTL gönderildi.");
		if(UserPref.getOpts(args[1]).notifyTransaction) Msg.send("/m "+args[1]+" "+user+" kişisi size "+args[2]+" PTL transferledi.");
		logDCEvent("Transfer", "**Gönderen:** "+user+"\n**Alan:** "+args[1]+"\n**Miktar:** "+args[2], "GREEN");
	}
	
	if(args[0] == "bal") {
		didC = true;
		let bal = Economy.getBal(user);
		Msg.send("/m "+user+" Bakiyeniz "+bal+" PTL");
	}
	
	if(args[0]=="test") {
		didC = true;
		console.log(chalk.blue(JSON.stringify(bot.players)));
	}
	
	if(args[0] == "hgset") {
		didC = true;
		if(!args[1]) return Msg.send("/m "+user+" Kullanım: hgset <Mesaj>");
		let m = args.slice(1).join(" ");
		if(BADWORDS.includes(m.toLowerCase())) {
			Msg.send("/m "+user+" Kötü kelimeler kullanmayın!");
			Msg.sendMods(user+" kötü kelimeler kullanıyor. (hgset)");
			return;
		};
		Welcomer.setGreet(user, args[1]);
		Msg.send("/m "+user+" Başarıyla karşılama mesajı ayarlandı.");
	};
	
	if(args[0] == "afk") {
		didC = true;
		if(args.length === 1) {
			Msg.send("/m "+user+" Artık AFK'sınız ^^");
			setTimeout(function(){
				AFKLIST[user] = true;
			}, 1000);
		} else {
			let r = args.slice(1).join(" ");
			if(BADWORDS.includes(r.toLowerCase())) {
				Msg.send("/m "+user+" Kötü kelimeler kullanmayın!");
				Msg.sendMods(user+" kötü kelimeler kullanıyor. (afk)");
				return;
			};
			Msg.send("/m "+user+" Artık bu nedenle AFK'sınız: "+r);
			setTimeout(function(){
				AFKLIST[user] = r;
			}, 1000);
		};
	};
	
	if(args[0] == "ayar") {
		didC = true;
		if(args[1] == "isim"){
			Msg.send("/m "+user+" nö");
			/*
			let n = args.slice(2).join(" ")
			if(BADWORDS.includes(n.toLowerCase())) {
				Msg.send("/m "+user+" Kötü kelimeler kullanmayın!");
				Msg.sendMods(user+" kötü kelimeler kullanıyor. (ayar isim)");
				return;
			};
			UserPref.setName(user, n);
			Msg.send("/m "+user+" Başarıyla isminizi "+n+" olarak kaydettim.");
			logDCEvent("İsim Değiştirildi", "**Nick:** "+user+"\n**İsim:** "+n, "BLUE");*/
		};
		if(args[1] == "notify-mail" || args[1] == "mail") {
			let s = UserPref.setOpts(user, "notifyMail", args[2]);
			if(s) {
				Msg.send("/m "+user+" Başaryla ayar kaydedildi.");
			} else {
				Msg.send("/m "+user+" Lütfen düzgün bir value yazın.");
			}
		};
		if(args[1] == "notify-pay" || args[1] == "pay") {
			let s = UserPref.setOpts(user, "notifyTransaction", args[2]);
			if(s) {
				Msg.send("/m "+user+" Başaryla ayar kaydedildi.");
			} else {
				Msg.send("/m "+user+" Lütfen düzgün bir value yazın.");
			}
		};
	};
	
	if(args[0] == "grup") {
		if(!grupsEnabled) return;
		didC = true;
		if(args[1] == "oluştur"){
			let isim = args.slice(2).join(" ");
			let g = Groups.createGroup(user, isim);
			Msg.send("/m "+user+" Başarıyla yeni grup oluşturuldu. ID: " + g.id);
			logDCEvent("Yeni Grup Oluşturuldu", "**Oluşturan:** "+user+"\n**Grup İsmi:** "+isim+"\n**Grup ID'si:** "+g.id, "CYAN");
		};
		if(args[1] == "list") {
			let groupList = Groups.getGroups(user);
			if(groupList.length === 0) {
				Msg.send("/m "+user+" Hiçbir grupta değilsiniz");
			} else {
				let list = [];
				groupList.forEach(function(grp){
					list.push(grp.settings.name + " (" + (grp.id) + ")");
				});
				Msg.send("/m "+user+" "+list.join("; "));
			};
		};
		if(!isNaN(args[1])) {
			let id = Number(args[1]);
			let g = Groups.getGroup(user, id);
			if(g === null) return Msg.send("/m "+user+" Böyle bir grup yok.");
			if(g === false) return Msg.send("/m "+user+" Öyle bir grupta değilsiniz.");
			if(args[2] == "ekle" || args[2] == "add") {
				if(!g.managers.includes(user)) return Msg.send("/m "+user+" Bu grupta yetkiniz yok.");
				let addNick = args[3];
				Msg.send("/m " + addNick + " Gruplar>> "+user+" sizi '"+g.settings.name+"' grubuna davet etti.");
				requestConfirmation(addNick, "Gruplar>> Kabul etmek için '/r katıl" + g.id + "' yazın.", "katıl" + g.id, 60 * 1000, function(user, msg){
					//cb
					Groups.addMember(id, args[3]);
					Groups.sendMsg(g, args[3] + ", " + user + " tarafından gruba eklendi.", "");
				});
				Msg.send("/m "+user+" "+addNick+"'e davet gönderildi.");
			};
			if(args[2] == "çıkar" || args[2] == "remove") {
				if(!g.managers.includes(user)) return Msg.send("/m "+user+" Bu grupta yetkiniz yok.");
				Groups.removeMember(id, args[3]);
				Groups.sendMsg(g, args[3] + ", " + user + " tarafından gruptan çıkarıldı.", "Sys");
				Msg.send("/m "+args[3]+" "+g.settings.name+" grubundan çıkarıldınız.");
			};
			if(args[2] == "promote" || args[2] == "yetkiver" || args[2] == "rankup") {
				if(!g.members.includes(args[3])) {
					return Msg.send("/m "+user+" "+args[3]+" kişisi grupta değil yada zaten bir yönetici.");
				}
				Groups.rankup(id, args[3]);
				Msg.send("/m "+user+" Başarıyla "+args[3]+"'e yetki verildi.");
			}
			if(args[2] == "demote" || args[2] == "yetkial" || args[2] == "rankdown") {
				if(!g.managers.includes(args[3])) {
					return Msg.send("/m "+user+" "+args[3]+" kişisi grupta değil yada zaten bir üye.");
				}
				Groups.demote(id, args[3]);
				Msg.send("/m "+user+" Başarıyla "+args[3]+"'ün yetkisi alındı.");
			}
			if(args[2] == "ayrıl") {
				Groups.removeMember(id, user);
				Groups.sendMsg(g, user + " gruptan ayrıldı.", "Sys");
			};
			if(args[2] == "ayar") {
				if(!g.managers.includes(user)) return Msg.send("/m "+user+" Bu grupta yetkiniz yok.");
				if(args[3] == "sendjoin" || args[3] == "katılmamesajı" || args[3] == "joinmsg") {
					let s = Groups.setOpts(id, "sendJoins", args[4]);
					if(s) {
						Msg.send("/m "+user+" Başarıyla ayarlandı.");
					} else {
						Msg.send("/m "+user+" Bir hata oluştu. Düzgün bir value girin.");
					}
				}
				if(args[3] == "permmsg") {
					let s = Groups.setOpts(id, "permRequiredToChat", args[4]);
					if(s) {
						Msg.send("/m "+user+" Başarıyla ayarlandı.");
					} else {
						Msg.send("/m "+user+" Bir hata oluştu. Düzgün bir value girin.");
					}
				}
			}
			if(args[2] == "bilgi") {
				Msg.send("/m "+user+" ID: "+id+" / İsim: "+g.settings.name+" / "+(g.members.length+g.managers.length)+" kişi.");
			}
			if(args[2] == "üyeliste" || args[2] == "üyeler") {
				Msg.send("/m "+user+" "+g.members.join("; "));
			}
			if(args[2] == "yöneticiliste" || args[2] == "yöneticiler") {
				Msg.send("/m "+user+" "+g.managers.join("; "));
			}
		};
	};
	
	
	if(args[0] == "chat") {
		if(!args[1]) return Msg.send("/m "+user+" Kullanım: chat <Grup ID>");
		if(args[1] == "all") {
			CHATLIST[user] = "all";
			Msg.send("/m "+user+" Artık her gruba msg atıyorsunuz.");
		} else {
			let g = Groups.getGroup(user, args[1]);
			if(g === null) return Msg.send("/m "+user+" Böyle bir grup yok.");
			if(g === false) return Msg.send("/m "+user+" Öyle bir grupta değilsiniz.");
			CHATLIST[user] = args[1];
			Msg.send("/m "+user+" Chat artık " + g.settings.name + " grubunda. Bota mesaj atarak gruba msg atın.");
		}
	}
	
	
	if(didC) return;
	if(!grupsEnabled) return;
	let groups = Groups.getGroups(user);
	if(groups.length != 0) {
		
		if(!CHATLIST[user]) return;
		if(CHATLIST[user] == "all") {
			groups.forEach(function(g){
					Groups.sendMsg(g, cmd, user);
			});
		} else {
			let g = Groups.getGroup(user, CHATLIST[user]);
			let s = Groups.sendMsg(g, cmd, user);
			if(!s) Msg.send("/m "+user+" Bu gruba mesaj atmak için izniniz yok.");
		}
		
		/*
		if(groups.length == 1) {
			let g = groups[0];
			let s = Groups.sendMsg(g, cmd, user);
			if(!s) Msg.send("/m "+user+" Bu gruba mesaj atmak için izniniz yok.");
		} else {
			if(!cmd.includes(".")) return;
			let sp = cmd.split(".");
			if(isNaN(sp[0])) {
				if(sp[0] == "a") {
					groups.forEach(function(g){
						Groups.sendMsg(g, sp.slice(1).join("."), user);
					});
					return;
				};
			} else {
				let n = Number(sp[0]);
				let g = Groups.getGroup(user, n);
				if(g === null) return Msg.send("/m "+user+" Böyle bir grup yok.");
				if(g === false) return Msg.send("/m "+user+" Bu grupta değilsiniz.");
				let s = Groups.sendMsg(g, sp.slice(1).join("."), user);
				if(!s) Msg.send("/m "+user+" Bu gruba mesaj atmak için izniniz yok.");
			}
		};*/
	};
}






// #opcmd
function PrismOPCMD(u, cmd) {
	let args = cmd.split(" ");
	if(cmd == "saaskapa") {
		sendRepls = false;
		Msg.send("/m "+u+" Tamam kapadım");
	};
	if(cmd == "saasaç") {
		sendRepls = true;
		Msg.send("/m "+u+" Tamam açtım");
	};
	if(cmd.split(" ")[0] == "soru") {
		let a = cmd.split(" ");
		if(a == "sil") {
			q = [];
		} else {
			q.push(a.slice(1).join(" "));
		};
	}
	if(cmd=="testOP") Msg.send("/m "+u+" Yes");
	if(args[0]=="yazanaptl") {
		if(args.length == 1) {
			yazanaPTL(100);
		} else {
			if(isNaN(args[1])) return;
			yazanaPTL(Number(args[1]));
		};
	};
	if(args[0] == "eval") {
		let e;
		try {
			e = eval(args.slice(1).join("."));
		} catch(err) {
			e = err
		};
		Msg.send("/m " + u + " > " + e);
	};
	if(cmd=="reload") Services = require("./__prismServices.js");
	if(cmd=="yptlpchat") yazanaptlPCHAT = true;
	if(cmd=="yptlglobal") yazanaptlPCHAT = false;
	if(cmd.split(" ")[0]=="addafk") AFKLIST[cmd.split(" ")[1]] = true;
	if(cmd.split(" ")[0]=="alertmods") Msg.sendMods(cmd.split(" ").slice(1).join(" "));
	if(args[0] == "isimbul") {
		let list = [];
		let onlyNamesList = [];
		db.all().forEach(function(entry){
			list.push(entry.ID);
		});
		list.forEach(function(key){
			
		});
	};
	if(args[0] == "isimset") {
		UserPref.setName(args[1], args.slice(2).join(" "));
	};
	if(args[0] == "ismine") {
		Msg.send("/m "+u+" "+args[1]+"in kayıtlı ismi "+UserPref.getName(args[1]));
	};
	if(args[0] == "lastseen") {
		let p = args[1];
		let time = db.get(`last-seen_${p}`);
		let d = new Date(time);
		if(time === null) {
			Msg.send("/m "+u+" "+p+" kişisi hiç görülmedi.");
		} else {
			Msg.send("/m "+u+" "+p+" kişisi en son "+d.toLocaleDateString()+" "+d.toLocaleTimeString()+" zamanında görüldü.");
		};
	};
	if(args[0] == "mailOKU") {
		let mails = Mail.getMail(args[1]);
		if(mails == null) {
			Msg.send("/m "+u+" O kişinin maili yok.");
		} else {
			for(let i = 0; i !== mails.length ; i++) {
				Msg.send("/m " + u +" >> (" + i + ") [" + mails[i].from + "] " + mails[i].msg);
			}
		};
	};
	if(args[0] == "sn") {
		NOTEDATAPRE[args[1]] = bot.players[u].entity.position.floor().toString();
	}
	if(args[0] == "snlog") {
		console.log(require("util").inspect(NOTEDATAPRE));
	}
};






























class MailCommands {
	static cmd(user, args){
		//console.log("--mail trigger : "+user+": "+args);
		let didCMD = false;
		
		if(args[1] == "send") {
			didCMD = true;
			if(args.length < 3) {
				return Msg.send("/m "+user+" Kullanım: mail send Kişi Mesaj");
			}
			let newMsg = args.slice(3).join(" ");
			let resultOfMailSend = Mail.sendMail(user, args[2], newMsg);
			if(resultOfMailSend == "blocked") {
				Msg.send("/m "+user+" Bu kişi sizi bloklamış. Mesaj gönderilemedi.");
			} else if(resultOfMailSend == "alrSend") {
				Msg.send("/m "+user+" İptal edildi: Bu kişiye zaten bu maili attınız.");
				logDCEvent("Mail Gönder - AntiSpam", "**Gönderen:** "+user+"\n**Alıcı:** "+args[2]+"\n\n**Mesaj:** "+newMsg+"\n\nİptal edildi.", "YELLOW");
			} else {
				Msg.send("/m "+user+" "+args[2]+" kişisine mesaj gönderildi.");
				logDCEvent("Mail Gönderildi", "**Gönderen:** "+user+"\n**Alıcı:** "+args[2]+"\n\n**Mesaj:** ||"+newMsg+"||", "GREEN");
			}
		}		
		
		if(args[1] == "read" || args[1] == "list") {
			didCMD = true;
			let mails = Mail.getMail(user);
			if(mails == null) {
				Msg.send("/m "+user+" Mailiniz yok.");
			} else {
				for(let i = 0; i !== mails.length ; i++) {
					Msg.send("/m " + user +" (" + i + ") [" + mails[i].from + "] " + mails[i].msg);
				}
			}
		}
		
		
		if( args[1] == "delete" || args[1] == "sil" ) {
			didCMD = true;
			if(args.length !== 3) {
				return Msg.send("/m "+user+" Kullanım: mail delete #");
			} else if (!isNaN(parseInt(args[2])) && (args[2] !== "*" || args[2] !== "hepsi" || args[2] !== "all")) {
				return Msg.send("/m "+user+" Hata: "+args[2]+" bir sayı değil.");
			}
			
			if(args[2] !== "*" || args[2] !== "hepsi" || args[2] !== "all") {
				Mail.deleteAll(user);
				Msg.send("/m "+user+" Bütün mailleriniz silindi.");
			} else {
				let resultOfMailDelete = Mail.deleteMail(user, args[2]);
				if(resultOfMailDelete) {
					Msg.send("/m "+user+" Başarıyla mail silindi.");
				} else {
					Msg.send("/m "+user+" Bir hata oluştu.");
				}
			}
		}
		
		if(args[1] == "block" || args[1] == "blok") {
			didCMD = true;
			if(args[2] == undefined) return Msg.send("/m "+user+" Kullanım: mail block nick");
			Mail.block(user, args[2]);
			Msg.send("/m "+user+" Başarıyla "+args[2]+" bloke edildi.");
		}
		
		if(args[1] == "unblock" || args[1] == "unblok") {
			didCMD = true;
			if(args[2] == undefined) return Msg.send("/m "+user+" Kullanım: mail unblock nick");
			Mail.unblock(user, args[2]);
			Msg.send("/m "+user+" Başarıyla "+args[2]+" unblocklandı.");
		}
		
		if(didCMD == false) {
			Msg.send("/m "+user+" Sadece mail olan bir komut yok... Tp at ve komutları öğren?");
		}
	}
	static OPcmd(user, args) {
		
	};
}















class Groups {
	static getGroups(user) {
		let d = db.get(`groups`);
		if(d === null) {
			d = [];
			db.set(`groups`, []);
		};
		let arr = [];
		d.forEach(function(group){
			if(group.members.includes(user) || group.managers.includes(user)) {
				arr.push(group);
			};
		});
		return arr;
	};
	static getGroup(user, id){
		let d = db.get(`groups`);
		if(d[id] === undefined) return null;
		let g = d[id];
		if(g.managers.includes(user) || g.members.includes(user)) {
			return g;
		} else {
			return false;
		};
	};
	static createGroup(user, name) {
		let obj = {
			settings: {
				permRequiredToChat: false,
				name: name,
				sendJoins: false
			},
			members: [],
			managers: [user],
			ogCreator: user,
			created: Date.now(),
			id: db.get(`groups`).length,
			deleted: false
		};
		db.push(`groups`, obj);
		return obj;
		
	};
	static addMember(id, member) {
		let g = db.get("groups");
		g[id].members.push(member);
		db.set(`groups`, g);
	};
	static removeMember(id, member) {
		let g = db.get("groups");
		g[id].members = removeFromArr(g[id].members, member);
		g[id].managers = removeFromArr(g[id].managers, member);
		if(g[id].members.length === 0 && g[id].managers.length === 0) {
			g[id].deleted = true;
			let d = new Date(g[id].created);
			logDCEvent("Grup Silindi", "**Oluşturan:** "+g[id].ogCreator+"\n**Grup İsmi:** "+g[id].settings.name+"\n**Grup ID'si:** "+id+"\n**Oluşturulma Tarihi: **" + d.toLocaleDateString() + " " + d.toLocaleTimeString(), "RED");
		}
		db.set(`groups`, g);
	};
	static rankup(id, member) {
		let g = db.get("groups");
		g[id].members = removeFromArr(g[id].members, member);
		g[id].managers.push(member);
		db.set(`groups`, g);
	};
	static demote(id, member) {
		let g = db.get("groups");
		g[id].managers = removeFromArr(g[id].managers, member);
		g[id].members.push(member);
		db.set(`groups`, g);
	};
	static setOpts(id, opt, input){
		let g = db.get(`groups`);
		let x;
		if(input == "true" || input == "1" || input == "y") x = true;
		if(input == "false" || input == "0" || input == "n") x = false;
		if(x === undefined) return false;
		g[id].settings[opt] = x;
		db.set(`groups`, g);
		return true;
	}
	
	
	static sendMsg(group, msg, sentBy, otherSentBy){
		if(group.settings.permRequiredToChat) {
			return false;
		}
		group.members.forEach(function(u){
			if(u == otherSentBy) return;
			if(u == sentBy) return;
			if(!bot.players[u]) return;
			Msg.send("/m "+u+" "+group.settings.name+"//"+sentBy+"> "+msg);
		});
		group.managers.forEach(function(u){
			if(u == otherSentBy) return;
			if(u == sentBy) return;
			if(!bot.players[u]) return;
			Msg.send("/m "+u+" "+group.settings.name+"//"+sentBy+"> "+msg);
		});
		return true;
	};
};



























class Mail {
	static sendMail(username, sendTo, message){
		let blocks = db.get(`mailBlock_${sendTo}`);
		if(blocks === undefined || blocks === null) {
			blocks = [];
		} else {
			if(blocks.includes(username)) {
				return "blocked";
			}
		}
		
		let theirMailList = Mail.getMail(sendTo);
		if(theirMailList == null) theirMailList = [];
		let theirMailListArray = [];
		theirMailList.forEach(function(mail){
			theirMailListArray.push(mail.msg);
		});
		if(theirMailListArray.includes(message)) {
			return "alrSend";
		};
		
		if(!db.has(`mail_${sendTo}`)) {
			db.set(`mail_${sendTo}`, [{"from": username, "msg": message}]);
			return "first";
		}
		db.push(`mail_${sendTo}`, {"from": username, "msg": message});
		return "done"
	}
	
	static deleteMail(username, i){
		let mailData = db.get(`mail_${username}`);
		if (mailData[i] == null) return false;
		delete mailData[i];
		db.set(`mail_${username}`, mailData);
		return true;
	}
	
	static deleteAll(username){
		db.set(`mail_${username}`, []);
	}
	
	static hasMail(username){
		let mailData = db.get(`mail_${username}`);
		if(mailData == null) {
			mailData = [];
			db.set(`mail_${username}`, []);
		}
		if (mailData.length == 0) {
			return false;
		} else {
			return true;
		}
	}
	
	static getMail(username){
		if(!db.has(`mail_${username}`)) {
			db.set(`mail_${username}`, []);
			return null;
		}
		let mailData = db.get(`mail_${username}`);
		if (mailData == [] || mailData.length == 0) {
			return null;
		} else {
			return mailData;
		}
	}
	
	static block(username, blocked) {
		db.push(`mailBlock_${username}`, blocked);
	}
	
	static unblock(username, unblocked) {
		let blocks = db.get(`mailBlock_${username}`);
		if(blocks === null) return;
		if(blocks.indexOf(unblocked) == -1) return;
		delete blocks[blocks.indexOf(unblocked)];
		db.set(`mailBlock_${username}`, blocks);
	}
}








class Economy {
	static getBal(username) {
		if(db.has(`bal_${username}`)) {
			let bal = db.get(`bal_${username}`);
			if(isNaN(bal)) {
				db.set(`bal_${username}`, 200);
				return 200;
			} else {
				return bal;
			}
		} else {
			db.set(`bal_${username}`, 200);
			return 200;
		}
	}
	
	static setBal(username, bal) {
		db.set(`bal_${username}`, bal);
	}
	
	static addBal(username, bal) {
		db.add(`bal_${username}`, bal);
	}
}







class UserPref {
	static getGreet(user) {
		let r = db.get(`welcomeMsg_${user}`);
		return r;
	}
	static setGreet(user, greet) {
		db.set(`welcomeMsg_${user}`, greet);
	}
	static hasGreet(user) {
		let r = db.has(`welcomeMsg_${user}`);
		return r;
	}
	static getName(user){
		let r = db.get(`pref-name_${user}`);
		return r;
	};
	static setName(user, name){
		db.set(`pref-name_${user}`, name);
	};
	static setOpts(user, opt, input){
		let d = db.get(`pref-settings_${user}`);
		if(d === null) {
			d = {
				notifyMail: true,
				notifyTransaction: true
			}
		}
		let x;
		if(input == "true" || input == "1" || input == "y") x = true;
		if(input == "false" || input == "0" || input == "n") x = false;
		if(x === undefined) return false;
		d[opt] = x;
		db.set(`pref-settings_${user}`, d);
		return true;
	}
	static getOpts(user){
		let x = db.get(`pref-settings_${user}`);
		if(x === null) {
			let obj = {
				notifyMail: true,
				notifyTransaction: true
			}
			x = obj;
			db.set(`pref-settings_${user}`, obj);
		}
		return x;
	}
};



















class GameManagerClass {
	constructor(){
		this.list = [];
	}
};
var GameManager = new GameManagerClass();


class TicTacToe extends EventEmitter {
	constructor(p1, p2){
		this.currentMove = 0;
		this.players = [p1, p2];
		this.board = ["_","_","_","_","_","_","_","_","_"];
		this.winner = null;
		
	}
	doMove(player, move){
		
	}
};





const GameMoves = ["1","2","3","4","5","6","7","8","9"];
function GameCMD(u, m) {
	if(!GameMoves.includes(m)) return;
}





var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
	let command = d.toString().trim()
    console.log("Inputted: [" + command + "]");
	if (botStatus && command.startsWith("!") == false) {
		bot.chat(command);
	} else {
		if(command == "!retry") newBot("play.legendcrafttr.net");
		if(command == "!") loopMSG();
	}
});


var lastPing = 0;
var lastTPS = 0;

function loopMSG() {
	inCreative = true;
	setInterval(function(){
		
		if(lookAt != null) {
			bot.lookAt(bot.players[lookAt].entity.position)
		}
		
		
		if(Msglist == [] || Msglist[0] == undefined) return;
		bot.chat(Msglist[0]);
		Msglist.shift();
	}, stackDelay);
	
	setInterval(function(){
		Object.keys(bot.players).forEach(function(player){
			db.set(`last-seen_${player}`, Date.now());
		});
		if(!yptlEnabled) return;
		yazanaPTL(200);
	},  10 * 60 * 1000);
}



class Msg {
	static send(msg){
		Msglist.push(msg);
		//bot.chat(msg);
	}
	static sendMods(msg){
		let modlist = ["Bladdie", "varkentjekna", "xEgosMenSS", "SirContra", "TolgaKMS", "xWestLC", "AYARS1Z"];
		modlist.forEach(function(mod){
			if(bot.players[mod]) Msg.send("/m "+mod+" "+msg);
		});
	};
	static log(msg) {
		if(MsgLOG.includes(msg)) return;
		MsgLOG.push(msg);
		setTimeout(function(){
			let i = MsgLOG.indexOf(msg);
			MsgLOG.slice(i, 1);
		}, 60 * 1000);
	};
}
Msglist = [];
MsgLOG = [];





function yazanaPTL(price) {
	let a = Math.round(Math.random() * 10000000000000000000000000000);
	let b = 0;
	//let b = Math.round(Math.random() * 100000);
	if(yazanaptlPCHAT) Msg.send("/p chat");
	//Msg.send("<Ödül> Hey, "+a+"+"+b+"=? ("+price+"PTL!)");
	Msg.send("<Ödül> Hey, "+a+" yazana "+price+"PTL!");
	if(yazanaptlPCHAT) Msg.send("/p chat");
	let done = false;
	const handler = function(u, m){
		if(m == a+b) {
			done = true;
			if(yazanaptlPCHAT) Msg.send("/p chat");
			Msg.send("<Ödül> Ödülü "+u+" kazandı.");
			if(yazanaptlPCHAT) Msg.send("/p chat");
			Economy.addBal(u, price);
			bot.removeListener("chat", handler);
		};
	};
	bot.on("chat", handler);
	setTimeout(function(){
		if(!done) {
			bot.removeListener("chat", handler);
			if(yazanaptlPCHAT) Msg.send("/p chat");
			//Msg.send("<Ödül> Kimse ödülü almadı.. Cevap: "+(a+b));
			Msg.send("<Ödül> Kimse ödülü almadı..");
			if(yazanaptlPCHAT) Msg.send("/p chat");
			db.add(`prize-overflow`, price);
		};
	}, 100 * 1000);
};


function requestConfirmation(user, rmsg, cmsg, time, cb) {
	Msg.send("/m "+user+" "+rmsg);
	let confirmationComplete = false;
	let checkFunction = function(checkuser, msg) {
		if(checkuser == user && msg == cmsg) {
			confirmationComplete = true;
			cb(user, msg);
			bot.removeListener("message", messageHandler);
		};
	};
	let messageHandler = function(JSONmessage) {
		let cleanMsg = mcparser.parse(JSONmessage).replace(/§[0-9a-fklmno]/g, "");
		if(cleanMsg.startsWith("[")) {
			let splitted = cleanMsg.split(" ");
			let dmRanks = ["[Padawan", "[Destek", "[Clone", 
			"[Senpai", "[Storm", "[Jedi", "[Sensei", "[Chosen", "[Asistan", "[VIP", "[LegendVIP",
			"[Yönetici", "[MVIP+", "[MVIP", "[Victorious", "[Kurucu", "[Moderatör", "[Mimar"];
			if(dmRanks.includes(splitted[0])) {
				//özel
				let user = splitted[1];
				let cmd = splitted.slice(4).join(" ");
				if(user == "->") {
					user = splitted[0].split("[")[1];
					cmd = splitted.slice(3).join(" ");
				};
				checkFunction(user, cmd);
			} else {
				//student
				let user = splitted[0].split("[")[1];
				if(user == "ADİGE") return;
				if(user == "Server") return;
				if(user == "ben") return;
				let cmd = splitted.slice(3).join(" ");
				console.log(chalk.green("Normal - ") + chalk.blue(user) + chalk.red(cmd));
				checkFunction(user, cmd);
			}
		}
	};
	bot.on("message", messageHandler);
	setTimeout(function(){
		if(confirmationComplete) return;
		bot.removeListener("message", messageHandler);
	}, time);
};




function removeFromArr(arr, thing){
	let arr2 = arr;
	let i = arr2.indexOf(thing);
	if (i > -1) {
		arr2.splice(i, 1);
	}
	return arr2;
};


var defaultExport = true;
function preventDefault(){
	defaultExport = false;
};

module.exports = {
	def: preventDefault,
	newBot: newBot
};


setTimeout(function(){
	if(defaultExport) newBot(USERIP, false);
}, 500);













var dcbotchannel = null;
var dcboteventchannel = null;
var dcbotModMail = null;
var dclogmsg = "";
dcbot.on("message", function(msg){
	if(msg.content.startsWith("!") && msg.channel.id == "748212960597639233") {
		bot.chat(msg.content.slice(1));
	}
});
dcbot.on("ready", function(){
	dcbot.channels.fetch("748212960597639233").then(function(chn){
		dcbotchannel = chn;
		chn.send("```diff\n+ Bot Aktif\n```");
	});
	dcbot.channels.fetch("748228558656372737").then(function(chn){
		dcboteventchannel = chn;
	});
	dcbot.channels.fetch("750300766861787166").then(function(chn){
		dcbotModMail = chn;
	});
});
function logDC(log) {
	dclogmsg += log + "\n"
}


function logDCEvent(title, log, color) {
	if(dcboteventchannel === null) return console.log(chalk.red("Coulnt event-log -> ", title, log, color));
	let embed = new Discord.MessageEmbed().setTitle(title).setDescription(log).setColor(color);
	dcboteventchannel.send(embed);
};






function dcModMail(title, desc, user, msg, defTime, mentionHere) {
	
	let table = [
		"✅ - Varsayılan zaman",
		"🕐 - 5 dakika",
		"🕒 - 10 dakika",
		"🕧 - 30 dakika",
		"🕛 - Sınırsız",
		"❌ - İptal / Mute atma"
	];
	
	
	let cb = function(time) {
		Msg.send("/emute "+user+" "+time);
		delete MUTECACHE[user];
	};
	
	if(!lastMsgs[user]) lastMsgs[user] = [];
	let des = "**Gönderen:** " + user + "\n**Mesaj:** " + msg + "\n**Mute süresi:** " + defTime + "\n\n**Oyuncunun son mesajları:**\n- " + lastMsgs[user].join("\n- ") + "\n\n";
	
	
	let e = new Discord.MessageEmbed();
	e.setTitle(title);
	e.setColor("YELLOW");
	e.setDescription(des + table.join("\n"));
	if(!dcbotModMail) return console.log(chalk.red("HATA - MODMAİL BAŞARISIZ"));
	
	let y = "✅";
	let n = "❌";
	
	let Vm = "🕐";
	let XVm = "🕒";
	let XXXm = "🕧";
	let LXm = "🕛";
	
	let emojiList = [y, n, Vm, XVm, XXXm, LXm, "🦴"];
	
	let done = false;
	
	dcbotModMail.send(e).then(function(m){
		m.react(y); // yes
		m.react(Vm);
		m.react(XVm);
		m.react(XXXm);
		m.react(LXm);
		m.react(n);
		if(mentionHere) m.channel.send(":warning: @here");
		const filter = (reaction, user) => !user.bot && emojiList.includes(reaction.emoji.name);
		const collector = m.createReactionCollector(filter, {
			time: 30 * 60 * 1000
		});
		collector.on("collect", function(reaction, reactor){
			done = true;
			console.log("dcModMail collected "+reaction.emoji.name);
			if(reaction.emoji.name == y) {
				e.setDescription("__Karar Verildi__\n**Karar:** " + defTime + " mute");
				e.setColor("GREEN");
				m.edit(e);
				if(cb) cb(defTime);
				collector.stop();
				
			} else if (reaction.emoji.name == n){
				e.setColor("RED");
				e.setDescription(des + "__Karar Verildi__\n**Karar:** İptal");
				m.edit(e);
				delete MUTECACHE[user];
				collector.stop();
				
			} else if(reaction.emoji.name == Vm) {
				e.setDescription(des + "__Karar Verildi__\n**Karar:** 5 dakika mute");
				e.setColor("GREEN");
				m.edit(e);
				if(cb) cb("5m");
				collector.stop();
			} else if(reaction.emoji.name == XVm) {
				e.setDescription(des + "__Karar Verildi__\n**Karar:** 10 dakika mute");
				e.setColor("GREEN");
				m.edit(e);
				if(cb) cb("10m");
				collector.stop();
				
			} else if(reaction.emoji.name == XXXm) {
				e.setDescription(des + "__Karar Verildi__\n**Karar:** 30 dakika mute");
				e.setColor("GREEN");
				m.edit(e);
				if(cb) cb("30m");
				collector.stop();
				
			} else if(reaction.emoji.name == LXm) {
				e.setDescription(des + "__Karar Verildi__\n**Karar:** Sınırsız mute");
				e.setColor("GREEN");
				m.edit(e);
				if(cb) cb("999y");
				collector.stop();
			} else if(reaction.emoji.name == "🦴") {
				e.setColor("CYAN");
				e.setDescription(des + "Bir yetkili mute atmış, iptal.");
				m.edit(e);
			};
		});
		
		collector.on("end", function(){
			if(!done) {
				e.setColor("RED");
				e.setDescription(des + "__Karar Verildi__\n**Karar:** Zaman aşımı / İptal");
				m.edit(e);
			};
		});
	});
};


setInterval(function(){
	if(dcbotchannel === null) return;
	if(dclogmsg.trim() == "") return;
	dcbotchannel.send(Discord.escapeMarkdown(dclogmsg.trim().replace(/@everyone/g, "@-everyone").replace(/@here/g, "@-here")).replace("[", "**[").replace("]", "]**"));
	dclogmsg = "";
	
	if(dclogmsg.includes("[Susturma]") && dclogmsg.includes("Görevli:") && dclogmsg.includes("Susturulan:")) {
		let arr = dclogmsg.split("\n");
		let gorevli = null;
		let susturulan = null;
		arr.forEach(function(line){
			if(line.startsWith("Susturulan:")) susturulan = line.split(":")[1].trim();
			if(line.startsWith("Görevli:")) gorevli = line.split(":")[1].trim();
		});
		if(gorevli === null || susturulan === null) return logDCEvent("", "[HATA] Mute mesajı parselanamadı. Mesaj:\n\n" + dclogmsg);
		if(MUTECACHE[susturulan]) {
			MUTECACHE.forEach(function(m){
				m.react("🦴"); // bone
			});
			delete MUTECACHE[susturulan];
		}
	};
}, 1 * 1000);



dcbot.login("NzQ0MjEyODM2MzQ3MDE5MzY1.Xzf8Ng.W8bjmNHEzmTZoxMmVktuAUfhd90");













function injectTPSFunc (bot) {
  let time = parseInt(bot.time.age)
  const calcTps = []
  function run (bot) {
    time = parseInt(bot.time.age)
    setTimeout(() => {
		if(!bot) return;
		const diff = parseInt(bot.time.age) - time
		
		calcTps.push(diff)
		if (calcTps.length > 20) {
			calcTps.shift()
		}
		run(bot)
    }, 1000)
  }
  run(bot)

  bot.getTps = function () {
    return calcTps.filter(tps => tps === 20).length
  }
}

























process.on("SIGINT", function(){
	dcbotchannel.send("```diff\n- Kapatılıyor...\n```").then(function(){
		process.exit(2);
	});
});