package com.atul.ecommerce.products.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.atul.ecommerce.products.entity.Product;
import com.atul.ecommerce.products.service.ProductService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping ("/api") 
public class ProductController {

    ProductService productService;

    @Autowired 
    ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping ("/products")
    public List<Product> getProducts() {
        return productService.getAllProducts();
    }

    @GetMapping ("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping ("/products") 
    public Long addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PatchMapping ("/products/{id}")
    public Product updateExistingProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product) ;
    }

    @DeleteMapping ("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

}
