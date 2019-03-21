// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, CardFactory } = require('botbuilder');

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
            const link = 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg'
            const card = this.generateCard("Title", "Subtitle" , "Text here", link, "Play on Spotify", link)
            await turnContext.sendActivity({ attachments: [card] });
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    generateCard(title, subtitle, bodyText, urlImage, buttonTitle, urlButton) {
        return CardFactory.thumbnailCard(
            title,
            [{ url: urlImage }],
            [{
                type: 'openUrl',
                title: buttonTitle,
                value: urlButton
            }],
            {
                subtitle: subtitle,
                text: bodyText
            }
        );
    }
}

module.exports.MyBot = MyBot;
