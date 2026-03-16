package com.example.shop.product;

import com.example.shop.category.CategoryService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {
  private final ProductRepository productRepository;
  private final InventoryRepository inventoryRepository;
  private final CategoryService categoryService;

  public ProductService(ProductRepository productRepository, InventoryRepository inventoryRepository,
                        CategoryService categoryService) {
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
    this.categoryService = categoryService;
  }

  @Transactional
  public Product create(Product product, List<ProductSizeRequest> sizes) {
    categoryService.validateNameExists(product.getType());
    applySizes(product, sizes);
    Product saved = productRepository.save(product);
    InventoryItem item = new InventoryItem();
    item.setProduct(saved);
    item.setQuantity(sumSizes(saved));
    inventoryRepository.save(item);
    return saved;
  }

  @Transactional
  public Product update(Long id, Product update, List<ProductSizeRequest> sizes) {
    categoryService.validateNameExists(update.getType());
    Product product = productRepository.findById(id).orElseThrow();
    product.setName(update.getName());
    product.setDescription(update.getDescription());
    product.setPrice(update.getPrice());
    product.setType(update.getType());
    if (update.getImageUrl() != null) {
      product.setImageUrl(update.getImageUrl());
    }
    product.setActive(update.isActive());
    if (sizes != null) {
      applySizes(product, sizes);
      inventoryRepository.findByProductId(id).ifPresent(item -> {
        item.setQuantity(sumSizes(product));
        inventoryRepository.save(item);
      });
    }
    Product saved = productRepository.save(product);
    return saved;
  }

  @Transactional
  public InventoryItem updateInventory(Long productId, int quantity) {
    InventoryItem item = inventoryRepository.findByProductId(productId).orElseThrow();
    item.setQuantity(quantity);
    return inventoryRepository.save(item);
  }

  public List<Product> listActive() {
    return productRepository.findByActiveTrue();
  }

  public List<Product> listAll() {
    return productRepository.findAll();
  }

  public Page<Product> listAll(Pageable pageable) {
    return productRepository.findAll(pageable);
  }

  public Page<AdminProductResponse> listAllWithInventory(Pageable pageable) {
    Page<Product> page = productRepository.findAll(pageable);
    return page.map(product -> {
      int quantity = inventoryRepository.findByProductId(product.getId())
          .map(InventoryItem::getQuantity)
          .orElse(sumSizes(product));
      return new AdminProductResponse(product, quantity);
    });
  }

  @Transactional
  public void delete(Long id) {
    inventoryRepository.findByProductId(id).ifPresent(inventoryRepository::delete);
    productRepository.deleteById(id);
  }

  @Transactional
  public void deleteByCategoryName(String name) {
    long count = productRepository.countByTypeIgnoreCase(name);
    if (count > 0) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Category is in use");
    }
  }

  private void applySizes(Product product, List<ProductSizeRequest> sizes) {
    product.getSizes().clear();
    if (sizes == null) {
      return;
    }
    for (ProductSizeRequest request : sizes) {
      if (!StringUtils.hasText(request.getSize())) {
        continue;
      }
      ProductSize size = new ProductSize();
      size.setProduct(product);
      size.setSize(request.getSize().trim());
      size.setQuantity(Math.max(0, request.getQuantity()));
      product.getSizes().add(size);
    }
  }

  private int sumSizes(Product product) {
    return product.getSizes().stream().mapToInt(ProductSize::getQuantity).sum();
  }

}
