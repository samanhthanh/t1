package com.example.shop.category;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/categories")
public class PublicCategoryController {
  private final CategoryService categoryService;

  public PublicCategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public List<Category> listAll() {
    return categoryService.listAll();
  }
}
