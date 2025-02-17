let qtdInput = 0;
var valoresInputs = [];
var unidadeTematica = document.getElementById("unidadeTematica");
var objConhecimento = document.getElementById("objetos-conhecimento");
var habilidades = document.getElementById("habilidades da BNC");
var camposDesabilitados = document.querySelectorAll("select.disabled");
const erro = document.getElementById("erro");

function habilitarCampos() {
  var ano = document.getElementById("ano");
  var disciplina = document.getElementById("disciplina");
  var valorAno = ano.value;
  var valorDisciplina = disciplina.value;

  camposDesabilitados.forEach(function (campo) {
    campo.disabled = false;
    campo.classList.remove("disabled");
  });

  if (valorAno !== "" && valorDisciplina !== "") {
    unidadeTematica.disabled = false;
    objConhecimento.disabled = false;
    habilidades.disabled = false;
  } else {
    unidadeTematica.disabled = true;
    objConhecimento.disabled = true;
    habilidades.disabled = true;
  }
}

function novoRecurso() {
  const inputNovoRecurso = document.createElement("div");
  qtdInput++;
  inputNovoRecurso.innerHTML = `<label for="novoRec ${qtdInput}" class="form-label">Novo Recurso</label>
                               <input type="text" class="form-control novoRec" id="novoRec ${qtdInput}" name="Recurso Didático">`;

  document.getElementById("novoRecurso").appendChild(inputNovoRecurso);

  const novoInput = inputNovoRecurso.querySelector(".novoRec");

  novoInput.addEventListener("change", function () {
    valoresInputs[qtdInput - 1] = novoInput.value;
  });
}

function redirecionar(event) {
  event.preventDefault();

  const objConhecimento = document.getElementById("objetos-conhecimento");
  const formulario = document.getElementById("form");
  const nomeProfessor = document.getElementById("nome-professor").value;
  const data = document.getElementById("data").value;
  const instituicao = document.getElementById("Instituição").value;
  const ano = document.getElementById("ano").value;
  const disciplina = document.getElementById("disciplina").value;
  const unidadeTematica = document.getElementById("unidadeTematica").value;
  const habilidades = document.getElementById("habilidades").value;
  const praticasLinguagem = document.getElementById("praticas-linguagem").value;
  const objetosConhecimento = document.getElementById(
    "objetos-conhecimento"
  ).value;
  const objetivos = document.getElementById("objetivos").value;
  const recursosDidaticos = [];
  const novoRec = document.getElementsByClassName(".novoRec");
  const metodologias = document.getElementById("metodologias").value;
  const avaliacao = document.getElementById("avaliacao").value;

  document.querySelectorAll(".recurso:checked").forEach(function (recurso) {
    recursosDidaticos.push(recurso.value);
  });

  if (novoRec) {
    recursosDidaticos.push(...valoresInputs);
  }

  const dadosFormulario = {
    professor: nomeProfessor,
    data: data,
    instituicao: instituicao,
    ano: ano,
    disciplina: disciplina,
    unidadeTematica: unidadeTematica,
    habilidades: habilidades,
    praticasLinguagem: praticasLinguagem,
    objetosConhecimento: objetosConhecimento,
    objetivos: objetivos,
    recursosDidaticos: recursosDidaticos,
    metodologias: metodologias,
    avaliacao: avaliacao,
  };

  const json = JSON.stringify(dadosFormulario);

  window.location.href = "tabela.html?dados=" + encodeURIComponent(json);
}

function recarregarFormulario() {
  location.reload();
}

async function listarUnidadesTematicas() {
  const disciplina = document.getElementById("disciplina");
  const ano = document.getElementById("ano");
  const selDisciplina = disciplina.value;
  const selAno = ano.value;

  if (selDisciplina !== "" && selAno !== "") {
    try {
      const url = await fetch(
        `https://cientificar1992.pythonanywhere.com/bncc_fundamental/disciplina/${selDisciplina}/${selAno}/?format=json`
      );
      const dados = await url.json();

      const listaUnidadesTematicas = document.getElementById("unidadeTematica");

      while (listaUnidadesTematicas.firstChild) {
        listaUnidadesTematicas.removeChild(listaUnidadesTematicas.firstChild);
      }

      if (Array.isArray(dados.unidades_tematicas)) {
        dados.unidades_tematicas.forEach((data) => {
          const opcaoTematica = document.createElement("option");
          opcaoTematica.value = data.nome_unidade;
          opcaoTematica.text = data.nome_unidade;
          listaUnidadesTematicas.appendChild(opcaoTematica);
        });
      }
    } catch (error) {
      erro.innerHTML = `<div class="alert alert-warning" role="alert">
      Erro ao buscar dados na API. Aguarde uns minutos e atualize a página para tentar novamente.
    </div>`;

      unidadeTematica.disabled = true;
      objConhecimento.disabled = true;
      habilidades.disabled = true;
    }
  }
}

