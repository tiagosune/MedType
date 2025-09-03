package com.medtype.medtype.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LaudoDTO {
    private Long pacienteId;
    private Long autorId;
    private LocalDate data;
    private String conteudo;
    private String status;
}
