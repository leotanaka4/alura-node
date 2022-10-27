import moment from "moment";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

import usuarios from "../models/Usuario.js";

class AuthController {
  static login = (req, res) => {
    const { email, senha } = req.body;

    usuarios.findOne({ email }, (err, usuario) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        if (usuario) {
          const testeHash = scryptSync(senha, usuario.sal, 64);
          const hashReal = Buffer.from(usuario.senhaHasheada, "hex");
          if (timingSafeEqual(testeHash, hashReal)) {
            res.status(200).send({
              message: "Usuário logado com sucesso!",
              acessToken: "123456789",
              refreshToken: "987654321",
            });
          } else {
            res.status(401).send({ message: "Senha incorreta!" });
          }
        } else {
          res.status(404).send({ message: "Usuário não encontrado." });
        }
      }
    });
  };

  static cadastro = (req, res) => {
    try {
      function validateEmail(email) {
        const re = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
        return re.test(email);
      }
      function validateSenha(senha) {
        const re =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
        return re.test(senha);
      }
      function criaHashComSal(senha) {
        const sal = randomBytes(16).toString("hex");
        const senhaHasheada = scryptSync(senha, sal, 64).toString("hex");
        return `${sal}:${senhaHasheada}`;
      }

      if (validateEmail(req.body.email && validateSenha(req.body.senha))) {
        const dateFormat = new Date(req.body.dataNascimento);
        const stringFormat = moment(dateFormat).format("DD/MM/YYYY");

        const [sal, senhaHasheada] = criaHashComSal(req.body.senha).split(":");

        let usuario = new usuarios({
          nome: req.body.nome,
          sobrenome: req.body.sobrenome,
          email: req.body.email,
          sal: sal,
          senhaHasheada: senhaHasheada,
          dataNascimento: stringFormat,
        });

        usuario.save((err) => {
          if (err) {
            res.status(500).send({
              message: `${err.message} - falha ao cadastrar usuário.`,
            });
          } else {
            res.status(201).send(usuario.toJSON());
          }
        });
      } else {
        res
          .status(400)
          .send({ message: "Senha ou email inadequados!" });
      }
    } catch (error) {
      res
        .status(400)
        .send({ message: "Cadastro preenchido de forma incorreta!" });
    }
  };
}

export default AuthController;
