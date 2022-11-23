let pokemonRepository = (function () {
  let pokemonList = [
    // {
    //   name: 'bulbasaur',
    //   description: `There is a plant seed on its back right from
    //   the day this Pokémon is born. The seed slowly grows larger.`,
    //   category: 'Seed',
    //   abilities: {
    //     abilityName: 'Overgrow',
    //     abilityInfo: 'Powers up Grass-type moves when the Pokémon’s HP is low.',
    //   },
    //   heightFt: 2.04,
    //   weightLbs: 15.2,
    //   types: ['grass', 'poison'],
    //   weaknesses: ['fire', 'psychic', 'flying', 'ice'],
    //   evolutions: ['Bulbasaur', 'Ivysaur', 'Venusaur'],
    // },
  ];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      return `${pokemon} is not a Pokémon. Pokémon must be an object with the keys name, height and type`;
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    const isHeavyWeight =
      pokemon.weightLbs > 200 ? `<h3>WOW! Super heavy!</h3>` : ``;
    // let pokemonDetailsImage = loadDetails();
    // console.log(loadDetails());

    let pokemonList = document.querySelector(`.pokemon-list`);
    let pokemonListItem = document.createElement(`div`);
    pokemonList.appendChild(pokemonListItem);
    pokemonListItem.classList.add(`pokemon-list__item`);

    let pokemonImage = document.createElement(`img`);
    pokemonListItem.appendChild(pokemonImage);
    pokemonImage.setAttribute(`src`, `images/${pokemon.name}.png`);
    pokemonImage.setAttribute(`alt`, `Pokemon ${pokemon.name} image`);

    // Need to find better sollution for positioning h2 - super feature
    let pokemonName = document.createElement(`h2`);
    pokemonListItem.appendChild(pokemonName);
    pokemonName.innerText = pokemon.name;

    let pokemonUnique = document.createElement(`div`);
    pokemonListItem.appendChild(pokemonUnique);
    pokemonUnique.innerHTML = isHeavyWeight;

    let pokemonFeature = document.createElement(`ul`);
    pokemonListItem.appendChild(pokemonFeature);

    let pokemonHeight = document.createElement(`li`);
    pokemonFeature.appendChild(pokemonHeight);
    let pokemonHeightHeading = document.createElement(`span`);
    pokemonHeight.appendChild(pokemonHeightHeading);
    pokemonHeightHeading.innerText = `Height: `;
    pokemonHeightHeading.classList.add(`pokemon-list__item-heading`);
    let pokemonHeightValue = document.createElement(`span`);
    pokemonHeight.appendChild(pokemonHeightValue);
    pokemonHeightValue.innerText = `${pokemon.heightFt}`;
    // pokemonHeight.innerText = `${pokemon.heightFt}`;

    let pokemonWeight = document.createElement(`li`);
    pokemonFeature.appendChild(pokemonWeight);
    let pokemonWeightHeading = document.createElement(`span`);
    pokemonWeight.appendChild(pokemonWeightHeading);
    pokemonWeightHeading.innerText = `Weight: `;
    pokemonWeightHeading.classList.add(`pokemon-list__item-heading`);
    let pokemonWeightValue = document.createElement(`span`);
    pokemonWeight.appendChild(pokemonWeightValue);
    pokemonWeightValue.innerText = `${pokemon.weightLbs}`;
    // pokemonWeight.innerText = `Weight: ${pokemon.weightLbs}`;

    let pokemonButton = document.createElement(`button`);
    pokemonListItem.appendChild(pokemonButton);
    pokemonButton.innerText = `Show details`;
    pokemonButton.classList.add(`pokemon-details__button`);

    pokemonButton.addEventListener(`click`, function () {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results
          .forEach(function (item) {
            const moreDetails = fetch(item.url)
              .then((res) => res.json())
              .then((details) => {
                return { height: details.height, weight: details.weight };
              });
            const mydetails = async () => {
              const values = await moreDetails;
              // console.log('values', values);
              let pokemon = {
                name: item.name,
                detailsUrl: item.url,
                height: values.height,
                weight: values.weight,
              };
              // console.log(`detailsUrl`);
              // console.log(pokemon);
              add(pokemon);
            };
            mydetails();
          });
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // Now we add the details to the item
        item.imgUrl = details.sprites.other.dream_world.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetailsModal(item) {
    let detailsModalCard = document.querySelector(
      '#pkemon-details__modal-card'
    );

    detailsModalCard.innerHTML = '';

    let pokemonDetailsModal = document.createElement('div');
    pokemonDetailsModal.classList.add('pokemon-details__modal');

    let closeButton = document.createElement('button');
    closeButton.classList.add('modal-close');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', hideDetailsModal);

    let modalTitle = document.createElement('h2');
    modalTitle.innerText = `${item.name}`;

    let detailsContainer = document.createElement('div');
    detailsContainer.classList.add('pkemon-details__container');

    let pokemonImage = document.createElement('img');
    pokemonImage.setAttribute(`src`, `${item.imgUrl}`);
    pokemonImage.setAttribute(`alt`, `Pokemon ${item.name} image`);

    let detailsList = document.createElement('ul');
    let pokemonHeight = document.createElement('li');
    pokemonHeight.innerHTML = `<span><strong>Height: </strong>${item.height}</span>`;
    let pokemonWeight = document.createElement('li');
    pokemonWeight.innerHTML = `<span><strong>Weight: </strong>${item.weight}</span>`;

    detailsModalCard.appendChild(pokemonDetailsModal);
    pokemonDetailsModal.appendChild(closeButton);
    pokemonDetailsModal.appendChild(modalTitle);
    pokemonDetailsModal.appendChild(detailsContainer);
    detailsContainer.appendChild(pokemonImage);
    detailsContainer.appendChild(detailsList);
    detailsList.appendChild(pokemonHeight);
    detailsList.appendChild(pokemonWeight);

    detailsModalCard.classList.add('is-visible');

    detailsModalCard.addEventListener('click', (e) => {
      let target = e.target;
      if (target === detailsModalCard) {
        hideDetailsModal();
      }
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showDetailsModal(item);
    });
  }

  function hideDetailsModal(params) {
    let detailsModalCard = document.querySelector(
      '#pkemon-details__modal-card'
    );
    detailsModalCard.classList.remove('is-visible');
  }

  window.addEventListener('keydown', (e) => {
    let detailsModalCard = document.querySelector(
      '#pkemon-details__modal-card'
    );
    if (
      e.key === 'Escape' &&
      detailsModalCard.classList.contains('is-visible')
    ) {
      hideDetailsModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

function getPocemonCard(pokemon) {
  pokemonRepository.addListItem(pokemon);
  // Old version of Pokemon Card code
  // const pokemonItemHtml = `<div class="pokemon-list__item">
  //         <img src="images/${pokemon.name}.png" alt="Pokemon ${pokemon.name} image" />
  //         <h2>${pokemon.name}</h2>
  //         ${isHeavyWeight}
  //         <ul>
  //           <li><span>Height:</span>${pokemon.heightFt}</li>
  //           <li><span>Weight:</span>${pokemon.weightLbs}</li>
  //         </ul>
  //       </div>`;
  // document.write(pokemonItemHtml);
}
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(getPocemonCard);
});

let pokemons = pokemonRepository.getAll();
console.log(pokemons);

// Filter pokemons by name. I will need to create input field for search
// Allso i need to write the function that will take attribute from
// result of function findPokemon and create the card with result of the filter
// After fetching API function doesn't work
function findPokemon(queryValue) {
  return pokemonRepository.getAll().filter((value) => {
    if (value.name === queryValue) {
      console.log(value);
    }
  });
}
console.log(findPokemon('bulbasaur'));
