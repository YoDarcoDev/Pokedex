let allPokemon = []; // Tableau pour stocker
let tableauFin = []; // Tableau avec nom francais et image

const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');


const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};




// RECUPERE LA LISTE COMPLETE (ANGLAIS)

function fetchPokemonBase() {
    
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151") 
        .then(reponse => reponse.json())
        .then((allPoke) => {
            // console.log(allPoke);

            allPoke.results.forEach((pokemon) => {     // Pour chaque pokemon (results = array liste pokemon)
                fetchPokemonComplet(pokemon)
            })

        })
}

fetchPokemonBase();




// POUR CHAQUE POKEMON ON RECUPERE SES CARACTÉRISTIQUES

function fetchPokemonComplet(pokemon) {
    
    let objPokemonFull = {};            // Crée un objet vide
    let url = pokemon.url;              // Récupère son url et son name
    let nameP = pokemon.name 

    fetch(url)
    .then((reponse) => reponse.json())
    .then((pokeData) => {
        // console.log(pokeData);          // Récupère chaque pokemon avec ses caractéristiques

        objPokemonFull.pic = pokeData.sprites.front_default;                // Image
        objPokemonFull.type = pokeData.types[0].type.name;                  // Espèce
        objPokemonFull.id = pokeData.id;                                    // Id


        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then((reponse) => reponse.json())
        .then((dataPokemon) => {
            // console.log(dataPokemon);

            objPokemonFull.name = dataPokemon.names[4].name;
            allPokemon.push(objPokemonFull)              // Push l'objet contenant tous les pokemon dans le tableau

            if(allPokemon.length === 151) {
                // console.log(allPokemon);            // Tableau avec 151 objets 

                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                }).slice(0, 21);

                // console.log(tableauFin);
                createCard(tableauFin);

                // Animation loader apres tous les fetch
                chargement.style.display = "none";

            }

        })
    })
}




// CREATION DES CARTES

function createCard(tableau) {

    for (let i = 0; i  < tableau.length; i++) {
        
        const carte = document.createElement('li');
        let couleur = types[tableau[i].type];
        carte.style.background = couleur;

        const txtCarte = document.createElement('h5');
        txtCarte.innerText = tableau[i].name;

        const idCarte = document.createElement('p');
        idCarte.innerText = `ID# ${tableau[i].id}`;

        const imgCarte = document.createElement('img');
        imgCarte.src = tableau[i].pic;

        carte.appendChild(imgCarte);     // On ajoute image dans carte (li)
        carte.appendChild(txtCarte);     // On ajoute nom dans carte (li)
        carte.appendChild(idCarte);      // On ajoute id dans carte (li)
        
        listePoke.appendChild(carte);    // On ajoute une carte (li) dans liste-poke (ul)
    }
}




// SCROLL INFINI 

window.addEventListener('scroll', () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;   
    // scrollTop = scroll depuis le top
    // scrollHeight = scroll total
    // clientHeight = hauteur de la fenêtre, partie visible
    
    // console.log(scrollTop,scrollHeight,clientHeight);

    if(clientHeight + scrollTop >= scrollHeight - 20) {  // Rajoute 6 cards vers le bas de la page visible
        addPoke(6);
    }
})





// AJOUTER 6 CARTES EN PLUS AVEC LE SCROLL

let index = 21;

function addPoke(nb) {

    if (index > 151) {
        return;
    }
    else {
        const arrToAdd = allPokemon.slice(index, index + nb)  // ajoute morceau de tableau avec 6 cartes suivantes
        createCard(arrToAdd);
        index += nb;        // Pour que index s'actualise à chaque fois que j'appelle ma fonction addPoke
    }
}




// RECHERCHE POKEMON 

// avec le bouton
// const formRecherche = document.querySelector('form');
// formRecherche.addEventListener('submit', (event) => {
//     event.preventDefault();
//     recherche();
// } )


searchInput.addEventListener('keyup', recherche);

function recherche() {

    if (index < 151) {       // Effectue recherche dans ttes les cartes si le nombre de cartes depasse slice 
        addPoke(130);        // revient à la longueur max du tableau
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5')    // Tous les h5 dans li
    
    for (let i = 0; i < allLi.length; i++) {            //  Voir dans chaque carte

        titleValue = allTitles[i].innerText

        if (titleValue.toUpperCase().indexOf(filter) > -1) {    // -1 ne figure pas dans le tableau (filter)
            allLi[i].style.display = "flex";                    // indexOf renvoie le 1er index de l'élément cherché
        }
        else {
            allLi[i].style.display = "none";
        }
    }
}



// ANIMATION INPUT

searchInput.addEventListener('input', function(event) {
    
    if (event.target.value !== "") { // si input rempli
        event.target.parentNode.classList.add('active-input');
    } 
    else if (event.target.value === "" ) {
        event.target.parentNode.classList.remove('active-input');
    }
})



