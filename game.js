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
            {color:'green',action:'+2'},
            {color:'green',action:'+2'},
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
            {color:'blue',action:'+2'},
            {color:'blue',action:'+2'},
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
            {color:'yellow',action:'+2'},
            {color:'yellow',action:'+2'},
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
            {color:'red',action:'+2'},
            {color:'red',action:'+2'},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'choose'},
            {color:'black',action:'+4'},
            {color:'black',action:'+4'},
            {color:'black',action:'+4'},
            {color:'black',action:'+4'}
        ]
        this.currentDeck = JSON.parse(JSON.stringify(this.cards))
        this.discardDeck = []
        this.status = 'preparing'
        this.players = []
        this.nextPlayer = ''
        this.direction = 'normal'
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
    giveCards(){
        this.players.forEach((player)=>{
            for(let i=0;i<this.startCardCount;i++){
                let card = this.takeCard()
                player.receiveCard(card)
            }
        })
        this.status = 'ready'
    }
    newPlayer(name){
        if(this.status == 'preparing'){
            this.players.push(new UNOPlayer(name,this))
        }
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
    start(displayFirstCard){
        let startIndex = Math.floor(Math.random() * this.players.length)
        let startCard = this.takeCard()
        this.currentCard = startCard
        displayFirstCard(startCard)
        let nextPlayer = this.players[startIndex]
        this.nextPlayer = nextPlayer
        this.onPlayerFinishedEvent(nextPlayer.name)
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
        this.displayCardEvent(this.currentCard)
        this.next()
    }
    next(){
        let oldIndex = this.players.indexOf(this.nextPlayer)
        let newIndex = null
        if(this.direction == 'normal'){
            newIndex = oldIndex + 1
        }else{
            newIndex = oldIndex - 1
        }
        if(this.players.length == newIndex){
            newIndex = 0;
        }
        if(newIndex < 0){
            newIndex = this.players.length + 1
        }
        console.log(oldIndex)
        console.log(newIndex)
        this.nextPlayer = this.players[newIndex]
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
            let currCard = this.game.currentCard
            console.log(this.game)
            if(card.color == currCard.color){
                this.trueplace(card)
            }
            if(card.number == currCard.number){
                this.trueplace(card)
            }
            if(card.action == currCard.action){
                this.trueplace(card)
            }
        }
    }
    trueplace(card){
        let cardIndex = this.deck.indexOf(card)
        this.deck.splice(cardIndex,1)
        this.game.place(card)
    }
}