export class PollData
{
    constructor(poll)
    {
        
        this.url = poll.url;
        this.pollName = poll.name;
        this.question=  poll.data.question;
        this.options= poll.data.options;
        this.image= poll.data.image;
        this.rewards= poll.data.rewards;
        this.knobs=poll.data.knobs;
     
    }
    getItem()
    {
        return this.pollItem;
    }
    getPollChoice(choice)
    {
        if(choice>2)
            return;
        return this.options[choice-1];
    }
    getPollChoices()
    {
        return this.options;
    }
}