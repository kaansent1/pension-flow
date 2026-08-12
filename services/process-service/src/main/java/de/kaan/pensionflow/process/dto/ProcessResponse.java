package de.kaan.pensionflow.process.dto;

import de.kaan.pensionflow.process.model.ProcessPriority;
import de.kaan.pensionflow.process.model.ProcessStatus;

import java.time.Instant;

public record ProcessResponse(
        String id,
        String title,
        String description,
        ProcessStatus status,
        ProcessPriority priority,
        String assignedEmployeeId,
        Instant createdAt,
        Instant updatedAt
) {
}