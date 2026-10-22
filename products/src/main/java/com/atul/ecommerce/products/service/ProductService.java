package com.atul.ecommerce.products.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.atul.ecommerce.products.repository.ProductRepository;

import com.atul.ecommerce.products.entity.Product;
import com.atul.ecommerce.products.exceptionhandling.exceptions.ProductNotFoundException;
import com.atul.ecommerce.products.exceptionhandling.exceptions.BadRequestException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service 
public class ProductService {

    public static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()) {
            return product.get();
        } else {
            throw new ProductNotFoundException(id);
        }
    }

    public Long addProduct(Product product) {
        if(product.getId() != null){
            logger.info("ID of the product is not null. {}" , product.getId());
            throw new BadRequestException("Product ID must not be specified to add a new product");
        }
        Product savedProduct = productRepository.save(product);
        return savedProduct.getId();
    }

    public Product updateProduct(Long id, Product product) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if(existingProduct.isPresent()) {
            Product updatedProduct = existingProduct.get();
            
            if(product.getName() != null) {
                updatedProduct.setName(product.getName());
            }
            if(product.getDescription() != null) {
                updatedProduct.setDescription(product.getDescription());
            }
            if(product.getPrice() != null) {
                updatedProduct.setPrice(product.getPrice());
            }

            return productRepository.save(updatedProduct);

        } else {
            throw new ProductNotFoundException(id);
        }
    }

    public void deleteProduct(Long id) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if(existingProduct.isPresent()) {
            productRepository.deleteById(id);
        } else {
            throw new ProductNotFoundException(id);
        }
    }

}
