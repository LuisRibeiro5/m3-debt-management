<template>
  <div>
    <h2>Dívidas cadastradas</h2>
    
    <table>
        <thead>
            <tr>
                <th>Nome</th>
                <th>Cpf</th>
                <th>Email</th>
                <th>CEP</th>
                <th>numero</th>
                <th>complemento</th>
                <th>valor</th>
                <th>descricao</th>
                <th>situacao</th>
                <th>numero processo</th>
                <th>comprovante</th>
                <th>criado em</th>
                <th>Acao</th>
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
                <td><button @click="baixarComprovante(divida.id)">Baixar</button></td>
                <td>{{ divida.criado_em }}</td>
                <td><button @click="excluirDivida(divida.id)">Excluir</button></td>
            </tr>
        </tbody>
    </table>
  </div>

  <form enctype="multipart/form-data" @submit.prevent="enviarFormulario" ref="enviarFormulario">
    <h2>Cadastro de Dívida</h2>
    <div>
      <label for="nome_cliente">Nome do Cliente:</label>
      <input type="text" id="nome_cliente" name="nome_cliente" required />
    </div>
    <div>
      <label for="cpf_cliente">CPF do Cliente:</label>
      <input type="text" id="cpf_cliente" name="cpf_cliente" required />
    </div>
    <div>
      <label for="email_cliente">Email do Cliente:</label>
      <input type="email" id="email_cliente" name="email_cliente" required />
    </div>
    <div>
      <label for="cep">CEP:</label>
      <input type="text" id="cep" name="cep"  />
    </div>
    <div>
      <label for="numero">Número:</label>
      <input type="text" id="numero" name="numero"  />
    </div>
    <div>
      <label for="complemento">Complemento:</label>
      <input type="text" id="complemento" name="complemento" />
    </div>
    <div>
      <label for="valor">Valor:</label>
      <input type="number" id="valor" name="valor" required />
    </div>
    <div>
      <label for="descricao">Descrição:</label>
      <textarea id="descricao" name="descricao" required></textarea>
    </div>
    <div>
      <p>Selecione a situacao</p>
      <input type="radio" id="pago" name="situacao" value="pago" required />
      <label for="pago">Pago</label>

      <input type="radio" id="pendente" name="situacao" value="pendente" required />
      <label for="pendente">Pendente</label>

    </div>
    <div>
      <label for="numero_processo">Número do Processo:</label>
      <input type="text" id="numero_processo" name="numero_processo" required />
    </div>
    <div>
      <label for="comprovante">Comprovante:</label>
      <input type="file" id="comprovante" name="comprovante"  />
    </div>
    <button type="submit">Cadastrar Dívida</button>
  </form>
</template>

<script>

export default {
  data() {
    return {
      dividas: []
    }
  },
  methods: {
    async fetchDividas() {
      try {
        const response = await fetch("http://localhost:3002/dividas");
        const data = await response.json();
        this.dividas = data;
      } catch (error) {
        console.error("Erro ao buscar dívidas:", error);
      }
    },
    async enviarFormulario() {
      const form = this.$refs.enviarFormulario;
      const formData = new FormData(form);

      try {
        const response = await fetch("http://localhost:3002/dividas", {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          alert("Dívida cadastrada com sucesso!");
          form.reset();
          this.fetchDividas(); // Atualiza a lista de dívidas após o cadastro
        } else {
          alert("Erro ao cadastrar dívida.");
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
      }
    },
    async excluirDivida(id) {
      try {
        const response = await fetch(`http://localhost:3002/dividas/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("Dívida excluída com sucesso!");
          this.fetchDividas(); // Atualiza a lista de dívidas após a exclusão
        } else {
          alert("Erro ao excluir dívida.");
        }
      } catch (error) {
        console.error("Erro ao excluir dívida:", error);
      }
    },
    async baixarComprovante(id) {
      try {
            const url = `http://localhost:3002/dividas/comprovante/${id}`;
            window.open(url, "_blank");
      } catch (error) {
        console.error("Erro ao baixar comprovante:", error);
      }
    }

  },
  mounted() {
        this.fetchDividas();
  }
}
</script>
