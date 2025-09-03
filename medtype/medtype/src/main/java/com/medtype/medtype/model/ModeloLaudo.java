package com.medtype.medtype.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ModeloLaudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo; // texto padrão do modelo
}
