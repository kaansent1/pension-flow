package de.kaan.pensionflow.process.integration;

import de.kaan.pensionflow.process.model.AdministrativeProcess;
import de.kaan.pensionflow.process.model.ProcessPriority;
import de.kaan.pensionflow.process.repository.ProcessRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProcessIntegrationTest {

    @LocalServerPort
    private int port;

    private RestClient restClient;

    @BeforeEach
    void setUp() {
        restClient = RestClient.builder()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    void shouldCreateProcessThroughApi() {
        String requestBody = """
            {
                "title": "Adressänderung",
                "description": "Neue Adresse bearbeiten",
                "priority": "MEDIUM"
            }
            """;

        String response = restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        assertThat(response)
                .contains("\"title\":\"Adressänderung\"")
                .contains("\"status\":\"OPEN\"")
                .contains("\"priority\":\"MEDIUM\"");
    }

    @Container
    static MongoDBContainer mongoDB =
            new MongoDBContainer("mongo:8");

    @DynamicPropertySource
    static void configureMongoDB(DynamicPropertyRegistry registry) {
        registry.add(
                "spring.data.mongodb.uri",
                mongoDB::getReplicaSetUrl
        );
    }

    @Autowired
    private ProcessRepository processRepository;

    @Test
    void shouldSaveAndRetrieveProcess() {
        AdministrativeProcess process = AdministrativeProcess.builder()
                .title("Adressänderung")
                .description("Neue Adresse bearbeiten")
                .priority(ProcessPriority.MEDIUM)
                .build();

        AdministrativeProcess saved =
                processRepository.save(process);

        assertThat(saved.getId()).isNotNull();

        AdministrativeProcess found =
                processRepository.findById(saved.getId())
                        .orElseThrow();

        assertThat(found.getTitle())
                .isEqualTo("Adressänderung");

        assertThat(found.getDescription())
                .isEqualTo("Neue Adresse bearbeiten");

        assertThat(found.getPriority())
                .isEqualTo(ProcessPriority.MEDIUM);
    }

    @Test
    void shouldGetAllProcessesThroughApi() {
        String requestBody = """
        {
            "title": "Adressänderung",
            "description": "Neue Adresse bearbeiten",
            "priority": "MEDIUM"
        }
        """;

        restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .toBodilessEntity();

        String response = restClient.get()
                .uri("/api/processes")
                .retrieve()
                .body(String.class);

        assertThat(response)
                .contains("Adressänderung")
                .contains("Neue Adresse bearbeiten");
    }

    @Test
    void shouldGetProcessByIdThroughApi() {
        String requestBody = """
        {
            "title": "Adressänderung",
            "description": "Neue Adresse bearbeiten",
            "priority": "MEDIUM"
        }
        """;

        String created = restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        String id = created.split("\"id\":\"")[1].split("\"")[0];

        String response = restClient.get()
                .uri("/api/processes/" + id)
                .retrieve()
                .body(String.class);

        assertThat(response)
                .contains("\"title\":\"Adressänderung\"")
                .contains("\"status\":\"OPEN\"");
    }

    @Test
    void shouldUpdateProcessThroughApi() {
        String createBody = """
        {
            "title": "Alte Adresse",
            "description": "Alte Beschreibung",
            "priority": "LOW"
        }
        """;

        String created = restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(createBody)
                .retrieve()
                .body(String.class);

        String id = created.split("\"id\":\"")[1].split("\"")[0];

        String updateBody = """
        {
            "title": "Neue Adresse",
            "description": "Neue Beschreibung",
            "priority": "HIGH"
        }
        """;

        String response = restClient.put()
                .uri("/api/processes/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(updateBody)
                .retrieve()
                .body(String.class);

        assertThat(response)
                .contains("\"title\":\"Neue Adresse\"")
                .contains("\"description\":\"Neue Beschreibung\"")
                .contains("\"priority\":\"HIGH\"");
    }

    @Test
    void shouldUpdateProcessStatusThroughApi() {
        String createBody = """
        {
            "title": "Adressänderung",
            "description": "Neue Adresse bearbeiten",
            "priority": "MEDIUM"
        }
        """;

        String created = restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(createBody)
                .retrieve()
                .body(String.class);

        String id = created.split("\"id\":\"")[1].split("\"")[0];

        String statusBody = """
        {
            "status": "IN_PROGRESS"
        }
        """;

        String response = restClient.patch()
                .uri("/api/processes/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .body(statusBody)
                .retrieve()
                .body(String.class);

        assertThat(response)
                .contains("\"status\":\"IN_PROGRESS\"");
    }

    @Test
    void shouldDeleteProcessThroughApi() {
        String createBody = """
        {
            "title": "Zu löschender Prozess",
            "description": "Dieser Prozess wird gelöscht",
            "priority": "LOW"
        }
        """;

        String created = restClient.post()
                .uri("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .body(createBody)
                .retrieve()
                .body(String.class);

        String id = created.split("\"id\":\"")[1].split("\"")[0];

        var response = restClient.delete()
                .uri("/api/processes/" + id)
                .retrieve()
                .toBodilessEntity();

        assertThat(response.getStatusCode().value())
                .isEqualTo(204);

        assertThatThrownBy(() ->
                restClient.get()
                        .uri("/api/processes/" + id)
                        .retrieve()
                        .toBodilessEntity()
        ).isInstanceOf(Exception.class);
    }
}