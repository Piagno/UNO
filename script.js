
window.onload = (r)=>{
    let uno = document.getElementById('uno')
    function displayCard(card){
        let deck = document.getElementById('deck')
        deck.innerText = 'Card: '+card.color+' '
        if(card.number === undefined){
            deck.innerText += ' '+card.action
            if(card.action == 'add'){
                deck.innerText += ' '+card.count
            }
        }else{
            deck.innerText += ' '+card.number
        }
        if(card.chosenColor !== undefined){
            deck.innerText += ' wish: '+card.chosenColor
        }
    }
    function displayDeck(player,deck,chosenCard){
        function addCard(card){
            let cardEl = document.createElement('div')
            cardEl.innerHTML = 'Card: '+card.color+' '
            if(card.number === undefined){
                cardEl.innerHTML += card.action
            }else{
                cardEl.innerHTML += card.number
            }
            if(game.cardAllowed(card)){
                possibleCards++
                cardEl.onclick = ()=>{
                    if(card.color == 'black'){
                        let chosenColor = prompt('Choose a color:')
                        card.chosenColor = chosenColor
                    }
                    if(game.currentAdd > 0){
                        if(card.action == 'add'){
                            place.innerHTML = ''
                            chosenCard(card)
                        }
                    }else{
                        place.innerHTML = ''
                        chosenCard(card)
                    }
                }
            }
            place.appendChild(cardEl)
        }
        let place = document.getElementById('currentPlayer')
        place.innerHTML = '<div>'+player.name+'</div>'
        let possibleCards = 0
        deck.forEach((card)=>{
            addCard(card)
        })
        if(possibleCards == 0){
            if(game.currentAdd > 0){
                for(let i =0;i<= game.currentAdd;i++){
                    let newCard = game.takeCard()
                    player.receiveCard(newCard)
                    addCard(newCard)
                }
                game.currentAdd = 0
            }
            if(possibleCards == 0){
                console.log('taking new Card')
                let newCard = game.takeCard()
                player.receiveCard(newCard)
                addCard(newCard)
                if(possibleCards == 0){
                    console.log("no action possible by "+player.name)
                    place.innerHTML = ''
                    game.next(true)
                }
            }
        }else{
            if(game.currentAdd > 0){
                let takeCard = document.createElement('button')
                takeCard.type = 'button'
                takeCard.innerText = 'Take '+game.currentAdd+' cards'
                takeCard.onclick = ()=>{
                    for(let i=0;i< game.currentAdd;i++){
                        let newCard = game.takeCard()
                        player.receiveCard(newCard)
                        addCard(newCard)
                    }
                    game.currentAdd = 0
                    takeCard.innerText = 'Take new Card'
                    takeCard.onclick = ()=>{
                        let newCard = game.takeCard()
                        player.receiveCard(newCard)
                        addCard(newCard)
                        takeCard.innerText = 'Skip'
                        takeCard.onclick = ()=>{
                            place.innerHTML = ''
                            game.next(true)
                        }
                    }
                }
                place.appendChild(takeCard)
            }else{
                let takeCard = document.createElement('button')
                takeCard.type = 'button'
                takeCard.innerText = 'Take new Card'
                takeCard.onclick = ()=>{
                        let newCard = game.takeCard()
                        player.receiveCard(newCard)
                        addCard(newCard)
                        takeCard.innerText = 'Skip'
                        takeCard.onclick = ()=>{
                            place.innerHTML = ''
                            game.next(true)
                        }
                }
                place.appendChild(takeCard)
            }
        }
    }
    function displayNext(player){
        let ready = document.getElementById('ready')
        ready.innerHTML = ''
        ready.style.display = 'flex'
        let playerNameEL = document.createElement('div')
        playerNameEL.innerText = 'Next Player: '+player
        ready.appendChild(playerNameEL)
        let playerReadyEL = document.createElement('button')
        playerReadyEL.type = 'button'
        playerReadyEL.innerText = 'Click here, when you are ready!'
        playerReadyEL.onclick = function(){
            ready.innerHTML = ''
            ready.style.display = 'none'
            game.playerReady(player)
        }
        ready.appendChild(playerReadyEL)
    }
    let playerCount = 3//prompt('How many players?')
    game = new UNO(5)//prompt('How many cards to start with?'))
    for(let i=1;i<=playerCount;i++){
        //game.newPlayer(prompt('Player name of player '+i+':'))
    }
    game.newPlayer('fff')
    game.newPlayer('ddd')
    game.newPlayer('sss')
    game.giveCards()
    game.onPlayerFinished = (nextPlayer)=>{
        displayNext(nextPlayer)
    }
    game.onPlayerNext = (player,chosenCard)=>{
        displayDeck(player,player.deck,chosenCard)
    }
    game.displayCard = (card)=>{
        displayCard(card)
    }
    game.winning = (winner)=>{
        document.getElementById('winner').innerText = winner
        document.getElementById('winnerElement').style.display = 'block'
    }
    game.start((card)=>{
        displayCard(card)
    })
}