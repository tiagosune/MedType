package com.medtype.medtype.repository;

import com.medtype.medtype.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

// O repositório é uma interface, não uma classe
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Você pode criar consultas personalizadas aqui depois, exemplo:
    Paciente findByCpf(String cpf);
}
