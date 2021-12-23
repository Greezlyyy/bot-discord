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

const disbut = require("discord-buttons")
disbut(client);

const { MessageButton, MessageActionRow } = require("discord-buttons")
const { MessageMenuOption, MessageMenu } = require("discord-buttons")


client.on("message", message => {
    if (message.content == "!bottoni") {
        var button1 = new MessageButton()
            .setLabel("Cliccami")
            .setStyle("url")
            .setURL("https://www.google.it")
        var button2 = new MessageButton()
            .setLabel("Ciao")
            .setStyle("green")
            .setID("ciao")

        var row = new MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        var embedCarina = new Discord.MessageEmbed()
            .setTitle("Bottoni")
            .setDescription("Clicca sul bottone")

        message.channel.send(embedCarina, row)
    }

    if (message.content == "!menu") {
        var option1 = new MessageMenuOption()
            .setLabel("Opzione 1")
            .setDescription("Questa è la prima opzione")
            .setValue("opzione1")
            .setEmoji("😀")

        var option2 = new MessageMenuOption()
            .setLabel("Opzione 2")
            .setDescription("Questa è la seconda opzione")
            .setValue("opzione2")
            .setEmoji("🤑")

        var menu = new MessageMenu()
            .setPlaceholder("Seleziona un elemento")
            .setID("menu")
            .setMinValues(1)
            .setMaxValues(2)
            .addOption(option1)
            .addOption(option2)


        message.channel.send("Clicca sul menu", menu)
    }
})

client.on("clickButton", (button) => {
    if (button.id == "ciao") {
        button.reply.send("Ciao anche a te!", true)
    }
})

client.on("clickMenu", (menu) => {
    if (menu.id == "menu") {
        menu.reply.defer()
        //Se si ha solo un opzione da selezionare
        if (menu.values[0] == "opzione1")
            menu.message.channel.send("Opzione 1")
        if (menu.values[0] == "opzione2")
            menu.message.channel.send("Opzione 2")
        //Se si hanno piu opzioni da selezionare
        if (menu.values.includes("opzione1"))
            menu.message.channel.send("opzione 1")
        if (menu.values.includes("opzione2"))
            menu.message.channel.send("opzione 2")
    }
})

client.on("message", (message) => {
    if (message.content.startsWith("!kick")) {
        var utenteKick = message.mentions.members.first();

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            message.channel.send('Non hai il permesso');
            return;
        }

        if (!utenteKick) {
            message.channel.send('Non hai menzionato nessun utente');
            return;
        }

        if (!message.mentions.members.first().kickable) {
            message.channel.send('Io non ho il permesso');
            return
        }

        utenteKick.kick()
            .then(() => message.channel.send("<@" + utenteKick + ">" + " è stato kickato"))

    }

    if (message.content.startsWith("!ban")) {
        var utenteBan = message.mentions.members.first();

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            message.channel.send('Non hai il permesso');
            return;
        }

        if (!utenteBan) {
            message.channel.send('Non hai menzionato nessun utente');
            return;
        }

        if (!utenteBan.kickable) {
            message.channel.send('Io non ho il permesso');
            return
        }

        utenteBan.ban()
            .then(() => message.channel.send("<@" + utenteBan + ">" + " è stato bannato"))

    }
})

client.on("message", message => {
    if (message.content.startsWith("!clear")) {

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send('Non hai il permesso');
            return;
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send('Non ho il permesso');
            return;
        }

        var count = message.content.slice(7);
        count = parseInt(count);

        if (!count) {
            message.channel.send("Inserisci un numero valido")
            return
        }

        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            msg.delete({ timeout: 1000 })
        })

    }
})

//BENVENUTO
client.on("guildMemberAdd", (member) => {
    //console.log(member.guild); Per avere tutte le info del utente e del server
    client.channels.cache.get("923641840324972604").send("Benvenuto " + member.toString() + " nel **" + member.guild.name + "** Sei il **" + member.guild.memberCount + "° membro**");
})

//ADDIO
client.on("guildMemberRemove", (member) => {
    //console.log(member.guild); Per avere tutte le info del utente e del server
    client.channels.cache.get("923641840324972604").send("Addio " + member.toString() + ", torna presto nel **" + member.guild.name + "** !");
})

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

    var embed2 = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("Errore")
        .setDescription("Hai già un ticket aperto!")

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction._emoji.name == "🧾") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "922095762379243571") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == `User ID: ${user.id}`)) {
                user.send(embed2).catch(() => { })
                return
            }

            var embed3 = new Discord.MessageEmbed()
                .setColor("AQUA")
                .setTitle("Supporto")
                .setDescription("Lo staff ti assisterà a breve, attendi")

            server.channels.create("ticket-di-" + user.username, {
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
                canale.send(embed3)
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