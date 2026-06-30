const BASE_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2506-ftb-et-web-ft";
const API_URL = `${BASE_URL}/${COHORT}`;

const state = {
  players: [],
  selectedPlayer: null,
};

const puppyRoster = document.querySelector("#puppy-roster");
const puppyDetails = document.querySelector("#puppy-details");
const newPuppyForm = document.querySelector("#new-puppy-form");


const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const result = await response.json();

    state.players = result.data.players;
  } catch (error) {
    console.error(error);
  }
};

const renderDetails = () => {
  puppyDetails.replaceChildren();

  if (state.selectedPlayer === null) {
    const message = document.createElement("p");
    message.textContent = "Select a puppy to see more information.";
    puppyDetails.append(message);
    return;
  }

  const player = state.selectedPlayer;

  const box = document.createElement("div");
  box.classList.add("details-card");

  const image = document.createElement("img");
  image.src = player.imageUrl;
  image.alt = player.name;

  const name = document.createElement("p");
  name.textContent = `Name: ${player.name}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${player.id}`;

  const breed = document.createElement("p");
  breed.textContent = `Breed: ${player.breed}`;

  const status = document.createElement("p");
  status.textContent = `Status: ${player.status}`;

  const team = document.createElement("p");

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove from Roster";
  removeButton.addEventListener("click", function () {
    removePlayer(player.id);
  });

  if (player.team) {
    team.textContent = `Team: ${player.team.name}`;
  } else {
    team.textContent = "Team: Unassigned";
  }

  box.append(
    image,
    name, 
    id, 
    breed, 
    status, 
    team,
    removeButton
  );
  puppyDetails.append(box);

};

const render = () => {
  puppyRoster.replaceChildren();

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];

    const card = document.createElement("div");
    card.classList.add("puppy-card");

    const image = document.createElement("img");
    image.src = player.imageUrl;
    image.alt = player.name;

    const name = document.createElement("h3");
    name.textContent = player.name;

    card.append(image, name);

    card.addEventListener("click", function () {
      fetchSinglePlayer(player.id);
    });

    puppyRoster.append(card);
  }

  renderDetails();
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const result = await response.json();

    state.selectedPlayer = result.data.player;

    render();
  } catch (error) {
    console.error(error);
  }
};

const removePlayer = async (playerId) => {
  try {
    await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });

    state.selectedPlayer = null;

    await fetchAllPlayers();

    render();
  } catch (error) {
    console.error(error);
  }
};

newPuppyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(newPuppyForm);

  const newPlayer = {
    name: formData.get("name"),
    breed: formData.get("breed"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl"),
  };

  addNewPlayer(newPlayer);

  newPuppyForm.reset();
});

const addNewPlayer = async (newPlayer) => {
  try {
    await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });

    await fetchAllPlayers();
    render();
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  await fetchAllPlayers();

  render();
};

init();