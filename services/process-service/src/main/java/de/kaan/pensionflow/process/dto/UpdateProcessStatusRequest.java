package de.kaan.pensionflow.process.dto;

import de.kaan.pensionflow.process.model.ProcessStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateProcessStatusRequest(
        @NotNull(message = "Status is required")
        ProcessStatus status
) {
}
