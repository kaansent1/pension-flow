package de.kaan.pensionflow.process.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "process_audit_events")
public class ProcessAuditEvent {

    @Id
    private String id;

    private String processId;

    private AuditAction action;

    private String actor;

    private String detail;

    private Instant occurredAt;
}
