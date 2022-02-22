const Discord = require("discord.js");
const config = require("./config.json");
const ping = require("ping");

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
    console.log("Client is ready!");

    const guild = client.guilds.cache.get(config.guild);
    let commands = client.application?.commands;

    commands?.create({
        name: "ping",
        description: "Shows the bot's latency"
    })
    commands?.create({
        name: "check",
        description: "Shows if a website is online.",
        options: [
            {
                name: "website",
                description: "The website you want to check",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })
    commands?.create({
        name: "mccheck",
        description: "Shows if a Minecraft server is online.",
        options: [
            {
                name: "server",
                description: "The server you want to check",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })
});

client.on("interactionCreate", async(interaction) => {
    if(!interaction.isCommand()) return;

    const {commandName , options } = interaction;

    switch(commandName) {
        case "ping": 
            const pingEmbed = new Discord.MessageEmbed()
            .setTitle("Current ping")
            .setColor("#e1ca8a")
            .setDescription(`**Websocket latency**: \`${client.ws.ping}ms\`\n**Client latency**: \`${interaction.createdTimestamp - Date.now()}ms\``)
            //.setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

            interaction.reply({embeds: [pingEmbed]})
            break;
        case "check":
            const UrlToCheck = options.getString("website");
            let ServerStatus = "DEFAULT";

            let startTime = performance.now()
            await ping.promise.probe(UrlToCheck).then(function (res) {
                if(res.alive === true) {
                    ServerStatus = "\`🟢 ONLINE\`";
                } else if(res.alive === false) {
                    ServerStatus = "\`🔴 OFFLINE\`";
                } else {
                    ServerStatus = "\`⚫ UNKNOWN\`";
                }
            }); let endTime = performance.now();

            while(ServerStatus === "DEFAULT") {};

            let checkPing = "**Webpage latency**: " + "\`" + parseInt(endTime - startTime) + "ms\`";

            if(ServerStatus === "\`🔴 OFFLINE\`") checkPing = "**Webpage latency**: " + "\`" + "0" + "ms\`";

            const StatusEmbed = new Discord.MessageEmbed()
            .setColor("#e1ca8a")
            .setTitle("Status")
            .setDescription(`

                **Webpage status**: ${ServerStatus}\n ${checkPing}
           
            `)
            //.setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

            interaction.reply({
                embeds: [StatusEmbed]
            });
            break;
        case "help":
            const helpEmbed = new Discord.MessageEmbed()
            .setColor("#e1ca8a")
            .setTitle("OnCheck help")
            .addFields(
                {name: "/ping", value: "Shows the latency of the bot.", inline: true},
                {name: "/check [link]", value: "Shows if a webpage is online and its latency."}
            )
            //.setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

            break;
    }
});

client.login(config.token)