package com.medtype.medtype.controller;

import com.medtype.medtype.dto.UsuarioDTO;
import com.medtype.medtype.model.Usuario;
import com.medtype.medtype.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return usuarioRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Usuario criar(@RequestBody @Valid UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword()); // futuramente criptografar
        usuario.setRole(dto.getRole() != null ? dto.getRole() : "ROLE_USER");

        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody @Valid UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();

        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());
        usuario.setRole(dto.getRole());

        return usuarioRepository.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletar (@PathVariable Long id){
        usuarioRepository.deleteById(id);
    }


}
