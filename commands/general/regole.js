const Discord = require('discord.js');

module.exports = {
    name: "test",
    description: "Comando di test",
    execute(message, args) {
        var embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("Regole")
    .setDescription(`✘ Nessun contenuto illegale.
    ✘ Nessun razzismo.
    ✘ Nessun tipo di spam.
    ✘ Nessuna pubblicità/link senza permesso.`)

client.on("message", message => {
    if (message.content == "!regole") {
        message.channel.send(embed)
    }
})
    }
}