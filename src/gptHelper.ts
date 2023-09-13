export default class GptHelper {
    getChatGptQuestion() {
        let action = 'ask me to draw something doing something'
        const contentList = 
        [ 
            `${action} ${this.getLocation()}`,
            `${action} ${this.getRandomEnding()}`,
        ]
        let contentIndex = this.getRandomIndex(contentList)

        return contentList[contentIndex]
    }

    private getLocation() {
        const locations = [ 'in the world', 'in the world', 'in the world', 'in the world', 'in the world', 'in the world', 'in outer space', 'in the ocean', 'in the sky', 'on the moon', 'in a vehicle', 'in a volcano', 'on an island', 'on a boat', 'in nature' ]
        let locationIndex = this.getRandomIndex(locations)

        return locations[locationIndex]
    }

    private getRandomEnding() {
        const randomEndings = [ 'funny', 'fun', 'boring', 'sad', 'adventurous', 'slowly' ]
        let randomEndingIndex = this.getRandomIndex(randomEndings)

        return randomEndings[randomEndingIndex]
    }

    private getRandomIndex(list: string[]) {
        let lastIndex = list.length - 1
        return Math.floor(Math.random() * lastIndex);
      }
}