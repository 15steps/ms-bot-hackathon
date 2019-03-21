// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, CardFactory } = require('botbuilder');
const SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: '3f2026a5f25148d2a24993bedb4e7186',
  clientSecret: 'e23caf35d45c4778a2a2087e29bebd12',
//   redirectUri: 'http://www.example.com/callback'
});

spotifyApi.setAccessToken('BQDax6-BmqMg6nkFGbc254p8fdo3KsPZlP9jVuwJl2UV5I8ng9StBvSQFQib3lrOJ0rweAEGcyl3l-vUkx5TucSIv65ynLbP_sBKBFooG-R5v2ItZrMoD83p7HJ6WuEyAwHf6ja5cUQgB7c75oNk_PVxhpBE3Lt6');

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            try {
                const description = turnContext.activity.text;
                const { body } = await spotifyApi.searchPlaylists(description);
                const playlist = body.playlists.items[0];
                const { name, images, tracks: { total }, external_urls: { spotify } } = playlist;

                const data = await spotifyApi.getPlaylistTracks(playlist.id);

                const card = this.generateCard(
                    name, 
                    `${total} tracks` , "Tracks: ", 
                    images[0].url, 
                    data.body.items.map(({track}) => ({
                        title: track.name,
                        url: track.external_urls.spotify
                    })).slice(0, 5)
                )
                await turnContext.sendActivity({ attachments: [card] });
            } catch (e) {
                console.error(e);
            }
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    generateCard(title, subtitle, bodyText, urlImage, buttons) {
        return CardFactory.thumbnailCard(
            title,
            [{ url: urlImage }],
            buttons.map(button => ({
                type: 'openUrl',
                title: button.title,
                value: button.url
            })),
            {
                subtitle: subtitle,
                text: bodyText
            }
        );
    }
}

module.exports.MyBot = MyBot;
