package de.kaan.pensionflow.process.repository;

import de.kaan.pensionflow.process.model.AdministrativeProcess;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProcessRepository extends MongoRepository<AdministrativeProcess, String> {

    List<AdministrativeProcess> findAllByOrderByCreatedAtDesc();
}
