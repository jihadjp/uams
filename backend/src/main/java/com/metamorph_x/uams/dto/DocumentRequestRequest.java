package com.metamorph_x.uams.dto;

import com.metamorph_x.uams.model.enums.DocumentType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestRequest {
    @NotNull(message = "Document type is required")
    private DocumentType documentType;

    private String requestNote;
}
