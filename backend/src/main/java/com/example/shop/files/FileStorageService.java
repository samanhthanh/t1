package com.example.shop.files;

import com.cloudinary.Cloudinary;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private final Cloudinary cloudinary;
  private final String folder;

  public FileStorageService(@Value("${app.cloudinary.cloud-name}") String cloudName,
                            @Value("${app.cloudinary.api-key}") String apiKey,
                            @Value("${app.cloudinary.api-secret}") String apiSecret,
                            @Value("${app.cloudinary.folder:}") String folder) {
    this.folder = folder == null ? "" : folder.trim();
    Map<String, String> config = new HashMap<>();
    config.put("cloud_name", cloudName);
    config.put("api_key", apiKey);
    config.put("api_secret", apiSecret);
    this.cloudinary = new Cloudinary(config);
  }

  public String storeImage(MultipartFile file) {
    try {
      Map<String, Object> options = new HashMap<>();
      options.put("resource_type", "image");
      options.put("public_id", UUID.randomUUID().toString());
      if (StringUtils.hasText(folder)) {
        options.put("folder", folder);
      }
      Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), options);
      Object secureUrl = result.get("secure_url");
      if (secureUrl == null) {
        throw new RuntimeException("Upload succeeded but secure_url was missing");
      }
      return secureUrl.toString();
    } catch (IOException ex) {
      throw new RuntimeException("Failed to store file", ex);
    }
  }
}
