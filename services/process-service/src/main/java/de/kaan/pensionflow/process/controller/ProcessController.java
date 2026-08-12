package de.kaan.pensionflow.process.controller;

import de.kaan.pensionflow.process.dto.CreateProcessRequest;
import de.kaan.pensionflow.process.dto.ProcessResponse;
import de.kaan.pensionflow.process.dto.UpdateProcessRequest;
import de.kaan.pensionflow.process.dto.UpdateProcessStatusRequest;
import de.kaan.pensionflow.process.service.ProcessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
@RequiredArgsConstructor
public class ProcessController {

    private final ProcessService processService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProcessResponse createProcess(
            @Valid @RequestBody CreateProcessRequest request
    ) {
        return processService.createProcess(request);
    }

    @GetMapping
    public List<ProcessResponse> getAllProcesses() {
        return processService.getAllProcesses();
    }

    @GetMapping("/{id}")
    public ProcessResponse getProcessById(@PathVariable String id) {
        return processService.getProcessById(id);
    }

    @PatchMapping("/{id}/status")
    public ProcessResponse updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateProcessStatusRequest request
    ) {
        return processService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProcess(@PathVariable String id) {
        processService.deleteProcess(id);
    }

    @PutMapping("/{id}")
    public ProcessResponse updateProcess(
            @PathVariable String id,
            @Valid @RequestBody UpdateProcessRequest request
    ) {
        return processService.updateProcess(id, request);

    }

}