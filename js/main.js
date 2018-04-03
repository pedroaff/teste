$(document).ready(function () {
        $('.date').mask('0000/00/00');
        $('.phone').mask('00000-0000');
        $('.cpf').mask('000.000.000-00', { reverse: true });
        
      
        carregar();

        SNButton.init("cadastrarPaciente", {
			fields: ["nome", "celular", "cpf", "dataNascimento"]
        });
    });


    var $pacientes = $('#pacientes');
    var $nome = $('#nome');
    var $cpf = $('#cpf');
    var $dataNascimento = $('#dataNascimento');
    var $celular = $('#celular');
    var key = "23be778f-d904-4491-861a-6d226da05b49";
    var urlbase = "http://si.shx.com.br:9999/shx-teste-backend/paciente/v2/";
    var $idEdicao = 0;


    var carregar = function () {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: urlbase + "findall/" + key,
            success: function carregarDados(data) {
                $pacientes.empty();
                JSON.stringify(data);
                $.each(data.body, function (i, paciente) {
                    $pacientes.append
                        (`
                            <tr data-id=${paciente.id}>
                                <td> ${paciente.nome}</td>
                                <td> ${paciente.cpf} </td>
                                <td> ${paciente.dataNascimento}  </td>  
                                <td> ${paciente.celular}  </td> 
                                <td> 
                                    <button type="button" class="btn btn-primary editar" id='${paciente.id}'>Editar</button> 
                                    <button type="button" class="btn btn-warning remover" id='${paciente.id}')">Remover</button> 
                                    
                                </td>
                            </tr>`
                        );
                });

                $('.remover').on('click', function (e) {
                    deletar(e.target.id);
                });

                $('.editar').on('click', function (e) {
                    editar(e.target.id);
                });

            },
            error: function () {
                alert('Erro Ao tentar abrir o API');
                document.write('<p>Erro ao tentar API.</p>');
            }
        });
    }


    var deletar = function (id) {
        var data = {
            id: id,
            chave: key
        };

        $.ajax({
            type: 'DELETE',
            contentType: "application/json",
            dataType: "json",
            url: urlbase + "remove",
            data: JSON.stringify(data),
            success: function (response) {
                carregar();
            },
            error: function (error) {
                alert(error)
            }
        });
    }


    var editar = function (id) {
        var data = {
            id: id,
            chave: key
        }

        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            url: urlbase + "findone",
            data: JSON.stringify(data),
            success: function (response) {
                mostrarDadosEdicao(response.body);
            },
            error: function (error) {
                alert(error)
            }
        });
    }

    var habilitarBotao = function (){
        $("#cadastrarPaciente").prop("disabled", "true");
    }

    var mostrarDadosEdicao = function (dados) {
        $nome.val(dados.nome);
        $dataNascimento.val(dados.dataNascimento);
        $cpf.val(dados.cpf);
        $celular.val(dados.celular);
        $idEdicao = dados.id;

        $('#labelCadastro').hide();
        $('#cadastrarPaciente').hide();
        $('#labelEdicao').show();
        $('#editarPaciente').show();
        $('#formularioModal').modal('show');
    }


    $('#showModalCadastrar').on('click', function () {
        $('#adicionarPaciente')[0].reset();
        $('#labelCadastro').show();
        $('#cadastrarPaciente').show();
        $('#labelEdicao').hide();
        $('#editarPaciente').hide();

        
    });


    $('#cadastrarPaciente').on('click', function () {
        
        var novoPaciente = {
            nome: $nome.val(),
            dataNascimento: $dataNascimento.val(),
            cpf: $cpf.val().replace('.', '', ).replace('.', '').replace('-', ''),
            celular: $celular.val().replace('-', ''),
            chave: key
        };            

            $.ajax({
                type: 'POST',
                contentType: "application/json",
                dataType: "json",
                url: urlbase + "persist",
                data: JSON.stringify(novoPaciente),
                beforeSend: function(){
                    
                },
                success: function (criarPaciente) {
                    carregar();
                    $('#formularioModal').modal('hide');
                    $('form input:text').val('');               
                }
            });
        

    });

    
    $('#editarPaciente').on('click', function (e) {

        var pacienteEditado = {
            nome: $nome.val(),
            dataNascimento: $dataNascimento.val(),
            cpf: $cpf.val().replace('.', '', ).replace('.', '').replace('-', ''),
            celular: $celular.val().replace('-', ''),
            chave: key,
            id: $idEdicao
        };        

        $.ajax({
            type: 'PUT',
            contentType: "application/json",
            dataType: "json",
            url: urlbase + "merge",
            data: JSON.stringify(pacienteEditado),
            success: function (response) {
                $('#formularioModal').modal('hide');
                $('form input:text').val('');
                carregar();

            }
        })
    });

    $('#cancelar').on('click', function(e) {
        $('form input:text').val('');
    });