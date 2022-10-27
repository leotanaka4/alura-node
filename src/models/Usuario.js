import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    id: { type: String },
    admin: { type: Boolean, default: false },
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, required: true },
    sal: { type: String, required: true },
    senhaHasheada: { type: String, required: true },
    dataNascimento: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const usuarios = mongoose.model("usuarios", UsuarioSchema);

export default usuarios;
