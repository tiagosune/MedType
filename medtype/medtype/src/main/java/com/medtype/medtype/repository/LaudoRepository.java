package com.medtype.medtype.repository;

import com.medtype.medtype.model.Laudo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaudoRepository extends JpaRepository<Laudo, Long> {

    List<Laudo> findByPacienteId(Long pacienteId);
    List<Laudo> findByAutorId(Long autorId);
}
