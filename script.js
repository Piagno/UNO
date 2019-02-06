
window.onload = (r)=>{
    let uno = document.getElementById('uno')
    function prompting(question,type,cb){
        let promptElement = document.getElementById('prompter')
        let questionElement = document.getElementById('question')
        let input = document.getElementById('input')
        //let counters = document.getElementById('counters')
        let enter = document.getElementById('promptEnter')
        questionElement.innerText = question
        if(type == 'number'){
            //counters.style.display = 'block'
        }
        if(type == 'text'){
            //counters.style.display = 'none'
        }
        input.type = type
        input.value = ''
        promptElement.style.display = 'flex'
        enter.onclick = (e)=>{
            promptElement.style.display = 'none'
            cb(input.value)
        }
    }
    function colorPrompting(cb){
        let promptElement = document.getElementById('colorPrompter')
        document.getElementById('chooseRed').onclick = function(e){
            promptElement.style.display = 'none'
            cb('red')
        }
        document.getElementById('chooseGreen').onclick = function(e){
            promptElement.style.display = 'none'
            cb('green')
        }
        document.getElementById('chooseBlue').onclick = function(e){
            promptElement.style.display = 'none'
            cb('blue')
        }
        document.getElementById('chooseYellow').onclick = function(e){
            promptElement.style.display = 'none'
            cb('yellow')
        }
        promptElement.style.display = 'block'
    }
    function getDisplayCardData(card){
        let values = {}
        if(card.color == 'black'){
            values.color = card.chosenColor
        }else{
            values.color = card.color
        }
        if(card.number === undefined){
            switch(card.action){
                case 'add':
                    values.text = '+'+card.count
                    break;
                case 'stop':
                    values.text = '∅'
                    break;
                case 'change':
                    values.text = '⇔'
                    break;
                case 'choose':
                    values.text = '?'
                    break;
            }
        }else{
            values.text = card.number
        }
        return values
    }
    function displayCard(card){
        let deck = document.getElementById('deck')
        let values = getDisplayCardData(card)
        deck.style.color = values.color
        deck.innerText = values.text
    }
    function displayDeck(player,deck,chosenCard){
        function addCard(card){
            let cardEl = document.createElement('div')
            let values = getDisplayCardData(card)
            cardEl.style.color = values.color
            cardEl.innerText = values.text
            if(game.cardAllowed(card)){
                possibleCards++
                cardEl.onclick = ()=>{
                    if(card.color == 'black'){
                        if(game.currentAdd > 0){
                            if(card.action == 'add'){
                                colorPrompting((chosenColor)=>{
                                    place.style.display = 'none'
                                    card.chosenColor = chosenColor
                                    chosenCard(card)
                                })
                            }
                        }else{
                            colorPrompting((chosenColor)=>{
                                place.style.display = 'none'
                                card.chosenColor = chosenColor
                                chosenCard(card)
                            })
                        }
                    }else{
                        if(game.currentAdd > 0){
                            if(game.currentCard.color == 'black'){
                                if((card.color == game.currentCard.chosenColor) && (card.action == 'add')){
                                    place.innerHTML = ''
                                    chosenCard(card)
                                }
                            }else{
                                if(card.action == 'add'){
                                    place.innerHTML = ''
                                    chosenCard(card)
                                }
                            }
                        }else{
                            place.innerHTML = ''
                            chosenCard(card)
                        }
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
                }else{
                    let takeCard = document.createElement('button')
                    takeCard.type = 'button'
                    takeCard.innerText = 'Skip'
                    takeCard.onclick = ()=>{
                        place.innerHTML = ''
                        game.next()
                    }
                }
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
    function gameReady(){
        if(game.players.length != playerCountPublic){
            prompting('Player name of player '+(game.players.length +1)+':','text',(playerName)=>{
                game.newPlayer(playerName)
                gameReady()
            })
        }else{
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
            game.giveCards()
            game.start((card)=>{
                displayCard(card)
            })
        }
    }
    prompting('How many players?','number',(playerCount)=>{
        prompting('How many cards to start with?','number',(cardCount)=>{
            game = new UNO(cardCount)
            playerCountPublic = playerCount
            gameReady()
        })
    })
}