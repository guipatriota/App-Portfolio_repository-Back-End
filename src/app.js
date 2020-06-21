const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //This route shows all repositories:
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // This route should receive title, url and techs inside request body.
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Change only title, url and/or techs:
  const { id } = request.params;
  const {title, url, techs} = request.body;

  // Repository id validation:
  if (repositories.findIndex(repository => repository.id === id) < 0) {
    return response.status(400).json({error : "ID not found!"});
  };

  // Finding repository by id:
  const repository = repositories.find(repository => repository.id === id);

  // Updating data if necessary:
  repository.title = (typeof title !== 'undefined') ? title : repository.title;
  repository.url = (typeof url !== 'undefined') ? url : repository.url;
  repository.techs = (typeof techs !== 'undefined') ? techs : repository.techs;

  // repositories[repositories.findIndex(repository => repository.id === id)] = {
  //   id,
  //   title,
  //   url,
  //   techs
  // };

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // Delete some repository by id:
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verifying if id exists:
  if (repositoryIndex < 0) {
    return response.status(400).json({error : "ID not found!"})
  }
  else {
    // Delete the repository:
    repositories.splice(repositoryIndex, 1);
  };

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // Rise likes number for some repository by id:
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verifying if id exists:
  if (repositoryIndex < 0) {
    return response.status(400).json({error : "ID not found!"})
  }
  else {
    // Delete the repository:
    repositories[repositoryIndex].likes += 1;
  };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
