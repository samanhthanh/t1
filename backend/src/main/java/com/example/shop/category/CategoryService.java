package com.example.shop.category;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryService {
  private final CategoryRepository categoryRepository;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public List<Category> listAll() {
    return categoryRepository.findAll();
  }

  public Category getById(Long id) {
    return categoryRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
  }

  @Transactional
  public Category create(String name) {
    String normalized = normalize(name);
    if (categoryRepository.existsByNameIgnoreCase(normalized)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
    }
    Category category = new Category();
    category.setName(normalized);
    return categoryRepository.save(category);
  }

  @Transactional
  public Category update(Long id, String name) {
    String normalized = normalize(name);
    Category category = getById(id);
    boolean exists = categoryRepository.existsByNameIgnoreCase(normalized);
    if (exists && !category.getName().equalsIgnoreCase(normalized)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
    }
    category.setName(normalized);
    return categoryRepository.save(category);
  }

  @Transactional
  public void delete(Long id) {
    if (!categoryRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
    }
    categoryRepository.deleteById(id);
  }

  public void validateNameExists(String name) {
    String normalized = normalize(name);
    if (!categoryRepository.existsByNameIgnoreCase(normalized)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found");
    }
  }

  private String normalize(String name) {
    if (name == null || name.trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
    }
    return name.trim();
  }
}
