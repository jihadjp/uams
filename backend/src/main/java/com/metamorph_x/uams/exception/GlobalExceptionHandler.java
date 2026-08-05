package com.metamorph_x.uams.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.metamorph_x.uams.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED, request);
    }

    // Spring Security AccessDeniedException Direct + Wrapped handling
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        return buildErrorResponse("Access Denied: You do not have permission to access this resource.", HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        return buildErrorResponse("Invalid email or password", HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<ErrorResponse> handleScheduleConflictException(ScheduleConflictException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(org.springframework.dao.DataIntegrityViolationException ex, WebRequest request) {
        String message = "Database integrity violation: This record is being used by another part of the system.";
        String detailedMessage = ex.getMostSpecificCause().getMessage();

        if (detailedMessage != null) {
            if (detailedMessage.contains("Column 'name' cannot be null")) {
                if (detailedMessage.contains("guardians")) {
                    message = "Guardian Name is required.";
                } else if (detailedMessage.contains("users")) {
                    message = "Full Name is required.";
                } else {
                    message = "A required Name field is missing.";
                }
            } else if (detailedMessage.contains("Duplicate entry")) {
                message = "This record already exists in the database.";
            } else if (detailedMessage.contains("foreign key constraint fails")) {
                message = "Cannot delete or update: This record is referenced by other data (e.g. notices, courses, or users).";
            } else {
                message = detailedMessage;
            }
        }
        return buildErrorResponse(message, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(java.util.stream.Collectors.joining(", "));
        return buildErrorResponse("Validation failed: " + message, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupportedException(org.springframework.web.HttpRequestMethodNotSupportedException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.METHOD_NOT_ALLOWED, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    // Global Fallback Handler with Root Cause Check for AccessDeniedException
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        // Check if the root cause is an AccessDeniedException wrapped inside another exception
        Throwable rootCause = ex;
        while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
            rootCause = rootCause.getCause();
            if (rootCause instanceof AccessDeniedException) {
                return handleAccessDeniedException((AccessDeniedException) rootCause, request);
            }
        }

        if ("Access Denied".equalsIgnoreCase(ex.getMessage())) {
            return buildErrorResponse("Access Denied: You do not have permission to access this resource.", HttpStatus.FORBIDDEN, request);
        }

        return buildErrorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
            org.springframework.web.servlet.resource.NoResourceFoundException ex,
            WebRequest request
    ) {
        return buildErrorResponse("API endpoint not found: " + ex.getResourcePath(), HttpStatus.NOT_FOUND, request);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(String message, HttpStatus status, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorResponse, status);
    }
}