package com.example.shop.product;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
  private final ProductService productService;

  public AdminProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public Page<AdminProductResponse> listAll(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return productService.listAllWithInventory(pageable);
  }

  @PostMapping
  public Product create(@RequestBody ProductCreateRequest request) {
    Product product = new Product();
    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setType(request.getType());
    product.setActive(request.isActive());
    return productService.create(product, request.getSizes());
  }

  @PutMapping("/{id}")
  public Product update(@PathVariable("id") Long id, @RequestBody ProductUpdateRequest request) {
    Product product = new Product();
    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setType(request.getType());
    product.setImageUrl(request.getImageUrl());
    product.setActive(request.isActive());
    return productService.update(id, product, request.getSizes());
  }

  @PatchMapping("/{id}/inventory")
  public InventoryItem updateInventory(@PathVariable("id") Long id, @RequestBody InventoryUpdateRequest request) {
    return productService.updateInventory(id, request.getQuantity());
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") Long id) {
    productService.delete(id);
  }
}
