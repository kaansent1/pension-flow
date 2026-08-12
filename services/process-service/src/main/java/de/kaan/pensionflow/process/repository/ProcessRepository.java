package de.kaan.pensionflow.process.repository;

import de.kaan.pensionflow.process.model.AdministrativeProcess;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessRepository extends MongoRepository<AdministrativeProcess, String> {
}
