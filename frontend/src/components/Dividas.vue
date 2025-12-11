<template>
  <div class="container">

    <!-- ===================== TABELA ===================== -->
    <div class="table-container">
      <div class="section-title">Dívidas cadastradas</div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>CEP</th>
              <th>Número</th>
              <th>Complemento</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Situação</th>
              <th>Número Processo</th>
              <th>Comprovante</th>
              <th>Criado em</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="divida in dividas" :key="divida.id">
              <td>{{ divida.nome_cliente }}</td>
              <td>{{ divida.cpf_cliente }}</td>
              <td>{{ divida.email_cliente }}</td>
              <td>{{ divida.cep }}</td>
              <td>{{ divida.numero }}</td>
              <td>{{ divida.complemento }}</td>
              <td>{{ divida.valor }}</td>
              <td>{{ divida.descricao }}</td>
              <td>{{ divida.situacao }}</td>
              <td>{{ divida.numero_processo }}</td>

              <!-- Abrir comprovante -->
              <td>
                <a
                  v-if="divida.comprovante"
                  :href="`http://localhost:3002/comprovante/${divida.id}`"
                  target="_blank"
                >
                  Abrir
                </a>
                <span v-else>—</span>
              </td>

              <td>{{ divida.criado_em }}</td>

              <!-- Botão excluir -->
              <td>
                <button class="delete-btn" @click="excluirDivida(divida.id)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ===================== FORMULÁRIO ===================== -->
    <div class="form-container">

      <div class="section-title">Cadastro de Dívida</div>

      <form enctype="multipart/form-data" @submit.prevent="enviarFormulario" ref="enviarFormulario">

        <label for="nome_cliente">Nome do Cliente:</label>
        <input type="text" id="nome_cliente" name="nome_cliente" required />

        <label for="cpf_cliente">CPF do Cliente:</label>
        <input type="text" id="cpf_cliente" name="cpf_cliente" required />

        <label for="email_cliente">Email do Cliente:</label>
        <input type="email" id="email_cliente" name="email_cliente" required />

        <label for="cep">CEP:</label>
        <input type="text" id="cep" name="cep" />

        <label for="numero">Número:</label>
        <input type="text" id="numero" name="numero" />

        <label for="complemento">Complemento:</label>
        <input type="text" id="complemento" name="complemento" />

        <label for="valor">Valor:</label>
        <input type="number" id="valor" name="valor" required />

        <label for="descricao">Descrição:</label>
        <textarea id="descricao" name="descricao" required></textarea>

        <p style="font-weight:bold; margin-top:10px;">Selecione a situação</p>

        <div style="display:flex; align-items:center; gap:10px;">
          <input type="radio" id="pago" name="situacao" value="pago" required />
          <label for="pago">Pago</label>

          <input type="radio" id="pendente" name="situacao" value="pendente" required />
          <label for="pendente">Pendente</label>
        </div>

        <label for="numero_processo">Número do Processo:</label>
        <input type="text" id="numero_processo" name="numero_processo" required />

        <label for="comprovante">Comprovante:</label>
        <input type="file" id="comprovante" name="comprovante" />

        <button type="submit">Cadastrar Dívida</button>
      </form>

    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      dividas: []
    }
  },
  methods: {
      carregarCache() {
        const cache = localStorage.getItem("dividas");
        if (cache) {
          try {
            this.dividas = JSON.parse(cache);
          } catch (e) {
            console.warn("Erro ao ler cache, limpando...", e);
            localStorage.removeItem("dividas");
          }
        }
    },
    async fetchDividas() {
      try {
        const response = await fetch("http://localhost:3002/dividas");

        if (!response.ok) {
          throw new Error("Erro ao buscar dívidas");
        } 

        const data = await response.json();
        this.dividas = data;

        //  REMOVE O COMPROVANTE ANTES DE SALVAR NO CACHE
        const cacheData = data.map(d => {
          const copia = { ...d };
          delete copia.comprovante;
          return copia;
        });

        localStorage.setItem("dividas", JSON.stringify(cacheData));
      } catch (error) {
        console.warn("Erro ao buscar dívidas:", error);

        // tenta carregar do cache
        this.carregarCache();
        }
    },
    validarFormulario(fd) {
      const nome = fd.get("nome_cliente");
      const cpf = fd.get("cpf_cliente");
      const email = fd.get("email_cliente");
      const valor = fd.get("valor");
      const descricao = fd.get("descricao");
      const situacao = fd.get("situacao");

      if (!nome) return "Nome é obrigatório";
      if (!cpf || cpf.length !== 11) return "CPF deve ter 11 dígitos";
      if (!email) return "Email é obrigatório";
      if (!valor || Number(valor) <= 0) return "Valor deve ser maior que zero";
      if (!descricao) return "Descrição é obrigatória";
      if (!situacao) return "Situação deve ser selecionada";

      return null;
    },
    async enviarFormulario() {
      const form = this.$refs.enviarFormulario;
      const formData = new FormData(form);

      // validação
      const erro = this.validarFormulario(formData);
      if (erro) {
        alert(erro);
        return;
      }

      try {
        const response = await fetch("http://localhost:3002/dividas", {
          method: "POST",
          body: formData
        });


        if (!response.ok) {
          alert("Erro ao cadastrar dívida.");
          return;
        }

        alert("Dívida cadastrada!");
        form.reset();

        await this.fetchDividas(); // Atualiza a lista de dívidas após o cadastro

      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
      }
    },
    async excluirDivida(id) {
      try {
        const response = await fetch(`http://localhost:3002/dividas/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          alert("Erro ao excluir dívida.");
          return;
        }

        alert("Dívida excluída!");
        // remove do estado
        this.dividas = this.dividas.filter(d => d.id !== id);


        // ATUALIZA O CACHE SEM COMPROVANTE
        const cacheData = this.dividas.map(d => {
          const copia = { ...d };
          delete copia.comprovante;
          return copia;
        });

        localStorage.setItem("dividas", JSON.stringify(cacheData));
      } catch (error) {
        console.error("Erro ao excluir dívida:", error);
      }
    }
  },
  mounted() {
        this.carregarCache();
        this.fetchDividas();
  }
}
</script>

<style>
  .container {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100vh; /* ocupa a tela toda */
  padding: 20px;
  box-sizing: border-box;
  background: #f5f7fa;
  font-family: Arial, sans-serif;
}

/* Metade esquerda: tabela */
.table-container {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

/* Título da seção */
.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

/* Div da tabela com scroll */
.table-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* Tabela */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

table thead {
  background: #4a90e2;
  color: white;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

table tr:hover {
  background: #f2f7ff;
}

/* Botão de excluir */
.delete-btn {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #c0392b;
}

/* Metade direita: formulário */
.form-container {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

button {
  padding: 12px;
  margin-top: 8px;
  font-size: 16px;
  background: #4a90e2;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #357ABD;
}

</style>