async function listarHabilidades() {
  const disciplina = document.getElementById("disciplina");

  const selDisciplina = disciplina.value;

  if (selDisciplina !== "") {
    try {
      const url = await fetch(
        `https://cientificar1992.pythonanywhere.com/bncc_fundamental/${selDisciplina}/info_habilidades/`
      );

      const dados = await url.json();

      const listaHabilidades = document.getElementById("habilidades");

      while (listaHabilidades.firstChild) {
        listaHabilidades.removeChild(listaHabilidades.firstChild);
      }

      dados.forEach((item) => {
        const opcao = document.createElement("option");
        opcao.value = item.habilidade;
        opcao.text = item.habilidade;
        listaHabilidades.appendChild(opcao);
      });
    } catch (error) {
      erro.innerHTML = `<div class="alert alert-warning" role="alert">
        Erro ao buscar dados na API. Aguarde uns minutos e atualize a página para tentar novamente.
      </div>`;

      unidadeTematica.disabled = true;
      objConhecimento.disabled = true;
      habilidades.disabled = true;
    }
  }
}

async function listarObjetoConhecimento() {
  const listaObjetoConhecimento = document.getElementById(
    "objetos-conhecimento"
  );
  const ano = document.getElementById("ano");
  const disciplina = document.getElementById("disciplina");
  const selDisciplina = disciplina.value;
  const selAno = ano.value;

  if (selDisciplina !== "" && selAno !== "") {
    fetch(
      `https://cientificar1992.pythonanywhere.com/bncc_fundamental/disciplina/${selDisciplina}/${selAno}/?format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (listaObjetoConhecimento !== null) {
          while (listaObjetoConhecimento.firstChild) {
            listaObjetoConhecimento.removeChild(
              listaObjetoConhecimento.firstChild
            );
          }
        }

        if (Array.isArray(data.unidades_tematicas)) {
          data.unidades_tematicas.forEach((item) => {
            let uniTematicas = item.objeto_conhecimento;

            uniTematicas.forEach((element) => {
   
              const opcaoObjeto = document.createElement("option");
              opcaoObjeto.value = element.nome_objeto;
              opcaoObjeto.text = element.nome_objeto;
              listaObjetoConhecimento.appendChild(opcaoObjeto);
            });
          });
        }
      })
      .catch((error) => {
        erro.innerHTML = `<div class="alert alert-warning" role="alert">
        Erro ao buscar dados na API. Aguarde uns minutos e atualize a página para tentar novamente.
      </div>`
      
        unidadeTematica.disabled = true;
        objConhecimento.disabled = true;
        habilidades.disabled = true;
      });
  }
}

function renderizarDados() {
  if (typeof URLSearchParams !== "undefined") {
    const recursosDidaticos = [];
    const recursos = document
      .querySelectorAll(".recurso:checked")
      .forEach(function (recurso) {
        recursosDidaticos.push(recurso.value);
      });
    const novoRec = document.getElementsByClassName(".novoRec");

    if (novoRec) {
      recursosDidaticos.push(...valoresInputs);
    }

    document.getElementById("info-professor").textContent =
      document.getElementById("nome-professor").value;
    document.getElementById("info-turma").textContent =
      document.getElementById("turma").value;
    document.getElementById("info-instituição").textContent =
      document.getElementById("Instituição").value;
    document.getElementById("info-disciplina").textContent = document
      .getElementById("disciplina")
      .value.toUpperCase();
    document.getElementById("info-unidade-temática").textContent =
      document.getElementById("unidadeTematica").value;
    document.getElementById("info-habilidades").textContent =
      document.getElementById("habilidades").value;
    document.getElementById("info-praticas").textContent =
      document.getElementById("praticas-linguagem").value;
    document.getElementById("info-objeto-conhecimento").textContent =
      document.getElementById("objetos-conhecimento").value;
    document.getElementById("info-objetivos").textContent =
      document.getElementById("objetivos").value;
    document.getElementById("info-recursos").textContent = recursosDidaticos;
    document.getElementById("info-metodologias").textContent =
      document.getElementById("metodologias").value;
    document.getElementById("info-avaliação").textContent =
      document.getElementById("avaliacao").value;
  } else {
    console.log("Não foi possível capturar valores input");
  }
}

document.getElementById("ano").addEventListener("input", habilitarCampos);

document
  .getElementById("disciplina")
  .addEventListener("input", habilitarCampos);

document
  .getElementById("disciplina")
  .addEventListener("change", listarHabilidades);

document
  .getElementById("disciplina")
  .addEventListener("change", listarUnidadesTematicas);

document
  .getElementById("disciplina")
  .addEventListener("change", listarObjetoConhecimento);
