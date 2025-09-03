package com.medtype.medtype.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PacienteDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Past(message = "A data de nascimento deve ser no passado")
    private LocalDate dataNascimento;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    private String telefone;

    @Email(message = "E-mail inválido")
    private String email;
}
