package de.kaan.pensionflow.process.dto;

import de.kaan.pensionflow.process.model.ProcessPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateProcessRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String title,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull(message = "Priority is required")
        ProcessPriority priority,

        String assignedEmployeeId

) {
}