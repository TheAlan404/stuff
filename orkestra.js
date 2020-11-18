var mineflayer = require("mineflayer");
var mc = require("minecraft-protocol");
var mcparser = require("minecraft-chat-packet");
var db = require("quick.db");
var chalk = require("chalk");
var EventEmitter = require("events").EventEmitter;
var Vec3 = require("vec3");

var bot1 = null;

var dmRanks = ["[Padawan", "[Destek", "[Clone", 
"[Senpai", "[Storm", "[Jedi", "[Sensei", "[Chosen", "[Asistan", "[VIP", "[LegendVIP",
"[Yönetici", "[MVIP+", "[MVIP", "[Victorious", "[Kurucu", "[Moderatör", "[Mimar", "[Lances", "[Wraith", "["];
var dmPowerRanks = ["[Destek",  "[Asistan", "[Yönetici", "[Kurucu", "[Moderatör", "[Mimar"];


function startbot1(nick, pass, dontLoop) {
	
	console.log("Loading bot-1...");
	
	let bot = mineflayer.createBot({
		host: "no",
		port: 25565,
		username: nick,
		version: "1.12.2",
		keepAlive: true,
		colorsEnabled: false,
	});
	
	bot1 = bot;
	
	bot.on("message", function(JSONmessage) {
		let cleanMsg = mcparser.parse(JSONmessage).replace(/§[0-9a-fklmno]/g, "");
		console.log(cleanMsg);
		if(cleanMsg=="LCTR Network » Hesabına giriş yap: /login <şifre>") {
			bot.chat("/login "+pass);
		}
		if(cleanMsg=="§A§t§i§M§i§i§p") {
			setTimeout(function(){
				bot.chat("/creative");
			}, 1000)
		}
		if(cleanMsg.startsWith("[")) {
			let splitted = cleanMsg.split(" ");
			if(dmRanks.includes(splitted[0])) {
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
		console.log(`(i) Bot1 spawned`);
	});
	
	bot.on("login", function() {
		botStatus = true;
		console.log("Bot connected!");
		console.log(`(i) Logged in`);
	});
	
	bot.on("kicked", function(reason, loggedIn) {
		console.log(`(!) Kicked. R: ${mcparser.parse(reason)}`);
	});
	
	bot.on("end", function() {
		botStatus = false;
		console.log(`(!) Bot ended`);
		console.log("Restarting in 10 seconds...");
		inCreative = false;
		setTimeout(function(){
			console.log("Restarting now...");
			startbot1(nick, pass, true);
		}, 10 * 1000);
	});
	return bot;
}



function PrismCMD(user, cmd){
	
}

function PrismOPCMD(user, cmd){
	let args = cmd.split(" ");
	if(args[0] == "play") {
		currentSong.play();
	}
	if(args[0] == "set") {
		currentSong.setNotes(args.slice(1).join(" "));
	}
	if(args[0] == "eval") {
		let e;
		try {
			e = eval(args.slice(1).join("."));
		} catch(err) {
			e = err
		};
		bot1.chat("/m " + user + " > " + e);
	};
}

var NOTEDATAPRE = {
  '0': [-3264, 55, -1126],
  '1': [-3266, 55, -1126],
  '2': [-3264, 54, -1126],
  '3': [-3266, 54, -1126],
  '4': [-3268, 54, -1126],
  '5': [-3265, 53, -1126],
  '6': [-3268, 53, -1126],
  '7': [-3268, 55, -1126],
  '8': [-3268, 55, -1129],
  '9': [-3268, 53, -1129],
  '10': [-3268, 52, -1126],
  '11': [-3268, 52, -1129],
  '12': [-3267, 55, -1128],
  '13': [-3265, 55, -1128],
  '14': [-3269, 53, -1128],
  '15': [-3267, 53, -1128],
  '16': [-3265, 53, -1128],
  '17': [-3267, 53, -1128],
  '18': [-3265, 53, -1128],
  '19': [-3264, 55, -1128],
  '20': [-3264, 55, -1126],
  '21': [-3264, 53, -1127],
  '22': [-3264, 53, -1128],
  '23': [-3265, 53, -1126]
}

class TunerProto {
	constructor(){
		this.notePos = {};
	}
	tune() {}
	playNote(note){
		let block = {};
		let done = false;
		block.position = new Vec3(NOTEDATAPRE[note.note]);
		bot1.activateBlock(block);
	}
}
var Tuner = new TunerProto();

class Song {
	constructor(){
		currentSong = this;
		this.notes = [];
		this.currentNote = -1;
	}
	play(){
		this.nextNote();
	}
	nextNote(){
		this.currentNote++;
		let note = this.notes[this.currentNote];
		if(note === undefined) {
			bot1.chat("Müzik bitti.");
			return;
		}
		if(note.type == "note") {
			Tuner.playNote(note);
			setTimeout(function(){
				currentSong.nextNote();
			}, note.len * 1000);
		} else if(note.type == "delay") {
			setTimeout(function(){
				currentSong.nextNote();
			}, note.delay * 1000);
		} else {
			throw new Error("Invalid Note");
		}
	}
	setNotes(str){
		let arr = str.split(" ");
		this.notes = [];
		let localthis = this;
		arr.forEach(function(key){
			let n = {
				type: "",
				note: 0,
				delay: 1,
				len: 1
			}
			if(key[0] == "d") {
				n.type = "delay";
				let ifloat = parseFloat(key.slice(1));
				n.len = ifloat;
			} else {
				n.type = "note";
				n.note = key;
			}
			localthis.notes.push(n);
		});
	}
}
var currentSong = new Song();




















var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
	let command = d.toString().trim()
    console.log("Inputted: [" + command + "]");
	if (botStatus && command.startsWith("!") == false) {
		bot1.chat(command);
	} else {
		if(command == "!") loopMSG();
	}
});






startbot1("ConnorRK800", "passwd");