const express = require("express");

const server = express();
server.listen(3000);
server.use(express.json());

const projects = [];
let requests = 1;

/**
 * Middleware global que informa o número da requisição atual, o método e
 * a URL.
 */
server.use((req, res, next) => {
  console.log(`Request #${requests}\tMethod: ${req.method}\tURL: ${req.url}`);
  requests++;
  next();
});

/**
 * Busca um projeto a partir do id.
 */
function getProjectById(id) {
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    return { index, project: projects[index] };
  }
  return null;
}

/**
 * Middleware que irá verificar se o projeto já existe.
 */
function checkProjectExists(req, res, next) {
  const result = getProjectById(req.params.id);

  if (!result) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  ({ req } = result);
  return next();
}

/**
 * Middleware que faz a validação do projeto. É verificado se o id já existe.
 */
function validateProject(req, res, next) {
  const exists = getProjectById(req.body.id);
  if (exists) {
    return res.status(400).json({ error: "Project Id already in use" });
  }
  return next();
}

/**
 * Salva um projeto.
 */
server.post("/projects", validateProject, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

/**
 * Busca todos os projetos.
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Busca um projeto específico pelo id.
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  req.project.title = title;
  return res.json(projects);
});

/**
 * Remove um projeto a partir do id.
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects.splice(req.index, 1);
  return res.send();
});

/**
 * Adiciona uma task para um projeto específico.
 */
server.post("/projects/:id/tasks", (req, res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  return res.json(projects);
});
