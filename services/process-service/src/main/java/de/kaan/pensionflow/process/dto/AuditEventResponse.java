package de.kaan.pensionflow.process.dto;

import de.kaan.pensionflow.process.model.AuditAction;

import java.time.Instant;

public record AuditEventResponse(
        String id,
        AuditAction action,
        String actor,
        String detail,
        Instant occurredAt
) {
}
