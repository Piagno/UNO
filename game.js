class UNO{
    constructor(startCardCount){
        this.startCardCount = startCardCount
        this.cards = [
            {color:'green',number:0},
            {color:'green',number:1},
            {color:'green',number:2},
            {color:'green',number:3},
            {color:'green',number:4},
            {color:'green',number:5},
            {color:'green',number:6},
            {color:'green',number:7},
            {color:'green',number:8},
            {color:'green',number:9},
            {color:'green',number:1},
            {color:'green',number:2},
            {color:'green',number:3},
            {color:'green',number:4},
            {color:'green',number:5},
            {color:'green',number:6},
            {color:'green',number:7},
            {color:'green',number:8},
            {color:'green',number:9},
            {color:'green',action:'change'},
            {color:'green',action:'change'},
            {color:'green',action:'stop'},
            {color:'green',action:'stop'},
            {color:'green',action:'add',count:2},
            {color:'green',action:'add',count:2},
            {color:'blue',number:0},
            {color:'blue',number:1},
            {color:'blue',number:2},
            {color:'blue',number:3},
            {color:'blue',number:4},
            {color:'blue',number:5},
            {color:'blue',number:6},
            {color:'blue',number:7},
            {color:'blue',number:8},
            {color:'blue',number:9},
            {color:'blue',number:1},
            {color:'blue',number:2},
            {color:'blue',number:3},
            {color:'blue',number:4},
            {color:'blue',number:5},
            {color:'blue',number:6},
            {color:'blue',number:7},
            {color:'blue',number:8},
            {color:'blue',number:9},
            {color:'blue',action:'change'},
            {color:'blue',action:'change'},
            {color:'blue',action:'stop'},
            {color:'blue',action:'stop'},
            {color:'blue',action:'add',count:2},
            {color:'blue',action:'add',count:2},
            {color:'yellow',number:0},
            {color:'yellow',number:1},
            {color:'yellow',number:2},
            {color:'yellow',number:3},
            {color:'yellow',number:4},
            {color:'yellow',number:5},
            {color:'yellow',number:6},
            {color:'yellow',number:7},
            {color:'yellow',number:8},
            {color:'yellow',number:9},
            {color:'yellow',number:1},
            {color:'yellow',number:2},
            {color:'yellow',number:3},
            {color:'yellow',number:4},
            {color:'yellow',number:5},
            {color:'yellow',number:6},
            {color:'yellow',number:7},
            {color:'yellow',number:8},
            {color:'yellow',number:9},
            {color:'yellow',action:'change'},
            {color:'yellow',action:'change'},
            {color:'yellow',action:'stop'},
            {color:'yellow',action:'stop'},
            {color:'yellow',action:'add',count:2},
            {color:'yellow',action:'add',count:2},
            {color:'red',number:0},
            {color:'red',number:1},
            {color:'red',number:2},
            {color:'red',number:3},
            {color:'red',number:4},
            {color:'red',number:5},
            {color:'red',number:6},
            {color:'red',number:7},
            {color:'red',number:8},
            {color:'red',number:9},
            {color:'red',number:1},
            {color:'red',number:2},
            {color:'red',number:3},
            {color:'red',number:4},
            {color:'red',number:5},
            {color:'red',number:6},
            {color:'red',number:7},
            {color:'red',number:8},
            {color:'red',number:9},
            {color:'red',action:'change'},
            {color:'red',action:'change'},
            {color:'red',action:'stop'},
            {color:'red',action:'stop'},
            {color:'red',action:'add',count:2},
            {color:'red',action:'add',count:2},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'add',count:4},
            {color:'black',action:'add',count:4},
            {color:'black',action:'add',count:4},
            {color:'black',action:'add',count:4}
        ]
        this.currentDeck = JSON.parse(JSON.stringify(this.cards))
        this.discardDeck = []
        this.status = 'preparing'
        this.players = []
        this.nextPlayer = ''
        this.direction = 'normal'
        this.currentAdd = 0
    }
    set onPlayerFinished(cb){
        this.onPlayerFinishedEvent = cb
    }
    set onPlayerNext(cb){
        this.onPlayerNextEvent = cb
    }
    set displayCard(cb){
        this.displayCardEvent = cb
    }
    set winning(cb){
        this.winningEvent = cb
    }
    newPlayer(name){
        if(this.status == 'preparing'){
            this.players.push(new UNOPlayer(name,this))
        }
    }
    giveCards(){
        this.players.forEach((player)=>{
            for(let i=0;i<this.startCardCount;i++){
                let card = this.takeCard()
                player.receiveCard(card)
            }
        })
        this.status = 'ready'
    }
    start(displayFirstCard){
        let startIndex = Math.floor(Math.random() * this.players.length)
        let startCard = this.takeCard()
        this.currentCard = startCard
        displayFirstCard(startCard)
        if(startCard.action == 'add'){
            this.currentAdd = startCard.count
        }
        let nextPlayer = this.players[startIndex]
        this.nextPlayer = nextPlayer
        this.onPlayerFinishedEvent(nextPlayer.name)
    }
    win(player){
        console.log('The winner is: '+player.name)
        this.winningEvent(player.name)
    } 
    takeCard(){
        let index = Math.floor(Math.random() * this.currentDeck.length)
        if(this.currentDeck.length == 0){
            this.currentDeck = JSON.parse(JSON.stringify(this.discardDeck))
        }
        let card = this.currentDeck[index]
        this.currentDeck.splice(index,1)
        return card
    }
    cardAllowed(testingCard){
        let currentCard = this.currentCard
        if(testingCard.color == 'black'){return true}
        if(testingCard.color == currentCard.chosenColor){return true}
        if(testingCard.color == currentCard.color){return true}
        if(testingCard.number == undefined){
            if(testingCard.action == currentCard.action){return true}
        }else{
            if(testingCard.number == currentCard.number){return true}
        }
        return false
    } 
    playerReady(player){
        let nextPlayer = this.nextPlayer
        if(nextPlayer.name = player){
            this.onPlayerNextEvent(nextPlayer,function(card){
                nextPlayer.place(card)
            })
        }
    }
    place(card){
        this.discardDeck.push(card)
        this.currentCard = card
        if(this.currentCard.action == 'change'){
            if(this.direction == 'normal'){
                this.direction = 'opposite'
            }else{
                this.direction = 'normal'
            }
        }
        this.displayCardEvent(this.currentCard)
        this.next()
    }
    next(noCard){
        if(this.nextPlayer.deck.length == 0){
            this.win(this.nextPlayer)
            return
        }
        let oldIndex = this.players.indexOf(this.nextPlayer)
        let newIndex = null
        let adder = 1
        if(this.currentCard.action == 'stop' && (!(noCard))){
            adder = 2
        }
        if(this.direction == 'normal'){
            newIndex = oldIndex + adder
        }else{
            newIndex = oldIndex - adder
        }
        if(this.players.length <= newIndex){
            newIndex = newIndex - this.players.length;
        }
        if(newIndex < 0){
            newIndex = this.players.length + newIndex
        }
        if(this.currentCard.action == 'add' && (!(noCard))){
            this.currentAdd += this.currentCard.count
        }
        if(this.currentCard.action == 'change' && this.players.length == 2){
            newIndex = oldIndex
        }
        this.nextPlayer = this.players[newIndex]
        console.log('Next player: '+this.nextPlayer.name+' he has to take up '+this.currentAdd+' cards!')
        this.onPlayerFinishedEvent(this.nextPlayer.name)
    }
}
class UNOPlayer{
    constructor(name,game){
        this.name = name
        this.deck = []
        this.game = game
    }
    receiveCard(card){
        this.deck.push(card)
    }
    place(card){
        if(this.deck.indexOf(card) != -1){
            if(this.game.cardAllowed(card)){
                let cardIndex = this.deck.indexOf(card)
                this.deck.splice(cardIndex,1)
                this.game.place(card)
            }
        }
    }
}
