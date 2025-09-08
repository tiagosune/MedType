package com.medtype.medtype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LaudoDTO {
    @NotNull(message = "O paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "O autor é obrigatório")
    private Long autorId;

    private LocalDate data;

    @NotBlank(message = "O conteúdo do laudo não pode estar vazio")
    private String conteudo;

    private String status; // Ex: "Rascunho", "Finalizado"
}
