package com.medtype.medtype.repository;

import com.medtype.medtype.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Paciente findByCpf(String cpf);
}
