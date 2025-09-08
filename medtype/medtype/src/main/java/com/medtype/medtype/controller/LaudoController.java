package com.medtype.medtype.controller;

import com.medtype.medtype.dto.LaudoDTO;
import com.medtype.medtype.model.Laudo;
import com.medtype.medtype.repository.LaudoRepository;
import com.medtype.medtype.repository.PacienteRepository;
import com.medtype.medtype.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/laudos")
public class LaudoController {

    private final LaudoRepository laudoRepo;
    private final PacienteRepository pacienteRepo;
    private final UsuarioRepository usuarioRepo;

    public LaudoController(LaudoRepository laudoRepo,
                           PacienteRepository pacienteRepo,
                           UsuarioRepository usuarioRepo) {
        this.laudoRepo = laudoRepo;
        this.pacienteRepo = pacienteRepo;
        this.usuarioRepo = usuarioRepo;
    }

    @GetMapping
    public List<Laudo> listar() {
        return laudoRepo.findAll();
    }

    @GetMapping("/{id}")
    public Laudo buscar(@PathVariable Long id) {
        return laudoRepo.findById(id).orElseThrow();
    }

    @PostMapping
    public Laudo criar(@RequestBody @Valid LaudoDTO dto) {
        var paciente = pacienteRepo.findById(dto.getPacienteId()).orElseThrow();
        var autor = usuarioRepo.findById(dto.getAutorId()).orElseThrow();

        Laudo laudo = new Laudo();
        laudo.setPaciente(paciente);
        laudo.setAutor(autor);
        laudo.setConteudo(dto.getConteudo());
        laudo.setStatus(dto.getStatus());
        laudo.setData(dto.getData() != null ? dto.getData() : LocalDate.now());

        return laudoRepo.save(laudo);
    }

    @PutMapping("/{id}")
    public Laudo atualizar(@PathVariable Long id, @RequestBody @Valid LaudoDTO dto) {
        Laudo existente = laudoRepo.findById(id).orElseThrow();

        var paciente = pacienteRepo.findById(dto.getPacienteId()).orElseThrow();
        var autor = usuarioRepo.findById(dto.getAutorId()).orElseThrow();

        existente.setPaciente(paciente);
        existente.setAutor(autor);
        existente.setConteudo(dto.getConteudo());
        existente.setStatus(dto.getStatus());
        existente.setData(dto.getData() != null ? dto.getData() : existente.getData());

        return laudoRepo.save(existente);
    }


    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        laudoRepo.deleteById(id);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<Laudo> porPaciente(@PathVariable Long pacienteId) {
        return laudoRepo.findByPacienteId(pacienteId);
    }

    @GetMapping("/autor/{autorId}")
    public List<Laudo> porAutor(@PathVariable Long autorId) {
        return laudoRepo.findByAutorId(autorId);
    }
}
