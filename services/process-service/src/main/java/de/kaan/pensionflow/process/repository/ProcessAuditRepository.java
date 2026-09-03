package de.kaan.pensionflow.process.repository;

import de.kaan.pensionflow.process.model.ProcessAuditEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProcessAuditRepository extends MongoRepository<ProcessAuditEvent, String> {

    List<ProcessAuditEvent> findByProcessIdOrderByOccurredAtDesc(String processId);
}
