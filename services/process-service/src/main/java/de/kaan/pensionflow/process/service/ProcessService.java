package de.kaan.pensionflow.process.service;

import de.kaan.pensionflow.process.dto.CreateProcessRequest;
import de.kaan.pensionflow.process.dto.ProcessResponse;
import de.kaan.pensionflow.process.dto.UpdateProcessRequest;
import de.kaan.pensionflow.process.dto.UpdateProcessStatusRequest;
import de.kaan.pensionflow.process.model.AdministrativeProcess;
import de.kaan.pensionflow.process.model.ProcessStatus;
import de.kaan.pensionflow.process.repository.ProcessRepository;
import de.kaan.pensionflow.process.service.exception.ProcessNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessService {

    private final ProcessRepository processRepository;

    public ProcessResponse createProcess(CreateProcessRequest request) {
        Instant now = Instant.now();

        AdministrativeProcess process = AdministrativeProcess.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .assignedEmployeeId(request.assignedEmployeeId())
                .status(ProcessStatus.OPEN)
                .createdAt(now)
                .updatedAt(now)
                .build();

        AdministrativeProcess savedProcess = processRepository.save(process);

        return toResponse(savedProcess);
    }

    public List<ProcessResponse> getAllProcesses() {
        return processRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProcessResponse getProcessById(String id) {
        AdministrativeProcess process = processRepository.findById(id)
                .orElseThrow(() -> new ProcessNotFoundException(id));

        return toResponse(process);
    }

    public void deleteProcess(String id) {
        AdministrativeProcess process = processRepository.findById(id)
                .orElseThrow(() -> new ProcessNotFoundException(id));

        processRepository.delete(process);
    }

    public ProcessResponse updateStatus(
            String id,
            UpdateProcessStatusRequest request
    ) {
        AdministrativeProcess process = processRepository.findById(id)
                .orElseThrow(() -> new ProcessNotFoundException(id));

        validateStatusTransition(process.getStatus(), request.status());

        process.setStatus(request.status());
        process.setUpdatedAt(Instant.now());

        AdministrativeProcess updatedProcess = processRepository.save(process);

        return toResponse(updatedProcess);
    }

    private void validateStatusTransition(
            ProcessStatus currentStatus,
            ProcessStatus newStatus
    ) {
        if (currentStatus == ProcessStatus.COMPLETED
                && newStatus != ProcessStatus.COMPLETED) {
            throw new IllegalStateException(
                    "A completed process cannot be reopened"
            );
        }

        if (currentStatus == ProcessStatus.CANCELLED
                && newStatus != ProcessStatus.CANCELLED) {
            throw new IllegalStateException(
                    "A cancelled process cannot be opened"
            );
        }
    }

    public ProcessResponse updateProcess(
            String id,
            UpdateProcessRequest request
    ) {
        AdministrativeProcess process = processRepository.findById(id)
                .orElseThrow(() -> new ProcessNotFoundException(id));

        process.setTitle(request.title());
        process.setDescription(request.description());
        process.setPriority(request.priority());
        process.setAssignedEmployeeId(request.assignedEmployeeId());
        process.setUpdatedAt(Instant.now());

        AdministrativeProcess updatedProcess = processRepository.save(process);

        return toResponse(updatedProcess);

    }

    private ProcessResponse toResponse(AdministrativeProcess process) {
        return new ProcessResponse(
                process.getId(),
                process.getTitle(),
                process.getDescription(),
                process.getStatus(),
                process.getPriority(),
                process.getAssignedEmployeeId(),
                process.getCreatedAt(),
                process.getUpdatedAt()
        );
    }
}