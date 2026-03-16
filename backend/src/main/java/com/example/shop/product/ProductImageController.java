package com.example.shop.product;

import com.example.shop.files.FileStorageService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class ProductImageController {
  private final ProductRepository productRepository;
  private final ProductService productService;
  private final FileStorageService fileStorageService;
  private final ProductImageRepository productImageRepository;

  public ProductImageController(ProductRepository productRepository, ProductService productService,
                                FileStorageService fileStorageService, ProductImageRepository productImageRepository) {
    this.productRepository = productRepository;
    this.productService = productService;
    this.fileStorageService = fileStorageService;
    this.productImageRepository = productImageRepository;
  }

  @PostMapping("/{id}/image")
  public Product uploadImage(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
    Product product = productRepository.findById(id).orElseThrow();
    String imageUrl = fileStorageService.storeImage(file);
    product.setImageUrl(imageUrl);
    return productService.update(id, product, null);
  }

  @PostMapping("/{id}/images")
  public List<ProductImage> uploadImages(@PathVariable("id") Long id,
                                         @RequestParam("files") List<MultipartFile> files) {
    Product product = productRepository.findById(id).orElseThrow();
    List<ProductImage> saved = new ArrayList<>();
    for (MultipartFile file : files) {
      if (file == null || file.isEmpty()) {
        continue;
      }
      String imageUrl = fileStorageService.storeImage(file);
      ProductImage image = new ProductImage();
      image.setProduct(product);
      image.setUrl(imageUrl);
      saved.add(productImageRepository.save(image));
    }
    return saved;
  }
}
