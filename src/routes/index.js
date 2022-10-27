import express from "express";
import auth from "./authRoutes.js";
import livros from "./livrosRoutes.js";
import autores from "./autoresRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ titulo: "Curso de Node" });
  });

  app.use(express.json(), auth);

  app.use(express.json(), livros);

  app.use(express.json(), autores);
};

export default routes;
