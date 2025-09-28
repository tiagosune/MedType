package com.medtype.medtype.controller;

import com.medtype.medtype.dto.PacienteDTO;
import com.medtype.medtype.model.Paciente;
import com.medtype.medtype.repository.PacienteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;


    @GetMapping
    public List<Paciente> listar() {
        return pacienteRepository.findAll();
    }


    @GetMapping("/{id}")
    public Optional<Paciente> buscarPorId(@PathVariable Long id) {
        return pacienteRepository.findById(id);
    }

    @PostMapping
    public Paciente criar(@RequestBody @Valid PacienteDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setCpf(dto.getCpf());
        paciente.setTelefone(dto.getTelefone());
        paciente.setEmail(dto.getEmail());

        return pacienteRepository.save(paciente);
    }

    @PutMapping("/{id}")
    public Paciente atualizar(@PathVariable Long id, @RequestBody @Valid PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(id).orElseThrow();

        paciente.setNome(dto.getNome());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setCpf(dto.getCpf());
        paciente.setTelefone(dto.getTelefone());
        paciente.setEmail(dto.getEmail());

        return pacienteRepository.save(paciente);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        pacienteRepository.deleteById(id);
    }
}
