package com.example.shop.category;

import com.example.shop.product.ProductService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {
  private final CategoryService categoryService;
  private final ProductService productService;

  public AdminCategoryController(CategoryService categoryService, ProductService productService) {
    this.categoryService = categoryService;
    this.productService = productService;
  }

  @GetMapping
  public List<Category> listAll() {
    return categoryService.listAll();
  }

  @PostMapping
  public Category create(@RequestBody CategoryRequest request) {
    return categoryService.create(request.getName());
  }

  @PutMapping("/{id}")
  public Category update(@PathVariable("id") Long id, @RequestBody CategoryRequest request) {
    return categoryService.update(id, request.getName());
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") Long id) {
    Category c = categoryService.getById(id);
    productService.deleteByCategoryName(c.getName());
    categoryService.delete(id);
  }
}
