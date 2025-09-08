package com.medtype.medtype.controller;

import com.medtype.medtype.model.ModeloLaudo;
import com.medtype.medtype.repository.ModeloLaudoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modelos")
@CrossOrigin(origins = "http://localhost:3000") // libera acesso para frontend
public class ModeloLaudoController {

    private final ModeloLaudoRepository modeloRepo;

    public ModeloLaudoController(ModeloLaudoRepository modeloRepo) {
        this.modeloRepo = modeloRepo;
    }

    @GetMapping
    public List<ModeloLaudo> listar() {
        return modeloRepo.findAll();
    }

    @GetMapping("/{id}")
    public ModeloLaudo buscar(@PathVariable Long id) {
        return modeloRepo.findById(id).orElseThrow();
    }

    @PostMapping
    public ModeloLaudo criar(@RequestBody ModeloLaudo modelo) {
        return modeloRepo.save(modelo);
    }

    @PutMapping("/{id}")
    public ModeloLaudo atualizar(@PathVariable Long id, @RequestBody ModeloLaudo modelo) {
        ModeloLaudo existente = modeloRepo.findById(id).orElseThrow();
        existente.setTitulo(modelo.getTitulo());
        existente.setConteudo(modelo.getConteudo());
        return modeloRepo.save(existente);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        modeloRepo.deleteById(id);
    }
}
