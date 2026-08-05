package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import com.metamorph_x.uams.dto.RegistrarRequest;
import com.metamorph_x.uams.dto.RegistrarResponse;

public interface RegistrarService {
    List<RegistrarResponse> getAllRegistrars();
    RegistrarResponse createRegistrar(RegistrarRequest request);
    RegistrarResponse updateRegistrar(UUID id, RegistrarRequest request);
    void deleteRegistrar(UUID id);
}
