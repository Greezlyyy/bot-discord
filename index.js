const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }); //<-- RICORDARSI QUESTO

client.login(process.env.token);

client.on("ready", () => {
    console.log("ONLINE")
})

var embed1 = new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("Supporto")
    .setDescription(`Ti serve aiuto? Nessun problema! Usa la reazione qua sotto per creare un nuovo ticket dove il nostro staff ti assisterà.`)

//Prima di tutto mandare il messaggio del ticket
client.on("message", message => {
    if (message.content == "!ticket") {
        message.channel.send(embed1)
            .then(msg => msg.react("🧾")) //Personalizzare l'emoji della reaction
    }
})

client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

global.client.codes = new Discord.Collection();
const codesFolder = fs.readdirSync("./code");
for (const file of codesFolder) {
    const code = require(`./code/${file}`);
    client.codes.set(code.name, code);
}

if (!client.commands.has(command.toLowerCase()) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command.toLowerCase()))) {
    let embed = new Discord.MessageEmbed()
        .setTitle("Comando non esistente")
        .setColor("#FF931E")
        .setDescription(`Il comando \`${prefix}${command}\` non esiste`)

    var data = new Date()
    if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
        embed.setThumbnail("https://i.postimg.cc/x1MgSvfQ/Not-Found-Halloween.png")
    }
    else {
        embed.setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
    }

    if (!utenteMod(message.member)) //Se l"utente non è staff
        message.channel.send(embed)
            .then(msg => {
                message.delete({ timeout: 15000 })
                    .catch(() => { })
                msg.delete({ timeout: 15000 })
                    .catch(() => { })
            })
    return
}

let comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

if (comando.onlyStaff && !utenteMod(message.member)) {
    let embed = new Discord.MessageEmbed()
        .setTitle("Non hai il permesso")
        .setColor("#9E005D")
        .setDescription(`Non puoi eseguire il comando \`${prefix}${command}\` perchè non hai il permesso`)

    var data = new Date()
    if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
        embed.setThumbnail("https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png")
    }
    else {
        embed.setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
    }

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 15000 })
            .catch(() => { })
        msg.delete({ timeout: 15000 })
            .catch(() => { })
    })
    return
}

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction._emoji.name == "🧾") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "922095762379243571") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == `User ID: ${user.id}`)) {
                user.send("Hai gia un ticket aperto").catch(() => { })
                return
            }

            server.channels.create(user.username, {
                type: "text"
            }).then(canale => {
                canale.setTopic(`User ID: ${user.id}`);
                canale.setParent("923479737832181760") //Settare la categoria
                canale.overwritePermissions([
                    {
                        id: server.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ])
                canale.send("Lo staff ti assisterà a breve, attendi.")
            })
        }
    }
})

client.on("message", message => {
    if (message.content == "!chiudi") {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }

    if (message.content.startsWith("!aggiungi")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (haIlPermesso) {
                    message.channel.send("Questo utente ha gia accesso al ticket")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: true
                })

                message.channel.send(`${utente.toString()} è stato aggiunto al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("!rimuovi")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (!haIlPermesso) {
                    message.channel.send("Questo utente non ha gia accesso al ticket")
                    return
                }

                if (utente.hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send("Non puoi rimuovere questo utente")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: false
                })

                message.channel.send(`${utente.toString()} è stato rimosso al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
})

var embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("Regole")
    .setDescription(`✘ Nessun contenuto illegale.
    ✘ Nessun razzismo.
    ✘ Nessun tipo di spam.
    ✘ Nessuna pubblicità/link senza permesso.`)

//regole
client.on("message", message => {
    if (message.content == "!regole") {
        message.channel.send(embed)
    }
})