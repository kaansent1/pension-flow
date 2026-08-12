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
@Document(collection = "processes")
public class AdministrativeProcess {

    @Id
    private String id;

    private String title;

    private String description;

    private ProcessStatus status;

    private ProcessPriority priority;

    private String assignedEmployeeId;

    private Instant createdAt;

    private Instant updatedAt;
}