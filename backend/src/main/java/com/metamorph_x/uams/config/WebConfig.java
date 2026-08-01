package com.metamorph_x.uams.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        String path = uploadPath.toString().replace("\\", "/");
        
        // Ensure path ends with slash and handles Windows file: protocol correctly
        String resourceLocation = "file:" + (path.startsWith("/") ? "" : "/") + path + "/";

        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}
