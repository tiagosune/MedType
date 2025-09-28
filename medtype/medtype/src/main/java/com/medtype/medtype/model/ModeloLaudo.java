package com.medtype.medtype.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ModeloLaudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;
}
