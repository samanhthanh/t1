package com.example.shop.search;

import com.example.shop.product.Product;
import com.example.shop.product.ProductRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/search")
public class SearchController {
  private final ProductRepository productRepository;

  public SearchController(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @GetMapping
  public List<Product> search(@RequestParam("q") String query) {
    return productRepository.searchActiveByQuery(query);
  }
}
