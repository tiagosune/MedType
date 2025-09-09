// src/main/java/com/medtype/medtype/model/ModeloLaudo.java
package com.medtype.medtype.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ModeloLaudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo; // Nome do modelo (ex.: "Ultrassom Abdômen", "Laudo Obstétrico")

    @Column(columnDefinition = "TEXT")
    private String conteudo; // Texto padrão do modelo
}
