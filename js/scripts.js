let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=60';

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

    let pokemonList = document.querySelector(`.pokemon-list`);
    pokemonList.classList.add(`row`);
    pokemonList.classList.add(`justify-content-center`);

    let pokemonItemContainer = document.createElement(`div`);
    pokemonList.appendChild(pokemonItemContainer);
    pokemonItemContainer.classList.add('col-sm-6');
    pokemonItemContainer.classList.add('col-md-4');
    pokemonItemContainer.classList.add('col-lg-3');
    pokemonItemContainer.classList.add('p-1');

    let pokemonListItem = document.createElement(`div`);
    pokemonItemContainer.appendChild(pokemonListItem);
    pokemonListItem.classList.add(`pokemon-list__item`);
    pokemonListItem.classList.add(`py-3`);
    pokemonListItem.classList.add(`row`);
    pokemonListItem.classList.add(`m-0`);
    pokemonListItem.classList.add(`text-center`);
    pokemonListItem.classList.add(`justify-content-center`);

    let pokemonImage = document.createElement(`img`);
    pokemonListItem.appendChild(pokemonImage);
    pokemonImage.setAttribute(`src`, pokemon.imgUrl);
    pokemonImage.setAttribute(`alt`, `Pokemon ${pokemon.name} image`);
    pokemonImage.classList.add(`pokemon__image`);
    pokemonImage.classList.add(`col-12`);

    let pokemonName = document.createElement(`h2`);
    pokemonListItem.appendChild(pokemonName);
    pokemonName.innerText = pokemon.name;
    pokemonName.classList.add(`text-capitalize`);
    pokemonName.classList.add(`col-12`);
    pokemonName.classList.add(`mt-3`);

    // Need to find better sollution for positioning h2 - super feature
    let pokemonUnique = document.createElement(`div`);
    pokemonListItem.appendChild(pokemonUnique);
    pokemonUnique.innerHTML = isHeavyWeight;
    pokemonUnique.classList.add(`col-12`);

    let pokemonFeature = document.createElement(`ul`);
    pokemonListItem.appendChild(pokemonFeature);
    pokemonFeature.classList.add(`list-unstyled`);
    pokemonFeature.classList.add(`col-12`);

    let pokemonHeight = document.createElement(`li`);
    pokemonFeature.appendChild(pokemonHeight);
    let pokemonHeightHeading = document.createElement(`span`);
    pokemonHeight.appendChild(pokemonHeightHeading);
    pokemonHeightHeading.innerText = `Height: `;
    pokemonHeightHeading.classList.add(`font-weight-bolder`);
    let pokemonHeightValue = document.createElement(`span`);
    pokemonHeight.appendChild(pokemonHeightValue);
    pokemonHeightValue.innerText = `${pokemon.height}`;

    let pokemonWeight = document.createElement(`li`);
    pokemonFeature.appendChild(pokemonWeight);
    let pokemonWeightHeading = document.createElement(`span`);
    pokemonWeight.appendChild(pokemonWeightHeading);
    pokemonWeightHeading.innerText = `Weight: `;
    pokemonWeightHeading.classList.add(`font-weight-bolder`);
    let pokemonWeightValue = document.createElement(`span`);
    pokemonWeight.appendChild(pokemonWeightValue);
    pokemonWeightValue.innerText = `${pokemon.weight}`;

    let pokemonButton = document.createElement(`button`);
    pokemonListItem.appendChild(pokemonButton);
    pokemonButton.innerText = `Show details`;
    pokemonButton.classList.add(`pokemon-details__button`);
    pokemonButton.classList.add(`p-2`);
    pokemonButton.classList.add(`rounded`);
    pokemonButton.classList.add(`col-6`);
    pokemonButton.setAttribute('data-toggle', 'modal');
    pokemonButton.setAttribute('data-target', '#pkemon-modal');

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
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
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
        item.abilities = details.abilities;
        item.experience = details.base_experience;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetailsModal(item) {
    let modalBody = document.querySelector(`.modal-body`);
    let modalTitle = document.querySelector(`.modal-title`);
    let modalHeader = document.querySelector(`.modal-header`);

    modalTitle.innerText = '';
    modalBody.innerText = '';
   

    modalTitle.innerText = `${item.name}`;
    modalTitle.classList.add('text-capitalize');

    modalBody.classList.add('container-fluid');

    let modalContainer = document.createElement('div');
    modalBody.appendChild(modalContainer);
    modalContainer.classList.add('row');

    let modalImage = document.createElement('img');
    modalContainer.appendChild(modalImage);
    modalImage.setAttribute(`src`, `${item.imgUrl}`);
    modalImage.setAttribute(`alt`, `Pokemon ${item.name} image`);
    modalImage.classList.add('col-12');
    modalImage.classList.add('col-md-4');
    modalImage.classList.add('pokemon__image');

    let detailsInfo = document.createElement('div');
    modalContainer.appendChild(detailsInfo);
    detailsInfo.classList.add('col-12');
    detailsInfo.classList.add('col-md-8');

    let detailsList = document.createElement('ul');
    detailsInfo.appendChild(detailsList);
    detailsInfo.classList.add('list-group');
    detailsInfo.classList.add('list-group-flush');

    let pokemonHeight = document.createElement('li');
    pokemonHeight.innerHTML = `<span><strong>Height: </strong>${item.height}</span>`;
    detailsList.appendChild(pokemonHeight);
    pokemonHeight.classList.add('list-group-item');

    let pokemonWeight = document.createElement('li');
    pokemonWeight.innerHTML = `<span><strong>Weight: </strong>${item.weight}</span>`;
    detailsList.appendChild(pokemonWeight);
    pokemonWeight.classList.add('list-group-item');

    let pokemonExperience = document.createElement('li');
    pokemonExperience.innerHTML = `<span><strong>Base experience: </strong>${item.experience}</span>`;
    detailsList.appendChild(pokemonExperience);
    pokemonExperience.classList.add('list-group-item');

    function getAbilities(abilities) {
      let abilitiesString = ``;
      for (let i = 0; i < abilities.length; i++) {
        if (i === abilities.length - 1) {
          abilitiesString += `${abilities[i].ability.name}`;
        } else {
          abilitiesString += `${abilities[i].ability.name}, `;
        }
      }
      return abilitiesString;
    }
    let abilitiesList = getAbilities(item.abilities);

    let pokemonAbilities = document.createElement('li');
    pokemonAbilities.innerHTML = `<span><strong>Abilities: </strong>${abilitiesList}</span>`;
    detailsList.appendChild(pokemonAbilities);
    pokemonAbilities.classList.add('list-group-item');

    function getTypes(types) {
      let typesString = ``;
      for (let i = 0; i < types.length; i++) {
        if (i === types.length - 1) {
          typesString += `${types[i].type.name}`;
        } else {
          typesString += `${types[i].type.name}, `;
        }
      }
      return typesString;
    }

    let typesList = getTypes(item.types);
    let pokemonTypes = document.createElement('li');
    pokemonTypes.innerHTML = `<span><strong>Types: </strong>${typesList}</span>`;
    detailsList.appendChild(pokemonTypes);
    pokemonTypes.classList.add('list-group-item');
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showDetailsModal(item);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function (res) {
  pokemonRepository.getAll().forEach((p) => {
    pokemonRepository.loadDetails(p).then(function () {
      pokemonRepository.addListItem(p);
    });
  });
});

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
