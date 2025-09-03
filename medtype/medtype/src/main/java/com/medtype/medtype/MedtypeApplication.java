package com.medtype.medtype;

import com.medtype.medtype.model.Paciente;
import com.medtype.medtype.repository.PacienteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class MedtypeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedtypeApplication.class, args);
	}



}
