 class PollManager
{
    //name choiceNo, choiceName and pollName
    constructor(users)
    {
        this.pollUsers = users;
        this.poll1Users = new Array();
        this.poll2Users = new Array();
        this.pollUsers.forEach(pollUser => {
            if(pollUser.choiceNo==1)
            {
                this.poll1Users.push(pollUser);
            }
            else if(pollUser.choiceNo ==2)
            {
                this.poll2Users.push(pollUser);
            }
            else
            {
                throw new Error("Choice is not valid"+ pollUser.name);
            }
        });
        this.strength1 =  (this.poll1Users.length / this.pollUsers.length) *100;
        this.strength2 = (this.poll2Users.length / this.pollUsers.length) *100;
    }
    getPollStrength()
    {
        return {poll1: isNaN( this.strength1)?0: this.strength1, poll2:isNaN( this.strength2)?0:this.strength2};
    }
    getUsers()
    {
        return {poll1:this.poll1Users, poll2: this.poll2Users};
    }
}