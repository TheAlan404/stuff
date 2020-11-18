const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
var klanData = db.get("klans");
if(typeof(klanData) === "null") klanData = [];

// this is not the commands file xd
// its in the "komutlar" folder (was using a turkish premade bot lol)



client.conf = {
  token: "NzI0OTc4NzgwNTMxMTk1OTg0.XvIDIg.c7fF-E00hd8V__x_vxphaIke8_8", //bot tokeni
  pref: "*", //prefix
  invite: "https://discord.com/api/oauth2/authorize?client_id=724978780531195984&permissions=262144&scope=bot"
};

client.on("ready", () => {
  console.log(
    ` ${client.user.username} ismi ile Discord hesabı aktifleştirildi!`
  );

  const aktiviteListesi = ["_"];

  client.user.setStatus("online");

  setInterval(() => {
    const Aktivite = Math.floor(Math.random() * (aktiviteListesi.length - 1));
    client.user.setActivity(aktiviteListesi[Aktivite]);
  }, 7000);
});



client.on("message", async (msg) => {
	if(!msg.content.startsWith("*")) return;
	let args = msg.content.split(" ");
	let cmd = args[0].toLowerCase();
	if(cmd == "*new" && msg.author.id == "258638629839175681") {
		let roleid;
		await msg.guild.roles.create({
			data: {
				name: args[1],
				color: "BLUE",
				hoist: false,
				mentionable: false
			},
			reason: "Yeni klan eklendi."
		});
		
		roleid = msg.guild.roles.cache.find(role => role.name == args[1]).id;
		
		await msg.guild.channels.create(args[1], {
			type: "text",
			reason: "Yeni klan eklendi.",
			permissionOverwrites: [
			{
				id: roleid,
				allow: ["SEND_MESSAGES"]
			},
			{
				id: msg.guild.id,
				deny: ["SEND_MESSAGES"]
				}
			]
		}).then((channel) => {
			channel.setParent("724334872524488726");
		});
		
		if(roleid === undefined) {
			await msg.channel.send("Bir hata oluştu lol");
			return;
		}
		
		klanData.push({
			g: false,
			r: roleid,
			i: args[1]
		});
		
		await msg.channel.send("Yeni klan başarıyla eklendi.");
	}
	
	if(cmd == "*bağla" && msg.author.id == "258638629839175681") {
		
	}
	
	if(cmd == "*save" && msg.author.id == "258638629839175681") {
		klanData.push({
			g: false,
			r: "",
			i: args[1]
		});
	}
});

client.on("guildMemberAdd", function(member){
	if(member.guild.id != "724334651593982042") return;
	
	
	
});








process.on("SIGINT", function() {
  console.log("Closing...");
  db.set("klans", klanData);
  process.exit(2);
});







client.login(client.conf.token);