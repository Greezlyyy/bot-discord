const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

//ATTENZIONE
//Prima di utilizzare questi comandi è necessario attivare i "Privileged Gateway Intents" nella pagina del bot (sia "PRESENCE INTENT" che "SERVER MEMBERS INTENT")

client.on("guildMemberAdd", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount) //Impostare il nome del canale
});
client.on("guildMemberRemove", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount) //Impostare il nome del canale
});