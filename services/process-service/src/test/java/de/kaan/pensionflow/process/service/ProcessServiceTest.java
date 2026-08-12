package de.kaan.pensionflow.process.service;

import de.kaan.pensionflow.process.dto.CreateProcessRequest;
import de.kaan.pensionflow.process.dto.ProcessResponse;
import de.kaan.pensionflow.process.dto.UpdateProcessRequest;
import de.kaan.pensionflow.process.dto.UpdateProcessStatusRequest;
import de.kaan.pensionflow.process.model.AdministrativeProcess;
import de.kaan.pensionflow.process.model.ProcessPriority;
import de.kaan.pensionflow.process.model.ProcessStatus;
import de.kaan.pensionflow.process.repository.ProcessRepository;
import de.kaan.pensionflow.process.service.exception.ProcessNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProcessServiceTest {

    @Mock
    private ProcessRepository processRepository;

    @InjectMocks
    private ProcessService processService;

    @Test
    void shouldCreateProcess() {
        CreateProcessRequest request = new CreateProcessRequest(
                "Adressänderung",
                "Neue Adresse bearbeiten",
                ProcessPriority.MEDIUM,
                null
        );

        AdministrativeProcess savedProcess = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .description("Neue Adresse bearbeiten")
                .priority(ProcessPriority.MEDIUM)
                .status(ProcessStatus.OPEN)
                .build();

        when(processRepository.save(any(AdministrativeProcess.class)))
                .thenReturn(savedProcess);

        ProcessResponse response = processService.createProcess(request);

        assertThat(response.id()).isEqualTo("123");
        assertThat(response.title()).isEqualTo("Adressänderung");
        assertThat(response.priority()).isEqualTo(ProcessPriority.MEDIUM);
        assertThat(response.status()).isEqualTo(ProcessStatus.OPEN);

        verify(processRepository).save(any(AdministrativeProcess.class));
    }

    @Test
    void shouldNotReopenCompletedProcess() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .status(ProcessStatus.COMPLETED)
                .priority(ProcessPriority.MEDIUM)
                .build();

        when(processRepository.findById("123"))
                .thenReturn(Optional.of(process));

        UpdateProcessStatusRequest request =
                new UpdateProcessStatusRequest(ProcessStatus.OPEN);

        assertThatThrownBy(() ->
                processService.updateStatus("123", request)
        )
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("A completed process cannot be reopened");

        verify(processRepository, never())
                .save(any(AdministrativeProcess.class));
    }

    @Test
    void shouldCreateProcessWithOpenStatus() {
        CreateProcessRequest request = new CreateProcessRequest(
                "Adressänderung",
                "Neue Adresse bearbeiten",
                ProcessPriority.MEDIUM,
                null
        );

        AdministrativeProcess savedProcess = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .description("Neue Adresse bearbeiten")
                .priority(ProcessPriority.MEDIUM)
                .status(ProcessStatus.OPEN)
                .build();

        when(processRepository.save(any(AdministrativeProcess.class)))
                .thenReturn(savedProcess);

        processService.createProcess(request);

        ArgumentCaptor<AdministrativeProcess> captor =
                ArgumentCaptor.forClass(AdministrativeProcess.class);

        verify(processRepository).save(captor.capture());

        AdministrativeProcess saved = captor.getValue();

        assertThat(saved.getStatus()).isEqualTo(ProcessStatus.OPEN);
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldGetProcessById() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .description("Neue Adresse bearbeiten")
                .priority(ProcessPriority.MEDIUM)
                .status(ProcessStatus.OPEN)
                .build();

        when(processRepository.findById("123"))
                .thenReturn(Optional.of(process));

        ProcessResponse response = processService.getProcessById("123");

        assertThat(response.id()).isEqualTo("123");
        assertThat(response.title()).isEqualTo("Adressänderung");
        assertThat(response.status()).isEqualTo(ProcessStatus.OPEN);

        verify(processRepository).findById("123");
    }

    @Test
    void shouldThrowExceptionWhenProcessDoesNotExist() {
        when(processRepository.findById("999"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                processService.getProcessById("999")
        )
                .isInstanceOf(ProcessNotFoundException.class);

        verify(processRepository).findById("999");
    }

    @Test
    void shouldUpdateProcess() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .id("123")
                .title("Alte Adresse")
                .description("Alte Beschreibung")
                .priority(ProcessPriority.LOW)
                .status(ProcessStatus.OPEN)
                .build();

        when(processRepository.findById("123"))
                .thenReturn(Optional.of(process));

        when(processRepository.save(any(AdministrativeProcess.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProcessRequest request = new UpdateProcessRequest(
                "Neue Adresse",
                "Neue Beschreibung",
                ProcessPriority.HIGH,
                "employee-123"
        );

        ProcessResponse response =
                processService.updateProcess("123", request);

        assertThat(response.title()).isEqualTo("Neue Adresse");
        assertThat(response.description()).isEqualTo("Neue Beschreibung");
        assertThat(response.priority()).isEqualTo(ProcessPriority.HIGH);
        assertThat(response.assignedEmployeeId())
                .isEqualTo("employee-123");

        verify(processRepository).save(process);
    }

    @Test
    void shouldUpdateProcessStatus() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .description("Neue Adresse")
                .priority(ProcessPriority.MEDIUM)
                .status(ProcessStatus.OPEN)
                .build();

        when(processRepository.findById("123"))
                .thenReturn(Optional.of(process));

        when(processRepository.save(any(AdministrativeProcess.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProcessStatusRequest request =
                new UpdateProcessStatusRequest(ProcessStatus.IN_PROGRESS);

        ProcessResponse response =
                processService.updateStatus("123", request);

        assertThat(response.status())
                .isEqualTo(ProcessStatus.IN_PROGRESS);

        verify(processRepository).save(process);
    }

    @Test
    void shouldDeleteProcess() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .id("123")
                .title("Adressänderung")
                .status(ProcessStatus.OPEN)
                .priority(ProcessPriority.MEDIUM)
                .build();

        when(processRepository.findById("123"))
                .thenReturn(Optional.of(process));

        processService.deleteProcess("123");

        verify(processRepository).delete(process);
    }
}