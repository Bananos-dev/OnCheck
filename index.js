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
            .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

            interaction.reply({embeds: [pingEmbed]})
            break;
        case "check":
            const urlToCheck = options.getString("website");
            let serverStatus = "DEFAULT";

            let startTime = performance.now()
            await ping.promise.probe(urlToCheck).then(function (res) {
                if(res.alive === true) {
                    serverStatus = "\`🟢 ONLINE\`";
                } else if(res.alive === false) {
                    serverStatus = "\`🔴 OFFLINE\`";
                } else {
                    serverStatus = "\`⚫ UNKNOWN\`";
                }
            }); let endTime = performance.now();

            while(serverStatus === "DEFAULT" && MCserverStatus === "DEFAULT") {};

            let checkPing = "**Webpage latency**: " + "\`" + parseInt(endTime - startTime) + "ms\`";
            if(serverStatus === "\`🔴 OFFLINE\`") checkPing = "**Webpage latency**: " + "\`" + "0" + "ms\`";
            const statusEmbed = new Discord.MessageEmbed()
            .setColor("#e1ca8a")
            .setTitle("Status")
            .setDescription(`

                **Webpage status**: ${serverStatus}\n ${checkPing}
           
            `)
            //.setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

            interaction.reply({
                embeds: [statusEmbed]
            });
            break;
    }
});

client.login(config.token)