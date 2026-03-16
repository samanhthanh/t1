package com.example.shop.product;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/products")
public class PublicProductController {
  private final ProductService productService;
  private final ProductRepository productRepository;

  public PublicProductController(ProductService productService, ProductRepository productRepository) {
    this.productService = productService;
    this.productRepository = productRepository;
  }

  @GetMapping
  public List<Product> listActive() {
    return productService.listActive();
  }

  @GetMapping("/{id}")
  public Product getById(@PathVariable("id") Long id) {
    return productRepository.findById(id).orElseThrow();
  }
}
