
const campoFoto = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");
const formulario = document.getElementById("formPaciente");
const listaPacientes = document.getElementById("listaPacientes");
const mensagem = document.getElementById("mensagem");
const CHAVE = "consulta_pacientes";

function obterPacientes() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (erro) {
    return [];
  }
}

function limparMensagem() {
  mensagem.textContent = "";
}

function renderizarPacientes() {
  const pacientes = obterPacientes();
  listaPacientes.replaceChildren();

  if (pacientes.length === 0) {
    listaPacientes.textContent = "Nenhum paciente cadastrado.";
    return;
  }

  pacientes.forEach(function (paciente) {
    const registro = document.createElement("article");
    registro.className = "registro";

    const titulo = document.createElement("h3");
    titulo.textContent = paciente.nome;
    registro.appendChild(titulo);

    if (paciente.foto) {
      const imagem = document.createElement("img");
      imagem.src = paciente.foto;
      imagem.alt = "Foto de " + paciente.nome;
      registro.appendChild(imagem);
    }

    const dados = [
      ["Endereço", paciente.endereco],
      ["Telefone", paciente.telefone],
      ["E-mail", paciente.email],
      ["Nacionalidade", paciente.nacionalidade],
      ["Naturalidade", paciente.naturalidade]
    ];

    dados.forEach(function ([label, valor]) {
      const item = document.createElement("p");
      item.innerHTML = "<strong>" + label + ":</strong> " + valor;
      registro.appendChild(item);
    });

    listaPacientes.appendChild(registro);
  });
}

campoFoto.addEventListener("change", function () {
  const arquivo = campoFoto.files[0];

  if (!arquivo) {
    previewFoto.removeAttribute("src");
    previewFoto.style.display = "none";
    limparMensagem();
    return;
  }

  if (!arquivo.type.startsWith("image/")) {
    mensagem.textContent = "Selecione um arquivo de imagem válido.";
    previewFoto.removeAttribute("src");
    previewFoto.style.display = "none";
    return;
  }

  if (arquivo.size > 500 * 1024) {
    mensagem.textContent = "A foto deve ter no máximo 500 KB.";
    previewFoto.removeAttribute("src");
    previewFoto.style.display = "none";
    return;
  }

  const leitor = new FileReader();
  leitor.onload = function () {
    previewFoto.src = leitor.result;
    previewFoto.style.display = "block";
    limparMensagem();
  };
  leitor.readAsDataURL(arquivo);
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const paciente = {
    id: Date.now(),
    nome: document.getElementById("nome").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("email").value.trim(),
    nacionalidade: document.getElementById("nacionalidade").value.trim(),
    naturalidade: document.getElementById("naturalidade").value.trim(),
    foto: previewFoto.src || ""
  };

  const campos = [
    paciente.nome,
    paciente.endereco,
    paciente.telefone,
    paciente.email,
    paciente.nacionalidade,
    paciente.naturalidade
  ];

  if (campos.some(function (campo) {
    return campo === "";
  })) {
    mensagem.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }

  const pacientes = obterPacientes();
  pacientes.push(paciente);

  try {
    localStorage.setItem(CHAVE, JSON.stringify(pacientes));
    mensagem.textContent = "Cadastro salvo com sucesso!";
    formulario.reset();
    previewFoto.removeAttribute("src");
    previewFoto.style.display = "none";
    renderizarPacientes();
  } catch (erro) {
    mensagem.textContent = "Não foi possível salvar. O armazenamento pode estar cheio.";
  }
});

renderizarPacientes();

