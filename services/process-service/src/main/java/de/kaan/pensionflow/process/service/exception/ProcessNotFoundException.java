package de.kaan.pensionflow.process.service.exception;

public class ProcessNotFoundException extends RuntimeException {

    public ProcessNotFoundException(String id) {
        super("Process with id'" + id + "' was not found");
    }
}
