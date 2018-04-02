$(function () {
    $(document).ready(function(){
        $('.date').mask('0000/00/00');
        $('.time').mask('00:00:00');
        $('.date_time').mask('00/00/0000 00:00:00');
        $('.cep').mask('00000-000');
        $('.phone').mask('00000-0000');
        $('.phone_with_ddd').mask('(00) 0000-0000');
        $('.phone_us').mask('(000) 000-0000');
        $('.mixed').mask('AAA 000-S0S');
        $('.cpf').mask('000.000.000-00', {reverse: true});
        $('.money').mask('000.000.000.000.000,00', {reverse: true});
    });      
    
    var $pacientes = $('#pacientes');
    var cc = 0;
    var $nome = $('#nome');
    var $cpf = $('#cpf');
    var $dataNascimento = $('#dataNascimento');
    var $id = $('#codigo');
    var $celular = $('#celular');
    var key = "23be778f-d904-4491-861a-6d226da05b49";
    var urlbase = "http://si.shx.com.br:9999/shx-teste-backend/paciente/v2/";	

    //carrega a lista de pacientes
    $(document).ready(function(){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: urlbase + "/findall/" + key,
            success: function carregarDados(data) {
                $pacientes.empty();
                JSON.stringify(data);
                //console.log(data.body[0].nome);        
                $.each(data, function(i, paciente)
                {       
                    $pacientes.append
                        (`
                            <tr data-id=${data.body[cc].id}>
                                <td> ${data.body[cc].nome}</td>
                                <td> ${data.body[cc].cpf} </td>
                                <td> ${data.body[cc].dataNascimento}  </td>  
                                <td> ${data.body[cc].celular}  </td> 
                                <td> 
                                    <button type="button" class="btn btn-primary" id="editar" data-toggle="modal" data-target="#editarModal">Editar</button> 
                                    <button type="button" class="btn btn-warning remover" data-id='${data.body[cc].id}'>Remover</button> 
                                </td>
                            </tr>`
                        );
                        cc++;
                });

            },
            error: function()
            {
                alert('Erro Ao tentar abrir o API');
                document.write('<p>Erro ao tentar API.</p>');
            }
        });
    });

   
            
    $('#cadastrarPaciente').on('click', function() {
        var novoPaciente = {
            nome: $nome.val(),
            dataNascimento: $dataNascimento.val(),
            cpf: $cpf.val(),
            celular: $celular.val()
        };

        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            url: urlbase + "persist/" + key,
            data: JSON.stringify(novoPaciente),
            success: function(criarPaciente) {
                $pacientes.append(`
                        <tr>
                            <td>${novoPaciente.body.nome}</td>
                            <td>${novoPaciente.body.dataNascimento}</td>
                            <td>${novoPaciente.body.cpf}</td>
                            <td>${novoPaciente.body.id}</td> 
                            <td> 
                                <button type="button" class="btn btn-info">Editar</button> 
                                <button type="button" class="btn btn-warning remover">Remover</button> 
                            </td>
                        </tr>`);
                $('#formularioModal').modal('hide');
                $('form input:text').val('');                        
            }
        });

    });

    //Remover paciente
    // var $tabela = $('#pacienteTabela');

    // $tabela.delegate('.remover', 'click', function(){
    //     var $li = $(this).closest('li');
    //     $.ajax({
    //         type: 'DELETE',
    //         url: urlbase + $(this).attr('data-id'),
    //         contentType: "application/json",
    //         dataType: "json",
    //         success: function (){
    //             $li.remove();
    //         }
    //     });
    // });


});