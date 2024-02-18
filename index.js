const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');

const token = 'MTIwODY0NTcxMjk2ODAyODE3MA.GxI8pB.9oZmT1MFGPyMxjgmZ3ssqnKo0zheFNphylGtdU';
const apiUrl = 'https://api.aladhan.com/timingsByAddress/18-02-2024?address=Brussels,Belgium&method=2';

client.on('ready', async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const timings = data.data.timings;
        
        // Envoyer les horaires de prière dans un canal Discord
        const channel = client.channels.cache.get('1120111924718354514');
        if (channel) {
            channel.send('Horaires de prière pour Bruxelles le 18 février 2024 :');
            channel.send(`Fajr: ${timings.Fajr}`);
            channel.send(`Dhuhr: ${timings.Dhuhr}`);
            channel.send(`Asr: ${timings.Asr}`);
            channel.send(`Maghrib: ${timings.Maghrib}`);
            channel.send(`Isha: ${timings.Isha}`);

            // Rejoindre le canal vocal et jouer un son
            const voiceChannel = client.channels.cache.get('1097255169898582049');
            if (voiceChannel && voiceChannel.type === 'GUILD_VOICE') {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                const soundFile = 'C:\\Users\\zakar\\Downloads\\Adhan.mp3';
                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause,
                    },
                });

                const resource = createAudioResource(soundFile);
                player.play(resource);

                connection.subscribe(player);

                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        connection.destroy();
                    }
                });
            } else {
                console.error('Le canal vocal spécifié est introuvable.');
            }
        } else {
            console.error('Le canal spécifié est introuvable.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des horaires de prière :', error);
    }
});

client.login(token);
